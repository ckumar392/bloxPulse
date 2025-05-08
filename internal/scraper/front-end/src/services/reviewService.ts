import { Review, ReviewStats, Platform, Department, Product } from '../types/reviews';
import { v4 as uuidv4 } from 'uuid';
import enrichedReviewsData from '../assets/enriched_reviews.json';

// Define the structure of the enriched reviews data
interface EnrichedReview {
  id: number;
  reviewID: number;
  author: string;
  platform: string;
  title: string;
  Postcontent: string;
  replyContents: string;
  timestamp: string;
  tags: string[];
  rating: number;
  sentiment: string;
  department: string;
  product: string;
  needsAction: boolean;
}

// Define mock reviews data
const mockReviews: Review[] = [
  {
    id: uuidv4(),
    title: 'Great product, highly recommend!',
    content: 'This tool has completely transformed how we handle customer feedback. The insights are invaluable.',
    rating: 5,
    date: '2025-04-20T15:32:00Z',
    platform: 'G2',
    sentiment: 'Positive',
    department: 'Product',
    author: 'John Doe',
    url: 'https://www.g2.com/products/review/123456',
    highlights: ['Easy to use', 'Great insights', 'Excellent support'],
    tags: ['analytics', 'customer feedback', 'user-friendly'],
    isProcessed: true
  },
  {
    id: uuidv4(),
    title: 'Could use some improvements',
    content: 'The tool is good overall but has a steep learning curve. Documentation could be better.',
    rating: 3,
    date: '2025-04-18T09:45:00Z',
    platform: 'Gartner',
    sentiment: 'Neutral',
    department: 'Support',
    author: 'Jane Smith',
    url: 'https://www.Gartner.com/review/product/789012',
    highlights: ['Powerful features', 'Complex interface', 'Learning curve'],
    tags: ['documentation', 'usability', 'features'],
    isProcessed: true
  },
  {
    id: uuidv4(),
    title: 'Disappointing experience',
    content: 'The app keeps crashing and support has been unresponsive for days.',
    rating: 1,
    date: '2025-04-17T14:22:00Z',
    platform: 'Spiceworks Community',
    sentiment: 'Negative',
    department: 'Engineering',
    author: 'Mike Johnson',
    url: 'https://apps.apple.com/us/app/product/id345678',
    highlights: ['Crashes frequently', 'Poor support response'],
    tags: ['bugs', 'reliability', 'support'],
    isProcessed: true
  },
  {
    id: uuidv4(),
    title: 'Game-changing tool',
    content: 'This has dramatically improved our workflow. We are seeing a 40% increase in productivity.',
    rating: 5,
    date: '2025-04-15T18:12:00Z',
    platform: 'G2',
    sentiment: 'Positive',
    department: 'Product',
    author: 'Sarah Williams',
    url: 'https://www.g2.com/products/review/567890',
    highlights: ['Productivity boost', 'Time-saving', 'Intuitive'],
    tags: ['efficiency', 'workflow', 'productivity'],
    isProcessed: true
  },
  {
    id: uuidv4(),
    title: 'Not worth the price',
    content: 'Too expensive for what it offers. There are better alternatives at half the price.',
    rating: 2,
    date: '2025-04-14T10:05:00Z',
    platform: 'Gartner',
    sentiment: 'Negative',
    department: 'Sales',
    author: 'Robert Brown',
    url: 'https://www.Gartner.com/review/product/234567',
    highlights: ['Overpriced', 'Better alternatives'],
    tags: ['pricing', 'value', 'competition'],
    isProcessed: true
  },
  {
    id: uuidv4(),
    title: 'Solid product with room for improvement',
    content: 'Good feature set but the UI could be more intuitive. Support team is very helpful.',
    rating: 4,
    date: '2025-04-10T13:45:00Z',
    platform: 'Reddit',
    sentiment: 'Positive',
    department: 'Support',
    author: 'u/techreviewer42',
    url: 'https://www.reddit.com/r/SoftwareReviews/comments/abc123',
    highlights: ['Good features', 'Helpful support', 'UI needs work'],
    tags: ['user interface', 'features', 'support'],
    isProcessed: true
  },
  {
    id: uuidv4(),
    title: 'Mixed feelings about this tool',
    content: 'Some features are great, others feel half-baked. The analytics are impressive but exporting is limited.',
    rating: 3,
    date: '2025-04-08T09:30:00Z',
    platform: 'PeerSpot',
    sentiment: 'Neutral',
    department: 'Product',
    author: 'Emily Davis',
    url: 'https://play.google.com/store/apps/details?id=com.product',
    highlights: ['Good analytics', 'Limited exports', 'Inconsistent quality'],
    tags: ['analytics', 'export', 'features'],
    isProcessed: true
  },
];

