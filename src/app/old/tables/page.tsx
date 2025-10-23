'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Database, UploadCloud, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface TableStatus {
  name: string;
  documentCount: number;
  isExported: boolean;
}

export default function TablesPage() {
  const [tables, setTables] = useState<TableStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exportingTable, setExportingTable] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const { toast } = useToast();

  const fetchTableStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/table-status');
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to fetch table status.');
      }
      const data: TableStatus[] = await res.json();
      setTables(data);
    } catch (e: any) {
      setError(e.message);
      toast({
        variant: 'destructive',
        title: 'Error fetching status',
        description: e.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTableStatus();
  }, []);

  const handleExport = async (tableName: string) => {
    setExportingTable(tableName);
    setLogs([]);

    const addLog = (message: string) => {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
    };

    try {
        addLog(`Starting export for "${tableName}"...`);

        // Step 1: Get document count from MongoDB
        addLog('Fetching document count from MongoDB...');
        const countRes = await fetch(`/api/export-helpers/mongo-count?tableName=${tableName}`);
        if (!countRes.ok) throw new Error(await countRes.text());
        const { count } = await countRes.json();
        addLog(`Found ${count} documents in MongoDB.`);

        if (count === 0) {
            addLog('No documents to export. Finished.');
            toast({ title: 'Export Complete', description: `No documents found in "${tableName}" to export.` });
            setExportingTable(null);
            fetchTableStatus();
            return;
        }

        // Step 2: Fetch and write documents in batches
        const BATCH_SIZE = 400; // Firestore batch write limit is 500
        const totalBatches = Math.ceil(count / BATCH_SIZE);

        for (let i = 0; i < totalBatches; i++) {
            addLog(`Processing batch ${i + 1} of ${totalBatches}...`);

            // Fetch a batch from MongoDB
            addLog(` -> Fetching documents from MongoDB...`);
            const fetchRes = await fetch(`/api/export-helpers/mongo-fetch?tableName=${tableName}&page=${i}&pageSize=${BATCH_SIZE}`);
            if (!fetchRes.ok) throw new Error(`Failed to fetch batch ${i + 1}: ${await fetchRes.text()}`);
            const documents = await fetchRes.json();
            addLog(` -> Fetched ${documents.length} documents.`);

            // Write the batch to Firestore
            addLog(` -> Writing ${documents.length} documents to Firestore...`);
            const writeRes = await fetch(`/api/export-helpers/firestore-write`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tableName, documents }),
            });
            if (!writeRes.ok) throw new Error(`Failed to write batch ${i + 1}: ${await writeRes.text()}`);
            addLog(` -> Successfully wrote batch to Firestore.`);
        }
        
        addLog('Export complete!');
        toast({
            title: 'Export Successful',
            description: `${count} documents from "${tableName}" have been exported to Firestore.`,
        });
        fetchTableStatus();

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
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <header className="p-4 border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Database className="text-primary h-8 w-8" />
          <h1 className="text-3xl font-headline font-bold">Table Exporter</h1>
        </div>
        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Main View
        </Link>
      </header>
      <main className="p-4 md:p-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>MongoDB Collections</CardTitle>
            <CardDescription>
              View your MongoDB collections and export them to Firestore. The status checks if the corresponding collection exists in Firestore.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4">Loading table statuses...</p>
              </div>
            )}
            {error && (
              <div className="text-destructive flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
              </div>
            )}
            {!loading && !error && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Collection Name</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead>Firestore Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tables.map((table) => (
                    <TableRow key={table.name}>
                      <TableCell className="font-medium">{table.name}</TableCell>
                      <TableCell>{table.documentCount}</TableCell>
                      <TableCell>
                        {table.isExported ? (
                          <Badge variant="secondary" className="flex items-center w-fit">
                            <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                            Exported
                          </Badge>
                        ) : (
                          <Badge variant="outline">Not Exported</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExport(table.name)}
                          disabled={exportingTable === table.name}
                        >
                          {exportingTable === table.name ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <UploadCloud className="mr-2 h-4 w-4" />
                          )}
                          {exportingTable === table.name ? 'Exporting...' : table.isExported ? 'Re-Export' : 'Export'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        {logs.length > 0 && (
            <Card className="max-w-4xl mx-auto mt-4">
                <CardHeader>
                    <CardTitle>Export Logs</CardTitle>
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
