import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { InsertMoodEntry, insertMoodEntrySchema, insertMenstrualCycleSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Get mood entries for the current user
  app.get("/api/mood-entries", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const userId = req.user!.id;
    storage.getMoodEntries(userId)
      .then(entries => res.json(entries))
      .catch(err => {
        console.error("Error fetching mood entries:", err);
        res.status(500).json({ message: "Failed to fetch mood entries" });
      });
  });

  // Get mood entries for a specific date range
  app.get("/api/mood-entries/range", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const startDate = new Date(req.query.startDate as string);
      const endDate = new Date(req.query.endDate as string);
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({ message: "Invalid date format" });
      }
      
      const userId = req.user!.id;
      storage.getMoodEntriesByDateRange(userId, startDate, endDate)
        .then(entries => res.json(entries))
        .catch(err => {
          console.error("Error fetching mood entries by date range:", err);
          res.status(500).json({ message: "Failed to fetch mood entries" });
        });
    } catch (error) {
      res.status(400).json({ message: "Invalid date parameters" });
    }
  });

  // Create a new mood entry
  app.post("/api/mood-entries", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const validatedData = insertMoodEntrySchema.parse({
        ...req.body,
        userId: req.user!.id,
        date: new Date(req.body.date || new Date())
      });
      
      const entry = await storage.createMoodEntry(validatedData);
      res.status(201).json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating mood entry:", error);
      res.status(500).json({ message: "Failed to create mood entry" });
    }
  });

  // Get recommendations based on mood
  app.get("/api/recommendations/:moodType", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const { moodType } = req.params;
    const { type } = req.query;
    
    let recommendationsPromise;
    if (type) {
      recommendationsPromise = storage.getRecommendationsByType(type as string, moodType);
    } else {
      recommendationsPromise = storage.getRecommendationsByMood(moodType);
    }
    
    recommendationsPromise
      .then(recommendations => res.json(recommendations))
      .catch(err => {
        console.error("Error fetching recommendations:", err);
        res.status(500).json({ message: "Failed to fetch recommendations" });
      });
  });

  // Menstrual cycle endpoints (for female users)
  app.get("/api/menstrual-cycles", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const userId = req.user!.id;
    if (req.user!.gender !== "female") {
      return res.status(403).json({ message: "Feature only available for female users" });
    }
    
    storage.getMenstrualCycles(userId)
      .then(cycles => res.json(cycles))
      .catch(err => {
        console.error("Error fetching menstrual cycles:", err);
        res.status(500).json({ message: "Failed to fetch menstrual cycles" });
      });
  });

  app.post("/api/menstrual-cycles", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    if (req.user!.gender !== "female") {
      return res.status(403).json({ message: "Feature only available for female users" });
    }
    
    try {
      const validatedData = insertMenstrualCycleSchema.parse({
        ...req.body,
        userId: req.user!.id,
        startDate: new Date(req.body.startDate),
        endDate: req.body.endDate ? new Date(req.body.endDate) : undefined
      });
      
      const cycle = await storage.createMenstrualCycle(validatedData);
      res.status(201).json(cycle);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error recording menstrual cycle:", error);
      res.status(500).json({ message: "Failed to record menstrual cycle" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
