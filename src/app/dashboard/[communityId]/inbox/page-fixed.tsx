'use client';

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { useFirestore, useMemoFirebase, useDoc, useCollection } from '@/firebase';
import { collection, query, where, doc, orderBy } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, User, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

// Types
interface Community {
  id: string;
  name: string;
  communityProfileImage?: string;
}

interface Message {
  id: string;
  text: string;
  sender?: string;
  createdAt: any;
  community: string;
  messageType?: string;
  image?: {
    url: string;
    caption?: string;
  };
  readBy?: { userId: string; text: string }[];
  isRead?: boolean;
}

interface UserProfile {
  id: string;
  fullName?: string;
  phoneNumber?: string;
  role?: string;
  profileImage?: string;
  [key: string]: any;
}

interface UserWithMessages extends UserProfile {
  lastMessage?: Message;
  lastMessageTime?: number;
}

// Helper Components
const MessageContent = ({ message }: { message: Message }) => {
  if (message.messageType === 'image' && message.image?.url) {
    return (
      <div className="space-y-2">
        <div className="relative h-48 w-full rounded-md overflow-hidden">
          <Image 
            src={message.image.url} 
            alt={message.image.caption || 'Image message'} 
            fill
            className="object-cover"
          />
        </div>
        {message.image.caption && <p className="text-sm italic">{message.image.caption}</p>}
      </div>
    );
  }
  
  return <p className="whitespace-pre-wrap">{message.text}</p>;
};

const formatDate = (date: any) => {
  if (!date) return '';
  if (date && (date.seconds || date._seconds)) {
    const seconds = date.seconds || date._seconds;
    return format(new Date(seconds * 1000), "HH:mm • dd/MMM/yyyy");
  }
  return format(new Date(date), "HH:mm • dd/MMM/yyyy");
};

