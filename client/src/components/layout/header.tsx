import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Link } from 'wouter';
import { Cloud } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function Header() {
  const { user, logoutMutation } = useAuth();
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <Cloud className="text-primary h-6 w-6 mr-2" />
            <h1 className="text-xl font-bold text-primary">Moody</h1>
          </div>
        </Link>
        
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-600">
                <Avatar>
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-500 mt-1">{user.email}</p>
              </div>
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <div className="cursor-pointer">Profile Settings</div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600 focus:text-red-700" 
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                {logoutMutation.isPending ? 'Logging out...' : 'Log out'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
