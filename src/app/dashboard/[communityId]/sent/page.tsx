'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Search, Filter, Send } from 'lucide-react';

export default function SentPage() {
  const params = useParams();
  const communityId = params.communityId as string;
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock sent messages data
  const sentMessages = [
    {
      id: '1',
      text: 'Hello everyone, welcome to our community!',
      recipients: 'All Members',
      timestamp: new Date(2023, 9, 15),
    },
    {
      id: '2',
      text: 'Reminder about our upcoming event this weekend.',
      recipients: 'Active Members',
      timestamp: new Date(2023, 9, 10),
    },
    {
      id: '3',
      text: 'Thank you for your participation in yesterday\'s discussion.',
      recipients: 'Discussion Group',
      timestamp: new Date(2023, 9, 5),
    },
  ];

  const filteredMessages = sentMessages.filter(message => 
    message.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.recipients.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Send className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Sent</h1>
            <p className="text-muted-foreground">
              {sentMessages.length} messages sent
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search sent messages..." 
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
          ) : filteredMessages.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              {searchTerm ? 'No messages match your search' : 'No sent messages found'}
            </div>
          ) : (
            <div className="divide-y">
              {filteredMessages.map((message) => (
                <div 
                  key={message.id} 
                  className="p-4 hover:bg-muted/50 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">
                      {message.recipients}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {message.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
