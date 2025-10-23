
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { doc, collection, query, where, updateDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2, ServerCrash, User, MessageSquare, Users, FileJson, Loader2, Tag, Palette, MessageCircle, Image as ImageIcon, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { format } from 'date-fns';

// Define types based on backend.json and exported data
type Community = { 
  name: string; 
  mongoId: string;
  lore?: string;
  communityProfileImage?: string;
  logo?: string;
  tags?: string[];
  status?: string;
  colorPalette?: { hexCode: string; _id: string }[];
  quickReply?: { text: string; _id: string }[];
  updatedAt?: any; // Can be string or Firestore Timestamp
  usersList?: { userId: string; [key: string]: any }[];
};
type UserProfile = { fullName: string; email?: string; [key: string]: any }; // This is from the 'users' collection
type Message = { 
    id: string; 
    text: string; 
    sender: string; 
    createdAt: any, // Can be string or Firestore Timestamp
    channel: string 
};
type Channel = { community: string; [key: string]: any; };


function MemberCard({ userId, channelIds }: { userId: string, channelIds: string[] }) {
  const firestore = useFirestore();

  // 1. Create a reference to the full user profile in the top-level 'users' collection
  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !userId) return null;
    return doc(firestore, 'users', userId);
  }, [firestore, userId]);

  // 2. Fetch the full user profile data
  const { data: userProfile, isLoading: userProfileLoading, error: userProfileError } = useDoc<UserProfile>(userDocRef);

  // 3. State for messages fetched via API
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!userId || !channelIds || channelIds.length === 0) {
        setMessages([]); // Clear messages if there's nothing to query
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
        // Check if the error message is because of invalid JSON
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
    return (
        <Card className="bg-muted/50">
            <CardContent className="p-4">
                <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin w-4 h-4"/>
                    <span className="text-sm text-muted-foreground">Loading member...</span>
                </div>
            </CardContent>
        </Card>
    );
  }

  if (userProfileError && !userProfile) { // Only show full-card error if the profile fails
    return (
       <Card className="bg-destructive/10 border-destructive/50">
            <CardContent className="p-4">
               <p className="text-xs text-destructive-foreground">Error loading profile for ID: {userId}</p>
                <p className="text-xs font-mono text-destructive-foreground mt-2">{userProfileError.message}</p>
            </CardContent>
        </Card>
    )
  }

  if (!userProfile) {
     return (
       <Card className="bg-muted/50">
            <CardContent className="p-4">
               <p className="text-xs text-muted-foreground">User profile not found for ID: {userId}</p>
            </CardContent>
        </Card>
    )
  }
  
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'No date';
    // Handle Firestore Timestamp object
    if (timestamp._seconds) {
      return format(new Date(timestamp._seconds * 1000), "Pp");
    }
    // Handle ISO string
    return format(new Date(timestamp), "Pp");
  };


  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="w-5 h-5 text-primary" />
          {userProfile?.fullName || 'Unnamed Member'}
        </CardTitle>
        <CardDescription>User ID: {userId}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm space-y-2 mb-4">
            <p><strong>Full Name:</strong> {userProfile.fullName}</p>
            {userProfile.email && <p><strong>Email:</strong> {userProfile.email}</p>}
        </div>
        <div>
            <h4 className="font-semibold flex items-center gap-2 text-md mb-2"><MessageSquare className="w-4 h-4"/> Messages ({messages?.length ?? 0})</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto p-2 bg-muted/50 rounded-md">
              {messagesError && <p className="text-destructive text-xs">Error loading messages: {messagesError}</p>}
              {messagesLoading && <p className="text-xs text-muted-foreground">Loading messages...</p>}
              {!messagesLoading && (!channelIds || channelIds.length === 0) && <p className="text-xs text-muted-foreground">No channels in this community to search for messages.</p>}
              {!messagesLoading && messages && messages.length > 0 ? (
                messages.map(msg => (
                  <div key={msg.id} className="p-2 bg-background rounded-md text-sm border">
                    <p>{msg.text}</p>
                    {msg.createdAt && <p className="text-xs text-muted-foreground mt-1">{formatDate(msg.createdAt)}</p>}
                  </div>
                ))
              ) : (
                !messagesLoading && channelIds && channelIds.length > 0 && <p className="text-xs text-muted-foreground">No messages found for this user in this community's channels.</p>
              )}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}


