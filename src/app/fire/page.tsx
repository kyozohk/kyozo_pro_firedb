'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Database, ServerCrash, Users, Loader2, ArrowRight, ArrowLeft, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { WithId } from '@/firebase/firestore/use-collection';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Define the type for a community document from Firestore
type Community = {
  name: string;
  mongoId: string;
};

// Define the type for a channel document
type Channel = {
  provider: string; 
  community: string; // This is the community ID
};

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="max-w-2xl mx-auto my-16">
      <div role="alert" className="p-4 rounded-lg bg-destructive/10 text-destructive-foreground border border-destructive/20">
        <div className="flex items-start gap-4">
          <ServerCrash className="h-6 w-6 flex-shrink-0 text-destructive" />
          <div className="flex-grow">
            <h3 className="font-semibold text-destructive">Error</h3>
            <p className="text-sm font-code mt-1">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FirePage() {
  const firestore = useFirestore();

  const communitiesCollectionRef = useMemoFirebase(() => firestore ? collection(firestore, 'communities') : null, [firestore]);
  const channelsCollectionRef = useMemoFirebase(() => firestore ? collection(firestore, 'channels') : null, [firestore]);

  const { data: communities, isLoading: communitiesLoading, error: communitiesError } = useCollection<Community>(communitiesCollectionRef);
  const { data: channels, isLoading: channelsLoading, error: channelsError } = useCollection<Channel>(channelsCollectionRef);

  const isLoading = communitiesLoading || channelsLoading;
  const error = communitiesError || channelsError;

  // Create a map of channels grouped by their community ID
  const channelsByCommunity = useMemoFirebase(() => {
    if (!channels) return new Map<string, WithId<Channel>[]>();
    return channels.reduce((acc, channel) => {
      if (!channel.community) return acc;
      const communityChannels = acc.get(channel.community) || [];
      communityChannels.push(channel);
      acc.set(channel.community, communityChannels);
      return acc;
    }, new Map<string, WithId<Channel>[]>());
  }, [channels]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading Data from Firestore...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <header className="p-4 border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Database className="text-primary h-8 w-8" />
          <h1 className="text-3xl font-headline font-bold">Firestore Navigator</h1>
        </div>
        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Main View
        </Link>
      </header>
      <main className="p-4 md:p-8">
        {error && <ErrorMessage message={error.message} />}
        {!error && (
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Users className="text-primary" />
                Firestore Communities
              </CardTitle>
              <CardDescription>
                This data is being loaded in real-time from your Firestore collections.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {communities && communities.length > 0 ? (
                <ul className="space-y-4">
                  {communities.map((community: WithId<Community>) => {
                    const communityChannels = channelsByCommunity.get(community.id) || [];
                    return (
                      <li key={community.id} className="p-4 rounded-md border hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-primary text-2xl">
                                {community.name}
                            </span>
                            <Link href={`/firestore/community/${community.id}`} passHref>
                                <Button variant="ghost" size="sm">
                                   View Details <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                        <div className="mt-2">
                           <h4 className="font-semibold flex items-center gap-2 text-sm mb-2">
                                <MessageSquare className="w-4 h-4 text-muted-foreground"/>
                                Channels ({communityChannels.length})
                           </h4>
                           {communityChannels.length > 0 ? (
                            <div className="pl-6 flex flex-wrap gap-2">
                                {communityChannels.map(channel => (
                                    <Badge variant="secondary" key={channel.id}>
                                        {channel.provider} ({channel.id.substring(0,5)}...)
                                    </Badge>
                                ))}
                            </div>
                           ) : (
                            <p className="text-xs text-muted-foreground pl-6">No channels found for this community.</p>
                           )}
                        </div>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p className="text-muted-foreground text-center py-4">No communities found in Firestore.</p>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
