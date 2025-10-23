'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, MessageSquare, BarChart3, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Stats */}
        <Card gradient className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold">Quick Stats</CardTitle>
            <Select>
              <SelectTrigger className="w-[180px]" gradient>
                <SelectValue placeholder="Last 7 days" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card/50 p-4 rounded-lg border border-accent/20">
                <div className="text-muted-foreground text-sm">Total Members</div>
                <div className="text-3xl font-bold mt-2">1,245</div>
                <div className="text-xs text-primary mt-1">+12% from last week</div>
              </div>
              <div className="bg-card/50 p-4 rounded-lg border border-accent/20">
                <div className="text-muted-foreground text-sm">Messages Sent</div>
                <div className="text-3xl font-bold mt-2">3,872</div>
                <div className="text-xs text-primary mt-1">+8% from last week</div>
              </div>
              <div className="bg-card/50 p-4 rounded-lg border border-accent/20">
                <div className="text-muted-foreground text-sm">Engagement Rate</div>
                <div className="text-3xl font-bold mt-2">64%</div>
                <div className="text-xs text-primary mt-1">+5% from last week</div>
              </div>
              <div className="bg-card/50 p-4 rounded-lg border border-accent/20">
                <div className="text-muted-foreground text-sm">New Members</div>
                <div className="text-3xl font-bold mt-2">128</div>
                <div className="text-xs text-primary mt-1">+15% from last week</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Messages */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
            <CardDescription>Latest messages from your community</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 rounded-lg bg-card/50 border border-accent/10">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Weekly Update #{i}</p>
                    <p className="text-sm text-muted-foreground mt-1">Sent to 1,245 members</p>
                  </div>
                  <Badge gradient>{80 + i}% open rate</Badge>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              View All Messages <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you can perform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/dashboard/broadcast" className="block">
              <Button gradient className="w-full justify-start" size="lg">
                <MessageSquare className="mr-2 h-5 w-5" /> Create New Broadcast
              </Button>
            </Link>
            
            <Link href="/dashboard/members" className="block">
              <Button variant="outline" className="w-full justify-start" size="lg">
                <Users className="mr-2 h-5 w-5" /> Manage Members
              </Button>
            </Link>
            
            <Link href="/dashboard/analytics" className="block">
              <Button variant="outline" className="w-full justify-start" size="lg">
                <BarChart3 className="mr-2 h-5 w-5" /> View Analytics
              </Button>
            </Link>
            
            <Link href="/dashboard/settings" className="block">
              <Button variant="outline" className="w-full justify-start" size="lg">
                <Settings className="mr-2 h-5 w-5" /> Settings
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
