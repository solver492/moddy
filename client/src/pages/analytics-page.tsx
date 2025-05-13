import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import Header from '@/components/layout/header';
import BottomNav from '@/components/layout/bottom-nav';
import MoodChart from '@/components/mood-chart';
import MoodEntry from '@/components/mood-entry';
import CycleCorrelation from '@/components/menstrual/cycle-correlation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MoodEntry as MoodEntryType, MenstrualCycle } from '@shared/schema';
import { subMonths, format } from 'date-fns';
import { Loader2 } from 'lucide-react';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState({
    startDate: subMonths(new Date(), 1),
    endDate: new Date()
  });

  // Fetch mood entries
  const { data: moodEntries, isLoading: loadingMoodEntries } = useQuery<MoodEntryType[]>({
    queryKey: ['/api/mood-entries/range', dateRange.startDate.toISOString(), dateRange.endDate.toISOString()],
    queryFn: async () => {
      const res = await fetch(`/api/mood-entries/range?startDate=${dateRange.startDate.toISOString()}&endDate=${dateRange.endDate.toISOString()}`, {
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to fetch mood entries');
      return res.json();
    }
  });

  // Fetch menstrual cycles (for female users only)
  const { data: menstrualCycles, isLoading: loadingCycles } = useQuery<MenstrualCycle[]>({
    queryKey: ['/api/menstrual-cycles'],
    queryFn: async () => {
      const res = await fetch('/api/menstrual-cycles', {
        credentials: 'include'
      });
      if (!res.ok) {
        if (res.status === 403) return null; // Not a female user
        throw new Error('Failed to fetch menstrual cycles');
      }
      return res.json();
    },
    enabled: user?.gender === 'female'
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6 mb-16">
        <Card className="bg-white rounded-xl shadow-sm mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Your Mood Trends</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingMoodEntries ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : !moodEntries || moodEntries.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-gray-500">No mood data available.</p>
                <p className="text-sm text-gray-400 mt-2">Start tracking your mood to see trends here.</p>
              </div>
            ) : (
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-700 mb-3">Monthly Overview</h3>
                <MoodChart moodEntries={moodEntries} />
              </div>
            )}
            
            {/* Cycle Correlation (only for female users) */}
            {user?.gender === 'female' && (
              <CycleCorrelation 
                cycles={menstrualCycles || []} 
                moodEntries={moodEntries || []}
                isLoading={loadingCycles}
              />
            )}
            
            {/* Recent Entries */}
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-3">Recent Entries</h3>
              
              {loadingMoodEntries ? (
                <div className="flex justify-center items-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : !moodEntries || moodEntries.length === 0 ? (
                <div className="py-4 text-center">
                  <p className="text-sm text-gray-500">No entries to display.</p>
                </div>
              ) : (
                <>
                  {moodEntries.slice(0, 3).map((entry) => (
                    <MoodEntry key={entry.id} entry={entry} />
                  ))}
                  
                  {moodEntries.length > 3 && (
                    <button className="w-full text-primary hover:text-accent text-sm mt-3 flex items-center justify-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      View all entries
                    </button>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
      <BottomNav activeTab="analytics" />
    </div>
  );
}
