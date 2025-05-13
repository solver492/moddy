import React, { useEffect, useRef } from 'react';
import { MoodEntry } from '@shared/schema';
import { format, compareAsc, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';
import { Line } from 'recharts';
import {
  Chart,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { Chart as ChartJS } from 'chart.js/auto';

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

type MoodChartProps = {
  moodEntries: MoodEntry[];
};

// Map mood types to numerical values for charting
const moodToValue: Record<string, number> = {
  very_happy: 5,
  happy: 4,
  neutral: 3,
  sad: 2,
  very_sad: 1,
  anxious: 2.5,
  energetic: 4.5
};

export default function MoodChart({ moodEntries }: MoodChartProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (!chartRef.current || !moodEntries.length) return;

    // Destroy previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Sort entries by date
    const sortedEntries = [...moodEntries].sort((a, b) => 
      compareAsc(new Date(a.date), new Date(b.date))
    );

    // Get date range (full month)
    const firstDate = sortedEntries.length ? new Date(sortedEntries[0].date) : new Date();
    const lastDate = sortedEntries.length ? new Date(sortedEntries[sortedEntries.length - 1].date) : new Date();
    
    const startDate = startOfMonth(firstDate);
    const endDate = endOfMonth(lastDate);

    // Generate all days in the interval
    const allDays = eachDayOfInterval({ start: startDate, end: endDate });
    
    // Create a map of dates to mood values
    const moodMap = new Map();
    sortedEntries.forEach(entry => {
      const dateString = format(new Date(entry.date), 'yyyy-MM-dd');
      moodMap.set(dateString, moodToValue[entry.moodType] || 3);
    });

    // Generate labels and data for all days
    const labels: string[] = [];
    const data: number[] = [];

    allDays.forEach(day => {
      const dateString = format(day, 'yyyy-MM-dd');
      const dayLabel = format(day, 'd');
      
      labels.push(dayLabel);
      
      // Use the mood value if it exists, otherwise use null to show a gap
      const moodValue = moodMap.has(dateString) ? moodMap.get(dateString) : null;
      data.push(moodValue);
    });

    // Chart data
    const chartData: ChartData = {
      labels,
      datasets: [
        {
          label: 'Mood Level',
          data,
          borderColor: '#4A90E2',
          backgroundColor: 'rgba(74, 144, 226, 0.1)',
          borderWidth: 2,
          tension: 0.3,
          fill: true,
          pointBackgroundColor: '#4A90E2',
          pointRadius: 3,
          pointHoverRadius: 5
        }
      ]
    };

    // Chart options
    const chartOptions: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 5,
          ticks: {
            stepSize: 1,
            callback: function(value) {
              const labels = ['', 'Very Sad', 'Sad', 'Neutral', 'Happy', 'Very Happy'];
              return labels[value as number];
            }
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const labels = ['Very Sad', 'Sad', 'Neutral', 'Happy', 'Very Happy'];
              const value = context.raw as number;
              
              if (value === 2.5) return 'Anxious';
              if (value === 4.5) return 'Energetic';
              
              const intValue = Math.floor(value);
              return labels[intValue - 1];
            }
          }
        }
      }
    };

    // Create new chart
    const ctx = chartRef.current.getContext('2d');
    if (ctx) {
      chartInstance.current = new ChartJS(ctx, {
        type: 'line',
        data: chartData,
        options: chartOptions
      });
    }

    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [moodEntries]);

  return (
    <div>
      <div className="chart-container mb-2" style={{ height: '220px' }}>
        <canvas ref={chartRef}></canvas>
      </div>
      <div className="flex justify-center space-x-4 text-xs flex-wrap">
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-[#FFD700] mr-1"></span>
          <span>Very Happy</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-[#7ED321] mr-1"></span>
          <span>Happy</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-[#4A90E2] mr-1"></span>
          <span>Neutral</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-[#738CA6] mr-1"></span>
          <span>Sad</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-[#5B2C6F] mr-1"></span>
          <span>Very Sad</span>
        </div>
      </div>
    </div>
  );
}
