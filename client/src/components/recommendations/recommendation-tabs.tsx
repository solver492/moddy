import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Recommendation } from '@shared/schema';
import { ExternalLink, PlayCircle } from 'lucide-react';

type RecommendationTabsProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
  videoRecommendations: Recommendation[];
  musicRecommendations: Recommendation[];
  quoteRecommendations: Recommendation[];
  activityRecommendations: Recommendation[];
};

export default function RecommendationTabs({
  activeTab,
  onTabChange,
  videoRecommendations,
  musicRecommendations,
  quoteRecommendations,
  activityRecommendations
}: RecommendationTabsProps) {
  const tabs = [
    { id: 'videos', label: 'Videos', icon: 'video' },
    { id: 'music', label: 'Music', icon: 'music' },
    { id: 'quotes', label: 'Quotes', icon: 'quote-left' },
    { id: 'activities', label: 'Activities', icon: 'running' }
  ];

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
  };

  return (
    <div>
      {/* Tabs navigation */}
      <div className="border-b border-gray-200 mb-4">
        <nav className="flex -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={cn(
                "px-4 py-2 mr-2 font-medium border-b-2 transition-colors",
                activeTab === tab.id
                  ? "text-accent border-accent"
                  : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
              )}
              onClick={() => handleTabClick(tab.id)}
              data-tab={tab.id}
            >
              <span className="flex items-center">
                {tab.icon === 'video' && <i className="fas fa-video mr-1"></i>}
                {tab.icon === 'music' && <i className="fas fa-music mr-1"></i>}
                {tab.icon === 'quote-left' && <i className="fas fa-quote-left mr-1"></i>}
                {tab.icon === 'running' && <i className="fas fa-running mr-1"></i>}
                {tab.label}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Videos content */}
      <div className={cn("tab-content", activeTab === 'videos' ? "block" : "hidden")}>
        {videoRecommendations.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p>No video recommendations available.</p>
          </div>
        ) : (
          videoRecommendations.map((video) => (
            <div key={video.id} className="flex flex-col mb-4 bg-gray-50 rounded-lg overflow-hidden">
              <img
                src={video.thumbnail || "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=450"}
                alt={video.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-medium mb-1">{video.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{video.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{video.duration}</span>
                  <a 
                    href={video.content} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:text-accent flex items-center"
                  >
                    <PlayCircle className="h-4 w-4 mr-1" /> Play
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Music content */}
      <div className={cn("tab-content", activeTab === 'music' ? "block" : "hidden")}>
        {musicRecommendations.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p>No music recommendations available.</p>
          </div>
        ) : (
          musicRecommendations.map((playlist) => (
            <div key={playlist.id} className="flex items-center bg-gray-50 rounded-lg p-4 mb-4">
              <div className="mr-4 flex-shrink-0 w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                <i className="fas fa-music text-xl text-gray-500"></i>
              </div>
              <div className="flex-grow">
                <h3 className="font-medium mb-1">{playlist.title}</h3>
                <p className="text-sm text-gray-600">{playlist.description}</p>
              </div>
              <a 
                href={playlist.content} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="ml-4 text-gray-600 hover:text-accent"
              >
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          ))
        )}
      </div>

      {/* Quotes content */}
      <div className={cn("tab-content", activeTab === 'quotes' ? "block" : "hidden")}>
        {quoteRecommendations.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p>No quote recommendations available.</p>
          </div>
        ) : (
          quoteRecommendations.map((quote) => (
            <div key={quote.id} className="bg-gray-50 rounded-lg p-5 mb-4">
              <p className="text-lg italic mb-2">"{quote.content}"</p>
              <p className="text-right text-sm text-gray-600">— {quote.description}</p>
            </div>
          ))
        )}
      </div>

      {/* Activities content */}
      <div className={cn("tab-content", activeTab === 'activities' ? "block" : "hidden")}>
        {activityRecommendations.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p>No activity recommendations available.</p>
          </div>
        ) : (
          activityRecommendations.map((activity) => (
            <div key={activity.id} className="bg-gray-50 rounded-lg p-4 mb-4 flex">
              <div className="mr-4 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                {activity.content === 'journaling' && <i className="fas fa-pencil-alt text-blue-500"></i>}
                {activity.content === 'walking' && <i className="fas fa-leaf text-green-500"></i>}
                {activity.content === 'breathing' && <i className="fas fa-wind text-purple-500"></i>}
                {!['journaling', 'walking', 'breathing'].includes(activity.content) && <i className="fas fa-star text-blue-500"></i>}
              </div>
              <div>
                <h3 className="font-medium mb-1">{activity.title}</h3>
                <p className="text-sm text-gray-600">{activity.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
