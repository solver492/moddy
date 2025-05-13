import { pgTable, text, serial, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  gender: text("gender").notNull(), // 'male' or 'female'
  lastMenstrualCycle: date("last_menstrual_cycle"), // nullable
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Mood entries table
export const moodEntries = pgTable("mood_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  moodType: text("mood_type").notNull(), // 'very_happy', 'happy', 'neutral', 'sad', 'very_sad', 'anxious', 'energetic'
  notes: text("notes"),
  date: date("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Menstrual cycles table (for female users)
export const menstrualCycles = pgTable("menstrual_cycles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  symptoms: text("symptoms"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Recommendations table
export const recommendations = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'VIDEO', 'MUSIC', 'QUOTE', 'ACTIVITY'
  title: text("title").notNull(),
  content: text("content").notNull(), // URL for videos/music, text for quotes/activities
  thumbnail: text("thumbnail"), // for videos
  description: text("description"),
  duration: text("duration"), // for videos
  moodTarget: text("mood_target").notNull(), // which mood it targets
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User preferences table
export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  preferenceType: text("preference_type").notNull(),
  preferenceValue: text("preference_value").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Auth schemas
export const registerUserSchema = createInsertSchema(users)
  .omit({ id: true, passwordHash: true, createdAt: true })
  .extend({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginUserSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

// Mood entry schema
export const insertMoodEntrySchema = createInsertSchema(moodEntries).omit({
  id: true,
  createdAt: true,
});

// Menstrual cycle schema
export const insertMenstrualCycleSchema = createInsertSchema(menstrualCycles).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = Omit<typeof users.$inferInsert, "passwordHash"> & { password: string };
export type MoodEntry = typeof moodEntries.$inferSelect;
export type InsertMoodEntry = typeof moodEntries.$inferInsert;
export type MenstrualCycle = typeof menstrualCycles.$inferSelect;
export type InsertMenstrualCycle = typeof menstrualCycles.$inferInsert;
export type Recommendation = typeof recommendations.$inferSelect;
export type UserPreference = typeof userPreferences.$inferSelect;
export type LoginData = z.infer<typeof loginUserSchema>;
export type RegisterData = z.infer<typeof registerUserSchema>;
