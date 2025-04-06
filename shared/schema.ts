import { pgTable, text, serial, integer, date, jsonb, boolean, timestamp } from "drizzle-orm/pg-core";
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

// Define the reminders table
export const reminders = pgTable("reminders", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  note: text("note").notNull(),
  dueDate: date("due_date").notNull(),
  completed: boolean("completed").default(false).notNull(),
  priority: text("priority").default("medium").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Create the insert schema for reminders
export const insertReminderSchema = createInsertSchema(reminders).pick({
  title: true,
  note: true,
  dueDate: true,
  priority: true,
  completed: true,
});

export type InsertReminder = z.infer<typeof insertReminderSchema>;
export type Reminder = typeof reminders.$inferSelect;

// Define priority types
export const reminderPriorities = ["low", "medium", "high"] as const;
export type ReminderPriority = typeof reminderPriorities[number];

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

// Define settings schema types
export const themeColors = ["default", "lavender", "mint", "peach", "sky"] as const;
export type ThemeColor = typeof themeColors[number];

export const fontSizes = ["small", "medium", "large"] as const;
export type FontSize = typeof fontSizes[number];

export const colorModes = ["light", "dark", "system"] as const;
export type ColorMode = typeof colorModes[number];

export const backgroundGradients = [
  "orange-blue", // Default: Light orange to sky blue
  "purple-pink",
  "green-blue",
  "blue-purple",
  "pink-orange"
] as const;
export type BackgroundGradient = typeof backgroundGradients[number];

// User settings schema
export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  colorMode: text("color_mode", { enum: colorModes }).default("light").notNull(),
  themeColor: text("theme_color", { enum: themeColors }).default("default").notNull(),
  fontSize: text("font_size", { enum: fontSizes }).default("medium").notNull(),
  zoomLevel: integer("zoom_level").default(100).notNull(),
  backgroundGradient: text("background_gradient", { enum: backgroundGradients }).default("orange-blue").notNull(),
});

export const insertUserSettingsSchema = createInsertSchema(userSettings).pick({
  colorMode: true,
  themeColor: true,
  fontSize: true,
  zoomLevel: true,
  backgroundGradient: true,
});

export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
export type UserSettings = typeof userSettings.$inferSelect;
