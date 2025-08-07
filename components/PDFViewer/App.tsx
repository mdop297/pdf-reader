"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import CommentForm from "./CommentForm";
import ContextMenu, { type ContextMenuProps } from "./ContextMenu";
import ExpandableTip from "./ExpandableTip";
import HighlightContainer from "./HighlightContainer";
import Toolbar from "./Toolbar/Toolbar";
import {
  PdfLoader,
  PdfHighlighter,
  type GhostHighlight,
  type PdfHighlighterUtils,
  type PdfScaleValue,
  type Tip,
  type ViewportHighlight,
} from "./react-pdf-highlighter";

import "./style/App.css";
import { testHighlights as _testHighlights } from "./utils/test-highlights";
import type { CommentedHighlight } from "./types";
import Sidebar from "./Sidebar/Sidebar";
import { PDFDocumentProxy } from "pdfjs-dist";
import { PDFViewer } from "pdfjs-dist/web/pdf_viewer.mjs";

const TEST_HIGHLIGHTS = _testHighlights;
export const PRIMARY_PDF_URL = "https://arxiv.org/pdf/2203.11115";
export const SECONDARY_PDF_URL = "https://arxiv.org/pdf/1604.02480";

const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () => {
  return document.location.hash.slice("#highlight-".length);
};

const resetHash = () => {
  document.location.hash = "";
};

