import { useEffect } from 'react';
import { useLocation } from 'wouter';
import Header from '@/components/layout/header';
import BottomNav from '@/components/layout/bottom-nav';
import { useAuth } from '@/hooks/use-auth';

export default function HomePage() {
  const { user } = useAuth();
  const [_, navigate] = useLocation();

  // Redirect to mood questionnaire page by default
  useEffect(() => {
    navigate('/mood-questionnaire');
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6 mb-16">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Welcome to Moody</h1>
            <p className="text-gray-600 mb-6">Redirecting to mood tracking...</p>
          </div>
        </div>
      </main>
      <BottomNav activeTab="mood" />
    </div>
  );
}
