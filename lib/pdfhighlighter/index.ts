import dynamic from "next/dynamic";

import {
  PdfHighlighter,
  PdfHighlighterProps,
} from "./components/PdfHighlighter";
import { TextHighlight, TextHighlightProps } from "./components/TextHighlight";
import {
  MonitoredHighlightContainer,
  MonitoredHighlightContainerProps,
} from "./components/MonitoredHighlightContainer";
import { AreaHighlight, AreaHighlightProps } from "./components/AreaHighlight";
import { PdfLoaderProps, PdfLoader } from "./components/PdfLoader";
import {
  HighlightContainerUtils,
  useHighlightContainerContext,
} from "./contexts/HighlightContext";
import {
  viewportPositionToScaled,
  scaledPositionToViewport,
} from "./lib/coordinates";

import {
  PdfHighlighterUtils,
  usePdfHighlighterContext,
} from "./contexts/PdfHighlighterContext";

export {
  PdfLoader,
  PdfHighlighter,
  TextHighlight,
  MonitoredHighlightContainer,
  AreaHighlight,
  useHighlightContainerContext,
  viewportPositionToScaled,
  scaledPositionToViewport,
  usePdfHighlighterContext,
};

export type {
  HighlightContainerUtils,
  PdfHighlighterUtils,
  PdfHighlighterProps,
  TextHighlightProps,
  MonitoredHighlightContainerProps,
  AreaHighlightProps,
  PdfLoaderProps,
};
export * from "./types";
