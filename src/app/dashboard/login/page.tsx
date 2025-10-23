'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Welcome to Kyozo</h1>
          <p className="mt-2 text-muted-foreground">
            Create an account or sign in to access your community dashboard and settings.
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input 
                id="name" 
                placeholder="Enter your name" 
                gradient 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Your Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter your email" 
                gradient 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Create a password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Create a password" 
                gradient 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                placeholder="Confirm password" 
                gradient 
                required 
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox id="terms" gradient />
              <Label htmlFor="terms" className="text-sm">
                I agree to the{" "}
                <a href="#" className="text-primary hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </Label>
            </div>
          </div>
          
          <div className="space-y-4">
            <Button gradient className="w-full" size="lg">
              Sign Up
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <a href="#" className="text-primary hover:underline">
                  Sign In
                </a>
              </p>
            </div>
            
            <Button variant="outline" className="w-full" size="lg">
              Continue with Google
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
