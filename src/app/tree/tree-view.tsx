

'use client';

import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, User, MessageSquare } from 'lucide-react';

// --- TYPES ---
interface Community {
  id: string;
  name: string;
}

interface Member {
  _id: string;
  fullName: string;
  // Add other member fields if needed
}

interface Message {
  _id: string;
  text: string;
  createdAt: string;
}

// --- CHILD COMPONENTS ---

function MemberItem({ communityName, member }: { communityName: string; member: Member }) {
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    if (messages) return; // Don't re-fetch
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/tree-data?communityName=${encodeURIComponent(communityName)}&userId=${member._id}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch messages.');
      }
      const data = await res.json();
      setMessages(data.messages);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleToggle = (open: boolean) => {
    if (open && !messages) {
      fetchMessages();
    }
  }

  return (
    <Accordion type="single" collapsible onValueChange={(value) => handleToggle(!!value)}>
      <AccordionItem value={member._id}>
        <AccordionTrigger className="text-sm font-medium py-2 pl-4 pr-2 hover:bg-muted/50 rounded-md">
            <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary"/>
                {member.fullName || 'Unnamed User'}
            </div>
        </AccordionTrigger>
        <AccordionContent className="pl-8 pr-2 pt-2">
          {isLoading && <div className="flex items-center gap-2 text-muted-foreground text-sm"><Loader2 className="h-4 w-4 animate-spin" />Loading messages...</div>}
          {error && <p className="text-destructive text-xs">{error}</p>}
          {messages && (
            <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2 text-sm"><MessageSquare className="h-4 w-4" /> Messages ({messages.length})</h4>
                 {messages.length > 0 ? messages.map(msg => (
                    <div key={msg._id} className="p-2 bg-background rounded-md text-sm border">
                        <p>{msg.text}</p>
                        {msg.createdAt && <p className="text-xs text-muted-foreground mt-1">{new Date(msg.createdAt).toLocaleString()}</p>}
                    </div>
                )) : <p className="text-xs text-muted-foreground">No messages found for this user.</p>}
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}


function CommunityItem({ community }: { community: Community }) {
  const [members, setMembers] = useState<Member[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchMembers = async () => {
    if (members) return; // Don't re-fetch
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/tree-data?communityName=${encodeURIComponent(community.name)}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch members.');
      }
      const data = await res.json();
      setMembers(data.members);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = (open: boolean) => {
    if (open && !members) {
      fetchMembers();
    }
  };

  return (
    <AccordionItem value={community.id}>
      <AccordionTrigger className="text-base font-semibold py-3" onFocus={fetchMembers}>
        {community.name}
      </AccordionTrigger>
      <AccordionContent className="pl-4 pr-2 pt-2 space-y-2">
        {isLoading && <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Loading members...</div>}
        {error && <p className="text-destructive">{error}</p>}
        {members && members.length > 0 ? (
          members.map(member => <MemberItem key={member._id} communityName={community.name} member={member} />)
        ) : (
          !isLoading && <p className="text-sm text-muted-foreground">No members found in this community.</p>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}


// --- MAIN TREE VIEW COMPONENT ---

export function TreeView({ communities }: { communities: Community[] }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {communities.map(community => (
        <CommunityItem key={community.id} community={community} />
      ))}
    </Accordion>
  );
}
