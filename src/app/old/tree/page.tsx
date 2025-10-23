import { getClient } from '@/lib/mongodb';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GitBranch, ArrowLeft, ServerCrash } from 'lucide-react';
import Link from 'next/link';
import { TreeView } from './tree-view';

const MONGO_URI = "mongodb+srv://1234dev28:4testconnect@prod-kyozo-db.8rs1g.mongodb.net/?retryWrites=true&w=majority&appName=prod-kyozo-db";
const DB_NAME = "Prod-Kyozo";
const COLLECTION_NAME = "communities";

// --- DATA FETCHING ---

async function getInitialCommunities() {
  try {
    const client = await getClient(MONGO_URI);
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    const communities = await collection.find({}, { projection: { name: 1, _id: 1 } }).sort({ name: 1 }).toArray();
    
    // Ensure we have unique, valid community names and string IDs
    const uniqueCommunities = Array.from(new Map(communities.map(c => [c.name, c])).values())
                                 .filter(c => c.name) 
                                 .map(c => ({ name: c.name, id: c._id.toString() }));

    return { communities: uniqueCommunities, error: null };
  } catch (e: any) {
    console.error("Failed to fetch initial communities:", e);
    return { communities: [], error: `Failed to fetch communities: ${e.message}` };
  }
}

// --- UI COMPONENTS ---

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="max-w-4xl mx-auto my-16">
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

// --- MAIN PAGE ---

export default async function TreePage() {
  const { communities, error } = await getInitialCommunities();

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <header className="p-4 border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <GitBranch className="text-primary h-8 w-8" />
          <h1 className="text-3xl font-headline font-bold">MongoDB Tree Navigator</h1>
        </div>
        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Main View
        </Link>
      </header>
      <main className="p-4 md:p-8">
        {error && <ErrorMessage message={error} />}
        {!error && (
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle>Communities ({communities.length})</CardTitle>
                <CardDescription>Click the `+` to expand a community and view its members. Expand a member to see their messages.</CardDescription>
              </CardHeader>
              <CardContent>
                {communities.length > 0 ? (
                    <TreeView communities={communities} />
                ) : (
                    <p className="text-muted-foreground">No communities found in the database.</p>
                )}
              </CardContent>
            </Card>
        )}
      </main>
    </div>
  );
}
