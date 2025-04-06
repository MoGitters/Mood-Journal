import { 
  journalEntries, 
  type JournalEntry, 
  type InsertJournalEntry,
  reminders,
  type Reminder,
  type InsertReminder,
  userSettings,
  type UserSettings,
  type InsertUserSettings
} from "@shared/schema";

// Define the storage interface
export interface IStorage {
  // Journal entries
  getAllJournalEntries(): Promise<JournalEntry[]>;
  getJournalEntry(id: number): Promise<JournalEntry | undefined>;
  getJournalEntryByDate(date: string): Promise<JournalEntry | undefined>;
  createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry>;
  updateJournalEntry(id: number, entry: InsertJournalEntry): Promise<JournalEntry>;
  deleteJournalEntry(id: number): Promise<boolean>;
  
  // Reminders
  getAllReminders(): Promise<Reminder[]>;
  getReminder(id: number): Promise<Reminder | undefined>;
  createReminder(reminder: InsertReminder): Promise<Reminder>;
  updateReminder(id: number, reminder: InsertReminder): Promise<Reminder>;
  toggleReminderComplete(id: number): Promise<Reminder>;
  deleteReminder(id: number): Promise<boolean>;
  
  // Settings
  getSettings(): Promise<UserSettings>;
  updateSettings(settings: InsertUserSettings): Promise<UserSettings>;
}

// Memory storage implementation
export class MemStorage implements IStorage {
  private entries: Map<number, JournalEntry>;
  private reminderItems: Map<number, Reminder>;
  private userSettings: UserSettings;
  private currentId: number;
  private currentReminderId: number;

  constructor() {
    this.entries = new Map();
    this.reminderItems = new Map();
    this.currentId = 1;
    this.currentReminderId = 1;
    
    // Initialize with default settings
    this.userSettings = {
      id: 1,
      colorMode: "light",
      themeColor: "default",
      fontSize: "medium",
      zoomLevel: 100,
      backgroundGradient: "orange-blue"
    };
  }

  // Journal Entry Methods
  async getAllJournalEntries(): Promise<JournalEntry[]> {
    return Array.from(this.entries.values()).sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA; // Sort by date, most recent first
    });
  }

  async getJournalEntry(id: number): Promise<JournalEntry | undefined> {
    return this.entries.get(id);
  }

  async getJournalEntryByDate(dateStr: string): Promise<JournalEntry | undefined> {
    const date = new Date(dateStr).toISOString().split('T')[0]; // Normalize to YYYY-MM-DD
    
    return Array.from(this.entries.values()).find(entry => {
      const entryDate = new Date(entry.date).toISOString().split('T')[0];
      return entryDate === date;
    });
  }

  async createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry> {
    const id = this.currentId++;
    // Ensure proper type conversion for the JournalEntry
    const newEntry: JournalEntry = { 
      id,
      date: entry.date,
      mood: entry.mood,
      content: entry.content,
      stickers: Array.isArray(entry.stickers) ? [...entry.stickers] : null
    };
    this.entries.set(id, newEntry);
    return newEntry;
  }

  async updateJournalEntry(id: number, entry: InsertJournalEntry): Promise<JournalEntry> {
    const existingEntry = this.entries.get(id);
    
    if (!existingEntry) {
      throw new Error(`Journal entry with id ${id} not found`);
    }
    
    // Ensure proper type conversion for the JournalEntry
    const updatedEntry: JournalEntry = { 
      id,
      date: entry.date,
      mood: entry.mood,
      content: entry.content,
      stickers: Array.isArray(entry.stickers) ? [...entry.stickers] : null
    };
    this.entries.set(id, updatedEntry);
    return updatedEntry;
  }

  async deleteJournalEntry(id: number): Promise<boolean> {
    if (!this.entries.has(id)) {
      return false;
    }
    
    return this.entries.delete(id);
  }

  // Reminder Methods
  async getAllReminders(): Promise<Reminder[]> {
    return Array.from(this.reminderItems.values()).sort((a, b) => {
      // Sort by due date (ascending) and then by priority (high first)
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      
      if (dateA === dateB) {
        // When dates are equal, sort by priority (high > medium > low)
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority as keyof typeof priorityOrder] - 
               priorityOrder[b.priority as keyof typeof priorityOrder];
      }
      
      return dateA - dateB;
    });
  }

  async getReminder(id: number): Promise<Reminder | undefined> {
    return this.reminderItems.get(id);
  }

  async createReminder(reminder: InsertReminder): Promise<Reminder> {
    const id = this.currentReminderId++;
    const now = new Date();
    
    // Ensure proper type conversion for Reminder
    const newReminder: Reminder = { 
      id,
      title: reminder.title,
      note: reminder.note,
      dueDate: reminder.dueDate,
      completed: reminder.completed ?? false,
      priority: reminder.priority ?? "medium",
      createdAt: now
    };
    
    this.reminderItems.set(id, newReminder);
    return newReminder;
  }

  async updateReminder(id: number, reminder: InsertReminder): Promise<Reminder> {
    const existingReminder = this.reminderItems.get(id);
    
    if (!existingReminder) {
      throw new Error(`Reminder with id ${id} not found`);
    }
    
    // Ensure proper type conversion for Reminder
    const updatedReminder: Reminder = { 
      id,
      title: reminder.title,
      note: reminder.note,
      dueDate: reminder.dueDate,
      completed: reminder.completed ?? existingReminder.completed,
      priority: reminder.priority ?? existingReminder.priority,
      createdAt: existingReminder.createdAt 
    };
    
    this.reminderItems.set(id, updatedReminder);
    return updatedReminder;
  }

  async toggleReminderComplete(id: number): Promise<Reminder> {
    const reminder = this.reminderItems.get(id);
    
    if (!reminder) {
      throw new Error(`Reminder with id ${id} not found`);
    }
    
    const updatedReminder: Reminder = { 
      ...reminder, 
      completed: !reminder.completed 
    };
    
    this.reminderItems.set(id, updatedReminder);
    return updatedReminder;
  }

  async deleteReminder(id: number): Promise<boolean> {
    if (!this.reminderItems.has(id)) {
      return false;
    }
    
    return this.reminderItems.delete(id);
  }

  // Settings Methods
  async getSettings(): Promise<UserSettings> {
    return this.userSettings;
  }

  async updateSettings(settings: InsertUserSettings): Promise<UserSettings> {
    // Update only the provided settings, keep the rest as they are
    this.userSettings = {
      ...this.userSettings,
      colorMode: settings.colorMode ?? this.userSettings.colorMode,
      themeColor: settings.themeColor ?? this.userSettings.themeColor,
      fontSize: settings.fontSize ?? this.userSettings.fontSize,
      zoomLevel: settings.zoomLevel ?? this.userSettings.zoomLevel,
      backgroundGradient: settings.backgroundGradient ?? this.userSettings.backgroundGradient
    };
    
    return this.userSettings;
  }
}

// Create and export the storage instance
export const storage = new MemStorage();
