'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useFirestore, useMemoFirebase, useDoc, useCollection } from '@/firebase';
import { collection, query, where, doc, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, User, MessageSquare, ArrowDown } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import { cn } from '@/lib/utils';

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

export default function InboxPage() {
  const params = useParams();
  const communityId = params.communityId as string;
  const firestore = useFirestore();
  
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [lastMemberDoc, setLastMemberDoc] = useState<any>(null);
  const [lastMessageDoc, setLastMessageDoc] = useState<any>(null);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [hasMoreMembers, setHasMoreMembers] = useState(true);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  
  const membersObserver = useRef<IntersectionObserver | null>(null);
  const messagesObserver = useRef<IntersectionObserver | null>(null);
  const lastMemberElementRef = useCallback((node: HTMLElement | null) => {
    if (loadingMembers) return;
    if (membersObserver.current) membersObserver.current.disconnect();
    
    membersObserver.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMoreMembers) {
        loadMoreMembers();
      }
    });
    
    if (node) membersObserver.current.observe(node);
  }, [loadingMembers, hasMoreMembers]);
  
  const lastMessageElementRef = useCallback((node: HTMLElement | null) => {
    if (loadingMessages) return;
    if (messagesObserver.current) messagesObserver.current.disconnect();
    
    messagesObserver.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMoreMessages) {
        loadMoreMessages();
      }
    });
    
    if (node) messagesObserver.current.observe(node);
  }, [loadingMessages, hasMoreMessages]);
  
  // Get community document
  const communityDocRef = useMemoFirebase(() => {
    if (!firestore || !communityId) return null;
    return doc(firestore, 'communities', communityId);
  }, [firestore, communityId]);
  
  const { data: community } = useDoc<Community>(communityDocRef);
  
  // Load initial members
  useEffect(() => {
    if (!firestore || !communityId) return;
    
    const loadInitialMembers = async () => {
      setLoadingMembers(true);
      try {
        const membersQuery = query(
          collection(firestore, 'users'),
          where('communities', 'array-contains', communityId),
          limit(30)
        );
        
        const snapshot = await getDocs(membersQuery);
        const membersList = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        })) as UserProfile[];
        
        setMembers(membersList);
        setLastMemberDoc(snapshot.docs[snapshot.docs.length - 1]);
        setHasMoreMembers(snapshot.docs.length === 30);
        
        // Select first user by default
        if (membersList.length > 0 && !selectedUser) {
          setSelectedUser(membersList[0]);
        }
      } catch (error) {
        console.error("Error loading members:", error);
      } finally {
        setLoadingMembers(false);
      }
    };
    
    loadInitialMembers();
  }, [firestore, communityId]);
  
  // Load messages for selected user
  useEffect(() => {
    if (!firestore || !communityId || !selectedUser) {
      setMessages([]);
      return;
    }
    
    const loadInitialMessages = async () => {
      setLoadingMessages(true);
      try {
        const messagesQuery = query(
          collection(firestore, 'messages'),
          where('community', '==', communityId),
          where('readBy', 'array-contains', { userId: selectedUser.id }),
          orderBy('createdAt', 'desc'),
          limit(30)
        );
        
        const snapshot = await getDocs(messagesQuery);
        const messagesList = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        })) as Message[];
        
        setMessages(messagesList);
        setLastMessageDoc(snapshot.docs[snapshot.docs.length - 1]);
        setHasMoreMessages(snapshot.docs.length === 30);
      } catch (error) {
        console.error("Error loading messages:", error);
      } finally {
        setLoadingMessages(false);
      }
    };
    
    loadInitialMessages();
  }, [firestore, communityId, selectedUser]);
  
  // Load more members (infinite scroll)
  const loadMoreMembers = async () => {
    if (!firestore || !communityId || !lastMemberDoc || !hasMoreMembers) return;
    
    setLoadingMembers(true);
    try {
      const membersQuery = query(
        collection(firestore, 'users'),
        where('communities', 'array-contains', communityId),
        startAfter(lastMemberDoc),
        limit(30)
      );
      
      const snapshot = await getDocs(membersQuery);
      const newMembers = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as UserProfile[];
      
      setMembers(prev => [...prev, ...newMembers]);
      setLastMemberDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMoreMembers(snapshot.docs.length === 30);
    } catch (error) {
      console.error("Error loading more members:", error);
    } finally {
      setLoadingMembers(false);
    }
  };
  
  // Load more messages (infinite scroll)
  const loadMoreMessages = async () => {
    if (!firestore || !communityId || !selectedUser || !lastMessageDoc || !hasMoreMessages) return;
    
    setLoadingMessages(true);
    try {
      const messagesQuery = query(
        collection(firestore, 'messages'),
        where('community', '==', communityId),
        where('readBy', 'array-contains', { userId: selectedUser.id }),
        orderBy('createdAt', 'desc'),
        startAfter(lastMessageDoc),
        limit(30)
      );
      
      const snapshot = await getDocs(messagesQuery);
      const newMessages = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as Message[];
      
      setMessages(prev => [...prev, ...newMessages]);
      setLastMessageDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMoreMessages(snapshot.docs.length === 30);
    } catch (error) {
      console.error("Error loading more messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  };
  
  // Filter members based on search term
  const filteredMembers = members.filter(member => 
    (member.fullName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (member.phoneNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Left sidebar - Members list */}
      <div className="w-full md:w-80 lg:w-96 border-r flex flex-col h-full">
        <div className="p-4 border-b">
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
          {loadingMembers && members.length === 0 ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              {searchTerm ? 'No members match your search' : 'No members found'}
            </div>
          ) : (
            <div className="divide-y">
              {filteredMembers.map((member, index) => {
                const isLastItem = index === filteredMembers.length - 1;
                
                return (
                  <div 
                    key={member.id}
                    ref={isLastItem ? lastMemberElementRef : null}
                    className={cn(
                      "p-4 hover:bg-muted/50 cursor-pointer",
                      selectedUser?.id === member.id ? "bg-muted" : ""
                    )}
                    onClick={() => setSelectedUser(member)}
                  >
                    <div className="flex items-center gap-3">
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
                        <p className="font-medium truncate">
                          {member.fullName || 'Unknown User'}
                        </p>
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
                  </div>
                );
              })}
              
              {loadingMembers && (
                <div className="p-4 flex justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              )}
            </div>
          )}
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
                <div>
                  <h3 className="font-medium">{selectedUser.fullName || 'Unknown User'}</h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.phoneNumber || 'No phone number'}</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {loadingMessages && messages.length === 0 ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mb-2" />
                  <p>No messages with this member</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message, index) => {
                    const isLastItem = index === messages.length - 1;
                    const isSentByUser = message.sender === selectedUser.id;
                    
                    return (
                      <div 
                        key={message.id}
                        ref={isLastItem ? lastMessageElementRef : null}
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
                  
                  {loadingMessages && (
                    <div className="flex justify-center p-4">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {hasMoreMessages && (
              <div className="p-2 flex justify-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={loadMoreMessages}
                  disabled={loadingMessages}
                  className="text-xs"
                >
                  <ArrowDown className="h-3 w-3 mr-1" />
                  Load more messages
                </Button>
              </div>
            )}
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
