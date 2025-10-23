'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Users, MessageSquare, BarChart3 } from 'lucide-react';

type Community = {
  id: string;
  name: string;
  logo?: string;
  usersList?: { userId: string }[];
  description?: string;
  createdAt?: any;
};

export default function CommunityOverviewPage() {
  const params = useParams();
  const communityId = params.communityId as string;
  const firestore = useFirestore();
  
  // Get community document
  const communityDocRef = useMemoFirebase(() => {
    if (!firestore || !communityId) return null;
    return doc(firestore, 'communities', communityId);
  }, [firestore, communityId]);

  const { data: community, isLoading, error } = useDoc<Community>(communityDocRef);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="bg-destructive/10 border-destructive/30">
          <CardContent className="p-6">
            <h2 className="text-lg font-medium text-destructive mb-2">Error Loading Community</h2>
            <p className="text-sm text-destructive/80">{error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-medium mb-2">Community Not Found</h2>
            <p className="text-sm text-muted-foreground">
              The community you're looking for doesn't exist or you don't have access to it.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{community.name}</h1>
      {community.description && (
        <p className="text-muted-foreground mb-6">{community.description}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Members</p>
                <h3 className="text-2xl font-bold">{community.usersList?.length || 0}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Messages</p>
                <h3 className="text-2xl font-bold">--</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Engagement</p>
                <h3 className="text-2xl font-bold">--</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest messages and interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">No recent activity to display</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Community Details</CardTitle>
            <CardDescription>Information about this community</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Community ID</p>
              <p className="text-sm text-muted-foreground font-mono">{community.id}</p>
            </div>
            {community.createdAt && (
              <div>
                <p className="text-sm font-medium">Created</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(community.createdAt._seconds * 1000).toLocaleDateString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
