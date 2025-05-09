import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tooltip,
  useTheme,
  Card,
  alpha,
  CircularProgress,
  LinearProgress,
  Badge
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { colors } from '../theme/theme';

/* ----- Stat Card Component ----- */
const StatCardRoot = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  padding: theme.spacing(3),
  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease',
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: alpha('#FFFFFF', 0.95),
  '&:hover': {
    boxShadow: '0 10px 24px rgba(0, 0, 0, 0.1)',
    transform: 'translateY(-4px)',
  },
}));

const StatTitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.85rem',
  color: alpha(colors.darkGray, 0.7),
  fontWeight: 500,
  marginBottom: theme.spacing(1),
}));

const StatValue = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 600,
  marginBottom: theme.spacing(1),
  display: 'flex',
  alignItems: 'flex-end',
}));

const StatChangeIndicator = styled(Box)<{ positive?: boolean }>(({ positive, theme }) => ({
  display: 'flex',
  alignItems: 'center',
  fontSize: '0.85rem',
  color: positive ? colors.success : colors.error,
  fontWeight: 500,
  padding: theme.spacing(0.5, 1),
  borderRadius: 4,
  backgroundColor: positive ? alpha(colors.success, 0.1) : alpha(colors.error, 0.1),
}));

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: {
    value: string | number;
    positive: boolean;
  };
  footer?: React.ReactNode;
  tooltip?: string;
  color?: 'success' | 'error' | 'warning' | 'info' | 'default';
  animationDelay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  footer,
  tooltip,
  color = 'default',
  animationDelay = 0,
}) => {
  const colorMap = {
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
    info: colors.accent2,
    default: colors.primary,
  };

  const iconColor = colorMap[color];

  const cardContent = (
    <StatCardRoot>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        mb: 2 
      }}>
        <Box>
          <StatTitle>{title}</StatTitle>
          <StatValue>
            {value}
            {change && (
              <Box sx={{ ml: 1, fontSize: '1rem', display: 'flex', alignItems: 'center' }}>
                <StatChangeIndicator positive={change.positive}>
                  {change.positive ? '+' : ''}{change.value}
                </StatChangeIndicator>
              </Box>
            )}
          </StatValue>
        </Box>
        {icon && (
          <Box sx={{ 
            color: iconColor,
            backgroundColor: alpha(iconColor, 0.1),
            p: 1,
            borderRadius: 2,
            display: 'flex' 
          }}>
            {icon}
          </Box>
        )}
      </Box>

      {footer && (
        <Box sx={{ mt: 'auto' }}>
          {footer}
        </Box>
      )}
    </StatCardRoot>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: 0.1 * animationDelay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {tooltip ? (
        <Tooltip title={tooltip} arrow placement="top">
          {cardContent}
        </Tooltip>
      ) : (
        cardContent
      )}
    </motion.div>
  );
};

