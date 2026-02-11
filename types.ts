
export interface ProductData {
  name: string;
  image: string;
  category: string;
}

export interface GeneratedContent {
  scriptTunisian: string;
  caption: string;
  cta: string;
  audioData?: string;
  groundingLinks?: { web: { uri: string; title: string } }[];
}

export enum AppState {
  LANDING = 'LANDING',
  DASHBOARD = 'DASHBOARD',
  GENERATING = 'GENERATING',
  RESULTS = 'RESULTS',
  IMAGE_LAB = 'IMAGE_LAB',
  VIDEO_LAB = 'VIDEO_LAB',
  LIVE_SUPPORT = 'LIVE_SUPPORT',
  MARKET_RESEARCH = 'MARKET_RESEARCH'
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  features: string[];
  recommended?: boolean;
}
