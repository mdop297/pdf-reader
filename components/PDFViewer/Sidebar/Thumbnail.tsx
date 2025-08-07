import { PDFDocumentProxy } from "pdfjs-dist";
import { PDFViewer } from "pdfjs-dist/web/pdf_viewer.mjs";
import React, { useEffect, useRef } from "react";

interface ThumbnailsProps {
  pdfDocument: PDFDocumentProxy;
  viewerRef: React.RefObject<PDFViewer | null>;
  currentPage: number;
}

const Thumbnail = ({
  pdfDocument,
  viewerRef,
  currentPage,
}: ThumbnailsProps) => {
  const thumbnailRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  useEffect(() => {
    const renderThumbnails = async () => {
      for (let i = 0; i < pdfDocument.numPages; i++) {
        const page = await pdfDocument.getPage(i + 1);
        const viewport = page.getViewport({ scale: 0.25 });

        const canvas = thumbnailRefs.current[i];
        if (!canvas) continue;

        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context!,
          viewport,
        }).promise;
      }
    };

    renderThumbnails();
  }, [pdfDocument]);

  useEffect(() => {
    const canvas = thumbnailRefs.current[currentPage - 1];
    if (canvas) {
      canvas.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentPage]);

  const handleClick = (pageNumber: number) => {
    viewerRef.current?.scrollPageIntoView({ pageNumber });
  };

  return (
    <div className="overflow-y-auto max-h-full bg-gray-200 p-12 w-full space-y-2">
      {Array.from({ length: pdfDocument.numPages }).map((_, i) => (
        <div
          key={i}
          onClick={() => handleClick(i + 1)}
          className={`cursor-pointer border rounded-md p-1 ${
            currentPage === i + 1 ? "border-blue-500" : "border-transparent"
          }`}
        >
          <canvas
            ref={(el) => {
              thumbnailRefs.current[i] = el;
            }}
            className="w-full h-auto"
          />
          <div className="text-xs text-center mt-1 text-gray-600">
            Page {i + 1}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Thumbnail;
