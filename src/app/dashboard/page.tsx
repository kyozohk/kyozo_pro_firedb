'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to your Dashboard</CardTitle>
            <CardDescription>
              Select a community from the sidebar to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              This dashboard allows you to manage your communities, view messages, and interact with members.
            </p>
            <Button variant="outline" className="gap-2">
              View Documentation <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Quick tips to help you navigate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                1
              </div>
              <div>
                <h3 className="font-medium">Select a Community</h3>
                <p className="text-sm text-muted-foreground">
                  Choose a community from the dropdown in the sidebar
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                2
              </div>
              <div>
                <h3 className="font-medium">Navigate Sections</h3>
                <p className="text-sm text-muted-foreground">
                  Use the sidebar navigation to access different sections
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                3
              </div>
              <div>
                <h3 className="font-medium">Manage Content</h3>
                <p className="text-sm text-muted-foreground">
                  View and manage messages, members, and analytics
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
