'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, Users, BarChart3, Zap, 
  Globe, Bell, Shield, Settings 
} from 'lucide-react';

const Toolkit: React.FC = () => {
  const tools = [
    { 
      icon: <MessageSquare className="w-8 h-8" />, 
      title: 'Messaging', 
      description: 'Connect directly with your audience through personalized messaging' 
    },
    { 
      icon: <Users className="w-8 h-8" />, 
      title: 'Community', 
      description: 'Build and nurture your creative community' 
    },
    { 
      icon: <BarChart3 className="w-8 h-8" />, 
      title: 'Analytics', 
      description: 'Gain insights into your audience engagement' 
    },
    { 
      icon: <Zap className="w-8 h-8" />, 
      title: 'Automation', 
      description: 'Streamline your workflow with powerful automation tools' 
    },
    { 
      icon: <Globe className="w-8 h-8" />, 
      title: 'Global Reach', 
      description: 'Connect with creators and audiences worldwide' 
    },
    { 
      icon: <Bell className="w-8 h-8" />, 
      title: 'Notifications', 
      description: 'Stay updated with real-time alerts and notifications' 
    },
    { 
      icon: <Shield className="w-8 h-8" />, 
      title: 'Security', 
      description: 'Protect your content and community with advanced security' 
    },
    { 
      icon: <Settings className="w-8 h-8" />, 
      title: 'Customization', 
      description: 'Tailor your experience to match your creative vision' 
    },
  ];

  return (
    <div className="py-24 px-6 md:px-16 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Creative Toolkit</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to grow and engage with your creative community
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tools.map((tool, index) => (
            <div 
              key={index} 
              className="p-6 rounded-xl bg-background/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
            >
              <div className="mb-4 text-primary">{tool.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{tool.title}</h3>
              <p className="text-muted-foreground">{tool.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Button size="lg" className="px-8">
            Explore All Features
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Toolkit;
