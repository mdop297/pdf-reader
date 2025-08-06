import React, { useEffect, useState } from "react";

import type { PDFDocumentProxy } from "pdfjs-dist";
import TreeOutlineItem from "./OutlineItem";

type PDFOutline = Awaited<ReturnType<PDFDocumentProxy["getOutline"]>>;

export type PDFOutlineItem = PDFOutline[number];

export interface TreeOutlineProps {
  pdfDocument: PDFDocumentProxy;
  onNavigation: (pageNumber: number) => void;
}

const TreeOutline = ({ pdfDocument }: TreeOutlineProps) => {
  const [outline, setOutline] = useState<PDFOutline>([]);

  useEffect(() => {
    const load = async () => {
      if (pdfDocument) {
        setOutline((await pdfDocument.getOutline()) || []);
      }
    };
    load();
  }, [pdfDocument]);

  return (
    <div className="flex flex-col">
      {outline.map((item, i) => (
        <TreeOutlineItem key={i} item={item} />
      ))}
    </div>
  );
};

export default TreeOutline;
