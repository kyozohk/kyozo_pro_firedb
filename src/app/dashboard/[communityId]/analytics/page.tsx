'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, MessageSquare, Activity } from 'lucide-react';

export default function AnalyticsPage() {
  const params = useParams();
  const communityId = params.communityId as string;

  // Mock analytics data
  const memberStats = {
    total: 120,
    active: 87,
    new: 14,
    growth: '+12%',
  };

  const messageStats = {
    total: 1450,
    thisWeek: 124,
    avgPerDay: 18,
    trend: '+8%',
  };

  const engagementStats = {
    avgResponseTime: '3.2 hours',
    responseRate: '76%',
    mostActiveTime: '2-4 PM',
    mostActiveDay: 'Wednesday',
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Analytics</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-primary" />
              Member Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Total Members</dt>
                <dd className="font-medium">{memberStats.total}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Active Members</dt>
                <dd className="font-medium">{memberStats.active}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">New This Month</dt>
                <dd className="font-medium">{memberStats.new}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Monthly Growth</dt>
                <dd className="font-medium text-green-600">{memberStats.growth}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="h-5 w-5 text-primary" />
              Message Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Total Messages</dt>
                <dd className="font-medium">{messageStats.total}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">This Week</dt>
                <dd className="font-medium">{messageStats.thisWeek}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Avg. Per Day</dt>
                <dd className="font-medium">{messageStats.avgPerDay}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Weekly Trend</dt>
                <dd className="font-medium text-green-600">{messageStats.trend}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5 text-primary" />
              Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Avg. Response Time</dt>
                <dd className="font-medium">{engagementStats.avgResponseTime}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Response Rate</dt>
                <dd className="font-medium">{engagementStats.responseRate}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Most Active Time</dt>
                <dd className="font-medium">{engagementStats.mostActiveTime}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Most Active Day</dt>
                <dd className="font-medium">{engagementStats.mostActiveDay}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Member Activity</CardTitle>
            <CardDescription>
              Activity trends over the past 30 days
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Chart visualization would appear here</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Message Volume</CardTitle>
            <CardDescription>
              Message count by day of week
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Chart visualization would appear here</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