function ImageAsset({ communityId, imageUrl, fieldName, title }: { communityId: string, imageUrl: string, fieldName: string, title: string }) {
    const { toast } = useToast();
    const [isMigrating, setIsMigrating] = useState(false);
    const firestore = useFirestore();
    
    const isMigrated = imageUrl.includes('firebasestorage.googleapis.com');

    const handleMigrate = async () => {
        setIsMigrating(true);
        try {
            const res = await fetch('/api/migrate-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    communityId: communityId,
                    imageUrl: imageUrl,
                    fieldToUpdate: fieldName,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Failed to migrate image.');
            }
            
            // Manually update the local state to reflect the change
            if (firestore) {
                const docRef = doc(firestore, 'communities', communityId);
                await updateDoc(docRef, { [fieldName]: data.newUrl });
            }

            toast({
                title: 'Migration Successful',
                description: `${title} has been moved to the new storage bucket.`,
            });
        } catch (e: any) {
            toast({
                variant: 'destructive',
                title: 'Migration Failed',
                description: e.message,
            });
        } finally {
            setIsMigrating(false);
        }
    };

    return (
        <div className="space-y-2">
            <h3 className="font-semibold text-lg">{title}</h3>
            <div className="flex items-center gap-2">
                <Badge variant={isMigrated ? 'default' : 'secondary'}>
                    {isMigrated ? 'New Bucket' : 'Old Bucket'}
                </Badge>
                {!isMigrated && (
                    <Button size="sm" variant="outline" onClick={handleMigrate} disabled={isMigrating}>
                        {isMigrating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ExternalLink className="mr-2 h-4 w-4" />}
                        {isMigrating ? 'Migrating...' : 'Migrate Image'}
                    </Button>
                )}
            </div>
             <Image
                src={imageUrl}
                alt={title}
                width={400}
                height={400}
                className="rounded-lg object-cover aspect-square border"
             />
        </div>
    );
}

