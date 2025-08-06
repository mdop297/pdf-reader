import { useState } from "react";
import {
  ArrowDownToLine,
  EllipsisVertical,
  Highlighter,
  Maximize2,
  Menu,
  Minus,
  Plus,
  Search,
} from "lucide-react";

import "../style/Toolbar.css";

import type { PdfScaleValue } from "../react-pdf-highlighter";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface ToolbarProps {
  setPdfScaleValue: (value: PdfScaleValue) => void;
  toggleHighlightPen: () => void;
}

const Toolbar = ({ setPdfScaleValue, toggleHighlightPen }: ToolbarProps) => {
  const [zoom, setZoom] = useState<number | null>(null);
  const [isHighlightPen, setIsHighlightPen] = useState<boolean>(false);

  const zoomIn = () => {
    if (zoom) {
      if (zoom < 4) {
        setPdfScaleValue(zoom + 0.1);
        setZoom(zoom + 0.1);
      }
    } else {
      setPdfScaleValue(1);
      setZoom(1);
    }
  };

  const zoomOut = () => {
    if (zoom) {
      if (zoom > 0.2) {
        setPdfScaleValue(zoom - 0.1);
        setZoom(zoom - 0.1);
      }
    } else {
      setPdfScaleValue(1);
      setZoom(1);
    }
  };

  const zoomByOption = (value: PdfScaleValue | string) => {
    if (
      value === "page-width" ||
      value === "page-fit" ||
      value === "page-actual" ||
      value === "page-height" ||
      value === "auto"
    ) {
      setPdfScaleValue(value);
      setZoom(null);
    } else if (typeof value === "string") {
      const zoomNum = parseFloat(value);
      if (!isNaN(zoomNum)) {
        setPdfScaleValue(zoomNum / 100);
        setZoom(zoomNum / 100);
      }
    }
  };
  return (
    <div className=" px-1 py-1 border-b bg-neutral-700 rounded-xs flex flex-row text-neutral-200">
      <div className="w-full flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center space-x-3 text-sm">
          <div
            className="toolbar-button"
            aria-label="Toggle sidebar"
            // onClick={toggleSidebar}
          >
            <Menu className="size-4" />
          </div>
          <div className="flex gap-1 items-center justify-center">
            <Input className="w-12 h-fit py-0.5 rounded-xs px-2 text-sm border-0 bg-neutral-600 " />
            <span>/ 1234</span>
          </div>
          <div className="toolbar-button">
            <Search className="size-4" />
          </div>
        </div>
        {/* Center section */}

        <div className="flex items-center space-x-1 text-sm h-5">
          <Button
            className="toolbar-button"
            variant={"ghost"}
            title="Zoom in"
            onClick={zoomIn}
          >
            <Plus className="size-4 aspect-square" />
          </Button>
          <Select defaultValue="auto" onValueChange={zoomByOption}>
            <SelectTrigger className="toolbar-button border-none focus:border-none w-fit ">
              <SelectValue placeholder="auto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto</SelectItem>
              <SelectItem value="page-width">Page Width</SelectItem>
              <SelectItem value="page-height">Page Height</SelectItem>
              <SelectItem value="page-fit">Page Fit</SelectItem>
              <SelectItem value="75">75%</SelectItem>
              <SelectItem value="100">100%</SelectItem>
              <SelectItem value="150">150%</SelectItem>
              <SelectItem value="200">200%</SelectItem>
              <SelectItem value="250">250%</SelectItem>
            </SelectContent>
          </Select>
          <Button
            className="toolbar-button"
            variant={"ghost"}
            title="Zoom out"
            onClick={zoomOut}
          >
            <Minus className="size-4" />
          </Button>

          <Separator orientation="vertical" className="mx-3 bg-foreground " />
          <Button
            className={` toolbar-button font-normal HighlightButton ${
              isHighlightPen ? "active" : ""
            }`}
            aria-label="zoom"
            variant="ghost"
            title="Highlight"
            onClick={() => {
              toggleHighlightPen();
              setIsHighlightPen(!isHighlightPen);
            }}
          >
            <Highlighter className="size-4" />
            Highlight
          </Button>
          {/* Eraser for later  */}
          {/* <Button
            className="toolbar-button font-normal"
            aria-label="zoom"
            variant="ghost"
          >
            <Eraser className="size-4" />
            Erase
          </Button> */}
        </div>
        {/* Right section */}

        <div className="flex items-center space-x-1 text-sm h-5">
          <div className="toolbar-button">
            <ArrowDownToLine className="size-4" />
          </div>
          <div className="toolbar-button">
            <Maximize2 className="size-4" />
          </div>
          <div className="toolbar-button">
            <EllipsisVertical className="size-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
