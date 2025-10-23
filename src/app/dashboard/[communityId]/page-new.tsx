'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Loader2, 
  Users, 
  MessageSquare, 
  BarChart3,
  MapPin,
  Tag
} from 'lucide-react';

type Community = {
  id: string;
  name: string;
  logo?: string;
  heroImage?: string;
  usersList?: { userId: string }[];
  description?: string;
  mantra?: string;
  lore?: string;
  tags?: string[];
  location?: string;
  privacy?: 'public' | 'private';
  createdAt?: any;
  status?: 'publish' | 'draft';
  owner?: string;
  admins?: string[];
  moderators?: string[];
};

// Mock data for testing
const mockCommunity: Community = {
  id: 'secret-theatre',
  name: 'Secret Theatre',
  logo: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?q=80&w=100&auto=format&fit=crop',
  heroImage: 'https://images.unsplash.com/photo-1503095396549-807759245b35?q=80&w=800&auto=format&fit=crop',
  usersList: Array(1808).fill({ userId: 'user-id' }),
  description: 'A community for immersive theatre experiences',
  mantra: 'Secret Theatre travel: the world with unique, immersive site specific dramatic productions.',
  lore: 'Immerse yourself in specific character roles, discovering a world of possibilities (and rewards for those who surprise us)',
  tags: ['Immersive Art', 'Fashion Design', 'Futurism'],
  location: 'Hong Kong',
  privacy: 'private',
  createdAt: { _seconds: 1677649200, _nanoseconds: 0 },
  status: 'publish',
  owner: 'info@secrettheatre@gmail.com',
  admins: ['admin@kyozo.com', 'team@kyozo.com'],
  moderators: ['will@kyozo.com', 'richard@secrettheatre@gmail.com']
};

// Mock stats data
const mockGenderStats = {
  male: 56.25,
  female: 43.75
};

const mockAgeRanges = [
  { range: '18-25', percentage: 35.71 },
  { range: '26-35', percentage: 35.71 },
  { range: '36-45', percentage: 28.57 },
];

const mockLocations = [
  { name: 'Hong Kong', percentage: 85.57 },
  { name: 'United States', percentage: 5.71 },
  { name: 'United Kingdom', percentage: 2.86 },
  { name: 'Singapore', percentage: 2.86 },
];

export default function CommunityOverviewPage() {
  const params = useParams();
  const communityId = params.communityId as string;
  const firestore = useFirestore();
  
  // State for community data
  const [useMockData, setUseMockData] = useState(true);
  const [communityData, setCommunityData] = useState<Community | null>(null);
  
  // Get community document
  const communityDocRef = useMemoFirebase(() => {
    if (!firestore || !communityId) return null;
    return doc(firestore, 'communities', communityId);
  }, [firestore, communityId]);

  const { data: fetchedCommunity, isLoading, error } = useDoc<Community>(communityDocRef);
  
  // Use mock data for testing or when there's an error/no data
  useEffect(() => {
    if (useMockData || (!isLoading && (!fetchedCommunity || error))) {
      setCommunityData(mockCommunity);
    } else if (fetchedCommunity) {
      setCommunityData(fetchedCommunity);
    }
  }, [fetchedCommunity, isLoading, error, useMockData]);

  // Toggle between mock data and real data
  const toggleMockData = () => {
    setUseMockData(prev => !prev);
  };

  if (isLoading && !communityData) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error && !communityData) {
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

  if (!communityData) {
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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{communityData.name}</h1>
        <Button 
          onClick={toggleMockData} 
          variant="outline" 
          size="sm"
          className="text-xs"
        >
          {useMockData ? 'Use Real Data' : 'Use Mock Data'}
        </Button>
      </div>
      
      {/* Profile and Details Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Profile Card */}
        <Card gradient className="bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-accent-foreground">Profile</CardTitle>
            <Badge variant="outline" className="bg-accent/20">
              {communityData.status === 'publish' ? 'Published' : 'Draft'}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs uppercase text-accent-foreground">NAME</p>
              <p className="font-bold">{communityData.name}</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-xs uppercase text-accent-foreground">COMMUNITY PRIVACY</p>
              <p>{communityData.privacy || 'Private'}</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-xs uppercase text-accent-foreground">HERO IMAGE</p>
              <div className="relative h-36 w-full rounded-md overflow-hidden bg-accent/10">
                {communityData.heroImage ? (
                  <Image 
                    src={communityData.heroImage} 
                    alt={communityData.name} 
                    fill 
                    className="object-cover" 
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-muted-foreground">No hero image</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-xs uppercase text-accent-foreground">LOGO</p>
              <div className="flex items-center space-x-4">
                <div className="relative h-16 w-16 rounded-md overflow-hidden bg-accent/10">
                  {communityData.logo ? (
                    <Image 
                      src={communityData.logo} 
                      alt={communityData.name} 
                      fill 
                      className="object-cover" 
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-xs text-muted-foreground">No logo</p>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{communityData.name}</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-accent hover:bg-accent/80 text-accent-foreground"
            >
              Edit Profile
            </Button>
          </CardFooter>
        </Card>
        
        {/* Details Card */}
        <Card gradient className="bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-accent-foreground">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {communityData.mantra && (
              <div className="space-y-2">
                <p className="text-xs uppercase text-accent-foreground">MANTRA</p>
                <p className="text-sm">{communityData.mantra}</p>
              </div>
            )}
            
            {communityData.lore && (
              <div className="space-y-2">
                <p className="text-xs uppercase text-accent-foreground">LORE</p>
                <p className="text-sm">{communityData.lore}</p>
              </div>
            )}
            
            {communityData.tags && communityData.tags.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs uppercase text-accent-foreground">TAGS</p>
                <div className="flex flex-wrap gap-2">
                  {communityData.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="bg-accent/10">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {communityData.location && (
              <div className="space-y-2">
                <p className="text-xs uppercase text-accent-foreground">LOCATION</p>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-accent-foreground/70" />
                  <span>{communityData.location}</span>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-accent hover:bg-accent/80 text-accent-foreground"
            >
              Edit Details
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-card/80">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Members</p>
                <h3 className="text-2xl font-bold">{communityData.usersList?.length || 0}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/80">
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
        
        <Card className="bg-card/80">
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
      
      {/* Gender Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle className="text-accent-foreground">Gender Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-sm">Male</p>
                <p className="text-sm">{mockGenderStats.male}%</p>
              </div>
              <Progress value={mockGenderStats.male} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-sm">Female</p>
                <p className="text-sm">{mockGenderStats.female}%</p>
              </div>
              <Progress value={mockGenderStats.female} className="h-2" />
            </div>
          </CardContent>
        </Card>
        
        {/* Age Range */}
        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle className="text-accent-foreground">Age Range</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockAgeRanges.map((range, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-sm">{range.range}</p>
                  <p className="text-sm">{range.percentage}%</p>
                </div>
                <Progress value={range.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      
      {/* Location */}
      <Card className="bg-card/80 mb-8">
        <CardHeader>
          <CardTitle className="text-accent-foreground">Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockLocations.map((location, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between">
                <p className="text-sm">{location.name}</p>
                <p className="text-sm">{location.percentage}%</p>
              </div>
              <Progress value={location.percentage} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
