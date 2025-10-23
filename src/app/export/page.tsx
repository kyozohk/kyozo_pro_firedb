'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Database, Terminal, Loader2, Table, UploadCloud, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { writeBatch, doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const COLLECTIONS_TO_CHECK = [
    "broadcasts", "categories", "channels", "communities", "importhistories",
    "linktrackers", "messages", "otphistories", "participations", "paymenthistories",
    "payments", "paymenttransactions", "phonecodes", "registertrackers",
    "sendwamessagehistories", "stripewebhooks", "thirdpartyproviders",
    "threesixtywebhookhistories", "tokens", "users", "webhookevents", "webhooks"
];

export default function ExportPage() {
  const [loadingTable, setLoadingTable] = useState<string | null>(null);
  const [exportingTable, setExportingTable] = useState<string | null>(null);
  const [verifyingTable, setVerifyingTable] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [currentTask, setCurrentTask] = useState<string | null>(null);
  const { toast } = useToast();
  const firestore = useFirestore();
  const router = useRouter();


  const handleInspect = async (tableName: string) => {
    setLoadingTable(tableName);
    console.log(`Fetching data for "${tableName}"...`);
    try {
      const res = await fetch(`/api/export/get-collection?tableName=${tableName}`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to fetch collection data.');
      }
      const data = await res.json();
      console.log(`Data for "${tableName}":`, data);
      toast({
        title: `Data for "${tableName}" logged`,
        description: `Opened browser console to view ${data.length} documents.`,
      });
    } catch (e: any) {
      console.error(`Failed to inspect ${tableName}:`, e.message);
      toast({
        variant: 'destructive',
        title: `Error inspecting ${tableName}`,
        description: e.message,
      });
    } finally {
      setLoadingTable(null);
    }
  };

  const addLog = (message: string) => {
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const handleExport = async (tableName:string) => {
    if (!firestore) {
        toast({ variant: 'destructive', title: 'Firestore not available' });
        return;
    }
    setExportingTable(tableName);
    setCurrentTask(`Exporting: ${tableName}`);
    setLogs([]);

    try {
        addLog(`Starting export for "${tableName}"...`);

        addLog('Fetching document count from MongoDB...');
        const countRes = await fetch(`/api/export-helpers/mongo-count?tableName=${tableName}`);
        if (!countRes.ok) throw new Error(JSON.stringify(await countRes.json()));
        const { count } = await countRes.json();
        addLog(`Found ${count} documents in MongoDB.`);

        if (count === 0) {
            addLog('No documents to export. Finished.');
            toast({ title: 'Export Complete', description: `No documents found in "${tableName}" to export.` });
            setExportingTable(null);
            setCurrentTask(null);
            return;
        }

        const BATCH_SIZE = 400;
        const totalBatches = Math.ceil(count / BATCH_SIZE);

        for (let i = 0; i < totalBatches; i++) {
            addLog(`Processing batch ${i + 1} of ${totalBatches}...`);

            addLog(` -> Fetching documents from MongoDB...`);
            const fetchRes = await fetch(`/api/export-helpers/mongo-fetch?tableName=${tableName}&page=${i}&pageSize=${BATCH_SIZE}`);
            if (!fetchRes.ok) throw new Error(`Failed to fetch batch ${i + 1}: ${JSON.stringify(await fetchRes.json())}`);
            const documents = await fetchRes.json();
            addLog(` -> Fetched ${documents.length} documents.`);

            addLog(` -> Writing ${documents.length} documents to Firestore...`);
            
            const batch = writeBatch(firestore);
            documents.forEach((document: any) => {
                if (!document._id) {
                    addLog(` -> WARNING: Document missing _id, skipping: ${JSON.stringify(document)}`);
                    return;
                }
                const docRef = doc(firestore, tableName, document._id.toString());
                batch.set(docRef, document);
            });
            await batch.commit();

            addLog(` -> Successfully wrote batch to Firestore.`);
        }
        
        addLog('Export complete!');
        toast({
            title: 'Export Successful',
            description: `${count} documents from "${tableName}" have been exported to Firestore.`,
        });

    } catch (e: any) {
      const errorMessage = e.message || 'An unknown error occurred.';
      addLog(`ERROR: ${errorMessage}`);
      toast({
        variant: 'destructive',
        title: `Export Failed for ${tableName}`,
        description: errorMessage,
      });
    } finally {
      setExportingTable(null);
      setCurrentTask(null);
    }
  };

  const handleVerify = async (tableName: string) => {
    setVerifyingTable(tableName);
    setCurrentTask(`Verifying: ${tableName}`);
    setLogs([]);
    addLog(`Starting verification for "${tableName}"...`);
    try {
        const res = await fetch(`/api/verify-collection?tableName=${tableName}`);
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || 'Verification request failed');
        }

        addLog(`MongoDB Count: ${data.mongoCount}`);
        addLog(`Firestore Count: ${data.firestoreCount}`);

        if(data.countsMatch) {
            addLog("✅ Document counts match.");
        } else {
            addLog("❌ Document counts DO NOT match.");
        }

        if(data.allRecordsMatch) {
            addLog("✅ All records match.");
        } else {
            addLog("❌ Record data does not match.");
            if (data.mismatchedIds && data.mismatchedIds.length > 0) {
                 addLog(`Mismatched IDs: ${data.mismatchedIds.join(', ')}`);
            }
        }
        
        if (data.countsMatch && data.allRecordsMatch) {
            toast({
                title: 'Verification Successful',
                description: `All ${data.mongoCount} records in "${tableName}" match between MongoDB and Firestore.`,
            });
        } else {
             toast({
                variant: 'destructive',
                title: 'Verification Failed',
                description: `Discrepancies found for "${tableName}". Check logs for details.`,
            });
        }


    } catch (e: any) {
        addLog(`ERROR: ${e.message}`);
        toast({
            variant: 'destructive',
            title: `Verification Error for ${tableName}`,
            description: e.message,
        });
    } finally {
        setVerifyingTable(null);
        setCurrentTask(null);
    }
  };


  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <header className="p-4 border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Database className="text-primary h-8 w-8" />
          <h1 className="text-3xl font-headline font-bold">MongoDB Exporter</h1>
        </div>
        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Main View
        </Link>
      </header>
      <main className="p-4 md:p-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Table className="w-5 h-5" /> MongoDB Collections</CardTitle>
            <CardDescription>
              Inspect, Export, or Verify collections. Export migrates the data to a top-level Firestore collection.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {COLLECTIONS_TO_CHECK.map((tableName) => (
                <div key={tableName} className="flex items-center justify-between gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <Button
                    variant="link"
                    className="w-full justify-start p-0 h-auto font-mono text-base"
                    onClick={() => handleInspect(tableName)}
                    disabled={!!currentTask}
                  >
                    {loadingTable === tableName ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Terminal className="mr-2 h-4 w-4" />
                    )}
                    {tableName}
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExport(tableName)}
                      disabled={!!currentTask}
                    >
                      {exportingTable === tableName ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <UploadCloud className="mr-2 h-4 w-4" />
                      )}
                      {exportingTable === tableName ? 'Exporting...' : 'Export'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVerify(tableName)}
                      disabled={!!currentTask}
                    >
                      {verifyingTable === tableName ? (
                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <ShieldCheck className="mr-2 h-4 w-4" />
                      )}
                       {verifyingTable === tableName ? 'Verifying...' : 'Verify'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

         {logs.length > 0 && (
            <Card className="max-w-4xl mx-auto mt-4">
                <CardHeader>
                    <CardTitle>Logs: {currentTask || 'Completed'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <pre className="p-4 bg-muted rounded-md text-card-foreground overflow-auto text-sm font-code h-64">
                        {logs.join('\n')}
                    </pre>
                </CardContent>
            </Card>
        )}
      </main>
    </div>
  );
}
