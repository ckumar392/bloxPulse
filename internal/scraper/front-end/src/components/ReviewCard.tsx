import React from 'react';
import { 
  Typography, Box, Chip, Rating, 
  Avatar, Stack, Divider, Card, 
  CardContent, Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { Review } from '../types/reviews';
import { colors } from '../theme/theme';

const ReviewCardContainer = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  background: colors.cardBg,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  height: '100%',
  position: 'relative',
  overflow: 'visible', // Changed from 'hidden' to allow the action indicator to overflow
  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.06)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.1)',
  }
}));

const CardContentStyled = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  paddingTop: theme.spacing(4), // Add more padding to the top to avoid overlap with the action indicator
}));

const PlatformAvatar = styled(Avatar)<{ platform: string }>(({ platform, theme }) => {
  const platformColors: Record<string, string> = {
    'G2': '#FF492C',
    'App Store': '#0D96F6',
    'Google Play': '#01875F',
    'Trustpilot': '#00B67A',
    'Reddit': '#FF4500',
    'Twitter': '#1DA1F2',
    'Gartner': '#EC407A',
    'TrustRadius': '#59A7D7',
    'PeerSpot': '#673AB7',
    'Spiceworks Community': '#26A69A',
    'LinkedIn / Medium / Blogs': '#1976D2',
    'Other': colors.mediumGray
  };
  
  return {
    backgroundColor: platformColors[platform] || colors.primary,
    color: '#FFFFFF',
    width: 40,
    height: 40,
    fontWeight: 'bold',
    fontSize: '0.95rem',
    boxShadow: '0 3px 8px rgba(0, 0, 0, 0.2)'
  };
});

const SentimentIndicator = styled(Box)<{ sentiment: string }>(({ sentiment }) => {
  const sentimentColors: Record<string, string> = {
    'Positive': colors.success,
    'Neutral': colors.accent2,
    'Negative': colors.error
  };
  
  return {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: sentimentColors[sentiment] || colors.mediumGray,
    marginRight: 8,
    boxShadow: `0 0 8px ${sentimentColors[sentiment] || colors.mediumGray}`
  };
});

const HighlightChip = styled(Chip)(({ theme }) => ({
  background: `linear-gradient(135deg, ${colors.accent2} 0%, ${colors.primary} 100%)`,
  color: 'white',
  fontWeight: 500,
  borderRadius: '12px',
  '& .MuiChip-label': {
    fontSize: '0.8rem'
  }
}));

const TagChip = styled(Chip)(({ theme }) => ({
  backgroundColor: 'rgba(0, 114, 198, 0.08)',
  borderColor: 'rgba(0, 114, 198, 0.2)',
  color: colors.darkGray,
  borderRadius: '12px',
  '& .MuiChip-label': {
    fontSize: '0.75rem'
  },
  '&:hover': {
    backgroundColor: 'rgba(0, 114, 198, 0.12)',
  }
}));

const ProductBadge = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: 12,
  right: 12,
  backgroundColor: 'rgba(51, 153, 255, 0.1)',
  borderColor: 'rgba(51, 153, 255, 0.2)',
  color: colors.primary,
  fontWeight: 500,
  fontSize: '0.7rem',
  height: '24px',
}));

const DepartmentBadge = styled(Chip)(({ theme }) => ({
  backgroundColor: 'rgba(141, 198, 63, 0.1)',
  borderColor: 'rgba(141, 198, 63, 0.2)',
  color: colors.accent1Dark,
  fontWeight: 500,
  fontSize: '0.7rem',
  height: '24px',
  marginRight: theme.spacing(1),
}));

const ContentPreview = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 4,
  WebkitBoxOrient: 'vertical',
  position: 'relative',
  color: colors.darkGray,
  fontSize: '0.95rem',
  lineHeight: '1.6',
  flex: '1 0 auto',
}));

const ReviewDate = styled(Typography)(({ theme }) => ({
  color: colors.mediumGray,
  fontSize: '0.8rem',
  display: 'flex',
  alignItems: 'center',
}));

const ReviewHeader = styled(Box)(({ theme }) => ({
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'flex-start', 
  marginBottom: theme.spacing(2),
}));

