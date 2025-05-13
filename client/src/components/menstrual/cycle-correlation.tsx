import React from 'react';
import { MoodEntry, MenstrualCycle } from '@shared/schema';
import { differenceInDays } from 'date-fns';
import { Loader2 } from 'lucide-react';

type CycleCorrelationProps = {
  cycles: MenstrualCycle[];
  moodEntries: MoodEntry[];
  isLoading: boolean;
};

// Average cycle length (days)
const AVERAGE_CYCLE_LENGTH = 28;

// Phases by day of cycle
const PHASES = {
  MENSTRUAL: { name: 'Menstrual Phase', days: [1, 5], typically: 'Lower energy' },
  FOLLICULAR: { name: 'Follicular Phase', days: [6, 13], typically: 'Increasing energy' },
  OVULATORY: { name: 'Ovulatory Phase', days: [14, 16], typically: 'Peak energy' },
  LUTEAL: { name: 'Luteal Phase', days: [17, 28], typically: 'Decreasing energy' }
};

export default function CycleCorrelation({ cycles, moodEntries, isLoading }: CycleCorrelationProps) {
  if (isLoading) {
    return (
      <div className="mb-6 p-4 bg-gray-50 rounded-lg flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!cycles || cycles.length === 0) {
    return (
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-md font-medium text-gray-700 mb-2">Cycle & Mood Correlation</h3>
        <p className="text-sm text-gray-500">No menstrual cycle data available. Add your cycle information to see correlations.</p>
      </div>
    );
  }

  // Sort cycles by start date (most recent first)
  const sortedCycles = [...cycles].sort((a, b) => 
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
  
  // Get the most recent cycle
  const currentCycle = sortedCycles[0];
  
  // Calculate current day of cycle
  const today = new Date();
  const dayOfCycle = differenceInDays(today, new Date(currentCycle.startDate)) + 1;
  
  // Determine current phase
  let currentPhase = null;
  let percentComplete = 0;
  
  if (dayOfCycle >= 1 && dayOfCycle <= 5) {
    currentPhase = PHASES.MENSTRUAL;
    percentComplete = (dayOfCycle / 5) * 100;
  } else if (dayOfCycle >= 6 && dayOfCycle <= 13) {
    currentPhase = PHASES.FOLLICULAR;
    percentComplete = ((dayOfCycle - 5) / 8) * 100;
  } else if (dayOfCycle >= 14 && dayOfCycle <= 16) {
    currentPhase = PHASES.OVULATORY;
    percentComplete = ((dayOfCycle - 13) / 3) * 100;
  } else if (dayOfCycle >= 17 && dayOfCycle <= 28) {
    currentPhase = PHASES.LUTEAL;
    percentComplete = ((dayOfCycle - 16) / 12) * 100;
  } else {
    // Past the expected cycle length
    currentPhase = PHASES.LUTEAL;
    percentComplete = 100;
  }
  
  // Analyze mood patterns during this phase from past cycles
  const phaseMoods: { [key: string]: number } = {};
  let dominantMood = '';
  let highestCount = 0;
  
  moodEntries.forEach(entry => {
    const entryDate = new Date(entry.date);
    
    // Find which cycle this entry belongs to
    const entryCycle = sortedCycles.find(cycle => {
      const cycleStartDate = new Date(cycle.startDate);
      const cycleEndDate = cycle.endDate 
        ? new Date(cycle.endDate) 
        : new Date(cycleStartDate.getTime() + (AVERAGE_CYCLE_LENGTH * 24 * 60 * 60 * 1000));
      
      return entryDate >= cycleStartDate && entryDate <= cycleEndDate;
    });
    
    if (entryCycle) {
      // Calculate day of cycle for this entry
      const entryDayOfCycle = differenceInDays(entryDate, new Date(entryCycle.startDate)) + 1;
      
      // Check if this entry falls in the same phase as current
      if (
        (currentPhase === PHASES.MENSTRUAL && entryDayOfCycle >= 1 && entryDayOfCycle <= 5) ||
        (currentPhase === PHASES.FOLLICULAR && entryDayOfCycle >= 6 && entryDayOfCycle <= 13) ||
        (currentPhase === PHASES.OVULATORY && entryDayOfCycle >= 14 && entryDayOfCycle <= 16) ||
        (currentPhase === PHASES.LUTEAL && entryDayOfCycle >= 17 && entryDayOfCycle <= 28)
      ) {
        // Count this mood
        phaseMoods[entry.moodType] = (phaseMoods[entry.moodType] || 0) + 1;
        
        // Update dominant mood
        if (phaseMoods[entry.moodType] > highestCount) {
          highestCount = phaseMoods[entry.moodType];
          dominantMood = entry.moodType;
        }
      }
    }
  });
  
  // Format mood for display
  const formatMood = (mood: string) => {
    if (!mood) return '';
    
    const words = mood.split('_');
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-md font-medium text-gray-700 mb-2">Cycle & Mood Correlation</h3>
      
      <div className="rounded-lg bg-white p-3 border border-gray-200 mb-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">{currentPhase?.name}</span>
          <span className="text-xs text-gray-500">
            Days {currentPhase?.days[0]}-{currentPhase?.days[1]}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent" 
            style={{ width: `${percentComplete}%` }}
          ></div>
        </div>
        <div className="mt-1 text-xs flex justify-between">
          <span>Typical mood: <span className="font-medium">{currentPhase?.typically}</span></span>
          <span>Day {dayOfCycle} of cycle</span>
        </div>
      </div>
      
      <div className="text-sm">
        {dominantMood ? (
          <p className="text-gray-600">
            Your mood trends suggest you may experience more <span className="font-medium">{formatMood(dominantMood)}</span> during this phase of your cycle.
          </p>
        ) : (
          <p className="text-gray-600">
            Not enough data yet to determine mood patterns during this phase of your cycle.
          </p>
        )}
        <button className="text-primary hover:text-accent text-sm mt-2 flex items-center">
          <i className="fas fa-chart-line mr-1"></i> See detailed analysis
        </button>
      </div>
    </div>
  );
}
