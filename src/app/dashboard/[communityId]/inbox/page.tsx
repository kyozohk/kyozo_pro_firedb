'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Filter, Inbox as InboxIcon } from 'lucide-react';
import { format } from 'date-fns';

type Message = {
  id: string;
  text: string;
  sender: string;
  createdAt: any;
  channel: string;
  read?: boolean;
};

type UserProfile = {
  id: string;
  fullName?: string;
  photoURL?: string;
};

export default function InboxPage() {
  const params = useParams();
  const communityId = params.communityId as string;
  const firestore = useFirestore();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Query for channels in this community
  const channelsQuery = useMemoFirebase(() => {
    if (!firestore || !communityId) return null;
    return query(
      collection(firestore, 'channels'), 
      where('community', '==', communityId)
    );
  }, [firestore, communityId]);

  const { data: channels, isLoading: channelsLoading } = useCollection(channelsQuery);
  
  // Get channel IDs
  const channelIds = channels?.map(channel => channel.id) || [];
  
  // Query for messages in these channels
  const messagesQuery = useMemoFirebase(() => {
    if (!firestore || channelIds.length === 0) return null;
    // Note: In a real app, you'd need to handle the Firestore limitation on 'in' queries (max 10 values)
    // For simplicity, we're assuming fewer than 10 channels here
    return query(
      collection(firestore, 'messages'),
      where('channel', 'in', channelIds)
    );
  }, [firestore, channelIds]);

  const { data: messages, isLoading: messagesLoading, error } = useCollection<Message>(messagesQuery);

  // Mock user data - in a real app, you'd fetch this from Firestore
  const userProfiles: Record<string, UserProfile> = {
    'user1': { id: 'user1', fullName: 'John Doe', photoURL: '' },
    'user2': { id: 'user2', fullName: 'Jane Smith', photoURL: '' },
    // Add more users as needed
  };

  const isLoading = channelsLoading || messagesLoading;

  // Filter messages based on search term
  const filteredMessages = messages?.filter(message => 
    message.text.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Sort messages by date (newest first)
  const sortedMessages = [...(filteredMessages || [])].sort((a, b) => {
    const dateA = a.createdAt?._seconds ? a.createdAt._seconds * 1000 : 0;
    const dateB = b.createdAt?._seconds ? b.createdAt._seconds * 1000 : 0;
    return dateB - dateA;
  });

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    // Handle Firestore Timestamp object
    if (timestamp._seconds) {
      return format(new Date(timestamp._seconds * 1000), "MMM d, yyyy");
    }
    // Handle ISO string
    return format(new Date(timestamp), "MMM d, yyyy");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <InboxIcon className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Inbox</h1>
            <p className="text-muted-foreground">
              {messages?.length || 0} messages
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search messages..." 
              className="pl-9 w-[200px]" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="p-6 text-center text-destructive">
              Error loading messages: {error.message}
            </div>
          ) : sortedMessages.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              {searchTerm ? 'No messages match your search' : 'No messages in your inbox'}
            </div>
          ) : (
            <div className="divide-y">
              {sortedMessages.map((message) => {
                const sender = userProfiles[message.sender] || { fullName: 'Unknown User' };
                
                return (
                  <div 
                    key={message.id} 
                    className={`p-4 hover:bg-muted/50 cursor-pointer flex items-center gap-4 ${!message.read ? 'bg-primary/5' : ''}`}
                  >
                    <Avatar>
                      <AvatarImage src={sender.photoURL} />
                      <AvatarFallback>
                        {sender.fullName?.substring(0, 2).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium truncate">
                          {sender.fullName}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(message.createdAt)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground truncate">
                        {message.text}
                      </p>
                    </div>
                    
                    {!message.read && (
                      <Badge variant="secondary" className="ml-2">New</Badge>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
