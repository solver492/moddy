import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'wouter';
import Header from '@/components/layout/header';
import BottomNav from '@/components/layout/bottom-nav';
import RecommendationTabs from '@/components/recommendations/recommendation-tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Recommendation } from '@shared/schema';
import { Loader2 } from 'lucide-react';

export default function RecommendationsPage() {
  const { moodType } = useParams();
  const [activeTab, setActiveTab] = useState<string>('videos');
  
  // Format the mood type for display
  const formatMoodType = (mood: string | undefined) => {
    if (!mood) return 'Unknown';
    return mood.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Fetch recommendations based on mood type
  const { data: recommendations, isLoading, error } = useQuery<Recommendation[]>({
    queryKey: [`/api/recommendations/${moodType || 'neutral'}`],
    enabled: !!moodType,
  });
  
  // Filter recommendations by type
  const getRecommendationsByType = (type: string) => {
    if (!recommendations) return [];
    return recommendations.filter(rec => rec.type === type.toUpperCase());
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6 mb-16">
        <Card className="bg-white rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Recommendations for you</CardTitle>
            <p className="text-gray-600">
              Based on your current mood: <span className="font-medium">{formatMoodType(moodType)}</span>
            </p>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="py-8 text-center">
                <p className="text-red-500">Error loading recommendations</p>
                <p className="text-sm text-gray-500 mt-2">Please try again later</p>
              </div>
            ) : !recommendations || recommendations.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-gray-500">No recommendations available for this mood.</p>
                <p className="text-sm text-gray-400 mt-2">Try selecting a different mood.</p>
              </div>
            ) : (
              <RecommendationTabs 
                activeTab={activeTab} 
                onTabChange={setActiveTab}
                videoRecommendations={getRecommendationsByType('video')}
                musicRecommendations={getRecommendationsByType('music')}
                quoteRecommendations={getRecommendationsByType('quote')}
                activityRecommendations={getRecommendationsByType('activity')}
              />
            )}
          </CardContent>
        </Card>
      </main>
      <BottomNav activeTab="recommendations" />
    </div>
  );
}
