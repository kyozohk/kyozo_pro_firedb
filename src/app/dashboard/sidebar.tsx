'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  MessageSquare, 
  Inbox, 
  Send, 
  Users, 
  BarChart3, 
  ChevronDown 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

type Community = {
  id: string;
  name: string;
  logo?: string;
};

type NavItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
};

export function Sidebar({ 
  communities, 
  selectedCommunity, 
  onSelectCommunity 
}: { 
  communities: Community[]; 
  selectedCommunity: string | null;
  onSelectCommunity: (id: string) => void;
}) {
  const pathname = usePathname();
  
  const navItems: NavItem[] = [
    {
      name: 'Overview',
      href: `/dashboard/${selectedCommunity || ''}`,
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: 'Broadcast',
      href: `/dashboard/${selectedCommunity || ''}/broadcast`,
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      name: 'Inbox',
      href: `/dashboard/${selectedCommunity || ''}/inbox`,
      icon: <Inbox className="h-5 w-5" />,
      badge: 76,
    },
    {
      name: 'Sent',
      href: `/dashboard/${selectedCommunity || ''}/sent`,
      icon: <Send className="h-5 w-5" />,
    },
    {
      name: 'Members',
      href: `/dashboard/${selectedCommunity || ''}/members`,
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: 'Analytics',
      href: `/dashboard/${selectedCommunity || ''}/analytics`,
      icon: <BarChart3 className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Community Selector */}
      <div className="p-4 border-b">
        <Select 
          value={selectedCommunity || ''} 
          onValueChange={onSelectCommunity}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a community" />
          </SelectTrigger>
          <SelectContent>
            {communities.map((community) => (
              <SelectItem key={community.id} value={community.id}>
                {community.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link key={item.name} href={selectedCommunity ? item.href : '#'}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 font-normal",
                  !selectedCommunity && "opacity-50 pointer-events-none"
                )}
                disabled={!selectedCommunity}
              >
                {item.icon}
                <span>{item.name}</span>
                {item.badge && (
                  <Badge variant="secondary" className="ml-auto">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
