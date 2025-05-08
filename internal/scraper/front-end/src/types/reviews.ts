export type Platform = 'G2' | 'App Store' | 'Google Play' | 'Trustpilot' | 'Reddit' | 'Twitter' | 'Other';

export type Sentiment = 'Positive' | 'Neutral' | 'Negative';

export type Department = 'Product' | 'Support' | 'Sales' | 'Marketing' | 'Engineering' | 'General';

export type Product = 'BloxOne' | 'NIOS' | 'DDI' | 'DNS Security' | 'Cloud' | 'Threat Defense' | 'Other';

export interface Review {
  id: string;
  title: string;
  content: string;
  rating?: number; // 1-5 stars
  date: string;
  platform: Platform;
  sentiment: Sentiment;
  department: Department;
  product?: Product;  // Added product field
  author?: string;
  url?: string;
  highlights?: string[];
  tags?: string[];
  isProcessed: boolean;
}

export interface ReviewStats {
  totalReviews: number;
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  averageRating: number;
  byPlatform: Record<Platform, number>;
  byDepartment: Record<Department, number>;
  byProduct: Record<Product, number>;  // Added product breakdown
  recentTrend: 'up' | 'down' | 'stable';
}