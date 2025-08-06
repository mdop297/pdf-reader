import type { ViewportHighlight } from "./react-pdf-highlighter";

import "./style/HighlightPopup.css";
import type { CommentedHighlight } from "./types";

interface HighlightPopupProps {
  highlight: ViewportHighlight<CommentedHighlight>;
}

const HighlightPopup = ({ highlight }: HighlightPopupProps) => {
  return highlight.comment ? (
    <div className="Highlight__popup">{highlight.comment}</div>
  ) : (
    <div className="Highlight__popup">Comment has no Text</div>
  );
};

export default HighlightPopup;
