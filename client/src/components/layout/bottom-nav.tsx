import React from 'react';
import { Link, useLocation } from 'wouter';
import { PlusCircle, LightbulbIcon, BarChart3, Settings, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type BottomNavProps = {
  activeTab: string;
};

export default function BottomNav({ activeTab }: BottomNavProps) {
  const [location] = useLocation();

  const navItems = [
    {
      id: 'mood',
      label: 'Humeur',
      icon: PlusCircle,
      href: '/mood-questionnaire'
    },
    {
      id: 'recommendations',
      label: 'Suggestions',
      icon: LightbulbIcon,
      href: '/recommendations'
    },
    {
      id: 'analytics',
      label: 'Analyses',
      icon: BarChart3,
      href: '/analytics'
    },
    {
      id: 'settings',
      label: 'Profil',
      icon: UserCircle,
      href: '/profile'
    }
  ];

  return (
    <nav className="bg-white border-t border-gray-200 fixed bottom-0 w-full">
      <div className="container mx-auto px-4">
        <div className="flex justify-around">
          {navItems.map((item) => (
            <Link key={item.id} href={item.href}>
              <div className={cn(
                "nav-link flex flex-col items-center py-3 px-2 cursor-pointer",
                item.id === activeTab ? "text-accent" : "text-gray-500"
              )}>
                <item.icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
