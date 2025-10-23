
'use client';

import React, { useState, useEffect } from 'react';
import { useFirestore, useMemoFirebase, useCollection, useDoc } from '@/firebase';
import { doc, collection, query, where, DocumentData } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, ServerCrash, User, MessageSquare, Users, FileJson, Loader2, Database } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import type { WithId } from '@/firebase/firestore/use-collection';

// --- TYPES ---
type Community = { name: string; usersList?: { userId: string }[] };
type UserProfile = { fullName: string; email?: string; [key: string]: any };
type Message = { id: string; text: string; sender: string; createdAt: any; channel: string };
type Channel = { community: string; [key: string]: any };

// --- MEMBER CARD ---
function MemberCard({ userId, channelIds }: { userId: string, channelIds: string[] }) {
  const firestore = useFirestore();

  // 1. Fetch the full user profile from the 'users' collection
  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !userId) return null;
    return doc(firestore, 'users', userId);
  }, [firestore, userId]);

  const { data: userProfile, isLoading: userProfileLoading, error: userProfileError } = useDoc<UserProfile>(userDocRef);

  // 2. State for messages, which will be fetched via a secure API route
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);

  // 3. Fetch messages using the API route when channelIds are available
  useEffect(() => {
    const fetchMessages = async () => {
      // Don't fetch if we don't have a user or any channels to look in
      if (!userId || channelIds.length === 0) {
        setMessages([]);
        return;
      }
      setMessagesLoading(true);
      setMessagesError(null);
      try {
        const response = await fetch('/api/get-member-messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, channelIds }),
        });
        
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.error || 'Failed to fetch messages');
        }

        setMessages(responseData.messages);
      } catch (e: any) {
        if (e instanceof SyntaxError) {
          setMessagesError("Received an invalid response from the server. It might be down.");
        } else {
          setMessagesError(e.message);
        }
      } finally {
        setMessagesLoading(false);
      }
    };

    fetchMessages();
  }, [userId, channelIds]);
  
  if (userProfileLoading) {
    return <Card className="bg-muted/50"><CardContent className="p-4 flex items-center gap-2"><Loader2 className="animate-spin w-4 h-4"/><span className="text-sm text-muted-foreground">Loading member...</span></CardContent></Card>;
  }

  if (userProfileError) {
    return <Card className="bg-destructive/10 border-destructive/50"><CardContent className="p-4"><p className="text-xs text-destructive-foreground">Error loading profile: {userProfileError.message}</p></CardContent></Card>;
  }

  if (!userProfile) {
    return <Card className="bg-muted/50"><CardContent className="p-4"><p className="text-xs text-muted-foreground">User profile not found for ID: {userId}</p></CardContent></Card>;
  }
  
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'No date';
    if (timestamp._seconds) return format(new Date(timestamp._seconds * 1000), "Pp");
    return format(new Date(timestamp), "Pp");
  };

  return (
    <Card className="bg-background mt-4 border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg"><User className="w-5 h-5 text-primary" />{userProfile.fullName || 'Unnamed Member'}</CardTitle>
        <CardDescription>User ID: {userId}</CardDescription>
      </CardHeader>
      <CardContent>
        <div>
            <h4 className="font-semibold flex items-center gap-2 text-md mb-2"><MessageSquare className="w-4 h-4"/> Messages ({messagesLoading ? '...' : messages?.length ?? 0})</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto p-2 bg-muted/50 rounded-md">
              {messagesError && <p className="text-destructive text-xs">Error loading messages: {messagesError}</p>}
              {messagesLoading && <p className="text-xs text-muted-foreground">Loading messages...</p>}
              {!messagesLoading && channelIds.length === 0 && <p className="text-xs text-muted-foreground">This community has no channels.</p>}
              {!messagesLoading && messages.length > 0 ? (
                messages.map(msg => (
                  <div key={msg.id} className="p-2 bg-background rounded-md text-sm border">
                    <p>{msg.text}</p>
                    {msg.createdAt && <p className="text-xs text-muted-foreground mt-1">{formatDate(msg.createdAt)}</p>}
                  </div>
                ))
              ) : (
                !messagesLoading && channelIds.length > 0 && <p className="text-xs text-muted-foreground">No messages found for this user in this community.</p>
              )}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}

