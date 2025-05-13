import React from 'react';
import { cn } from '@/lib/utils';

type MoodSelectorProps = {
  selectedMood: string | null;
  onSelect: (mood: string) => void;
};

const moods = [
  { id: 'very_happy', emoji: '😄', label: 'Very Happy', bgClass: 'bg-[#FFD700] bg-opacity-10' },
  { id: 'happy', emoji: '🙂', label: 'Happy', bgClass: 'bg-[#7ED321] bg-opacity-10' },
  { id: 'neutral', emoji: '😐', label: 'Neutral', bgClass: 'bg-[#4A90E2] bg-opacity-10' },
  { id: 'sad', emoji: '😔', label: 'Sad', bgClass: 'bg-[#738CA6] bg-opacity-10' },
  { id: 'very_sad', emoji: '😢', label: 'Very Sad', bgClass: 'bg-[#5B2C6F] bg-opacity-10' },
  { id: 'anxious', emoji: '😰', label: 'Anxious', bgClass: 'bg-[#F5A623] bg-opacity-10' },
  { id: 'energetic', emoji: '⚡', label: 'Energetic', bgClass: 'bg-[#FF3B30] bg-opacity-10' }
];

export default function MoodSelector({ selectedMood, onSelect }: MoodSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {moods.map((mood) => (
        <div
          key={mood.id}
          className={cn(
            'emoji-selector rounded-lg p-4 flex flex-col items-center cursor-pointer',
            mood.bgClass,
            selectedMood === mood.id && 'selected border-2',
            selectedMood === mood.id && mood.id === 'very_happy' && 'border-[#FFD700]',
            selectedMood === mood.id && mood.id === 'happy' && 'border-[#7ED321]',
            selectedMood === mood.id && mood.id === 'neutral' && 'border-[#4A90E2]',
            selectedMood === mood.id && mood.id === 'sad' && 'border-[#738CA6]',
            selectedMood === mood.id && mood.id === 'very_sad' && 'border-[#5B2C6F]',
            selectedMood === mood.id && mood.id === 'anxious' && 'border-[#F5A623]',
            selectedMood === mood.id && mood.id === 'energetic' && 'border-[#FF3B30]'
          )}
          onClick={() => onSelect(mood.id)}
          data-mood={mood.id}
        >
          <span className="text-3xl mb-1">{mood.emoji}</span>
          <span className="text-xs text-center font-medium">{mood.label}</span>
        </div>
      ))}
    </div>
  );
}
