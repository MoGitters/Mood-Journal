import { useRef, useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Sticker } from "@shared/schema";

interface JournalEntryProps {
  journalText: string;
  onJournalTextChange: (text: string) => void;
  appliedStickers: Sticker[];
  updateStickerPosition: (id: string, posX: number, posY: number) => void;
}

export default function JournalEntry({
  journalText,
  onJournalTextChange,
  appliedStickers,
  updateStickerPosition
}: JournalEntryProps) {
  const stickerCanvasRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [draggedSticker, setDraggedSticker] = useState<string | null>(null);
  const [initialPos, setInitialPos] = useState({ x: 0, y: 0 });

  // When component mounts or resizes, ensure stickers stay within bounds
  useEffect(() => {
    const handleResize = () => {
      if (!stickerCanvasRef.current) return;
      
      const canvasRect = stickerCanvasRef.current.getBoundingClientRect();
      
      appliedStickers.forEach(sticker => {
        // Ensure stickers are within bounds after resize
        const boundedX = Math.min(sticker.posX, canvasRect.width - sticker.width);
        const boundedY = Math.min(sticker.posY, canvasRect.height - sticker.height);
        
        if (boundedX !== sticker.posX || boundedY !== sticker.posY) {
          updateStickerPosition(sticker.id, boundedX, boundedY);
        }
      });
    };
    
    window.addEventListener('resize', handleResize);
    // Run once on mount
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, [appliedStickers, updateStickerPosition]);

  const handleStickerMouseDown = (e: React.MouseEvent, stickerId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    setDraggedSticker(stickerId);
    
    // Store initial position of mouse
    setInitialPos({
      x: e.clientX,
      y: e.clientY
    });
    
    // Add event listeners for dragging
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!draggedSticker || !stickerCanvasRef.current) return;
    
    const sticker = appliedStickers.find(s => s.id === draggedSticker);
    if (!sticker) return;
    
    // Calculate new position
    const deltaX = e.clientX - initialPos.x;
    const deltaY = e.clientY - initialPos.y;
    
    const canvasRect = stickerCanvasRef.current.getBoundingClientRect();
    
    // Update position, keeping within bounds
    const newPosX = Math.max(0, Math.min(sticker.posX + deltaX, canvasRect.width - sticker.width));
    const newPosY = Math.max(0, Math.min(sticker.posY + deltaY, canvasRect.height - sticker.height));
    
    updateStickerPosition(draggedSticker, newPosX, newPosY);
    
    // Update initial position for next move
    setInitialPos({
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleMouseUp = () => {
    setDraggedSticker(null);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="mb-6">
      <label htmlFor="journal-entry" className="block text-lg font-semibold mb-3 text-pastel-purple">
        Journal Entry
      </label>
      <div className="relative">
        <Textarea
          id="journal-entry"
          ref={textareaRef}
          className="w-full rounded-2xl border-2 border-pastel-pink border-opacity-50 p-4 h-40 focus:outline-none focus:border-pastel-purple resize-none shadow-sm"
          placeholder="Write about your day and feelings..."
          value={journalText}
          onChange={(e) => onJournalTextChange(e.target.value)}
        />
        
        {/* Sticker Canvas Area */}
        <div 
          id="sticker-canvas" 
          ref={stickerCanvasRef}
          className="absolute inset-0 pointer-events-none z-10"
        >
          {appliedStickers.map((sticker, index) => (
            <img
              key={`${sticker.id}-${index}`}
              src={sticker.imageUrl}
              alt={sticker.id}
              className="absolute cursor-move z-10"
              style={{
                left: `${sticker.posX}px`,
                top: `${sticker.posY}px`,
                width: `${sticker.width}px`,
                height: `${sticker.height}px`,
                pointerEvents: "auto", // Allow interaction with stickers
                zIndex: draggedSticker === sticker.id ? 20 : 10
              }}
              onMouseDown={(e) => handleStickerMouseDown(e, sticker.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
