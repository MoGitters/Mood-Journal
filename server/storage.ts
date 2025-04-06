import { journalEntries, type JournalEntry, type InsertJournalEntry } from "@shared/schema";

// Define the storage interface
export interface IStorage {
  getAllJournalEntries(): Promise<JournalEntry[]>;
  getJournalEntry(id: number): Promise<JournalEntry | undefined>;
  getJournalEntryByDate(date: string): Promise<JournalEntry | undefined>;
  createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry>;
  updateJournalEntry(id: number, entry: InsertJournalEntry): Promise<JournalEntry>;
  deleteJournalEntry(id: number): Promise<boolean>;
}

// Memory storage implementation
export class MemStorage implements IStorage {
  private entries: Map<number, JournalEntry>;
  private currentId: number;

  constructor() {
    this.entries = new Map();
    this.currentId = 1;
  }

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
    const newEntry: JournalEntry = { ...entry, id };
    this.entries.set(id, newEntry);
    return newEntry;
  }

  async updateJournalEntry(id: number, entry: InsertJournalEntry): Promise<JournalEntry> {
    const existingEntry = this.entries.get(id);
    
    if (!existingEntry) {
      throw new Error(`Journal entry with id ${id} not found`);
    }
    
    const updatedEntry: JournalEntry = { ...entry, id };
    this.entries.set(id, updatedEntry);
    return updatedEntry;
  }

  async deleteJournalEntry(id: number): Promise<boolean> {
    if (!this.entries.has(id)) {
      return false;
    }
    
    return this.entries.delete(id);
  }
}

// Create and export the storage instance
export const storage = new MemStorage();
