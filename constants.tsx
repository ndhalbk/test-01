
import React from 'react';
import { PricingPlan } from './types';

export const PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: '49 TND',
    features: ['4 AI Videos', '10 Tunisian Scripts', 'Standard Avatars', 'Email Support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '99 TND',
    features: ['8 AI Videos', '30 Tunisian Scripts', 'Premium Avatars', 'Priority Support', 'Meta Scheduling'],
    recommended: true,
  },
  {
    id: 'business',
    name: 'Business',
    price: '189 TND',
    features: ['16 AI Videos', 'Unlimited Scripts', 'Custom Voices', 'API Access', 'White-labeling'],
  }
];

export const APP_NAME = "ContentFlyer AI";
