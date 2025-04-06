// This file contains additional types that might be needed in the client code
import { Sticker } from "@shared/schema";

export interface ActiveSticker extends Sticker {
  isDragging: boolean;
}

export interface StickerCategory {
  id: string;
  name: string;
}
