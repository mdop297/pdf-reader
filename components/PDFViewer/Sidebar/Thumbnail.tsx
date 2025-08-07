import { PDFDocumentProxy, RenderTask } from "pdfjs-dist";
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
    const renderTasks: RenderTask[] = [];

    const renderThumbnails = async () => {
      for (let i = 0; i < pdfDocument.numPages; i++) {
        const page = await pdfDocument.getPage(i + 1);
        const viewport = page.getViewport({ scale: 0.25 });

        const offscreenCanvas = document.createElement("canvas");
        const context = offscreenCanvas.getContext("2d");
        offscreenCanvas.width = viewport.width;
        offscreenCanvas.height = viewport.height;

        const renderTask = page.render({
          canvasContext: context!,
          viewport,
        });
        await renderTask.promise;

        // Copy vào canvas hiển thị
        const onscreenCanvas = thumbnailRefs.current[i];
        if (onscreenCanvas) {
          const onscreenCtx = onscreenCanvas.getContext("2d");
          onscreenCanvas.width = offscreenCanvas.width;
          onscreenCanvas.height = offscreenCanvas.height;
          onscreenCtx?.drawImage(offscreenCanvas, 0, 0);
        }
      }
    };
    renderThumbnails();

    return () => {
      renderTasks.forEach((task) => {
        if (task.onContinue) {
          task.cancel();
        }
      });
    };
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