const App = () => {
  const [url, setUrl] = useState(PRIMARY_PDF_URL);
  const [highlights, setHighlights] = useState<Array<CommentedHighlight>>(
    TEST_HIGHLIGHTS[PRIMARY_PDF_URL] ?? []
  );
  const currentPdfIndexRef = useRef(0);
  const [contextMenu, setContextMenu] = useState<ContextMenuProps | null>(null);
  const [pdfScaleValue, setPdfScaleValue] = useState<PdfScaleValue | undefined>(
    "auto"
  );
  const [highlightPen, setHighlightPen] = useState<boolean>(false);
  // Refs for PdfHighlighter utilities
  const highlighterUtilsRef = useRef<PdfHighlighterUtils>(null);
  const pdfDocumentRef = useRef<PDFDocumentProxy>(null);
  const viewerRef = useRef<PDFViewer>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  // const [viewerReady, setViewerReady] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const onPageChange = (page: number) => {
    setCurrentPage(page);
    handleNavigation(page);
  };

  const toggleDocument = () => {
    const urls = [PRIMARY_PDF_URL, SECONDARY_PDF_URL];
    currentPdfIndexRef.current = (currentPdfIndexRef.current + 1) % urls.length;
    setUrl(urls[currentPdfIndexRef.current]);
    setHighlights(TEST_HIGHLIGHTS[urls[currentPdfIndexRef.current]] ?? []);
  };

  // Click listeners for context menu
  useEffect(() => {
    const handleClick = () => {
      if (contextMenu) {
        setContextMenu(null);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [contextMenu]);

  const handleContextMenu = (
    event: MouseEvent<HTMLDivElement>,
    highlight: ViewportHighlight<CommentedHighlight>
  ) => {
    event.preventDefault();

    setContextMenu({
      xPos: event.clientX,
      yPos: event.clientY,
      deleteHighlight: () => deleteHighlight(highlight),
      editComment: () => editComment(highlight),
    });
  };

  const addHighlight = (highlight: GhostHighlight, comment: string) => {
    console.log("Saving highlight", highlight);
    setHighlights([{ ...highlight, comment, id: getNextId() }, ...highlights]);
  };

  const deleteHighlight = (highlight: ViewportHighlight | Highlight) => {
    console.log("Deleting highlight", highlight);
    if ("id" in highlight) {
      setHighlights(
        highlights.filter((h) => "id" in h && h.id !== highlight.id)
      );
    }
  };

  const editHighlight = (
    idToUpdate: string,
    edit: Partial<CommentedHighlight>
  ) => {
    console.log(`Editing highlight ${idToUpdate} with `, edit);
    setHighlights(
      highlights.map((highlight) =>
        highlight.id === idToUpdate ? { ...highlight, ...edit } : highlight
      )
    );
  };

  const resetHighlights = () => {
    setHighlights([]);
  };

  // Open comment tip and update highlight with new user input
  const editComment = (highlight: ViewportHighlight<CommentedHighlight>) => {
    if (!highlighterUtilsRef.current) return;

    const editCommentTip: Tip = {
      position: highlight.position,
      content: (
        <CommentForm
          placeHolder={highlight.comment}
          onSubmit={(input) => {
            editHighlight(highlight.id, { comment: input });
            highlighterUtilsRef.current!.setTip(null);
            highlighterUtilsRef.current!.toggleEditInProgress(false);
          }}
        ></CommentForm>
      ),
    };

    highlighterUtilsRef.current.setTip(editCommentTip);
    highlighterUtilsRef.current.toggleEditInProgress(true);
  };

  const handleNavigation = (pageNumber: number) => {
    if (highlighterUtilsRef.current) {
      const viewer = highlighterUtilsRef.current.getViewer();
      if (viewer) {
        viewer.scrollPageIntoView({ pageNumber });
      }
    }
  };

  const getHighlightById = useCallback(
    (id: string) => {
      return highlights.find((highlight) => highlight.id === id);
    },
    [highlights]
  );

  // Hash listeners for autoscrolling to highlights
  useEffect(() => {
    const scrollToHighlightFromHash = () => {
      const highlight = getHighlightById(parseIdFromHash());

      if (highlight && highlighterUtilsRef.current) {
        highlighterUtilsRef.current.scrollToHighlight(highlight);
      }
    };

    window.addEventListener("hashchange", scrollToHighlightFromHash);

    return () => {
      window.removeEventListener("hashchange", scrollToHighlightFromHash);
    };
  }, [getHighlightById]);

  return (
    <div className="App flex flex-col h-dvh">
      <PdfLoader document={url}>
        {(pdfDocument) => {
          pdfDocumentRef.current = pdfDocument;
          return (
            <>
              <Toolbar
                currentPage={currentPage}
                totalPages={pdfDocumentRef.current?.numPages ?? 0}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  handleNavigation(page);
                }}
                toggleSidebar={toggleSidebar}
                setPdfScaleValue={(value) => setPdfScaleValue(value)}
                toggleHighlightPen={() => setHighlightPen(!highlightPen)}
              />
              <div className="flex overflow-hidden h-full pb-4">
                {isSidebarOpen && (
                  <Sidebar
                    pdfDocument={pdfDocumentRef.current}
                    viewerRef={viewerRef}
                    currentPage={currentPage}
                    highlights={highlights}
                    resetHighlights={resetHighlights}
                    toggleDocument={toggleDocument}
                    onNavigation={handleNavigation}
                  />
                )}
                <div className=" flex-1 relative ">
                  <PdfHighlighter
                    enableAreaSelection={(event) => event.altKey}
                    pdfDocument={pdfDocument}
                    onScrollAway={resetHash}
                    utilsRef={(_pdfHighlighterUtils) => {
                      highlighterUtilsRef.current = _pdfHighlighterUtils;
                      viewerRef.current =
                        highlighterUtilsRef.current.getViewer();
                    }}
                    pdfScaleValue={pdfScaleValue}
                    textSelectionColor={
                      highlightPen ? "rgba(255, 226, 143, 1)" : undefined
                    }
                    onSelection={
                      highlightPen
                        ? (selection) =>
                            addHighlight(selection.makeGhostHighlight(), "")
                        : undefined
                    }
                    selectionTip={
                      highlightPen ? undefined : (
                        <ExpandableTip addHighlight={addHighlight} />
                      )
                    }
                    highlights={highlights}
                    setCurrentPage={setCurrentPage}
                  >
                    <HighlightContainer
                      editHighlight={editHighlight}
                      onContextMenu={handleContextMenu}
                    />
                  </PdfHighlighter>
                </div>
              </div>
            </>
          );
        }}
      </PdfLoader>
      {contextMenu && <ContextMenu {...contextMenu} />}
    </div>
  );
};

export default App;
