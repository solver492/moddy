import { MoodEntry, InsertMoodEntry, User, InsertUser, MenstrualCycle, InsertMenstrualCycle, Recommendation } from "@shared/schema";
import { randomUUID } from "crypto";
import createMemoryStore from "memorystore";
import session from "express-session";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User related
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: Omit<InsertUser, "password"> & { passwordHash: string }): Promise<User>;

  // Mood entries
  getMoodEntries(userId: number): Promise<MoodEntry[]>;
  getMoodEntryById(id: number): Promise<MoodEntry | undefined>;
  getMoodEntriesByDate(userId: number, date: Date): Promise<MoodEntry[]>;
  getMoodEntriesByDateRange(userId: number, startDate: Date, endDate: Date): Promise<MoodEntry[]>;
  createMoodEntry(entry: InsertMoodEntry): Promise<MoodEntry>;
  
  // Menstrual cycles (for female users)
  getMenstrualCycles(userId: number): Promise<MenstrualCycle[]>;
  getMenstrualCycleById(id: number): Promise<MenstrualCycle | undefined>;
  createMenstrualCycle(cycle: InsertMenstrualCycle): Promise<MenstrualCycle>;
  
  // Recommendations
  getRecommendationsByMood(moodType: string): Promise<Recommendation[]>;
  getRecommendationsByType(type: string, moodType: string): Promise<Recommendation[]>;
  
  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private moodEntries: Map<number, MoodEntry>;
  private menstrualCycles: Map<number, MenstrualCycle>;
  private recommendations: Map<number, Recommendation>;
  sessionStore: session.Store;
  private userId: number;
  private moodEntryId: number;
  private menstrualCycleId: number;
  private recommendationId: number;

  constructor() {
    this.users = new Map();
    this.moodEntries = new Map();
    this.menstrualCycles = new Map();
    this.recommendations = new Map();
    this.userId = 1;
    this.moodEntryId = 1;
    this.menstrualCycleId = 1;
    this.recommendationId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24h, clear expired sessions
    });
    
    // Initialize with some recommendations
    this.initializeRecommendations();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(userData: Omit<InsertUser, "password"> & { passwordHash: string }): Promise<User> {
    const id = this.userId++;
    const user: User = { 
      ...userData, 
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  // Mood entry methods
  async getMoodEntries(userId: number): Promise<MoodEntry[]> {
    return Array.from(this.moodEntries.values())
      .filter(entry => entry.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getMoodEntryById(id: number): Promise<MoodEntry | undefined> {
    return this.moodEntries.get(id);
  }

  async getMoodEntriesByDate(userId: number, date: Date): Promise<MoodEntry[]> {
    const dateString = date.toISOString().split('T')[0];
    return Array.from(this.moodEntries.values())
      .filter(entry => {
        const entryDateString = new Date(entry.date).toISOString().split('T')[0];
        return entry.userId === userId && entryDateString === dateString;
      });
  }

  async getMoodEntriesByDateRange(userId: number, startDate: Date, endDate: Date): Promise<MoodEntry[]> {
    const start = startDate.getTime();
    const end = endDate.getTime();
    return Array.from(this.moodEntries.values())
      .filter(entry => {
        const entryTime = new Date(entry.date).getTime();
        return entry.userId === userId && entryTime >= start && entryTime <= end;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async createMoodEntry(entry: InsertMoodEntry): Promise<MoodEntry> {
    const id = this.moodEntryId++;
    const moodEntry: MoodEntry = {
      ...entry,
      id,
      createdAt: new Date()
    };
    this.moodEntries.set(id, moodEntry);
    return moodEntry;
  }

  // Menstrual cycle methods
  async getMenstrualCycles(userId: number): Promise<MenstrualCycle[]> {
    return Array.from(this.menstrualCycles.values())
      .filter(cycle => cycle.userId === userId)
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  }

  async getMenstrualCycleById(id: number): Promise<MenstrualCycle | undefined> {
    return this.menstrualCycles.get(id);
  }

  async createMenstrualCycle(cycle: InsertMenstrualCycle): Promise<MenstrualCycle> {
    const id = this.menstrualCycleId++;
    const menstrualCycle: MenstrualCycle = {
      ...cycle,
      id,
      createdAt: new Date()
    };
    this.menstrualCycles.set(id, menstrualCycle);
    return menstrualCycle;
  }

  // Recommendation methods
  async getRecommendationsByMood(moodType: string): Promise<Recommendation[]> {
    return Array.from(this.recommendations.values())
      .filter(rec => rec.moodTarget === moodType);
  }

  async getRecommendationsByType(type: string, moodType: string): Promise<Recommendation[]> {
    return Array.from(this.recommendations.values())
      .filter(rec => rec.type === type && rec.moodTarget === moodType);
  }

  // Initialize sample recommendations for different moods
  private initializeRecommendations(): void {
    // Videos for sad mood
    this.addRecommendation({
      type: 'VIDEO',
      title: '10-Minute Yoga for Stress Relief',
      content: 'https://www.youtube.com/watch?v=qiKJRoX_2uo',
      thumbnail: 'https://img.youtube.com/vi/qiKJRoX_2uo/hqdefault.jpg',
      description: 'This gentle yoga session helps calm your mind and release tension',
      duration: '10:15',
      moodTarget: 'sad'
    });
    
    this.addRecommendation({
      type: 'VIDEO',
      title: 'Guided Meditation for Anxiety',
      content: 'https://www.youtube.com/watch?v=O-6f5wQXSu8',
      thumbnail: 'https://img.youtube.com/vi/O-6f5wQXSu8/hqdefault.jpg',
      description: 'A calming meditation to help reduce anxiety and find inner peace',
      duration: '8:15',
      moodTarget: 'sad'
    });

    // Music for sad mood
    this.addRecommendation({
      type: 'MUSIC',
      title: 'Calming Acoustic Playlist',
      content: 'https://open.spotify.com/playlist/37i9dQZF1DX4OzrY981I79',
      description: 'Gentle acoustic songs to soothe your mind',
      moodTarget: 'sad'
    });
    
    this.addRecommendation({
      type: 'MUSIC',
      title: 'Rain & Piano Ambient Mix',
      content: 'https://open.spotify.com/playlist/37i9dQZF1DX4aYNO8X5RpR',
      description: 'Relaxing piano with background rain sounds',
      moodTarget: 'sad'
    });

    // Quotes for sad mood
    this.addRecommendation({
      type: 'QUOTE',
      title: 'Nelson Mandela Quote',
      content: 'The greatest glory in living lies not in never falling, but in rising every time we fall.',
      description: 'Nelson Mandela',
      moodTarget: 'sad'
    });
    
    this.addRecommendation({
      type: 'QUOTE',
      title: 'Albert Camus Quote',
      content: 'In the midst of winter, I found there was, within me, an invincible summer.',
      description: 'Albert Camus',
      moodTarget: 'sad'
    });

    // Activities for sad mood
    this.addRecommendation({
      type: 'ACTIVITY',
      title: 'Journal Your Thoughts',
      content: 'journaling',
      description: 'Take 10 minutes to write down your thoughts and feelings without judgment',
      moodTarget: 'sad'
    });
    
    this.addRecommendation({
      type: 'ACTIVITY',
      title: 'Take a Nature Walk',
      content: 'walking',
      description: 'Spend 20 minutes walking outside, focusing on the sights and sounds around you',
      moodTarget: 'sad'
    });

    // For happy mood
    this.addRecommendation({
      type: 'VIDEO',
      title: 'Energy-Boosting Morning Yoga',
      content: 'https://www.youtube.com/watch?v=UEEsdXn8oG8',
      thumbnail: 'https://img.youtube.com/vi/UEEsdXn8oG8/hqdefault.jpg',
      description: 'Start your day with this energizing yoga routine',
      duration: '15:30',
      moodTarget: 'happy'
    });

    this.addRecommendation({
      type: 'MUSIC',
      title: 'Feel-Good Indie Folk',
      content: 'https://open.spotify.com/playlist/37i9dQZF1DX2mFmJUZg4uJ',
      description: 'Upbeat indie folk songs to enhance your good mood',
      moodTarget: 'happy'
    });

    // For neutral mood
    this.addRecommendation({
      type: 'VIDEO',
      title: 'Mindfulness Meditation',
      content: 'https://www.youtube.com/watch?v=ZToicYcHIOU',
      thumbnail: 'https://img.youtube.com/vi/ZToicYcHIOU/hqdefault.jpg',
      description: 'A simple mindfulness practice to center yourself',
      duration: '12:00',
      moodTarget: 'neutral'
    });

    // For anxious mood
    this.addRecommendation({
      type: 'ACTIVITY',
      title: 'Deep Breathing Exercise',
      content: 'breathing',
      description: 'Practice 4-7-8 breathing: Inhale for 4 seconds, hold for 7, exhale for 8',
      moodTarget: 'anxious'
    });

    // For very_sad mood
    this.addRecommendation({
      type: 'QUOTE',
      title: 'Brené Brown Quote',
      content: 'Only when we are brave enough to explore the darkness will we discover the infinite power of our light.',
      description: 'Brené Brown',
      moodTarget: 'very_sad'
    });
  }

  private addRecommendation(data: Omit<Recommendation, 'id' | 'createdAt'>): void {
    const id = this.recommendationId++;
    const recommendation: Recommendation = {
      ...data,
      id,
      createdAt: new Date()
    };
    this.recommendations.set(id, recommendation);
  }
}

export const storage = new MemStorage();
