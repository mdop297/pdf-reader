"use client";

import { Image, LayoutList, TableOfContents } from "lucide-react";
// import { useViewer } from "./PDFProvider";
// import TreeOutline from "./Outline";
import TreeOutline from "./Outline";
import type { CommentedHighlight } from "../types";
import type { PDFDocumentProxy } from "pdfjs-dist";
import AnntationSidebar from "./Annotations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Thumbnail from "./Thumbnail";
import { PDFViewer } from "pdfjs-dist/web/pdf_viewer.mjs";
import { RefObject } from "react";

interface SidebarProps {
  pdfDocument: PDFDocumentProxy;
  viewerRef: RefObject<PDFViewer | null>;
  currentPage: number;
  highlights: Array<CommentedHighlight>;
  resetHighlights: () => void;
  toggleDocument: () => void;
  onNavigation: (pageNumber: number) => void;
}

export function Sidebar({
  pdfDocument,
  viewerRef,
  currentPage,
  highlights,
  resetHighlights,
  toggleDocument,
  onNavigation,
}: SidebarProps) {
  // const { isSidebarOpen } = useViewer();

  return (
    // isSidebarOpen && (
    <>
      <div className="flex flex-col gap-6 h-full w-[280px]">
        <Tabs
          defaultValue="toc"
          className="w-full h-full flex flex-row justify-center-safe items-start gap-0"
        >
          <TabsList className="data flex flex-col gap-1 h-fit m-0.5 bg-transparent">
            <TabsTrigger value="toc" className="px-1">
              <TableOfContents className="aspect-square size-5" />
            </TabsTrigger>
            <TabsTrigger value="thumbnails" className="px-1">
              <Image className="aspect-square size-5" />
            </TabsTrigger>
            <TabsTrigger value="annos" className="px-1">
              <LayoutList className="aspect-square size-5" />
            </TabsTrigger>
          </TabsList>
          {/* Table of content */}
          <TabsContent value="toc" className="h-full w-full overflow-y-auto">
            <TreeOutline
              pdfDocument={pdfDocument}
              onNavigation={onNavigation}
            />
            {/* tree outline */}
          </TabsContent>
          {/* Thumbnails */}
          <TabsContent value="thumbnails" className="h-full w-full">
            <Thumbnail
              pdfDocument={pdfDocument}
              viewerRef={viewerRef}
              currentPage={currentPage}
            />
          </TabsContent>
          <TabsContent value="annos" className="h-full w-full overflow-y-auto">
            {/* <TreeOutline /> */}
            <AnntationSidebar
              highlights={highlights}
              resetHighlights={resetHighlights}
              toggleDocument={toggleDocument}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
    // )
  );
}

export default Sidebar;
