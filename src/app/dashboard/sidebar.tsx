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
      <div className="p-2 border-b border-accent/20">
        <Select 
          value={selectedCommunity || ''} 
          onValueChange={onSelectCommunity}
        >
          <SelectTrigger className="w-full h-14 bg-background/5 border-accent/30 hover:border-primary/70 focus:border-primary focus:ring-1 focus:ring-primary">
            <SelectValue placeholder="Select a community" />
          </SelectTrigger>
          <SelectContent className="bg-card border-accent/30">
            {communities.map((community) => (
              <SelectItem 
                key={community.id} 
                value={community.id}
                className="h-12 hover:bg-accent hover:text-accent-foreground"
              >
                {community.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-1 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link key={item.name} href={selectedCommunity ? item.href : '#'} className="w-full">
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-[98%] h-14 justify-start gap-3 font-normal my-0.5",
                  isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent/10 hover:text-accent-foreground",
                  !selectedCommunity && "opacity-50 pointer-events-none"
                )}
                disabled={!selectedCommunity}
              >
                {item.icon}
                <span className="text-base">{item.name}</span>
                {item.badge && (
                  <Badge variant="secondary" className="ml-auto bg-primary text-primary-foreground">
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