// --- COMMUNITY CARD ---
function CommunityCard({ community }: { community: WithId<Community> }) {
    const firestore = useFirestore();

    // 1. Fetch all channels associated with this community
    const channelsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'channels'), where('community', '==', community.id));
    }, [firestore, community.id]);

    const { data: channels, isLoading: channelsLoading, error: channelsError } = useCollection<Channel>(channelsQuery);
    
    // 2. Create an array of channel IDs to pass to member cards
    const channelIds = useMemoFirebase(() => channels?.map(c => c.id) || [], [channels]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl break-all">
                    <FileJson className="text-primary" />
                    {community.name}
                </CardTitle>
                <CardDescription>Firestore ID: {community.id}</CardDescription>
            </CardHeader>
            <CardContent>
                <Card className="bg-muted/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            <Users className="text-primary" />
                            Members ({community.usersList?.length || 0})
                        </CardTitle>
                        <CardDescription>Each card below fetches the full user profile and their messages within this community's channels.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {channelsLoading && <div className="col-span-full flex items-center gap-2 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin"/><span>Loading channels...</span></div>}
                        {channelsError && <p className="text-destructive text-sm col-span-full">Error loading channels: {channelsError.message}</p>}
                        
                        {/* 3. Render a MemberCard for each user, passing the relevant channel IDs */}
                        {!channelsLoading && community.usersList && community.usersList.length > 0 ? (
                           community.usersList.map(member => (
                             <MemberCard key={member.userId} userId={member.userId} channelIds={channelIds}/>
                           ))
                        ) : (
                          !channelsLoading && <p className="text-muted-foreground text-sm col-span-full">No members found in this community's user list.</p>
                        )}
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    );
}

// --- MAIN PAGE ---
export default function DataExplorerPage() {
  const firestore = useFirestore();

  // Fetch all communities from the top-level collection
  const communitiesCollectionRef = useMemoFirebase(() => firestore ? collection(firestore, 'communities') : null, [firestore]);
  const { data: communities, isLoading, error } = useCollection<Community>(communitiesCollectionRef);

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <header className="p-4 border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Database className="text-primary h-8 w-8" />
          <h1 className="text-3xl font-headline font-bold">Firestore Data Explorer</h1>
        </div>
        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Main View
        </Link>
      </header>
      <main className="p-4 md:p-8">
        {isLoading && (
             <div className="flex justify-center items-center min-h-[50vh]">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span>Loading Communities...</span>
                </div>
             </div>
        )}
        {error && (
            <div className="max-w-4xl mx-auto my-16">
              <div role="alert" className="p-4 rounded-lg bg-destructive/10 text-destructive-foreground border border-destructive/20">
                <div className="flex items-start gap-4">
                  <ServerCrash className="h-6 w-6 flex-shrink-0 text-destructive" />
                  <div className="flex-grow">
                    <h3 className="font-semibold text-destructive">Error Loading Communities</h3>
                    <p className="text-sm font-code mt-1">{error.message}</p>
                  </div>
                </div>
              </div>
            </div>
        )}
        {!isLoading && !error && communities && (
            <div className="max-w-5xl mx-auto space-y-8">
                {communities.map(community => <CommunityCard key={community.id} community={community} />)}
            </div>
        )}
         {!isLoading && !error && !communities?.length && (
             <div className="text-center text-muted-foreground mt-16">
                <p>No communities found in Firestore.</p>
                <p className="text-sm">Have you exported any data yet?</p>
             </div>
         )}
      </main>
    </div>
  );
}
