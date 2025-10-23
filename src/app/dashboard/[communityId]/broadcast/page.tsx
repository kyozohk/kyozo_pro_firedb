'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Send } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export default function BroadcastPage() {
  const params = useParams();
  const communityId = params.communityId as string;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Broadcast</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Send a Message to All Members</CardTitle>
          <CardDescription>
            This message will be sent to all members of the community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea 
              placeholder="Type your message here..." 
              className="min-h-[150px]"
            />
            <Button className="gap-2">
              <Send className="h-4 w-4" />
              Send Broadcast
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Previous Broadcasts</CardTitle>
          <CardDescription>
            History of messages sent to all members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No previous broadcasts found
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
