import React from 'react';
import { format } from 'date-fns';
import { MoodEntry as MoodEntryType } from '@shared/schema';
import { cn } from '@/lib/utils';

type MoodEntryProps = {
  entry: MoodEntryType;
};

// Map mood types to emojis
const moodEmojis: Record<string, string> = {
  very_happy: '😄',
  happy: '🙂',
  neutral: '😐',
  sad: '😔',
  very_sad: '😢',
  anxious: '😰',
  energetic: '⚡'
};

// Map mood types to background and text colors
const moodColors: Record<string, { bgColor: string; textColor: string; label: string }> = {
  very_happy: { bgColor: 'bg-[#FFD700] bg-opacity-20', textColor: 'text-[#FFD700]', label: 'Great Day' },
  happy: { bgColor: 'bg-[#7ED321] bg-opacity-20', textColor: 'text-[#7ED321]', label: 'Good Day' },
  neutral: { bgColor: 'bg-[#4A90E2] bg-opacity-20', textColor: 'text-[#4A90E2]', label: 'Average Day' },
  sad: { bgColor: 'bg-[#738CA6] bg-opacity-20', textColor: 'text-[#738CA6]', label: 'Sad Day' },
  very_sad: { bgColor: 'bg-[#5B2C6F] bg-opacity-20', textColor: 'text-[#5B2C6F]', label: 'Rough Day' },
  anxious: { bgColor: 'bg-[#F5A623] bg-opacity-20', textColor: 'text-[#F5A623]', label: 'Anxious Day' },
  energetic: { bgColor: 'bg-[#FF3B30] bg-opacity-20', textColor: 'text-[#FF3B30]', label: 'Energetic Day' }
};

export default function MoodEntry({ entry }: MoodEntryProps) {
  const formatMoodType = (moodType: string) => {
    return moodType.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const moodColor = moodColors[entry.moodType] || moodColors.neutral;
  const emoji = moodEmojis[entry.moodType] || '😐';
  
  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-3 mood-entry-animation">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <span className="text-2xl mr-2">{emoji}</span>
          <div>
            <h4 className="font-medium">{formatMoodType(entry.moodType)}</h4>
            <p className="text-xs text-gray-500">
              {format(new Date(entry.date), 'MMMM d, yyyy')}
            </p>
          </div>
        </div>
        <span className={cn("text-xs py-1 px-2 rounded-full", moodColor.bgColor, moodColor.textColor)}>
          {moodColor.label}
        </span>
      </div>
      {entry.notes && (
        <p className="text-sm text-gray-600">{entry.notes}</p>
      )}
    </div>
  );
}
