'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const PricingSection: React.FC = () => {
  const plans = [
    {
      name: 'Basic',
      price: 'Free',
      description: 'Perfect for getting started',
      features: [
        'Community access',
        'Basic messaging',
        'Limited analytics',
        'Standard support'
      ],
      buttonText: 'Get Started',
      highlighted: false
    },
    {
      name: 'Pro',
      price: '$19',
      period: '/month',
      description: 'Everything you need to grow',
      features: [
        'Unlimited communities',
        'Advanced messaging',
        'Full analytics suite',
        'Priority support',
        'Custom branding',
        'API access'
      ],
      buttonText: 'Start Free Trial',
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations',
      features: [
        'Dedicated account manager',
        'Custom integrations',
        'Advanced security',
        'SLA guarantees',
        'Onboarding assistance',
        'Training sessions'
      ],
      buttonText: 'Contact Sales',
      highlighted: false
    }
  ];

  return (
    <div className="py-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Simple, Transparent Pricing</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the plan that's right for your creative journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`rounded-2xl p-8 border ${
                plan.highlighted 
                  ? 'border-primary shadow-lg shadow-primary/20 scale-105' 
                  : 'border-border'
              } transition-all duration-300 hover:shadow-lg`}
            >
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-end mb-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground ml-1">{plan.period}</span>}
              </div>
              <p className="text-muted-foreground mb-6">{plan.description}</p>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full ${plan.highlighted ? '' : 'variant-outline'}`}
                variant={plan.highlighted ? 'default' : 'outline'}
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
