import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box,
  Button, CircularProgress, Chip, Grid as MuiGrid,
  Card, CardContent, Divider, Tooltip, IconButton
} from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import StatsDashboard from '../components/StatsDashboard';
import AnimatedButton from '../components/AnimatedButton';
import { ReviewStats, Platform } from '../types/reviews';
import { reviewService } from '../services/reviewService';
import { colors } from '../theme/theme';
import Grid from '../components/GridWrapper';
import RefreshIcon from '@mui/icons-material/Refresh';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

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

const PlatformButton = styled(Button)<{ active: boolean }>(({ active, theme }) => ({
  margin: theme.spacing(0.5),
  borderRadius: '20px',
  padding: '6px 16px',
  transition: 'all 0.3s ease',
  backgroundColor: active ? colors.primary : 'transparent',
  color: active ? '#FFFFFF' : colors.darkGray,
  border: active ? 'none' : `1px solid ${colors.borderColor}`,
  '&:hover': {
    backgroundColor: active ? colors.primaryDark : 'rgba(0, 114, 198, 0.08)',
    transform: 'translateY(-2px)'
  }
}));

const GlassContainer = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '16px',
  background: colors.cardBg,
  backdropFilter: 'blur(10px)',
  borderColor: colors.borderColor,
  marginBottom: theme.spacing(4),
  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.05)',
}));

const ActionButton = styled(Button)(({ theme }) => ({
  padding: '8px 24px',
  borderRadius: '24px',
  boxShadow: '0 4px 14px rgba(0, 114, 198, 0.2)',
  '&:hover': {
    boxShadow: '0 6px 20px rgba(0, 114, 198, 0.3)',
  }
}));

const LoaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(10),
}));

const DashboardContainer = styled(Container)(({ theme }) => ({
  maxWidth: '1280px',
  [theme.breakpoints.up('xl')]: {
    maxWidth: '1400px',
  },
}));

const DashboardPage: React.FC = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrapingInProgress, setScrapingInProgress] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const platforms: Platform[] = [
    'Gartner',
    'G2',
    'TrustRadius',
    'PeerSpot',
    'Reddit',
    'Spiceworks Community',
    'LinkedIn / Medium / Blogs',
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const fetchedStats = await reviewService.getStats();
        setStats(fetchedStats);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const togglePlatform = (platform: Platform) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const startScraping = async () => {
    if (selectedPlatforms.length === 0) return;

    setScrapingInProgress(true);
    setSuccessMessage('');
    
    try {
      // Start the scraping process
      const response = await reviewService.startScraping(selectedPlatforms);
      
      // If scraping started successfully, poll for status
      if (response.success) {
        await pollScrapingStatus();
      } else {
        console.error('Failed to start scraping:', response.message);
        setScrapingInProgress(false);
      }
    } catch (error) {
      console.error('Error starting scraping:', error);
      setScrapingInProgress(false);
    }
  };

  const pollScrapingStatus = async () => {
    try {
      const statusResponse = await reviewService.checkScrapingStatus();
      
      if (statusResponse.completed) {
        setScrapingInProgress(false);
        setSuccessMessage('Reviews have been successfully scraped and processed!');
        
        // Refresh stats after successful scraping
        const refreshedStats = await reviewService.getStats();
        setStats(refreshedStats);
      } else {
        // Not completed yet, poll again in 2 seconds
        setTimeout(pollScrapingStatus, 2000);
      }
    } catch (error) {
      console.error('Error checking scraping status:', error);
      // Even on error, keep trying for some time
      setTimeout(pollScrapingStatus, 3000);
    }
  };

  const handleRefreshStats = async () => {
    try {
      setLoading(true);
      const refreshedStats = await reviewService.getStats();
      setStats(refreshedStats);
      setLoading(false);
    } catch (error) {
      console.error('Error refreshing stats:', error);
      setLoading(false);
    }
  };

  return (
    <DashboardContainer maxWidth={false} sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <HeaderBox>
          <Box>
            <GradientText variant="h3">
              Dashboard
            </GradientText>
            <Typography variant="subtitle1" color="text.secondary">
              Monitor and analyze product reviews across platforms
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Refresh statistics">
              <IconButton 
                onClick={handleRefreshStats} 
                sx={{ mr: 1 }}
                disabled={loading}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <AnimatedButton 
              variant="contained"
              color="primary"
            >
              Export Reports
            </AnimatedButton>
          </Box>
        </HeaderBox>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <GlassContainer>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Box>
              <Typography variant="h5" fontWeight="500" gutterBottom>
                Collect New Reviews
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Select platforms to scrape for new product reviews
              </Typography>
            </Box>
            
            <Tooltip title="Reviews are collected and analyzed automatically">
              <HelpOutlineIcon fontSize="small" color="action" />
            </Tooltip>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', mb: 3 }}>
              {platforms.map((platform) => (
                <motion.div
                  key={platform}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <PlatformButton
                    variant={selectedPlatforms.includes(platform) ? "contained" : "outlined"}
                    active={selectedPlatforms.includes(platform)}
                    onClick={() => togglePlatform(platform)}
                    disabled={scrapingInProgress}
                    size="medium"
                  >
                    {platform}
                  </PlatformButton>
                </motion.div>
              ))}
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ActionButton
                  variant="contained"
                  color="primary"
                  disabled={scrapingInProgress || selectedPlatforms.length === 0}
                  onClick={startScraping}
                  sx={{ 
                    borderRadius: '20px',
                    background: 'linear-gradient(90deg, #8DC63F 0%, #0072C6 100%)'
                  }}
                  startIcon={scrapingInProgress && <CircularProgress size={16} color="inherit" />}
                >
                  {scrapingInProgress ? 'Processing...' : 'Scrape New Reviews'}
                </ActionButton>
              </motion.div>
            </Box>
          </Box>
          
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Box 
                sx={{ 
                  mt: 2, 
                  p: 2, 
                  bgcolor: 'rgba(141, 198, 63, 0.1)', 
                  borderRadius: 2,
                  border: `1px solid ${colors.accent1}`,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Box 
                  component="span"
                  sx={{ 
                    width: 8, 
                    height: 8, 
                    bgcolor: colors.accent1,
                    borderRadius: '50%',
                    display: 'inline-block',
                    mr: 1.5
                  }}
                />
                <Typography color={colors.accent1}>
                  {successMessage}
                </Typography>
              </Box>
            </motion.div>
          )}
        </GlassContainer>
      </motion.div>

      {loading ? (
        <LoaderContainer>
          <CircularProgress size={60} thickness={4} sx={{ color: colors.accent2 }} />
        </LoaderContainer>
      ) : stats ? (
        <StatsDashboard stats={stats} />
      ) : (
        <Box textAlign="center" sx={{ py: 10 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No statistics available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start by collecting reviews from the platforms above
          </Typography>
        </Box>
      )}
    </DashboardContainer>
  );
};

export default DashboardPage;