// Loading skeleton components
const MembersSkeleton = () => (
  <div className="p-4 space-y-4">
    {Array(5).fill(0).map((_, i) => (
      <div key={i} className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

const MessagesSkeleton = () => (
  <div className="p-4 space-y-6">
    <div className="flex items-start gap-3">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-20 w-64 rounded-lg" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
    <div className="flex items-start gap-3 justify-end">
      <div className="space-y-2">
        <Skeleton className="h-16 w-48 rounded-lg" />
        <Skeleton className="h-3 w-20 ml-auto" />
      </div>
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
    <div className="flex items-start gap-3">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-12 w-56 rounded-lg" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  </div>
);

export default function InboxPage() {
  const params = useParams();
  const communityId = params.communityId as string;
  const firestore = useFirestore();
  
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserWithMessages | null>(null);
  const [members, setMembers] = useState<UserWithMessages[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingUI, setIsLoadingUI] = useState(true);
  
  // Get community document
  const communityDocRef = useMemoFirebase(() => {
    if (!firestore || !communityId) return null;
    return doc(firestore, 'communities', communityId);
  }, [firestore, communityId]);
  
  const { data: community } = useDoc<Community>(communityDocRef);
  
  // Use useCollection hooks to get all data at once, like in the old inbox
  const messagesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'messages');
  }, [firestore]);
  const { data: allMessages, isLoading: loadingMessages } = useCollection<Message>(messagesQuery);

  const sentMessagesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'sendwamessagehistories');
  }, [firestore]);
  const { data: allSentMessages, isLoading: loadingSentMessages } = useCollection<Message>(sentMessagesQuery);
  
  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'users');
  }, [firestore]);
  const { data: allUsers, isLoading: loadingUsers } = useCollection<UserProfile>(usersQuery);

  // Update loading state
  useEffect(() => {
    setIsLoadingUI(loadingMessages || loadingSentMessages || loadingUsers);
  }, [loadingMessages, loadingSentMessages, loadingUsers]);

  // Process messages and users
  useEffect(() => {
    if (!communityId || !allMessages || !allUsers || !allSentMessages) {
      return;
    }

    // Combine received and sent messages for the community
    const communityMessages = allMessages.filter(msg => msg.community === communityId);
    const communitySentMessages = allSentMessages.filter(msg => msg.community === communityId);
    const combinedCommunityMessages = [...communityMessages, ...communitySentMessages];
    
    // Sort messages by date
    combinedCommunityMessages.sort((a, b) => {
      const timeA = a.createdAt?._seconds || a.createdAt?.seconds || 0;
      const timeB = b.createdAt?._seconds || b.createdAt?.seconds || 0;
      return timeB - timeA; // Descending order (newest first)
    });
    
    // Create a set of user IDs who have sent or received a message in this community
    const usersInvolved = new Set<string>();
    combinedCommunityMessages.forEach(msg => {
      if (msg.sender) usersInvolved.add(msg.sender);
      msg.readBy?.forEach(r => usersInvolved.add(r.userId));
    });
    
    // Create a map for quick lookup
    const usersMap = new Map(allUsers.map(user => [user.id, user]));
    
    // Create user with messages objects
    const usersWithMessages: UserWithMessages[] = Array.from(usersInvolved)
      .map(userId => {
        const user = usersMap.get(userId);
        if (!user) return null;
        
        // Get messages for this user
        const userMessages = combinedCommunityMessages.filter(msg => 
          msg.readBy?.some(r => r.userId === userId) || msg.sender === userId
        );
        
        if (userMessages.length === 0) return null;
        
        // Get the latest message for preview
        const lastMessage = userMessages[0]; // Already sorted by time
        const lastMessageTime = lastMessage.createdAt?._seconds || 
                              lastMessage.createdAt?.seconds || 0;
        
        return {
          ...user,
          lastMessage,
          lastMessageTime
        };
      })
      .filter(Boolean) as UserWithMessages[];
    
    // Sort users by latest message time
    usersWithMessages.sort((a, b) => 
      (b.lastMessageTime || 0) - (a.lastMessageTime || 0)
    );
    
    setMembers(usersWithMessages);
    
    // Select first user by default
    if (!selectedUser && usersWithMessages.length > 0) {
      setSelectedUser(usersWithMessages[0]);
      
      // Load messages for the first user
      const firstUserMessages = combinedCommunityMessages.filter(msg => 
        msg.readBy?.some(r => r.userId === usersWithMessages[0].id) || 
        msg.sender === usersWithMessages[0].id
      );
      
      // Sort messages for conversation view (oldest first)
      firstUserMessages.sort((a, b) => {
        const timeA = a.createdAt?._seconds || a.createdAt?.seconds || 0;
        const timeB = b.createdAt?._seconds || b.createdAt?.seconds || 0;
        return timeA - timeB;
      });
      
      setMessages(firstUserMessages);
    } else if (selectedUser) {
      // Update messages for selected user
      const userMessages = combinedCommunityMessages.filter(msg => 
        msg.readBy?.some(r => r.userId === selectedUser.id) || 
        msg.sender === selectedUser.id
      );
      
      // Sort messages for conversation view (oldest first)
      userMessages.sort((a, b) => {
        const timeA = a.createdAt?._seconds || a.createdAt?.seconds || 0;
        const timeB = b.createdAt?._seconds || b.createdAt?.seconds || 0;
        return timeA - timeB;
      });
      
      setMessages(userMessages);
    }
  }, [communityId, allMessages, allUsers, allSentMessages, selectedUser]);

  // Function to get message preview text
  const getMessagePreview = (message?: Message) => {
    if (!message) return '';
    if (message.messageType === 'image') return '[Image]';
    return message.text?.substring(0, 40) || '[Empty message]';
  };

  // Filter members based on search term
  const filteredMembers = members.filter(member => 
    (member.fullName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (member.phoneNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  // Main component with Suspense
  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Left sidebar - Members list */}
      <div className="w-full md:w-80 lg:w-96 border-r flex flex-col h-full">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium">Members</h3>
              <Badge variant="outline" className="text-xs">
                {members.length}
              </Badge>
              {isLoadingUI && (
                <div className="flex items-center text-xs text-muted-foreground gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Loading...</span>
                </div>
              )}
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search members..." 
              className="pl-9" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <Suspense fallback={<MembersSkeleton />}>
            {isLoadingUI ? (
              <MembersSkeleton />
            ) : filteredMembers.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                {searchTerm ? 'No members match your search' : 'No members found'}
              </div>
            ) : (
              <div className="divide-y">
                {filteredMembers.map((member) => {
                  const lastMessage = member.lastMessage;
                  const messagePreview = getMessagePreview(lastMessage);
                  
                  return (
                    <div 
                      key={member.id}
                      className={cn(
                        "p-4 hover:bg-muted/50 cursor-pointer",
                        selectedUser?.id === member.id ? "bg-muted" : ""
                      )}
                      onClick={() => setSelectedUser(member)}
                    >
                      <div className="flex items-center gap-3 mb-1">
                        <Avatar>
                          {member.profileImage ? (
                            <AvatarImage src={member.profileImage} alt={member.fullName || 'User'} />
                          ) : (
                            <AvatarFallback>
                              <User className="h-5 w-5" />
                            </AvatarFallback>
                          )}
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <p className="font-medium truncate">
                              {member.fullName || 'Unknown User'}
                            </p>
                            {member.lastMessageTime && (
                              <span className="text-xs text-muted-foreground">
                                {format(new Date((member.lastMessageTime) * 1000), "MMM d")}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {member.phoneNumber || 'No phone number'}
                          </p>
                        </div>
                        
                        {member.role && (
                          <Badge variant="outline" className="ml-auto">
                            {member.role}
                          </Badge>
                        )}
                      </div>
                      
                      {/* Last message preview */}
                      {messagePreview && (
                        <p className="text-xs text-muted-foreground truncate pl-12">
                          {messagePreview}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Suspense>
        </div>
      </div>
      
      {/* Right side - Messages */}
      <div className="flex-1 flex flex-col h-full">
        {selectedUser ? (
          <>
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <Avatar>
                  {selectedUser.profileImage ? (
                    <AvatarImage src={selectedUser.profileImage} alt={selectedUser.fullName || 'User'} />
                  ) : (
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-medium">{selectedUser.fullName || 'Unknown User'}</h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.phoneNumber || 'No phone number'}</p>
                </div>
              </div>
              
              {/* Debug info */}
              <div className="mt-2 text-xs text-muted-foreground border-t pt-2">
                <p>Total members: {members.length}</p>
                <p>User messages: {messages.length}</p>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <Suspense fallback={<MessagesSkeleton />}>
                {isLoadingUI ? (
                  <MessagesSkeleton />
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mb-2" />
                    <p>No messages with this member</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const isSentByUser = message.sender === selectedUser.id;
                      
                      return (
                        <div 
                          key={message.id}
                          className={cn(
                            "flex items-end gap-2",
                            isSentByUser ? "justify-end" : "justify-start"
                          )}
                        >
                          {!isSentByUser && (
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>A</AvatarFallback>
                            </Avatar>
                          )}
                          
                          <div className="max-w-[70%]">
                            <div className={cn(
                              "p-3 rounded-lg",
                              isSentByUser ? "bg-primary text-primary-foreground" : "bg-muted"
                            )}>
                              <MessageContent message={message} />
                            </div>
                            <p className={cn(
                              "text-xs text-muted-foreground mt-1",
                              isSentByUser ? "text-right" : "text-left"
                            )}>
                              {formatDate(message.createdAt)}
                            </p>
                          </div>
                          
                          {isSentByUser && (
                            <Avatar className="h-8 w-8">
                              {selectedUser.profileImage ? (
                                <AvatarImage src={selectedUser.profileImage} alt={selectedUser.fullName || 'User'} />
                              ) : (
                                <AvatarFallback>
                                  <User className="h-4 w-4" />
                                </AvatarFallback>
                              )}
                            </Avatar>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </Suspense>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
            <MessageSquare className="h-16 w-16 mb-4" />
            <h3 className="text-xl font-medium mb-2">Select a member to view messages</h3>
            <p>Choose a member from the list to view your conversation history</p>
          </div>
        )}
      </div>
    </div>
  );
}
