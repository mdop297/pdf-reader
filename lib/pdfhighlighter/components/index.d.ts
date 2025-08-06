import type * as PDFJSLib from "pdfjs-dist";

// Global augmentation
declare global {
  namespace globalThis {
    var pdfjsLib: typeof PDFJSLib | undefined;
  }
}
