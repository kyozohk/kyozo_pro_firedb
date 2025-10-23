'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Search, UserPlus } from 'lucide-react';

type Community = {
  id: string;
  name: string;
  usersList?: { userId: string }[];
};

type UserProfile = {
  id: string;
  fullName?: string;
  email?: string;
  photoURL?: string;
};

export default function MembersPage() {
  const params = useParams();
  const communityId = params.communityId as string;
  const firestore = useFirestore();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get community document
  const communityDocRef = useMemoFirebase(() => {
    if (!firestore || !communityId) return null;
    return doc(firestore, 'communities', communityId);
  }, [firestore, communityId]);

  const { data: community, isLoading, error } = useDoc<Community>(communityDocRef);

  // Simulate loading user profiles
  // In a real app, you would fetch these from Firestore based on the usersList
  const userProfiles: UserProfile[] = community?.usersList?.map((member, index) => ({
    id: member.userId,
    fullName: `User ${index + 1}`,
    email: `user${index + 1}@example.com`,
    photoURL: '',
  })) || [];

  const filteredMembers = userProfiles.filter(member => 
    member.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    member.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h2 className="text-lg font-medium text-destructive mb-2">Error Loading Members</h2>
            <p className="text-sm text-destructive/80">{error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Members</h1>
          <p className="text-muted-foreground">
            {community?.usersList?.length || 0} members in this community
          </p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search members..." 
              className="pl-9 w-[200px]" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Community Members</CardTitle>
          <CardDescription>
            View and manage members of this community
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredMembers.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {searchTerm ? 'No members match your search' : 'No members in this community'}
            </p>
          ) : (
            <div className="space-y-4">
              {filteredMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.photoURL} />
                      <AvatarFallback>
                        {member.fullName?.substring(0, 2).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.fullName}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">View Profile</Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
