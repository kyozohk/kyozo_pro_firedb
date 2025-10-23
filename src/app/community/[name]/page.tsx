import { getClient } from '@/lib/mongodb';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Database, ServerCrash, FileJson } from 'lucide-react';
import Link from 'next/link';
import { ObjectId } from 'mongodb';

const MONGO_URI = "mongodb+srv://1234dev28:4testconnect@prod-kyozo-db.8rs1g.mongodb.net/?retryWrites=true&w=majority&appName=prod-kyozo-db";
const DB_NAME = "Prod-Kyozo";
const COMMUNITY_COLLECTION_NAME = "communities";
const MESSAGES_COLLECTION_NAME = "messages";
const USERS_COLLECTION_NAME = "users";

// --- DATA FETCHING ---

async function getCommunityWithNestedData(name: string) {
  try {
    const client = await getClient(MONGO_URI);
    const db = client.db(DB_NAME);
    const decodedName = decodeURIComponent(name);

    // 1. Fetch community
    const communityCollection = db.collection(COMMUNITY_COLLECTION_NAME);
    const community = await communityCollection.findOne({ name: decodedName });

    if (!community) {
      return { community: null, error: `Community "${decodedName}" not found.` };
    }

    // 2. Fetch all messages for the community
    const messagesCollection = db.collection(MESSAGES_COLLECTION_NAME);
    const messages = await messagesCollection.find({ communityName: decodedName }).toArray();

    // 3. Get all unique user IDs from the community's usersList
    const userIdsFromCommunity = (community.usersList || [])
      .map((u: { userId: string }) => u.userId)
      .filter((id: string) => id && ObjectId.isValid(id))
      .map((id: string) => new ObjectId(id));
      
    let members: Record<string, any> = {};
    if (userIdsFromCommunity.length > 0) {
      // 4. Fetch full user details for these members
      const usersCollection = db.collection(USERS_COLLECTION_NAME);
      const memberDocs = await usersCollection.find({ _id: { $in: userIdsFromCommunity } }).toArray();
      
      // 5. Nest messages within each member's details
      memberDocs.forEach(doc => {
        const memberId = doc._id.toString();
        members[memberId] = doc;
        members[memberId].messages = messages.filter(msg => msg.sender === memberId);
      });
    }

    // 6. Replace user stubs in community.usersList with full member details
    if (community.usersList) {
        community.usersList = community.usersList.map((userStub: { userId: string }) => {
            const fullMemberDetails = members[userStub.userId];
            if (fullMemberDetails) {
                // Return the full details, which now includes messages
                return { ...userStub, userDetails: fullMemberDetails };
            }
            return userStub;
        }).filter(Boolean); // Filter out any potential null/undefined entries
    }

    // 7. Serialize the final deeply nested object
    const serializableCommunity = JSON.parse(JSON.stringify(community, (key, value) => {
      if (value instanceof ObjectId) {
        return value.toString();
      }
      return value;
    }));
    
    return { community: serializableCommunity, error: null };

  } catch (e: any) {
    console.error(e);
    return { community: null, error: `Failed to fetch community data: ${e.message}` };
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

export default async function CommunityPage({ params }: { params: { name: string } }) {
  const { community, error } = await getCommunityWithNestedData(params.name);

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <header className="p-4 border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Database className="text-primary h-8 w-8" />
          <h1 className="text-3xl font-headline font-bold">Mongo Navigator</h1>
        </div>
        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Communities
        </Link>
      </header>
      <main className="p-4 md:p-8">
        {error && <ErrorMessage message={error} />}
        {community && (
          <div className="max-w-4xl mx-auto space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 break-all">
                  <FileJson className="text-primary" />
                  Community: {community.name}
                </CardTitle>
                 <CardDescription>
                   Displaying the full community object with nested member details and their messages.
                 </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="p-4 bg-muted rounded-md text-card-foreground overflow-auto text-sm font-code">
                  {JSON.stringify(community, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
