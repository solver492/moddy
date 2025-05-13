import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import Header from '@/components/layout/header';
import BottomNav from '@/components/layout/bottom-nav';
import MoodQuestionnaire from '@/components/mood-questionnaire';

export default function MoodQuestionnairePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6 mb-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Évaluer votre humeur</h1>
            <p className="text-gray-600">
              Répondez à ces questions pour nous aider à évaluer votre humeur actuelle et vous 
              proposer des recommandations personnalisées.
            </p>
          </div>
          
          <MoodQuestionnaire />
        </div>
      </main>
      <BottomNav activeTab="mood" />
    </div>
  );
}