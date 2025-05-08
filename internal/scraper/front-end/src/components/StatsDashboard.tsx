import React, { useEffect, useState } from 'react';
import { Box, Typography, Chip, Card, Divider, Tooltip } from '@mui/material';
import Grid from './GridWrapper';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { ReviewStats, Platform, Department, Product } from '../types/reviews';
import { colors } from '../theme/theme';

// Styled components
const StatsCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(3),
  borderRadius: '16px',
  background: 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.05)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.08)',
  }
}));

const StatValue = styled(motion.div)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 'bold',
  backgroundImage: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent2} 100%)`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  textShadow: '0px 2px 4px rgba(0, 0, 0, 0.08)'
}));

const TrendChip = styled(Chip)<{ trend: 'up' | 'down' | 'stable' }>(({ trend }) => {
  const trendColors = {
    up: '#27AE60',
    down: '#E74C3C',
    stable: colors.accent2
  };
  
  return {
    backgroundColor: trendColors[trend],
    color: '#FFFFFF',
    fontWeight: 'bold',
    height: '26px',
    fontSize: '0.8rem'
  };
});

// Bar chart component
const BarChart = styled(Box)<{ value: number, max: number, color: string }>(
  ({ value, max, color }) => ({
    position: 'relative',
    height: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderRadius: '5px',
    overflow: 'hidden',
    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: `${Math.min(100, (value / max) * 100)}%`,
      backgroundColor: color,
      borderRadius: '5px'
    }
  })
);

const BarLabel = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '6px',
  fontSize: '0.85rem'
});

const CardTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.25rem',
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1)
}));

const StatsSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3)
}));

const StatsSummary = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(2),
}));

const TopItemRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(1.5),
}));

const TopItemLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  color: colors.darkGray,
  fontSize: '0.9rem',
}));

const TopItemValue = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: colors.primary,
  fontSize: '0.9rem',
}));

const CountRow = styled(Box)(({ theme }) => ({
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center',
  padding: theme.spacing(0.5, 0),
}));

interface StatsDashboardProps {
  stats: ReviewStats;
}

const StatsDashboard: React.FC<StatsDashboardProps> = ({ stats }) => {
  const [counters, setCounters] = useState({
    total: 0,
    positive: 0,
    neutral: 0,
    negative: 0
  });
  
  // Animated counting effect
  useEffect(() => {
    const duration = 1500;
    const frameRate = 30;
    const frames = duration / (1000 / frameRate);
    let frame = 0;
    
    const timer = setInterval(() => {
      frame++;
      const progress = frame / frames;
      
      setCounters({
        total: Math.ceil(progress * stats.totalReviews),
        positive: Math.ceil(progress * stats.positiveCount),
        neutral: Math.ceil(progress * stats.neutralCount),
        negative: Math.ceil(progress * stats.negativeCount)
      });
      
      if (frame === frames) {
        clearInterval(timer);
      }
    }, 1000 / frameRate);
    
    return () => clearInterval(timer);
  }, [stats]);
  
  // Platform statistics
  const maxPlatformCount = Math.max(...Object.values(stats.byPlatform));
  const topPlatform = Object.entries(stats.byPlatform).sort((a, b) => b[1] - a[1])[0] || ['None', 0];
  
  // Department statistics
  const maxDepartmentCount = Math.max(...Object.values(stats.byDepartment));
  const topDepartment = Object.entries(stats.byDepartment).sort((a, b) => b[1] - a[1])[0] || ['None', 0];
  
  // Product statistics
  const maxProductCount = Math.max(...Object.values(stats.byProduct));
  const topProduct = Object.entries(stats.byProduct).sort((a, b) => b[1] - a[1])[0] || ['None', 0];
  
  // Department colors for consistent coloring
  const departmentColors: Record<Department, string> = {
    'Product': '#3498DB', 
    'Engineering': '#8E44AD',
    'Support': '#F39C12',
    'Sales': '#E74C3C',
    'Marketing': '#2ECC71',
    'General': colors.mediumGray
  };
  
  // Platform colors for consistent coloring
  const platformColors: Record<Platform, string> = {
    'G2': '#FF492C',
    'Gartner': '#EC407A',
    'TrustRadius': '#59A7D7',
    'PeerSpot': '#673AB7',
    'Reddit': '#FF4500',
    'Spiceworks Community': '#26A69A',
    'LinkedIn / Medium / Blogs': '#1976D2'
  };
  
  // Product colors for consistent coloring
  const productColors: Record<Product, string> = {
    'BloxOne DDI': '#27AE60', 
    'NIOS': '#D35400',
    'BloxOne Threat Defense': '#8E44AD',
    'BloxOne DNS': '#C0392B',
    'BloxOne DHCP': '#2980B9',
    'BloxOne IPAM': '#16A085',
    'BloxOne Platform': '#2C3E50',
    'BloxOne Cloud Network Automation': '#3498DB'
  };

  // Rating stars component
  const ratingStars = () => {
    const rating = stats.averageRating;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {[...Array(5)].map((_, i) => (
          <Box 
            key={i}
            component={motion.div}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            sx={{ 
              color: i < fullStars ? colors.accent1 : (i === fullStars && hasHalfStar ? colors.accent2 : colors.mediumGray),
              fontSize: '1.8rem', 
              mr: 0.5,
              display: 'inline-flex',
            }}
          >
            {i < fullStars ? '★' : (i === fullStars && hasHalfStar ? '★' : '☆')}
          </Box>
        ))}
        <Typography variant="h6" sx={{ ml: 1 }}>{rating.toFixed(1)}</Typography>
      </Box>
    );
  };

  return (
    <Grid container spacing={3}>
      {/* Top Row */}
      <Grid item xs={12} md={6} lg={3}>
        <StatsCard>
          <CardTitle>
            Reviews Summary
            <Tooltip title="Total reviews across all platforms">
              <Box 
                component="span" 
                sx={{ 
                  display: 'inline-flex',
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  fontSize: '0.7rem',
                  border: `1px solid ${colors.mediumGray}`,
                  color: colors.mediumGray,
                  alignItems: 'center',
                  justifyContent: 'center',
                  ml: 1,
                  cursor: 'help',
                }}
              >
                ?
              </Box>
            </Tooltip>
          </CardTitle>
          
          <StatsSummary>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Total Reviews
              </Typography>
              <StatValue
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {counters.total}
              </StatValue>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
              <Box sx={{ minWidth: 80 }}>
                <Typography variant="body2" color="text.secondary">
                  Positive
                </Typography>
                <Typography variant="h6" sx={{ color: '#27AE60', fontWeight: 'bold' }}>
                  {counters.positive}
                </Typography>
              </Box>
              <Box sx={{ minWidth: 80 }}>
                <Typography variant="body2" color="text.secondary">
                  Neutral
                </Typography>
                <Typography variant="h6" sx={{ color: colors.accent2, fontWeight: 'bold' }}>
                  {counters.neutral}
                </Typography>
              </Box>
              <Box sx={{ minWidth: 80 }}>
                <Typography variant="body2" color="text.secondary">
                  Negative
                </Typography>
                <Typography variant="h6" sx={{ color: '#E74C3C', fontWeight: 'bold' }}>
                  {counters.negative}
                </Typography>
              </Box>
            </Box>
          </StatsSummary>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
            <Typography variant="subtitle1">Recent Trend</Typography>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
            >
              <TrendChip 
                label={stats.recentTrend === 'up' ? '↑ Improving' : stats.recentTrend === 'down' ? '↓ Declining' : '→ Stable'} 
                trend={stats.recentTrend}
              />
            </motion.div>
          </Box>
        </StatsCard>
      </Grid>
      
      {/* Average rating card */}
      <Grid item xs={12} md={6} lg={3}>
        <StatsCard>
          <CardTitle>
            Average Rating
          </CardTitle>
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            flex: 1, 
            alignItems: 'center' 
          }}>
            {ratingStars()}
            
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.8, duration: 1 }}
              style={{ 
                height: 4, 
                background: `linear-gradient(90deg, ${colors.accent1}, ${colors.accent2})`,
                borderRadius: 2,
                marginTop: 16
              }} 
            />
            
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ mt: 1.5, mb: 1 }}
            >
              Based on {stats.totalReviews} reviews
            </Typography>

            <Box sx={{ mt: 'auto', pt: 2, width: '100%' }}>
              <CountRow>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#27AE60', mr: 1 }} />
                  <Typography variant="body2">5 stars</Typography>
                </Box>
                <Typography variant="body2" fontWeight="500">
                  {stats.ratingsBreakdown?.['5'] || 0}
                </Typography>
              </CountRow>

              <CountRow>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: colors.accent1, mr: 1 }} />
                  <Typography variant="body2">4 stars</Typography>
                </Box>
                <Typography variant="body2" fontWeight="500">
                  {stats.ratingsBreakdown?.['4'] || 0}
                </Typography>
              </CountRow>

              <CountRow>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: colors.accent2, mr: 1 }} />
                  <Typography variant="body2">3 stars</Typography>
                </Box>
                <Typography variant="body2" fontWeight="500">
                  {stats.ratingsBreakdown?.['3'] || 0}
                </Typography>
              </CountRow>

              <CountRow>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#FFC107', mr: 1 }} />
                  <Typography variant="body2">2 stars</Typography>
                </Box>
                <Typography variant="body2" fontWeight="500">
                  {stats.ratingsBreakdown?.['2'] || 0}
                </Typography>
              </CountRow>

              <CountRow>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#E74C3C', mr: 1 }} />
                  <Typography variant="body2">1 star</Typography>
                </Box>
                <Typography variant="body2" fontWeight="500">
                  {stats.ratingsBreakdown?.['1'] || 0}
                </Typography>
              </CountRow>
            </Box>
          </Box>
        </StatsCard>
      </Grid>
      
      {/* Platform breakdown */}
      <Grid item xs={12} md={6} lg={3}>
        <StatsCard>
          <CardTitle>
            Platform Breakdown
            <Chip 
              label={`Top: ${topPlatform[0]}`} 
              size="small" 
              sx={{ 
                ml: 1, 
                backgroundColor: (platformColors as any)[topPlatform[0]] || colors.primary,
                color: '#fff', 
                fontSize: '0.75rem',
                height: '20px'
              }} 
            />
          </CardTitle>
          
          <Box>
            {Object.entries(stats.byPlatform).map(([platform, count], index) => (
              <Box key={platform} sx={{ mb: 2 }}>
                <BarLabel>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box 
                      sx={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%', 
                        backgroundColor: (platformColors as any)[platform] || colors.primary,
                        display: 'inline-block',
                        mr: 1
                      }}
                    />
                    {platform}
                  </Typography>
                  <Typography variant="body2" fontWeight="500">{count}</Typography>
                </BarLabel>
                <motion.div
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
                >
                  <BarChart 
                    value={count} 
                    max={maxPlatformCount}
                    color={(platformColors as any)[platform] || colors.primary}
                  />
                </motion.div>
              </Box>
            ))}
          </Box>
        </StatsCard>
      </Grid>
      
      {/* Department breakdown */}
      <Grid item xs={12} md={6} lg={3}>
        <StatsCard>
          <CardTitle>
            Department Breakdown
            <Chip 
              label={`Top: ${topDepartment[0]}`} 
              size="small" 
              sx={{ 
                ml: 1, 
                backgroundColor: (departmentColors as any)[topDepartment[0]] || colors.primary,
                color: '#fff', 
                fontSize: '0.75rem',
                height: '20px'
              }} 
            />
          </CardTitle>
          
          <Box>
            {Object.entries(stats.byDepartment).map(([dept, count], index) => (
              <Box key={dept} sx={{ mb: 2 }}>
                <BarLabel>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box 
                      sx={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%', 
                        backgroundColor: (departmentColors as any)[dept] || colors.primary,
                        display: 'inline-block',
                        mr: 1
                      }}
                    />
                    {dept}
                  </Typography>
                  <Typography variant="body2" fontWeight="500">{count}</Typography>
                </BarLabel>
                <motion.div
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
                >
                  <BarChart 
                    value={count} 
                    max={maxDepartmentCount}
                    color={(departmentColors as any)[dept] || colors.primary}
                  />
                </motion.div>
              </Box>
            ))}
          </Box>
        </StatsCard>
      </Grid>
      
      {/* Product breakdown */}
      <Grid item xs={12} md={6} lg={6}>
        <StatsCard>
          <CardTitle>
            Product Breakdown
            <Chip 
              label={`Top: ${topProduct[0].split(' ').slice(-1)[0]}`} 
              size="small" 
              sx={{ 
                ml: 1, 
                backgroundColor: (productColors as any)[topProduct[0]] || colors.primary,
                color: '#fff', 
                fontSize: '0.75rem',
                height: '20px'
              }} 
            />
          </CardTitle>
          
          <Box>
            {Object.entries(stats.byProduct).map(([product, count], index) => (
              <Box key={product} sx={{ mb: 2 }}>
                <BarLabel>
                  <Tooltip title={product}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        maxWidth: '200px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <Box 
                        sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%', 
                          backgroundColor: (productColors as any)[product] || colors.primary,
                          display: 'inline-block',
                          mr: 1,
                          flexShrink: 0
                        }}
                      />
                      {product}
                    </Typography>
                  </Tooltip>
                  <Typography variant="body2" fontWeight="500">{count}</Typography>
                </BarLabel>
                <motion.div
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
                >
                  <BarChart 
                    value={count} 
                    max={maxProductCount}
                    color={(productColors as any)[product] || colors.primary}
                  />
                </motion.div>
              </Box>
            ))}
          </Box>
        </StatsCard>
      </Grid>
    </Grid>
  );
};

export default StatsDashboard;