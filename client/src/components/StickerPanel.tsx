import { useState } from "react";
import { Button } from "@/components/ui/button";
import { stickerCategories, stickers } from "@shared/schema";
import { cn } from "@/lib/utils";

interface StickerPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  onStickerSelect: (sticker: any) => void;
}

export default function StickerPanel({ isOpen, onToggle, onStickerSelect }: StickerPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Get stickers based on selected category
  const getFilteredStickers = () => {
    if (selectedCategory === "all") {
      return Object.values(stickers).flat();
    } else {
      return stickers[selectedCategory as keyof typeof stickers] || [];
    }
  };

  return (
    <div className="sticker-panel relative z-20 mt-6">
      <Button
        variant="ghost"
        className="flex items-center justify-center mx-auto px-4 py-2 rounded-t-xl bg-white bg-opacity-70 shadow-md hover:bg-opacity-90 transition"
        onClick={onToggle}
      >
        <span className="mr-2 font-medium text-pastel-purple">Stickers</span>
        <span className="text-lg text-pastel-purple">
          {isOpen ? "↓" : "↑"}
        </span>
      </Button>
      
      <div className={cn(
        "bg-white bg-opacity-80 backdrop-blur-sm rounded-t-3xl shadow-lg p-4 transition-all duration-300 overflow-hidden",
        isOpen ? "max-h-64" : "max-h-0"
      )}>
        {/* Sticker Categories */}
        <div className="flex gap-2 mb-4 overflow-x-auto hide-scrollbar pb-2">
          {stickerCategories.map((category) => (
            <Button
              key={category}
              variant="ghost"
              className={cn(
                "px-4 py-1.5 rounded-full text-sm shadow-sm whitespace-nowrap",
                selectedCategory === category 
                  ? "bg-pastel-purple text-white" 
                  : "bg-white"
              )}
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>
        
        {/* Sticker Grid */}
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-3 p-2 overflow-y-auto hide-scrollbar max-h-40">
          {getFilteredStickers().map((sticker) => (
            <div
              key={`${sticker.type}-${sticker.id}`}
              className="sticker-item"
              onClick={() => onStickerSelect(sticker)}
            >
              <img 
                src={sticker.imageUrl}
                className="w-12 h-12 object-contain"
                alt={sticker.id}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
