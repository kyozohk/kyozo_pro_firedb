'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/app/dashboard/sidebar';
import { mockCommunities } from './mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardDemoPage() {
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Function to toggle loading state for demonstration
  const toggleLoading = () => {
    setIsLoading(prev => !prev);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar with updated styles */}
      <div className="w-72 border-r border-accent/20 bg-card/30 flex flex-col">
        <Sidebar 
          communities={mockCommunities} 
          selectedCommunity={selectedCommunity}
          onSelectCommunity={setSelectedCommunity}
          isLoading={isLoading}
        />
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard Demo</h1>
        
        <div className="mb-8">
          <Button 
            onClick={toggleLoading} 
            variant="outline"
            className="flex items-center gap-2"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading ? 'Stop Loading Simulation' : 'Simulate Loading State'}
          </Button>
        </div>
        
        <div className="p-4 bg-card rounded-lg border border-accent/20">
          <h2 className="text-xl font-bold mb-2">Selected Community</h2>
          {selectedCommunity ? (
            <div>
              <p>ID: {selectedCommunity}</p>
              <p>Name: {mockCommunities.find(c => c.id === selectedCommunity)?.name}</p>
            </div>
          ) : (
            <p className="text-muted-foreground">No community selected</p>
          )}
        </div>
      </div>
    </div>
  );
}
