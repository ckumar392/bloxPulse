export type Platform = 'Gartner' | 'G2' | 'TrustRadius' | 'PeerSpot' | 'Reddit' | 'Spiceworks Community' | 'LinkedIn / Medium / Blogs';

export type Sentiment = 'Positive' | 'Neutral' | 'Negative';

export type Department = 'Product' | 'Support' | 'Sales' | 'Marketing' | 'Engineering' | 'General';

export type Product = 'BloxOne DDI' | 'NIOS' | 'BloxOne Threat Defense' | 'BloxOne DNS' | 'BloxOne DHCP' | 'BloxOne IPAM' | 'BloxOne Platform' | 'BloxOne Cloud Network Automation';

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
  needsAction?: boolean; // Add flag to indicate if review needs action
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
  ratingsBreakdown?: Record<string, number>; // Add ratings breakdown by star rating
}