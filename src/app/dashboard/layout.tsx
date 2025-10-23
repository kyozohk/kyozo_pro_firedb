'use client';

import React, { useState } from 'react';
import { useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { Sidebar } from './sidebar';

type Community = {
  id: string;
  name: string;
  logo?: string;
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);
  const firestore = useFirestore();
  
  // Query for communities
  const communitiesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'communities');
  }, [firestore]);

  const { data: communities, isLoading: communitiesLoading, error: communitiesError } = 
    useCollection<Community>(communitiesQuery);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-muted/30 flex flex-col">
        {communitiesLoading ? (
          <div className="flex justify-center items-center h-16">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : communitiesError ? (
          <div className="p-4 text-sm text-destructive">
            Error loading communities
          </div>
        ) : (
          <Sidebar 
            communities={communities || []} 
            selectedCommunity={selectedCommunity}
            onSelectCommunity={setSelectedCommunity}
          />
        )}
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
