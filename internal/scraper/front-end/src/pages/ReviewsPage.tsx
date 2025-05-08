import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box,  
  TextField, InputAdornment, MenuItem,
  Select, FormControl, InputLabel, SelectChangeEvent,
  Chip, CircularProgress, Pagination, Card,
  IconButton, Tooltip, Divider
} from '@mui/material';
import Grid from '../components/GridWrapper';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import RefreshIcon from '@mui/icons-material/Refresh';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';
import ReviewCard from '../components/ReviewCard';
import AnimatedButton from '../components/AnimatedButton';
import { Review, Platform, Department, Sentiment, Product } from '../types/reviews';
import { reviewService } from '../services/reviewService';
import { colors } from '../theme/theme';

// Styled components
const HeaderBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
  }
}));

const GradientText = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundImage: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent2} 100%)`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  marginBottom: theme.spacing(0.5),
}));

const FilterContainer = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  borderRadius: '16px',
  background: colors.cardBg,
}));

const FilterChip = styled(Chip)<{ isactive: string }>(({ isactive, theme }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: isactive === 'true' ? colors.primary : 'transparent',
  color: isactive === 'true' ? '#FFFFFF' : colors.darkGray,
  borderColor: isactive === 'true' ? 'transparent' : colors.borderColor,
  borderRadius: '16px',
  fontWeight: 500,
  padding: '4px',
  '&:hover': {
    backgroundColor: isactive === 'true' ? colors.primary : 'rgba(0, 114, 198, 0.08)',
  }
}));

const PlaceholderMenuItem = styled(MenuItem)(({ theme }) => ({
  fontSize: '0.95rem',
  fontWeight: 400,
  color: theme.palette.text.primary,
  padding: theme.spacing(1.2, 2),
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
}));

const StyledSelect = styled(Select<string>)(({ theme }) => ({
  '& .MuiSelect-select': {
    padding: theme.spacing(1.5, 2),
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: '0.95rem',
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    padding: theme.spacing(0.8, 2),
    boxShadow: 'none',
  },
  '& .MuiOutlinedInput-input': {
    padding: theme.spacing(0.8, 0),
    fontSize: '0.95rem',
  }
}));

const LoaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(10),
  gap: theme.spacing(2)
}));

const PaginationContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  padding: theme.spacing(4, 0),
}));

const AnimatedCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  background: colors.cardBg,
  padding: theme.spacing(4),
  transition: 'all 0.3s ease',
  marginTop: theme.spacing(4)
}));

const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | ''>('');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | ''>('');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | ''>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;

  // Available filters
  const platforms: Platform[] = ['Gartner', 'G2', 'TrustRadius', 'PeerSpot', 'Reddit', 'Spiceworks Community', 'LinkedIn / Medium / Blogs'];
  const departments: Department[] = ['Product', 'Support', 'Sales', 'Marketing', 'Engineering', 'General'];
  const sentiments: Sentiment[] = ['Positive', 'Neutral', 'Negative'];
  const products: Product[] = ['BloxOne DDI', 'NIOS', 'BloxOne Threat Defense', 'BloxOne DNS', 'BloxOne DHCP', 'BloxOne IPAM', 'BloxOne Platform', 'BloxOne Cloud Network Automation'];

  // Fetch reviews on component load and when filters change
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const filters: {
          platform?: Platform,
          department?: Department,
          sentiment?: string,
          searchTerm?: string,
          product?: Product
        } = {};

        if (selectedPlatform) filters.platform = selectedPlatform;
        if (selectedDepartment) filters.department = selectedDepartment;
        if (selectedSentiment) filters.sentiment = selectedSentiment;
        if (searchTerm) filters.searchTerm = searchTerm;
        if (selectedProduct) filters.product = selectedProduct;

        const data = await reviewService.getReviews(Object.keys(filters).length > 0 ? filters : undefined);
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [selectedPlatform, selectedDepartment, selectedSentiment, searchTerm, selectedProduct]);

  // Handle filter changes
  const handlePlatformChange = (event: SelectChangeEvent<string>) => {
    setSelectedPlatform(event.target.value as Platform | '');
    setCurrentPage(1);
  };

  const handleDepartmentChange = (event: SelectChangeEvent<string>) => {
    setSelectedDepartment(event.target.value as Department | '');
    setCurrentPage(1);
  };

  const handleSentimentFilter = (sentiment: string) => {
    setSelectedSentiment(selectedSentiment === sentiment ? '' : sentiment);
    setCurrentPage(1);
  };

  const handleProductChange = (event: SelectChangeEvent<string>) => {
    setSelectedProduct(event.target.value as Product | '');
    setCurrentPage(1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleReviewClick = (review: Review) => {
    console.log('Review clicked:', review);
    // Can be expanded to show a detailed view or modal
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Pagination
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const clearFilters = () => {
    setSelectedPlatform('');
    setSelectedDepartment('');
    setSelectedSentiment('');
    setSelectedProduct('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <HeaderBox>
          <GradientText variant="h3">
            Reviews
          </GradientText>
        </HeaderBox>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <FilterContainer>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <FilterListIcon sx={{ mr: 1, color: colors.primary }} />
            <Typography variant="h6">Filters</Typography>
            <Box sx={{ flexGrow: 1 }} />
            <AnimatedButton
              variant="outlined"
              size="small"
              onClick={clearFilters}
            >
              Clear Filters
            </AnimatedButton>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel id="platform-label">Platform</InputLabel>
                <StyledSelect
                  labelId="platform-label"
                  value={selectedPlatform}
                  label="Platform"
                  onChange={handlePlatformChange}
                  displayEmpty
                >
                  <PlaceholderMenuItem value="">
                    All Platforms
                  </PlaceholderMenuItem>
                  {platforms.map((platform) => (
                    <MenuItem key={platform} value={platform}>{platform}</MenuItem>
                  ))}
                </StyledSelect>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel id="department-label">Department</InputLabel>
                <StyledSelect
                  labelId="department-label"
                  value={selectedDepartment}
                  label="Department"
                  onChange={handleDepartmentChange}
                  displayEmpty
                >
                  <PlaceholderMenuItem value="">
                    All Departments
                  </PlaceholderMenuItem>
                  {departments.map((department) => (
                    <MenuItem key={department} value={department}>{department}</MenuItem>
                  ))}
                </StyledSelect>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel id="product-label">Product</InputLabel>
                <StyledSelect
                  labelId="product-label"
                  value={selectedProduct}
                  label="Product"
                  onChange={handleProductChange}
                  displayEmpty
                >
                  <PlaceholderMenuItem value="">
                    All Products
                  </PlaceholderMenuItem>
                  {products.map((product) => (
                    <MenuItem key={product} value={product}>{product}</MenuItem>
                  ))}
                </StyledSelect>
              </FormControl>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Sentiment:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
              {sentiments.map((sentiment) => (
                <motion.div
                  key={sentiment}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FilterChip
                    label={sentiment}
                    isactive={(selectedSentiment === sentiment).toString()}
                    variant={selectedSentiment === sentiment ? "filled" : "outlined"}
                    onClick={() => handleSentimentFilter(sentiment)}
                  />
                </motion.div>
              ))}
            </Box>
          </Box>
        </FilterContainer>
      </motion.div>

      {loading ? (
        <LoaderContainer>
          <CircularProgress size={60} thickness={4} sx={{ color: colors.accent2 }} />
        </LoaderContainer>
      ) : reviews.length > 0 ? (
        <>
          <AnimatePresence>
            <Grid container spacing={3}>
              {currentReviews.map((review, index) => (
                <Grid item xs={12} md={6} key={review.id}>
                  <Box>
                    <ReviewCard 
                      review={review} 
                      index={index} 
                      onClick={handleReviewClick}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </AnimatePresence>
          
          {totalPages > 1 && (
            <PaginationContainer>
              <Pagination 
                count={totalPages} 
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': {
                    fontWeight: 'bold',
                  }
                }}
              />
            </PaginationContainer>
          )}
        </>
      ) : (
        <AnimatedCard sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No reviews found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Try adjusting your filters or search criteria
          </Typography>
        </AnimatedCard>
      )}
    </Container>
  );
};

export default ReviewsPage;