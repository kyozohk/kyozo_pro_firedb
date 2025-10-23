'use client';

import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ThemeToggle: React.FC = () => {
  // Since we're keeping only dark theme, this is just a placeholder
  return (
    <div className="fixed top-4 right-4 z-50">
      <Button variant="ghost" size="icon" aria-label="Toggle theme">
        <Moon className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ThemeToggle;
