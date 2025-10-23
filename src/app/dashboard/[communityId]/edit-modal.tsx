'use client';

import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface EditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  section: string;
  onSave: () => void;
  data: any;
}

export default function EditModal({ open, onOpenChange, section, onSave, data }: EditModalProps) {
  const renderFields = () => {
    switch (section) {
      case 'profile':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue={data?.name || ''} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="privacy">Privacy</Label>
              <select 
                id="privacy" 
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                defaultValue={data?.privacy || 'private'}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input id="logo" defaultValue={data?.logo || ''} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroImage">Hero Image URL</Label>
              <Input id="heroImage" defaultValue={data?.heroImage || ''} />
            </div>
          </>
        );
      case 'details':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="mantra">Mantra</Label>
              <Textarea id="mantra" defaultValue={data?.mantra || ''} className="min-h-[100px]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lore">Lore</Label>
              <Textarea id="lore" defaultValue={data?.lore || ''} className="min-h-[150px]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input id="tags" defaultValue={data?.tags?.join(', ') || ''} />
            </div>
          </>
        );
      case 'permissions':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="owner">Community Owner</Label>
              <Input id="owner" defaultValue={data?.owner || ''} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admins">Admins (one per line)</Label>
              <Textarea 
                id="admins" 
                defaultValue={data?.admins?.join('\n') || ''} 
                className="min-h-[100px]" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="moderators">Moderators (one per line)</Label>
              <Textarea 
                id="moderators" 
                defaultValue={data?.moderators?.join('\n') || ''} 
                className="min-h-[100px]" 
              />
            </div>
          </>
        );
      default:
        return <p>No editable fields available for this section.</p>;
    }
  };

  const getTitleBySection = () => {
    switch (section) {
      case 'profile':
        return 'Edit Profile';
      case 'details':
        return 'Edit Details';
      case 'permissions':
        return 'Edit Permissions';
      default:
        return 'Edit';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{getTitleBySection()}</DialogTitle>
          <DialogDescription>
            Make changes to the {section} information. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {renderFields()}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onSave} className="bg-accent hover:bg-accent/80 text-accent-foreground">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
