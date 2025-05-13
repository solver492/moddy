import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import Header from '@/components/layout/header';
import BottomNav from '@/components/layout/bottom-nav';
import MoodSelector from '@/components/mood-selector';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save } from 'lucide-react';
import { MoodEntry } from '@shared/schema';

export default function MoodPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  // Check for existing mood entry today
  const { data: todayEntries } = useQuery<MoodEntry[]>({
    queryKey: ['/api/mood-entries'],
    queryFn: async () => {
      const today = new Date();
      const startDate = new Date(today.setHours(0, 0, 0, 0));
      const endDate = new Date(today.setHours(23, 59, 59, 999));
      
      const res = await fetch(`/api/mood-entries/range?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`, {
        credentials: 'include'
      });
      
      if (!res.ok) throw new Error('Failed to fetch today\'s mood entries');
      return res.json();
    }
  });

  // Pre-fill form if entry exists for today
  useEffect(() => {
    if (todayEntries && todayEntries.length > 0) {
      const todayEntry = todayEntries[0];
      setSelectedMood(todayEntry.moodType);
      setNotes(todayEntry.notes || '');
    }
  }, [todayEntries]);

  // Create mood entry mutation
  const createMoodEntry = useMutation({
    mutationFn: async () => {
      if (!selectedMood) throw new Error('Please select your mood');
      
      const moodData = {
        moodType: selectedMood,
        notes: notes.trim(),
        date: new Date().toISOString()
      };
      
      const res = await apiRequest('POST', '/api/mood-entries', moodData);
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/mood-entries'] });
      toast({
        title: 'Mood Saved',
        description: 'Your mood has been recorded successfully!'
      });
      navigate(`/recommendations/${data.moodType}`);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const handleSaveMood = () => {
    createMoodEntry.mutate();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6 mb-16">
        <Card className="bg-white rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">How are you feeling today?</CardTitle>
          </CardHeader>
          <CardContent>
            <MoodSelector 
              selectedMood={selectedMood} 
              onSelect={setSelectedMood} 
            />
            
            <div className="mb-4 mt-6">
              <label htmlFor="mood-notes" className="block text-gray-700 mb-2">
                Add notes about your feelings (optional)
              </label>
              <Textarea
                id="mood-notes"
                placeholder="What's on your mind today?"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            
            <Button
              onClick={handleSaveMood}
              className="w-full bg-accent hover:bg-red-600 text-white font-medium py-3 rounded-lg transition duration-300"
              disabled={!selectedMood || createMoodEntry.isPending}
            >
              {createMoodEntry.isPending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Save Today's Mood
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </main>
      <BottomNav activeTab="mood" />
    </div>
  );
}
