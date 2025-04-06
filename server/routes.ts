import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertJournalEntrySchema, insertReminderSchema, insertUserSettingsSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // === Journal Entry Routes ===
  
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

  // === Reminder Routes ===

  // Get all reminders
  app.get("/api/reminders", async (req, res) => {
    try {
      const reminders = await storage.getAllReminders();
      res.json(reminders);
    } catch (error) {
      console.error("Error fetching reminders:", error);
      res.status(500).json({ message: "Failed to fetch reminders" });
    }
  });

  // Get reminder by ID
  app.get("/api/reminders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const reminder = await storage.getReminder(id);
      if (reminder) {
        res.json(reminder);
      } else {
        res.status(404).json({ message: "Reminder not found" });
      }
    } catch (error) {
      console.error("Error fetching reminder:", error);
      res.status(500).json({ message: "Failed to fetch reminder" });
    }
  });

  // Create reminder
  app.post("/api/reminders", async (req, res) => {
    try {
      const result = insertReminderSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ 
          message: "Invalid reminder data", 
          errors: validationError.details 
        });
      }
      
      const reminder = result.data;
      const newReminder = await storage.createReminder(reminder);
      
      res.status(201).json(newReminder);
    } catch (error) {
      console.error("Error creating reminder:", error);
      res.status(500).json({ message: "Failed to create reminder" });
    }
  });

  // Update reminder
  app.put("/api/reminders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const result = insertReminderSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ 
          message: "Invalid reminder data", 
          errors: validationError.details 
        });
      }
      
      const reminder = result.data;
      
      try {
        const updatedReminder = await storage.updateReminder(id, reminder);
        res.json(updatedReminder);
      } catch (error: any) {
        if (error.message.includes("not found")) {
          res.status(404).json({ message: "Reminder not found" });
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error("Error updating reminder:", error);
      res.status(500).json({ message: "Failed to update reminder" });
    }
  });

  // Toggle reminder completion status
  app.patch("/api/reminders/:id/toggle", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      try {
        const updatedReminder = await storage.toggleReminderComplete(id);
        res.json(updatedReminder);
      } catch (error: any) {
        if (error.message.includes("not found")) {
          res.status(404).json({ message: "Reminder not found" });
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error("Error toggling reminder status:", error);
      res.status(500).json({ message: "Failed to toggle reminder status" });
    }
  });

  // Delete reminder
  app.delete("/api/reminders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const success = await storage.deleteReminder(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Reminder not found" });
      }
    } catch (error) {
      console.error("Error deleting reminder:", error);
      res.status(500).json({ message: "Failed to delete reminder" });
    }
  });

  // === Settings Routes ===
  
  // Get settings
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  // Update settings
  app.put("/api/settings", async (req, res) => {
    try {
      const result = insertUserSettingsSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ 
          message: "Invalid settings data", 
          errors: validationError.details 
        });
      }
      
      const settings = result.data;
      const updatedSettings = await storage.updateSettings(settings);
      
      res.json(updatedSettings);
    } catch (error) {
      console.error("Error updating settings:", error);
      res.status(500).json({ message: "Failed to update settings" });
    }
  });

  // Export journal entries as PDF
  app.get("/api/export/journal", async (req, res) => {
    try {
      const entries = await storage.getAllJournalEntries();
      
      // In a real implementation, we would generate a PDF here
      // For now, we'll just return the entries as JSON with a note
      res.json({
        message: "PDF generation would happen here in a production environment",
        entries
      });
    } catch (error) {
      console.error("Error exporting journal entries:", error);
      res.status(500).json({ message: "Failed to export journal entries" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
