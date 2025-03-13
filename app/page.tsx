"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Palette, Trash2, Download, Eraser, Brush } from "lucide-react";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [thickness, setThickness] = useState([2]);
  const [isEraser, setIsEraser] = useState(false);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    
    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    
    const context = canvas.getContext("2d");
    if (!context) return;

    context.scale(2, 2);
    context.lineCap = "round";
    context.strokeStyle = color;
    context.lineWidth = thickness[0];
    contextRef.current = context;

    
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = isEraser ? backgroundColor : color;
      contextRef.current.lineWidth = thickness[0];
    }
  }, [color, thickness, isEraser, backgroundColor]);

  const startDrawing = (e: React.MouseEvent) => {
    const { offsetX, offsetY } = e.nativeEvent;
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    contextRef.current?.lineTo(offsetX, offsetY);
    contextRef.current?.stroke();
  };

  const stopDrawing = () => {
    contextRef.current?.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;
    
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "drawing.png";
    link.href = dataUrl;
    link.click();
  };

  const setBackgroundColorWithRefresh = (color: string) => {
    setBackgroundColor(color);
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;
    
    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100">
      {/* Top Toolbar */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-10 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-800">Kids Canvas</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={downloadCanvas}
              className="flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600"
            >
              <Download className="w-6 h-6" />
              <span className="text-lg">Save</span>
            </Button>
            <Button
              variant="outline"
              onClick={clearCanvas}
              className="flex items-center gap-2 bg-red-500 text-white hover:bg-red-600"
            >
              <Trash2 className="w-6 h-6" />
              <span className="text-lg">Clear</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="touch-none mt-16"
      />

      {/* Bottom Toolbar */}
      <Card className="fixed bottom-4 left-1/2 transform -translate-x-1/2 p-4 flex items-center gap-6 bg-white shadow-lg rounded-lg">
        <div className="flex flex-col items-center gap-2">
          <Palette className="w-8 h-8 text-blue-500" />
          <Input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-12 h-12 p-1 rounded-full cursor-pointer border-2 border-blue-500"
          />
          <span className="text-sm text-blue-800">Color</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 bg-current rounded" />
          <Input
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColorWithRefresh(e.target.value)}
            className="w-12 h-12 p-1 rounded-full cursor-pointer border-2 border-blue-500"
          />
          <span className="text-sm text-blue-800">Background</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Button
            variant={isEraser ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setIsEraser(!isEraser)}
            className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600"
          >
            {isEraser ? (
              <Eraser className="w-8 h-8 text-white" />
            ) : (
              <Brush className="w-8 h-8 text-white" />
            )}
          </Button>
          <span className="text-sm text-blue-800">
            {isEraser ? "Eraser" : "Brush"}
          </span>
        </div>

        <div className="w-48">
          <span className="text-sm text-blue-800 block mb-2">
            Thickness: {thickness[0]}px
          </span>
          <Slider
            value={thickness}
            onValueChange={setThickness}
            min={1}
            max={20}
            step={1}
            className="text-blue-500"
          />
        </div>
      </Card>
    </div>
  );
}