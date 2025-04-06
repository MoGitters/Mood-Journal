import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertJournalEntrySchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all journal entries
  app.get("/api/journal", async (req, res) => {
    try {
      const entries = await storage.getAllJournalEntries();
      res.json(entries);
    } catch (error) {
      console.error("Error fetching journal entries:", error);
      res.status(500).json({ message: "Failed to fetch journal entries" });
    }
  });

  // Get journal entry by date
  app.get("/api/journal/:date", async (req, res) => {
    try {
      const dateStr = req.params.date;
      const entry = await storage.getJournalEntryByDate(dateStr);
      if (entry) {
        res.json(entry);
      } else {
        res.status(404).json({ message: "No entry found for this date" });
      }
    } catch (error) {
      console.error("Error fetching journal entry:", error);
      res.status(500).json({ message: "Failed to fetch journal entry" });
    }
  });

  // Create or update journal entry
  app.post("/api/journal", async (req, res) => {
    try {
      const result = insertJournalEntrySchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ 
          message: "Invalid journal entry data", 
          errors: validationError.details 
        });
      }
      
      const journalEntry = result.data;
      
      // Check if an entry for this date already exists
      const existingEntry = await storage.getJournalEntryByDate(journalEntry.date.toString());
      
      if (existingEntry) {
        // Update existing entry
        const updatedEntry = await storage.updateJournalEntry(existingEntry.id, journalEntry);
        res.json(updatedEntry);
      } else {
        // Create new entry
        const newEntry = await storage.createJournalEntry(journalEntry);
        res.status(201).json(newEntry);
      }
    } catch (error) {
      console.error("Error saving journal entry:", error);
      res.status(500).json({ message: "Failed to save journal entry" });
    }
  });

  // Delete journal entry
  app.delete("/api/journal/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const success = await storage.deleteJournalEntry(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Journal entry not found" });
      }
    } catch (error) {
      console.error("Error deleting journal entry:", error);
      res.status(500).json({ message: "Failed to delete journal entry" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
