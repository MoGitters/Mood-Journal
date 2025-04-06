import { pgTable, text, serial, integer, date, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define the sticker type for placing stickers in specific positions
export const StickerSchema = z.object({
  id: z.string(),
  type: z.string(),
  imageUrl: z.string(),
  posX: z.number(),
  posY: z.number(),
  width: z.number(),
  height: z.number(),
});

export type Sticker = z.infer<typeof StickerSchema>;

// Define the journal entries table
export const journalEntries = pgTable("journal_entries", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  mood: text("mood").notNull(),
  content: text("content").notNull(),
  stickers: jsonb("stickers").$type<Sticker[]>(),
});

// Create the insert schema for journal entries
export const insertJournalEntrySchema = createInsertSchema(journalEntries).pick({
  date: true,
  mood: true,
  content: true,
  stickers: true,
});

export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;
export type JournalEntry = typeof journalEntries.$inferSelect;

// Define the available mood emojis
export const moodEmojis = [
  "😊", "😍", "😌", "🥰", "😎",
  "😢", "😞", "😡", "😴", "🤔"
];

// Define the sticker categories and items
export const stickerCategories = ["all", "animals", "flowers", "food", "weather", "objects"];

export const stickers = {
  animals: [
    { id: "dog", type: "animals", imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f436.svg" },
    { id: "cat", type: "animals", imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f431.svg" },
    { id: "bear", type: "animals", imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f43b.svg" },
    { id: "rabbit", type: "animals", imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f430.svg" },
    { id: "fox", type: "animals", imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f98a.svg" },
    { id: "deer", type: "animals", imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f98c.svg" },
    { id: "panda", type: "animals", imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f43c.svg" },
    { id: "penguin", type: "animals", imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f427.svg" }
  ],
  flowers: [
    { id: "sunflower", type: "flowers", imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f33b.svg" },
    { id: "rose", type: "flowers", imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f339.svg" },
    { id: "tulip", type: "flowers", imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f337.svg" },
    { id: "blossom", type: "flowers", imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f338.svg" },
    { id: "hibiscus", type: "flowers", imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f33a.svg" },
    { id: "daisy", type: "flowers", imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f33c.svg" }
  ],
  food: [
    { id: "strawberry", type: "food", imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f353.svg" },
    { id: "cake", type: "food", imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f370.svg" },
    { id: "cookie", type: "food", imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f36a.svg" },
    { id: "candy", type: "food", imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f36c.svg" }
  ],
  weather: [
    { id: "rainbow", type: "weather", imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f308.svg" },
    { id: "sun", type: "weather", imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/2600.svg" },
    { id: "cloud", type: "weather", imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/2601.svg" },
    { id: "moon", type: "weather", imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f319.svg" }
  ],
  objects: [
    { id: "heart", type: "objects", imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/2764.svg" },
    { id: "star", type: "objects", imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/2b50.svg" },
    { id: "sparkles", type: "objects", imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/2728.svg" },
    { id: "balloon", type: "objects", imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f388.svg" }
  ]
};
