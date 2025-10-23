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
  status: 'publish'
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
  const [community, setCommunity] = useState<Community | null>(null);
  
  // Get community document
  const communityDocRef = useMemoFirebase(() => {
    if (!firestore || !communityId) return null;
    return doc(firestore, 'communities', communityId);
  }, [firestore, communityId]);

  const { data: fetchedCommunity, isLoading: isLoadingCommunity, error } = useDoc<Community>(communityDocRef);
  
  // Use mock data for testing or when there's an error/no data
  useEffect(() => {
    // If we're explicitly using mock data or if there's an error/no data after loading
    if (useMockData || (!isLoadingCommunity && (!fetchedCommunity || error))) {
      setCommunity(mockCommunity as Community);
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

  if (error) {
    return (
      <div className="p-6">
        <Card className="bg-destructive/10 border-destructive/30">
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

  // Function to handle edit button clicks
  const handleEditClick = (section: string) => {
    setEditingSection(section);
    setIsEditModalOpen(true);
  };

  // Function to handle save changes
  const handleSaveChanges = () => {
    // In a real app, you would save changes to the database here
    setEditingSection(null);
    setIsEditModalOpen(false);
  };
  
  // Toggle between mock data and real data
  const toggleMockData = () => {
    setUseMockData(prev => !prev);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{community?.name || 'Community Overview'}</h1>
        <Button 
          onClick={toggleMockData} 
          variant="outline" 
          size="sm"
          className="text-xs"
        >
          {useMockData ? 'Use Real Data' : 'Use Mock Data'}
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Card */}
            <Card className="bg-card/80">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-accent-foreground">Profile</CardTitle>
                <Badge variant="outline" className="bg-accent/20">
                  {community?.status === 'publish' ? 'Published' : 'Draft'}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-xs uppercase text-accent-foreground">NAME</p>
                  <p className="font-bold">{community?.name || 'Untitled Community'}</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs uppercase text-accent-foreground">COMMUNITY PRIVACY</p>
                  <p>{community?.privacy || 'Private'}</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs uppercase text-accent-foreground">HERO IMAGE</p>
                  <div className="relative h-36 w-full rounded-md overflow-hidden bg-accent/10">
                    {community?.heroImage ? (
                      <Image 
                        src={community.heroImage} 
                        alt={community.name || 'Community hero'} 
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
                      {community?.logo ? (
                        <Image 
                          src={community.logo} 
                          alt={community.name || 'Community logo'} 
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
                      <p className="text-sm">{community?.name || 'Community Name'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleEditClick('profile')} 
                  className="w-full bg-accent hover:bg-accent/80 text-accent-foreground"
                >
                  <Pencil className="h-4 w-4 mr-2" /> Edit Profile
                </Button>
              </CardFooter>
            </Card>
            
            {/* Details Card */}
            <Card className="bg-card/80">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-accent-foreground">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {community?.mantra && (
                  <div className="space-y-2">
                    <p className="text-xs uppercase text-accent-foreground">MANTRA</p>
                    <p className="text-sm">{community.mantra}</p>
                  </div>
                )}
                
                {community?.lore && (
                  <div className="space-y-2">
                    <p className="text-xs uppercase text-accent-foreground">LORE</p>
                    <p className="text-sm">{community.lore}</p>
                  </div>
                )}
                
                {community?.tags && community.tags.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs uppercase text-accent-foreground">TAGS</p>
                    <div className="flex flex-wrap gap-2">
                      {community.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="bg-accent/10">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleEditClick('details')} 
                  className="w-full bg-accent hover:bg-accent/80 text-accent-foreground"
                >
                  <Pencil className="h-4 w-4 mr-2" /> Edit Details
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Permissions Card */}
          <Card className="bg-card/80">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-accent-foreground">Permissions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-xs uppercase text-accent-foreground">Community Owner</p>
                <p className="text-sm">{community?.owner || 'Not specified'}</p>
              </div>
              
              {community?.admins && community.admins.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs uppercase text-accent-foreground">Community Admin</p>
                  {community.admins.map((admin, index) => (
                    <p key={index} className="text-sm">{admin}</p>
                  ))}
                </div>
              )}
              
              {community?.moderators && community.moderators.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs uppercase text-accent-foreground">Community Curator</p>
                  {community.moderators.map((mod, index) => (
                    <p key={index} className="text-sm">{mod}</p>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleEditClick('permissions')} 
                className="w-full bg-accent hover:bg-accent/80 text-accent-foreground"
              >
                <Shield className="h-4 w-4 mr-2" /> Edit Permissions
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Stats Tab */}
        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Total Users Card */}
            <Card className="bg-card/80">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">1808</div>
                <p className="text-xs text-primary mt-1">+17%</p>
                <p className="text-xs text-muted-foreground">Since last month</p>
              </CardContent>
            </Card>
            
            {/* New Users Card */}
            <Card className="bg-card/80">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">+0% Since last month</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Gender Stats */}
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
          
          {/* Location */}
          <Card className="bg-card/80">
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
        </TabsContent>
        
        {/* Permissions Tab */}
        <TabsContent value="permissions" className="space-y-6">
          <Card className="bg-card/80">
            <CardHeader>
              <CardTitle className="text-accent-foreground">Permissions</CardTitle>
              <CardDescription>Manage who can access this community</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Community Owner</h3>
                <p className="text-sm text-muted-foreground">{community?.owner || 'Not specified'}</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Community Curator</h3>
                {community?.moderators && community.moderators.length > 0 ? (
                  <div className="space-y-1">
                    {community.moderators.map((mod, index) => (
                      <p key={index} className="text-sm text-muted-foreground">{mod}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No curators assigned</p>
                )}
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Community Admin</h3>
                {community?.admins && community.admins.length > 0 ? (
                  <div className="space-y-1">
                    {community.admins.map((admin, index) => (
                      <p key={index} className="text-sm text-muted-foreground">{admin}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No admins assigned</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-accent hover:bg-accent/80 text-accent-foreground">
                <Shield className="h-4 w-4 mr-2" /> Edit Permissions
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-card/80">
            <CardHeader>
              <CardTitle className="text-accent-foreground">Community Settings</CardTitle>
              <CardDescription>Manage your community configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="font-medium">Community ID</p>
                <p className="text-sm text-muted-foreground font-mono">{community?.id}</p>
              </div>
              
              <div className="space-y-2">
                <p className="font-medium">Created</p>
                <p className="text-sm text-muted-foreground">
                  {community?.createdAt ? new Date(community.createdAt._seconds * 1000).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
              
              <div className="space-y-2">
                <p className="font-medium">Status</p>
                <Badge variant="outline" className="bg-accent/20">
                  {community?.status === 'publish' ? 'Published' : 'Draft'}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <p className="font-medium">Privacy</p>
                <p className="text-sm text-muted-foreground">{community?.privacy || 'Private'}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-accent hover:bg-accent/80 text-accent-foreground">
                <Settings className="h-4 w-4 mr-2" /> Update Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Edit Modal */}
      <EditModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        section={editingSection || ''}
        onSave={handleSaveChanges}
        data={community}
      />
    </div>
  );
}
