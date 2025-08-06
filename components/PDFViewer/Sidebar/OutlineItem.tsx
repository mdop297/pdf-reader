import { ChevronRight } from "lucide-react";
import { useState } from "react";
import type { PDFOutlineItem } from "./Outline";
import { PDFDocumentProxy } from "pdfjs-dist";

export class Ref {
  num: number;
  gen: number;

  constructor({ num, gen }: { num: number; gen: number }) {
    this.num = num;
    this.gen = gen;
  }

  toString() {
    let str = `${this.num}R`;
    if (this.gen !== 0) {
      str += this.gen;
    }
    return str;
  }
}

interface TreeOutlineItemProps {
  item: PDFOutlineItem;
  pdfDocument: PDFDocumentProxy;
  onNavigation: (pageNumber: number) => void;
}

const TreeOutlineItem = ({
  item,
  pdfDocument,
  onNavigation,
}: TreeOutlineItemProps) => {
  const [expanded, setExpanded] = useState(false);

  const getDestination = async (
    pdf: PDFDocumentProxy,
    item: PDFOutlineItem
  ) => {
    if (typeof item.dest === "string") {
      const dest = await pdf.getDestination(item.dest);
      console.log("this is new destination: ", dest);
      return dest;
    }
    return item.dest;
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded((prev) => !prev);
  };

  const getPageNumber = async () => {
    if (!pdfDocument) return;

    const destination = await getDestination(pdfDocument, item);
    if (!destination) return;

    // const [ref, zoom, x, y, z] = destination;
    const [ref, , , y] = destination;
    const pageIndex = await pdfDocument.getPageIndex(new Ref(ref));
    const pageNumber = pageIndex + 1;

    return pageNumber;
  };

  const handleNavigation = async () => {
    const pageNumber = await getPageNumber();
    if (pageNumber) {
      onNavigation(pageNumber);
    }
  };

  return (
    <div className="ml-1 my-1">
      <div className="flex items-center gap-1">
        {item.items?.length > 0 ? (
          <ChevronRight
            className={`size-3.5 shrink-0 ${expanded ? "rotate-90" : ""}`}
            onClick={handleToggle}
          />
        ) : (
          <span className="size-3.5 inline-block shrink-0" />
        )}
        <button
          className="text-left text-sm  hover:underline"
          onClick={handleNavigation}
        >
          {item.title}
        </button>
      </div>
      {expanded && (
        <div className="ml-2">
          {item.items.map((child, idx) => (
            <TreeOutlineItem
              key={idx}
              item={child}
              pdfDocument={pdfDocument}
              onNavigation={onNavigation}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeOutlineItem;
