'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Database, ServerCrash, Users, UploadCloud, ArrowRight, GitBranch, Binary, Table, CheckCircle, ListTree, Shield, Inbox } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import React, { useEffect, useState } from 'react';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { doc, writeBatch, collection, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

// --- DATA FETCHING ---
async function getCommunities() {
  try {
    const res = await fetch('/api/communities');
    if(!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch communities');
    }
    const communities = await res.json();
    return { communities, error: null };
  } catch (e: any) {
    return { communities: [], error: `Failed to fetch communities: ${e.message}` };
  }
}


// --- UI COMPONENTS ---

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="max-w-2xl mx-auto my-16">
      <div role="alert" className="p-4 rounded-lg bg-destructive/10 text-destructive-foreground border border-destructive/20 animate-fade-in-up">
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

// --- MAIN PAGE ---

export default function Home() {
  const { toast } = useToast();
  const router = useRouter();
  const [communities, setCommunities] = useState<{name: string, _id: string}[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [exportingId, setExportingId] = useState<string | null>(null);

  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading && !user) {
      initiateAnonymousSignIn(auth);
    }
  }, [isUserLoading, user, auth]);

  useEffect(() => {
    async function fetchCommunities() {
      const { communities, error } = await getCommunities();
      setCommunities(communities);
      setError(error);
      setLoading(false);
    }
    fetchCommunities();
  }, []);

  const handleExport = async (communityName: string) => {
    if (!user || !firestore) {
      toast({
        variant: "destructive",
        title: "Authentication or Firestore Error",
        description: "You must be logged in and Firestore must be available to export.",
      });
      return;
    }
    setExportingId(communityName);
    let communityMongoId: string | null = null;
    try {
      // This is a hardcoded user ID for the purpose of this demo.
      // In a real application, this would be the currently logged-in user's ID.
      const userId = "DmiIAxs6nGebrhjphrMJCGOvOl83";

      // 1. Fetch detailed community data, members, and their messages from a single API endpoint
      const res = await fetch(`/api/export-community?communityName=${encodeURIComponent(communityName)}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch community data for export.');
      }
      const { communityData, members } = await res.json();
      communityMongoId = communityData.mongoId;
      
      // 2. Use a client-side batch write for atomicity
      const batch = writeBatch(firestore);

      // 2a. Create the main community document reference in a top-level collection
      const communityDocRef = doc(firestore, 'communities', communityData.mongoId);
      batch.set(communityDocRef, { ...communityData, exportedAt: serverTimestamp() });

      // 2b. Create member documents and their nested messages subcollections
      members.forEach((member: any) => {
          // Create a ref for the new member doc in the members subcollection
          const memberDocRef = doc(collection(communityDocRef, 'members'), member.mongoId);
          const { messages, ...memberData } = member; // Separate messages from member data
          batch.set(memberDocRef, { ...memberData, exportedAt: serverTimestamp() });

          // 2c. Create a 'messages' subcollection for each member
          if (messages && messages.length > 0) {
              messages.forEach((message: any) => {
                  // Create a ref for the new message doc in the messages subcollection
                  const messageDocRef = doc(collection(memberDocRef, 'messages'), message.mongoId);
                  batch.set(messageDocRef, { ...message, exportedAt: serverTimestamp() });
              });
          }
      });
      
      // 3. Commit the entire batch
      await batch.commit();

      toast({
        title: "Export Successful",
        description: `Community "${communityName}" has been exported.`,
        action: (
            <Button variant="outline" size="sm" onClick={() => router.push(`/firestore/community/${communityMongoId}`)}>
                View in Firestore <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        )
      });
      router.push(`/firestore/community/${communityMongoId}`);

    } catch (e: any) {
      console.error("Export Failed:", e);
      toast({
        variant: "destructive",
        title: `Export Failed for ${communityName}`,
        description: e.message || "An unknown error occurred during export.",
      });
    } finally {
      setExportingId(null);
    }
  };


  if (loading || isUserLoading) {
      return (
          <div className="flex justify-center items-center min-h-screen">
            <div className="flex items-center gap-2">
              <Database className="h-6 w-6 animate-pulse" />
              <span className="text-muted-foreground">Connecting to database...</span>
            </div>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <header className="p-4 border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Database className="text-primary h-8 w-8" />
          <h1 className="text-3xl font-headline font-bold">Mongo Navigator</h1>
        </div>
        <div className="flex items-center gap-4">
            <Link href="/inbox">
                <Button variant="outline">
                    <Inbox className="mr-2 h-4 w-4" />
                    Message Inbox
                </Button>
            </Link>
            <Link href="/fire">
                <Button variant="outline">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    View Firestore Data
                </Button>
            </Link>
            <Link href="/export">
                <Button variant="outline">
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Collection Exporter
                </Button>
            </Link>
            <Link href="/data-explorer">
              <Button variant="outline">
                <ListTree className="mr-2 h-4 w-4" />
                Data Explorer
              </Button>
            </Link>
             <Link href="/admin/migrate-images">
              <Button variant="ghost">
                <Shield className="mr-2 h-4 w-4" />
                Admin
              </Button>
            </Link>
        </div>
      </header>
      <main className="p-4 md:p-8">
        {error && <ErrorMessage message={error} />}
        {!error && (
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Users className="text-primary" />
                MongoDB Communities
              </CardTitle>
               <CardDescription>
                Select a community to view its raw data, or export it to Firestore. The export will migrate the community, its members, and all their messages.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {communities.length > 0 ? (
                <ul className="space-y-2">
                  {communities.map((community) => (
                    <li key={community._id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
                      <Link href={`/community/${encodeURIComponent(community.name)}`} className="flex-grow font-medium text-primary hover:underline">
                        {community.name}
                      </Link>
                       <Button
                        variant="ghost"
                        size="sm"
                        className="ml-4"
                        onClick={() => handleExport(community.name)}
                        disabled={!!exportingId}
                      >
                        {exportingId === community.name ? (
                           <><Database className="mr-2 h-4 w-4 animate-spin" /> Exporting...</>
                        ) : (
                           <><ArrowRight className="mr-2 h-4 w-4" /> Export to Firestore</>
                        )}
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-center py-4">No communities found in MongoDB.</p>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
