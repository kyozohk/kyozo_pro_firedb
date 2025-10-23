'use client';

import React, { useState, Suspense, useEffect } from 'react';
import { useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/app/dashboard/sidebar';

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
  const router = useRouter();
  const firestore = useFirestore();
  
  // Navigate to overview page when a community is selected
  const handleCommunitySelect = (communityId: string) => {
    setSelectedCommunity(communityId);
    router.push(`/dashboard/${communityId}`);
  };
  
  // Query for communities
  const communitiesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'communities');
  }, [firestore]);

  const { data: communities, isLoading: communitiesLoading, error: communitiesError } = 
    useCollection<Community>(communitiesQuery);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar with updated styles */}
      <div className="w-72 border-r border-accent/20 bg-card/30 flex flex-col">
        <Suspense fallback={<Sidebar communities={[]} selectedCommunity={null} onSelectCommunity={() => {}} isLoading={true} />}>
          {communitiesError ? (
            <div className="p-4 text-sm text-destructive">
              Error loading communities
            </div>
          ) : (
            <Sidebar 
              communities={communities || []} 
              selectedCommunity={selectedCommunity}
              onSelectCommunity={handleCommunitySelect}
              isLoading={communitiesLoading}
            />
          )}
        </Suspense>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <Suspense fallback={<div className="p-6"><div className="h-8 w-48 bg-muted animate-pulse rounded-md mb-4"></div><div className="h-64 bg-muted/50 animate-pulse rounded-lg"></div></div>}>
          {children}
        </Suspense>
      </div>
    </div>
  );
}