// Transform the enriched reviews data to match the Review interface
const actualReviews: Review[] = (enrichedReviewsData as EnrichedReview[]).map(review => ({
  id: String(review.id), // Convert to string to match the interface
  title: review.title,
  content: review.Postcontent, // Map Postcontent to content
  rating: review.rating,
  date: review.timestamp, // Map timestamp to date
  platform: review.platform as Platform,
  sentiment: review.sentiment as 'Positive' | 'Neutral' | 'Negative',
  department: review.department as Department,
  product: review.product as Product, // Add the product field from the JSON data
  author: review.author === "NOT GIVEN" ? "Anonymous" : review.author,
  url: '', // No URL in the JSON data, set to empty string
  highlights: [], // No highlights in the JSON data, set to empty array
  tags: review.tags || [],
  isProcessed: !review.needsAction // Inverse of needsAction
}));

// Calculate stats based on the actual reviews
const calculateStats = (): ReviewStats => {
  const positiveCount = actualReviews.filter(r => r.sentiment === 'Positive').length;
  const neutralCount = actualReviews.filter(r => r.sentiment === 'Neutral').length;
  const negativeCount = actualReviews.filter(r => r.sentiment === 'Negative').length;
  
  const totalRating = actualReviews.reduce((sum, review) => sum + (review.rating || 0), 0);
  const reviewsWithRating = actualReviews.filter(r => r.rating !== undefined).length;
  
  const byPlatform: Record<Platform, number> = {
    'Gartner': 0,
    'G2': 0,
    'TrustRadius': 0,
    'PeerSpot': 0,
    'Reddit': 0,
    'Spiceworks Community': 0,
    'LinkedIn / Medium / Blogs': 0
  };
  
  const byDepartment: Record<Department, number> = {
    'Product': 0,
    'Support': 0,
    'Sales': 0,
    'Marketing': 0,
    'Engineering': 0,
    'General': 0
  };
  
  const byProduct: Record<Product, number> = {
    'BloxOne DDI': 0,
    'NIOS': 0,
    'BloxOne Threat Defense': 0,
    'BloxOne DNS': 0,
    'BloxOne DHCP': 0, 
    'BloxOne IPAM': 0,
    'BloxOne Platform': 0,
    'BloxOne Cloud Network Automation': 0
  };
  
  actualReviews.forEach(review => {
    byPlatform[review.platform]++;
    byDepartment[review.department]++;
    
    // Determine product from review content or metadata
    let product: Product = 'BloxOne Platform'; // Default product if nothing specific is detected
    const content = (review.content || '').toLowerCase();
    const title = (review.title || '').toLowerCase();
    const tags = review.tags?.map(tag => tag.toLowerCase()) || [];
    
    // Check if review mentions specific products
    if ((content.includes('bloxone') && content.includes('ddi')) || 
        (title.includes('bloxone') && title.includes('ddi')) || 
        tags.some(tag => tag.includes('ddi'))) {
      product = 'BloxOne DDI';
    } else if (content.includes('nios') || title.includes('nios') || 
              tags.some(tag => tag.includes('nios'))) {
      product = 'NIOS';
    } else if ((content.includes('threat') && content.includes('defense')) || 
              (title.includes('threat') && title.includes('defense')) || 
              tags.some(tag => tag.includes('threat'))) {
      product = 'BloxOne Threat Defense';
    } else if (content.includes('dns') || title.includes('dns') || 
              tags.some(tag => tag.includes('dns'))) {
      product = 'BloxOne DNS';
    } else if (content.includes('dhcp') || title.includes('dhcp') || 
              tags.some(tag => tag.includes('dhcp'))) {
      product = 'BloxOne DHCP';
    } else if (content.includes('ipam') || title.includes('ipam') || 
              tags.some(tag => tag.includes('ipam'))) {
      product = 'BloxOne IPAM';
    } else if ((content.includes('cloud') && content.includes('network')) || 
              (title.includes('cloud') && title.includes('network')) || 
              tags.some(tag => tag.includes('cloud-network'))) {
      product = 'BloxOne Cloud Network Automation';
    } else if (content.includes('bloxone') || title.includes('bloxone') || 
              tags.some(tag => tag.includes('bloxone'))) {
      product = 'BloxOne Platform';
    }
    
    // Use product from the review data if available, otherwise use our detected product
    if (review.product) {
      product = review.product;
    }
    
    byProduct[product]++;
  });
  
  return {
    totalReviews: actualReviews.length,
    positiveCount,
    neutralCount,
    negativeCount,
    averageRating: reviewsWithRating > 0 ? totalRating / reviewsWithRating : 0,
    byPlatform,
    byDepartment,
    byProduct,
    recentTrend: positiveCount > negativeCount ? 'up' : negativeCount > positiveCount ? 'down' : 'stable'
  };
};

