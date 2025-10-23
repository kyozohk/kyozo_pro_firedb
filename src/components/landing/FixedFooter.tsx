'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface FixedFooterProps {
  className?: string;
}

const FixedFooter: React.FC<FixedFooterProps> = ({ className = '' }) => {
  const router = useRouter();
  const pathname = usePathname();
  
  const navigateToDashboard = () => {
    router.push('/dashboard');
  };

  // Don't render footer on dashboard pages
  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  return (
    <footer className={`fixed bottom-0 left-0 w-full z-50 py-4 ${className}`}>
      <div className="w-full px-4 flex justify-center items-center">
        <div className="flex items-center bg-black/60 rounded-full py-1 px-2 border border-white/10 backdrop-blur-md">
          <div className="flex items-center mr-2">
            <Image 
              src="/logo.png" 
              alt="Kyozo" 
              width={100} 
              height={30} 
              className="h-auto pl-2"
            />
          </div>
          <Button 
            variant="outline-only"
            size="medium"
            onClick={navigateToDashboard}
            className="rounded-full px-6 font-medium text-sm bg-pink-500 text-white hover:bg-pink-600"
          >
            Join
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default FixedFooter;
