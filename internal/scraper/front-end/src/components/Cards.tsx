import React from 'react';
import { 
  Card as MuiCard, 
  CardProps as MuiCardProps,
  CardContent,
  CardHeader,
  CardMedia,
  CardActions,
  Box,
  Grid,
  Typography,
  alpha
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { colors } from '../theme/theme';

// Styled Card component with soft shadows and rounded corners
const StyledCard = styled(MuiCard)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease',
  overflow: 'hidden',
  backgroundColor: alpha('#FFFFFF', 0.95),
  '&:hover': {
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
    transform: 'translateY(-4px)',
  },
}));

// Motion wrapper for animation effects
const AnimateWrapper = styled(motion.div)({
  height: '100%',
  display: 'flex',
});

// Styled Card Header
const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  padding: theme.spacing(3),
  '& .MuiCardHeader-title': {
    fontSize: '1.1rem',
    fontWeight: 600,
  },
  '& .MuiCardHeader-subheader': {
    fontSize: '0.85rem',
    color: alpha(colors.darkGray, 0.7),
  },
}));

// Styled Card Content
const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
  paddingTop: theme.spacing(1),
  '&:last-child': {
    paddingBottom: theme.spacing(3),
  },
}));

// Styled Card Actions
const StyledCardActions = styled(CardActions)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  justifyContent: 'flex-end',
  borderTop: `1px solid ${alpha(colors.borderColor, 0.5)}`,
}));

// Grid container for card layouts
const CardGridContainer = styled(Grid)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(3),
  width: '100%',
}));

// Types and interfaces
interface CardProps extends MuiCardProps {
  elevation?: number;
  animate?: boolean;
  animationDelay?: number;
  title?: string;
  subheader?: string;
  avatar?: React.ReactNode;
  action?: React.ReactNode;
  children?: React.ReactNode;
  media?: {
    image: string;
    height?: number | string;
    alt?: string;
  };
  footer?: React.ReactNode;
}

interface GridCardsLayoutProps {
  children: React.ReactNode;
  columns?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  spacing?: number;
}

// Card component
export const Card: React.FC<CardProps> = ({
  elevation = 0,
  animate = true,
  animationDelay = 0,
  title,
  subheader,
  avatar,
  action,
  children,
  media,
  footer,
  ...props
}) => {
  const content = (
    <StyledCard elevation={elevation} {...props}>
      {(title || subheader || avatar || action) && (
        <StyledCardHeader
          title={title}
          subheader={subheader}
          avatar={avatar}
          action={action}
        />
      )}
      
      {media && (
        <CardMedia
          component="img"
          height={media.height || 180}
          image={media.image}
          alt={media.alt || title}
        />
      )}
      
      {children && <StyledCardContent>{children}</StyledCardContent>}
      
      {footer && <StyledCardActions>{footer}</StyledCardActions>}
    </StyledCard>
  );

  if (!animate) {
    return content;
  }

  return (
    <AnimateWrapper
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: animationDelay * 0.1,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      style={{ height: '100%' }}
    >
      {content}
    </AnimateWrapper>
  );
};

// Grid layout component for cards
export const GridCardsLayout: React.FC<GridCardsLayoutProps> = ({
  children,
  columns = { xs: 1, sm: 2, md: 3, lg: 3, xl: 4 },
  spacing = 3,
}) => {
  // Convert columns to grid template columns CSS
  const gridTemplateColumns = {
    xs: `repeat(${columns.xs || 1}, 1fr)`,
    sm: `repeat(${columns.sm || 2}, 1fr)`,
    md: `repeat(${columns.md || 3}, 1fr)`,
    lg: `repeat(${columns.lg || 3}, 1fr)`,
    xl: `repeat(${columns.xl || 4}, 1fr)`,
  };

  return (
    <CardGridContainer
      sx={{
        gridTemplateColumns,
        gap: spacing,
      }}
    >
      {children}
    </CardGridContainer>
  );
};

// Helper section component for card content organization
export const CardSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '&:last-child': {
    marginBottom: 0,
  },
}));