const mockStats: ReviewStats = calculateStats();

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Base API URL
const API_BASE_URL = 'http://localhost:3001/api/v1';

export const reviewService = {
  // Get all reviews with optional filtering
  getReviews: async (filters?: {
    platform?: Platform,
    department?: Department,
    sentiment?: string,
    product?: Product,
    searchTerm?: string
  }): Promise<Review[]> => {
    await delay(800); // Simulate API delay
    
    if (!filters) return actualReviews;
    
    return actualReviews.filter(review => {
      if (filters.platform && review.platform !== filters.platform) return false;
      if (filters.department && review.department !== filters.department) return false;
      if (filters.sentiment && review.sentiment !== filters.sentiment) return false;
      if (filters.product && review.product !== filters.product) return false;
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        return (
          review.title.toLowerCase().includes(term) ||
          review.content.toLowerCase().includes(term) ||
          review.author?.toLowerCase().includes(term) ||
          review.tags?.some(tag => tag.toLowerCase().includes(term)) ||
          false
        );
      }
      return true;
    });
  },
  
  // Get a single review by ID
  getReviewById: async (id: string): Promise<Review | null> => {
    await delay(500); // Simulate API delay
    return actualReviews.find(review => review.id === id) || null;
  },
  
  // Update a review's processing status
  updateReviewStatus: async (id: string, isProcessed: boolean): Promise<Review | null> => {
    await delay(700); // Simulate API delay
    const index = actualReviews.findIndex(review => review.id === id);
    if (index !== -1) {
      actualReviews[index] = { ...actualReviews[index], isProcessed };
      return actualReviews[index];
    }
    return null;
  },
  
  // Get statistics about reviews
  getStats: async (): Promise<ReviewStats> => {
    await delay(1000); // Simulate API delay
    return mockStats;
  },
  
  // Start scraping process for selected platforms
  startScraping: async (platforms: Platform[]): Promise<{ success: boolean; message: string }> => {
    try {
      await delay(1000); // Simulate API delay
      
      // Call the existing triggerScraping method
      const result = await reviewService.triggerScraping(platforms);
      
      return {
        success: true,
        message: result.message
      };
    } catch (error) {
      console.error('Error starting scraping:', error);
      return {
        success: false,
        message: 'Failed to start scraping. Please try again.'
      };
    }
  },
  
  // Check the status of an ongoing scraping process
  checkScrapingStatus: async (): Promise<{ completed: boolean; progress: number }> => {
    await delay(800); // Simulate API delay
    
    // Randomly determine if the scraping is complete
    // In a real implementation, this would check the actual job status
    const isComplete = Math.random() > 0.7;
    const progress = isComplete ? 100 : Math.floor(Math.random() * 90) + 10;
    
    return {
      completed: isComplete,
      progress: progress
    };
  },
  
  // Trigger a new scraping job
  triggerScraping: async (platforms: Platform[]): Promise<{ jobId: string, message: string }> => {
    try {
      // Check if G2 is selected
      const hasG2 = platforms.includes('G2');
      
      if (hasG2) {
        // Make an API call to our local Express server
        const response = await fetch(`${API_BASE_URL}/scraping/run/g2`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ platforms }),
        });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        return {
          jobId: data.jobId || uuidv4(),
          message: `Scraping job started. Once complete, please refresh the page to see updated data.`
        };
      } else {
        // For non-G2 platforms
        await delay(1500); // Simulate API delay
        return {
          jobId: uuidv4(),
          message: `Scraping job for platforms: ${platforms.join(', ')} is not fully implemented yet.`
        };
      }
    } catch (error) {
      console.error('Error triggering scraping:', error);
      return {
        jobId: uuidv4(),
        message: 'Error starting scraping job. Please try again later.'
      };
    }
  }
};

export default reviewService;