/* ----- Bar Chart Component ----- */
interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  maxValue?: number;
  height?: number;
  showValues?: boolean;
  tooltips?: boolean;
  animate?: boolean;
  animationDelay?: number;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  maxValue: propMaxValue,
  height = 200,
  showValues = true,
  tooltips = true,
  animate = true,
  animationDelay = 0,
}) => {
  const theme = useTheme();
  const maxValue = propMaxValue || Math.max(...data.map(item => item.value));

  return (
    <Box sx={{ height, display: 'flex', alignItems: 'flex-end', gap: 1 }}>
      {data.map((item, index) => {
        const percentage = (item.value / maxValue) * 100;
        const barColor = item.color || colors.primary;
        
        return (
          <motion.div
            key={`${item.label}-${index}`}
            initial={animate ? { height: 0 } : { height: `${percentage}%` }}
            animate={{ height: `${percentage}%` }}
            transition={{
              duration: 0.7,
              delay: animate ? animationDelay + index * 0.1 : 0,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            style={{
              flex: 1,
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {tooltips ? (
              <Tooltip 
                title={`${item.label}: ${item.value}`} 
                arrow 
                placement="top"
              >
                <Box
                  sx={{
                    width: '100%',
                    background: barColor,
                    borderRadius: '4px 4px 0 0',
                    height: '100%',
                    minHeight: 4,
                    cursor: 'pointer',
                    '&:hover': {
                      opacity: 0.8,
                      transform: 'scaleY(1.03)',
                      transformOrigin: 'bottom',
                    },
                    transition: 'all 0.2s ease',
                  }}
                />
              </Tooltip>
            ) : (
              <Box
                sx={{
                  width: '100%',
                  background: barColor,
                  borderRadius: '4px 4px 0 0',
                  height: '100%',
                  minHeight: 4,
                }}
              />
            )}
            {showValues && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: animate ? animationDelay + index * 0.1 + 0.3 : 0 }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    mt: 1,
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    color: theme.palette.text.secondary,
                    textAlign: 'center',
                    width: '100%',
                  }}
                >
                  {item.label}
                </Typography>
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </Box>
  );
};

/* ----- Progress Indicators ----- */
// Circular Progress with value display
interface CircularProgressWithLabelProps {
  value: number;
  size?: number;
  thickness?: number;
  color?: 'success' | 'error' | 'warning' | 'info' | 'primary';
  tooltipText?: string;
  animate?: boolean;
  animationDelay?: number;
}

export const CircularProgressWithLabel: React.FC<CircularProgressWithLabelProps> = ({
  value,
  size = 80,
  thickness = 4,
  color = 'primary',
  tooltipText,
  animate = true,
  animationDelay = 0,
}) => {
  const colorMap = {
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
    info: colors.accent2,
    primary: colors.primary,
  };

  // Determine color based on value if not explicitly set
  const autoColor = value >= 70 ? 'success' : value >= 40 ? 'warning' : 'error';
  const progressColor = color === 'primary' ? autoColor : color;
  
  const progressComponent = (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      {animate ? (
        <motion.div
          initial={{ opacity: 0, rotate: -90 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ duration: 0.5, delay: animationDelay }}
        >
          <CircularProgress
            variant="determinate"
            value={0} // Start from 0
            size={size}
            thickness={thickness}
            sx={{ color: colorMap[progressColor] }}
          />
        </motion.div>
      ) : null}
      <motion.div
        initial={{ opacity: animate ? 0 : 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: animate ? animationDelay + 0.2 : 0 }}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <CircularProgress
          variant="determinate"
          value={animate ? 0 : value} // Start from 0 if animating
          size={size}
          thickness={thickness}
          sx={{ color: colorMap[progressColor] }}
          {...(animate && {
            component: motion.svg,
            animate: { strokeDashoffset: 100 - value },
            transition: { duration: 1, delay: animationDelay + 0.3 },
          })}
        />
      </motion.div>
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: animate ? animationDelay + 0.4 : 0 }}
        >
          <Typography
            variant="caption"
            component="div"
            sx={{ fontWeight: 600, fontSize: size / 5 }}
          >
            {`${Math.round(value)}%`}
          </Typography>
        </motion.div>
      </Box>
    </Box>
  );

  if (tooltipText) {
    return (
      <Tooltip title={tooltipText} arrow placement="top">
        {progressComponent}
      </Tooltip>
    );
  }

  return progressComponent;
};

// Linear Progress with label
interface LinearProgressWithLabelProps {
  value: number;
  label?: string;
  height?: number;
  color?: 'success' | 'error' | 'warning' | 'info' | 'primary';
  showPercentage?: boolean;
  tooltipText?: string;
  animate?: boolean;
  animationDelay?: number;
}

export const LinearProgressWithLabel: React.FC<LinearProgressWithLabelProps> = ({
  value,
  label,
  height = 10,
  color = 'primary',
  showPercentage = true,
  tooltipText,
  animate = true,
  animationDelay = 0,
}) => {
  const colorMap = {
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
    info: colors.accent2,
    primary: colors.primary,
  };

  // Determine color based on value if not explicitly set
  const autoColor = value >= 70 ? 'success' : value >= 40 ? 'warning' : 'error';
  const progressColor = color === 'primary' ? autoColor : color;

  const progressBar = (
    <Box sx={{ width: '100%' }}>
      {label && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          {showPercentage && (
            <Typography variant="body2" color="text.secondary">
              {`${Math.round(value)}%`}
            </Typography>
          )}
        </Box>
      )}
      <Box sx={{ width: '100%', position: 'relative' }}>
        <LinearProgress
          variant="determinate"
          value={animate ? 0 : value}
          sx={{
            height,
            borderRadius: height / 2,
            bgcolor: alpha(colorMap[progressColor], 0.15),
            '& .MuiLinearProgress-bar': {
              borderRadius: height / 2,
              bgcolor: colorMap[progressColor],
            },
          }}
          {...(animate && {
            component: motion.div,
            animate: { width: `${value}%` },
            transition: { duration: 0.8, delay: animationDelay, ease: [0.25, 0.1, 0.25, 1] },
          })}
        />
      </Box>
    </Box>
  );

  if (tooltipText) {
    return (
      <Tooltip title={tooltipText} arrow placement="top">
        <Box sx={{ width: '100%' }}>{progressBar}</Box>
      </Tooltip>
    );
  }

  return progressBar;
};

/* ----- Tooltip Components ----- */
interface InteractiveTooltipProps {
  title: string | React.ReactNode;
  children: React.ReactElement;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

export const InteractiveTooltip: React.FC<InteractiveTooltipProps> = ({
  title,
  children,
  placement = 'top',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Tooltip
      title={title}
      arrow
      placement={placement}
      open={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      componentsProps={{
        tooltip: {
          sx: {
            borderRadius: 2,
            bgcolor: alpha('#1E293B', 0.95),
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            px: 2,
            py: 1.5,
            maxWidth: 320,
          },
        },
        arrow: {
          sx: {
            color: alpha('#1E293B', 0.95),
          },
        },
      }}
      TransitionProps={{
        timeout: 300,
      }}
    >
      <Box 
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        sx={{ cursor: 'pointer', display: 'inline-block' }}
      >
        {children}
      </Box>
    </Tooltip>
  );
};