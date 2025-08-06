import { PDFDocumentProxy } from "pdfjs-dist";
import type {
  Content,
  Highlight,
  PdfScaleValue,
} from "./react-pdf-highlighter";

export interface CommentedHighlight extends Highlight {
  content: Content;
  comment?: string;
}

export type PDFViewerContext = {
  pdfDocument: PDFDocumentProxy;
  currentPage: number;
  zoomValue: PdfScaleValue;
  isSidebarOpen: boolean;
};
