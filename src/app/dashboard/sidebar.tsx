'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  MessageSquare, 
  Inbox, 
  Send, 
  Users, 
  BarChart3, 
  ChevronDown,
  Building2,
  Circle
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

type Community = {
  id: string;
  name: string;
  logo?: string;
  communityProfileImage?: string;
  communityPrivacy?: 'private' | 'public';
  communityType?: string;
  description?: string;
  tagline?: string;
  supportedProducts?: string[];
  tags?: string[];
};

type NavItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
};

interface SidebarProps {
  communities: Community[];
  selectedCommunity: string | null;
  onSelectCommunity: (id: string) => void;
  isLoading?: boolean;
}

export function Sidebar({
  communities,
  selectedCommunity,
  onSelectCommunity,
  isLoading
}: SidebarProps) {
  const pathname = usePathname();
  const firestore = useFirestore();
  const [memberCounts, setMemberCounts] = useState<Record<string, number>>({});
  const [loadingCounts, setLoadingCounts] = useState(false);
  
  // Fetch member counts for communities
  useEffect(() => {
    if (!firestore || communities.length === 0) return;
    
    const fetchMemberCounts = async () => {
      setLoadingCounts(true);
      const counts: Record<string, number> = {};
      
      try {
        // For each community, count members who have interacted with it
        for (const community of communities) {
          // First try to get messages for this community
          const messagesQuery = query(
            collection(firestore, 'messages'),
            where('community', '==', community.id)
          );
          
          const messagesSnapshot = await getDocs(messagesQuery);
          const messages = messagesSnapshot.docs.map(doc => doc.data());
          
          // Extract unique user IDs
          const userIds = new Set<string>();
          messages.forEach(msg => {
            if (msg.sender) userIds.add(msg.sender);
            if (msg.readBy) {
              msg.readBy.forEach((reader: any) => {
                if (reader.userId) userIds.add(reader.userId);
              });
            }
          });
          
          counts[community.id] = userIds.size;
        }
        
        setMemberCounts(counts);
      } catch (error) {
        console.error("Error fetching member counts:", error);
      } finally {
        setLoadingCounts(false);
      }
    };
    
    fetchMemberCounts();
  }, [firestore, communities]);
  
  const navItems: NavItem[] = [
    {
      name: 'Overview',
      href: `/dashboard/${selectedCommunity || ''}`,
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: 'Messages',
      href: `/dashboard/${selectedCommunity || ''}/messages`,
      icon: <MessageSquare className="h-5 w-5" />,
      badge: 76,
    },
    {
      name: 'Inbox',
      href: `/dashboard/${selectedCommunity || ''}/inbox`,
      icon: <Inbox className="h-5 w-5" />,
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
      badge: selectedCommunity && memberCounts[selectedCommunity] ? memberCounts[selectedCommunity] : undefined,
    },
    {
      name: 'Analytics',
      href: `/dashboard/${selectedCommunity || ''}/analytics`,
      icon: <BarChart3 className="h-5 w-5" />,
    },
  ];

  // Function to render community icon
  const renderCommunityIcon = (community: Community) => {
    // Use communityProfileImage if available, fall back to logo if not
    const imageUrl = community.communityProfileImage || community.logo;
    
    if (imageUrl) {
      return (
        <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3 border border-accent/30 shadow-sm">
          <Image 
            src={imageUrl} 
            alt={community.name} 
            width={40} 
            height={40} 
            className="object-cover"
          />
        </div>
      );
    }
    
    // Default icon if no image is available
    return (
      <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center mr-3 border border-accent/30 shadow-sm">
        <Building2 className="h-5 w-5 text-accent-foreground/70" />
      </div>
    );
  };
  
  // Get the selected community object
  const selectedCommunityObject = communities.find(c => c.id === selectedCommunity);
  
  return (
    <div className="flex flex-col h-full">
      {/* Community Selector */}
      <div className="p-2 border-b border-accent/20">
        {isLoading ? (
          <div className="space-y-2">
            <div className="flex items-center">
              <Skeleton className="h-8 w-8 rounded-full mr-3" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ) : (
          <Select 
            value={selectedCommunity || ''} 
            onValueChange={onSelectCommunity}
          >
            <SelectTrigger className="w-full h-16 bg-background/5 border-accent/30 hover:border-primary/70 focus:border-primary focus:ring-1 focus:ring-primary">
              {selectedCommunityObject ? (
                <div className="flex items-center">
                  {renderCommunityIcon(selectedCommunityObject)}
                  <div className="truncate">{selectedCommunityObject.name}</div>
                </div>
              ) : (
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center mr-3">
                    <Building2 className="h-4 w-4 text-accent-foreground/50" />
                  </div>
                  <span className="text-muted-foreground">Select a community</span>
                </div>
              )}
            </SelectTrigger>
            <SelectContent className="bg-card border-accent/30 max-h-[calc(100vh-120px)] overflow-y-auto">
              {communities.map((community) => (
                <SelectItem 
                  key={community.id} 
                  value={community.id}
                  className="h-16 hover:bg-accent hover:text-accent-foreground flex items-center px-2"
                >
                  <div className="flex items-center">
                    {renderCommunityIcon(community)}
                    <span className="ml-2">{community.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-1 space-y-0.5">
        {isLoading ? (
          // Skeleton loading state for navigation items
          <div className="space-y-2 px-1 py-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded-md" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        ) : (
          // Actual navigation items
          <>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              
              return (
                <Link key={item.name} href={selectedCommunity ? item.href : '#'} className="w-full">
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-[98%] h-16 justify-start gap-3 font-normal my-0.5",
                      isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent/10 hover:text-accent-foreground",
                      !selectedCommunity && "opacity-50 pointer-events-none"
                    )}
                    disabled={!selectedCommunity}
                  >
                    {item.icon}
                    <span className="text-base">{item.name}</span>
                    {item.badge && (
                      <Badge gradient className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                </Link>
              );
            })}
          </>
        )}
      </nav>
    </div>
  );
}
