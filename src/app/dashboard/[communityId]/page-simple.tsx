'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  Users, 
  MessageSquare, 
  BarChart3,
  MapPin
} from 'lucide-react';

type Community = {
  id: string;
  name: string;
  logo?: string;
  communityProfileImage?: string;
  description?: string;
  usersList?: { userId: string }[];
  communityPrivacy?: 'private' | 'public';
  communityType?: string;
  tags?: string[];
  location?: string;
};

// Mock data for testing
const mockCommunity: Community = {
  id: 'kyozo-demo-community',
  name: 'Kyozo Demo Community',
  communityProfileImage: 'https://firebasestorage.googleapis.com/v0/b/kyozo-dev.appspot.com/o/communities%2Fkyozo-demo-community%2Fprofile.jpg?alt=media',
  communityPrivacy: 'private',
  communityType: 'community',
  description: 'Join the Kyozo Announcements Community for updates on new communities and features on Kyozo.',
  tags: ['Digital Heritage', 'Digital Collections', 'Museums', 'App Design', 'Fast Fashion'],
  location: 'Hong Kong',
  usersList: Array(1808).fill({ userId: 'user-id' })
};

export default function CommunityOverviewPage() {
  const params = useParams();
  const communityId = params.communityId as string;
  const firestore = useFirestore();
  
  // State for community data
  const [useMockData, setUseMockData] = useState(true);
  const [community, setCommunity] = useState<Community | null>(null);
  
  // Get community document
  const communityDocRef = useMemoFirebase(() => {
    if (!firestore || !communityId) return null;
    return doc(firestore, 'communities', communityId);
  }, [firestore, communityId]);

  const { data: fetchedCommunity, isLoading: isLoadingCommunity, error } = useDoc<Community>(communityDocRef);
  
  // Use mock data for testing or when there's an error/no data
  useEffect(() => {
    if (useMockData || (!isLoadingCommunity && (!fetchedCommunity || error))) {
      setCommunity(mockCommunity);
    } else if (fetchedCommunity) {
      setCommunity(fetchedCommunity);
    }
  }, [fetchedCommunity, isLoadingCommunity, error, useMockData, setCommunity]);

  const isLoading = isLoadingCommunity && !community;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error && !community) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-medium text-destructive mb-2">Error Loading Community</h2>
            <p className="text-sm text-destructive/80">{error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-medium mb-2">Community Not Found</h2>
            <p className="text-sm text-muted-foreground">
              The community you're looking for doesn't exist or you don't have access to it.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Function to render community image
  const renderCommunityImage = () => {
    const imageUrl = community.communityProfileImage || community.logo;
    
    if (imageUrl) {
      return (
        <div className="relative h-24 w-24 rounded-full overflow-hidden border border-accent/30 shadow-sm">
          <Image 
            src={imageUrl} 
            alt={community.name} 
            fill 
            className="object-cover"
          />
        </div>
      );
    }
    
    return (
      <div className="h-24 w-24 rounded-full bg-accent/20 flex items-center justify-center border border-accent/30 shadow-sm">
        <Users className="h-10 w-10 text-accent-foreground/70" />
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{community.name}</h1>
        <Button 
          onClick={() => setUseMockData(prev => !prev)} 
          variant="outline" 
          size="sm"
          className="text-xs"
        >
          {useMockData ? 'Use Real Data' : 'Use Mock Data'}
        </Button>
      </div>
      
      {/* Community Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            {renderCommunityImage()}
            
            <div className="space-y-4 text-center md:text-left">
              <div>
                <h2 className="text-2xl font-bold">{community.name}</h2>
                <p className="text-muted-foreground">{community.description}</p>
              </div>
              
              {community.communityPrivacy && (
                <Badge variant="outline" className="bg-accent/10">
                  {community.communityPrivacy === 'private' ? 'Private' : 'Public'}
                </Badge>
              )}
              
              {community.location && (
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <MapPin className="h-4 w-4 text-accent-foreground/70" />
                  <span className="text-sm">{community.location}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Members</p>
                <h3 className="text-2xl font-bold">{community.usersList?.length || 0}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Messages</p>
                <h3 className="text-2xl font-bold">3,872</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Engagement</p>
                <h3 className="text-2xl font-bold">64%</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tags */}
      {community.tags && community.tags.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {community.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="bg-accent/10">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