export default function FirestoreCommunityPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const communityId = params.id as string;
  
  const firestore = useFirestore();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const communityDocRef = useMemoFirebase(() => {
    if (!firestore || !communityId) return null;
    return doc(firestore, 'communities', communityId);
  }, [firestore, communityId]);

  const { data: community, isLoading: communityLoading, error: communityError } = useDoc<Community>(communityDocRef);

  // Query for channels belonging to this community
  const channelsQuery = useMemoFirebase(() => {
    if (!firestore || !communityId) return null;
    return query(collection(firestore, 'channels'), where('community', '==', communityId));
  }, [firestore, communityId]);

  const { data: channels, isLoading: channelsLoading, error: channelsError } = useCollection<Channel>(channelsQuery);

  const channelIds = useMemoFirebase(() => channels?.map(c => c.id) || [], [channels]);

  const error = communityError || channelsError;

  const handleDelete = async () => {
      if (!communityId) {
          toast({ variant: "destructive", title: "Error", description: "Missing community ID." });
          return;
      }
      setIsDeleting(true);
      try {
          // This uses a hardcoded User ID. In a real app this would be the logged-in user.
          const res = await fetch('/api/delete-community', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: 'DmiIAxs6nGebrhjphrMJCGOvOl83', communityId }),
          });

          if (!res.ok) {
              const errorData = await res.json();
              throw new Error(errorData.error || "Failed to delete community.");
          }
          
          toast({ title: "Success", description: "Community deleted from Firestore." });
          router.push('/fire');

      } catch (e: any) {
          console.error("Deletion failed:", e);
          toast({ variant: "destructive", title: "Deletion Failed", description: e.message });
      } finally {
        setIsDeleting(false);
      }
  };
  
  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    // Handle Firestore Timestamp object
    if (timestamp._seconds) {
      return format(new Date(timestamp._seconds * 1000), "PPP");
    }
    // Handle ISO string
    return format(new Date(timestamp), "PPP");
  };

  const isLoading = communityLoading || channelsLoading;

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <header className="p-4 border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <FileJson className="text-primary h-8 w-8" />
          <h1 className="text-3xl font-headline font-bold">Firestore Community</h1>
        </div>
        <Link href="/fire" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Firestore Communities
        </Link>
      </header>
      <main className="p-4 md:p-8">
        {isLoading && (
             <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
             </div>
        )}
        {error && (
            <div className="max-w-4xl mx-auto my-16">
              <div role="alert" className="p-4 rounded-lg bg-destructive/10 text-destructive-foreground border border-destructive/20">
                <div className="flex items-start gap-4">
                  <ServerCrash className="h-6 w-6 flex-shrink-0 text-destructive" />
                  <div className="flex-grow">
                    <h3 className="font-semibold text-destructive">Error Loading Data</h3>
                    <p className="text-sm font-code mt-1">{error.message}</p>
                  </div>
                </div>
              </div>
            </div>
        )}
        {!isLoading && !error && community && (
            <div className="max-w-5xl mx-auto space-y-8">
                <Card>
                    <CardHeader className="flex flex-row items-start justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-3 text-4xl break-all">
                                {community.name}
                            </CardTitle>
                            <CardDescription>Firestore ID: {communityId}</CardDescription>
                        </div>
                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                            {isDeleting ? 'Deleting...' : 'Delete from Firestore'}
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-1 space-y-4">
                                {community.lore && (
                                    <div>
                                        <h3 className="font-semibold text-lg mb-2">Description</h3>
                                        <p className="text-muted-foreground">{community.lore}</p>
                                    </div>
                                )}
                                <div className="space-y-2">
                                    {community.status && (
                                        <div>
                                            <h3 className="font-semibold text-lg mb-2">Status</h3>
                                            <Badge variant={community.status === 'publish' ? 'default' : 'secondary'}>{community.status}</Badge>
                                        </div>
                                    )}
                                     {community.updatedAt && (
                                        <div>
                                            <h3 className="font-semibold text-lg mb-2">Last Updated</h3>
                                            <p className="text-sm text-muted-foreground">{formatDate(community.updatedAt)}</p>
                                        </div>
                                    )}
                                </div>

                                {community.tags && community.tags.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><Tag className="w-5 h-5"/> Tags</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {community.tags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {community.communityProfileImage ? (
                                    <ImageAsset communityId={communityId} imageUrl={community.communityProfileImage} fieldName="communityProfileImage" title="Profile Image" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center bg-muted rounded-lg aspect-square p-4">
                                        <ImageIcon className="w-16 h-16 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground mt-2">No Profile Image</p>
                                    </div>
                                )}
                                {community.logo ? (
                                     <ImageAsset communityId={communityId} imageUrl={community.logo} fieldName="logo" title="Logo" />
                                ) : (
                                     <div className="flex flex-col items-center justify-center bg-muted rounded-lg aspect-square p-4">
                                        <ImageIcon className="w-16 h-16 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground mt-2">No Logo</p>
                                    </div>
                                )}
                            </div>
                        </div>

                         {community.colorPalette && community.colorPalette.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><Palette className="w-5 h-5"/> Color Palette</h3>
                                <div className="flex flex-wrap gap-2">
                                    {community.colorPalette.map(color => (
                                        <div key={color._id} className="flex items-center gap-2 p-2 border rounded-md">
                                            <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: color.hexCode }}></div>
                                            <span className="font-mono text-xs">{color.hexCode}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {community.quickReply && community.quickReply.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><MessageCircle className="w-5 h-5"/> Quick Replies</h3>
                                <div className="space-y-2">
                                    {community.quickReply.map(reply => (
                                       <div key={reply._id} className="p-3 bg-muted rounded-md text-sm">
                                            <p>{reply.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            <Users className="text-primary" />
                            Members ({community.usersList?.length || 0})
                        </CardTitle>
                        <CardDescription>Full user profiles and their messages within this community's channels are fetched and displayed below.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {community.usersList && community.usersList.length > 0 ? (
                           community.usersList.map(member => (
                             <MemberCard key={member.userId} userId={member.userId} channelIds={channelIds}/>
                           ))
                        ) : (
                          <p className="text-muted-foreground text-sm col-span-full">No members found in this community.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        )}
        {!isLoading && !community && !error && (
            <div className="text-center text-muted-foreground mt-16">
                <p>Community not found in Firestore.</p>
                <p className="text-sm">It might have been deleted or the export failed.</p>
            </div>
        )}
      </main>
    </div>
  );
}