// New component for the action indicator
const ActionIndicator = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: -12,
  left: 0,
  backgroundColor: colors.error,
  color: 'white',
  borderRadius: '16px',
  padding: '6px 15px',
  fontSize: '0.75rem',
  fontWeight: 'bold',
  boxShadow: '0 3px 6px rgba(244, 67, 54, 0.4)',
  zIndex: 5,
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
}));

interface ReviewCardProps {
  review: Review;
  index: number;
  onClick?: (review: Review) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, index, onClick }) => {
  const getPlatformInitials = (platform: string): string => {
    if (platform === 'App Store') return 'AS';
    if (platform === 'Google Play') return 'GP';
    if (platform === 'LinkedIn / Medium / Blogs') return 'LI';
    if (platform === 'Spiceworks Community') return 'SC';
    if (platform === 'TrustRadius') return 'TR';
    return platform.charAt(0);
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{ height: '100%' }}
    >
      <ReviewCardContainer 
        onClick={() => onClick && onClick(review)}
        sx={{ cursor: onClick ? 'pointer' : 'default' }}
      >
        {review.product && (
          <ProductBadge 
            label={review.product} 
            size="small" 
            variant="outlined"
          />
        )}

        {review.needsAction && (
          <ActionIndicator>Action Required</ActionIndicator>
        )}

        <CardContentStyled>
          <ReviewHeader>
            <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', pl: review.needsAction ? 0 : 0 }}>
              <PlatformAvatar platform={review.platform}>
                {getPlatformInitials(review.platform)}
              </PlatformAvatar>
              <Box sx={{ ml: 2 }}>
                <Typography variant="subtitle1" fontWeight="500" sx={{ lineHeight: 1.2 }}>
                  {review.author || 'Anonymous'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <Tooltip title={review.sentiment}>
                    <SentimentIndicator sentiment={review.sentiment} />
                  </Tooltip>
                  <ReviewDate>
                    {formatDate(review.date)}
                  </ReviewDate>
                </Box>
              </Box>
            </Box>
            {review.rating !== undefined && review.rating > 0 && (
              <Rating 
                value={review.rating} 
                readOnly 
                precision={0.5} 
                size="small"
                sx={{ color: colors.accent1 }}
              />
            )}
          </ReviewHeader>

          <Typography variant="h6" gutterBottom sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
            {review.title || 'Untitled Review'}
          </Typography>
          
          <ContentPreview variant="body2" paragraph>
            {review.content || 'No content available'}
          </ContentPreview>

          <Box sx={{ mt: 'auto', pt: 1, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            {review.department && (
              <DepartmentBadge 
                label={review.department} 
                size="small" 
                variant="outlined"
              />
            )}
          </Box>

          {review.highlights && review.highlights.length > 0 && (
            <>
              <Divider sx={{ my: 2, opacity: 0.6 }} />
              <Typography variant="subtitle2" sx={{ mb: 1, fontSize: '0.85rem', color: colors.mediumGray }}>
                Highlights
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
                {review.highlights.slice(0, 3).map((highlight, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                  >
                    <HighlightChip 
                      label={highlight}
                      size="small"
                    />
                  </motion.div>
                ))}
                
                {review.highlights.length > 3 && (
                  <Tooltip title={review.highlights.slice(3).join(', ')}>
                    <Chip 
                      label={`+${review.highlights.length - 3} more`}
                      size="small"
                      sx={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.05)',
                        fontSize: '0.75rem',
                        height: '24px'
                      }}
                    />
                  </Tooltip>
                )}
              </Stack>
            </>
          )}
          
          {review.tags && review.tags.length > 0 && (
            <>
              <Divider sx={{ my: 2, opacity: 0.6 }} />
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {review.tags.slice(0, 4).map((tag, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + idx * 0.05 }}
                  >
                    <TagChip 
                      label={`#${tag}`}
                      variant="outlined"
                      size="small"
                    />
                  </motion.div>
                ))}
                
                {review.tags.length > 4 && (
                  <Tooltip title={review.tags.slice(4).map(tag => `#${tag}`).join(', ')}>
                    <Chip 
                      label={`+${review.tags.length - 4} more`}
                      size="small"
                      sx={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.05)',
                        fontSize: '0.75rem',
                        height: '24px'
                      }}
                    />
                  </Tooltip>
                )}
              </Stack>
            </>
          )}
        </CardContentStyled>

        {/* Status dot removed - using the Action Required capsule instead */}
      </ReviewCardContainer>
    </motion.div>
  );
};

export default ReviewCard;