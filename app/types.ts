import type { Content, Highlight } from "./react-pdf-highlighter-extended";

export interface CommentedHighlight extends Highlight {
  content: Content;
  comment?: string;
}
