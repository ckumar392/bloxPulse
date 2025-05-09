import React, { useState } from 'react';
import { 
  Box, 
  Drawer, 
  IconButton, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Divider,
  Tooltip,
  Avatar,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CommentIcon from '@mui/icons-material/Comment';
import AnalyticsIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { colors } from '../theme/theme';

// Constants
const DRAWER_WIDTH = 260;
const MINIMIZED_DRAWER_WIDTH = 70;

// Styled components
const SidebarContainer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'open' && prop !== 'isMobile'
})<{ open: boolean; isMobile?: boolean }>(({ theme, open, isMobile }) => ({
  width: open ? DRAWER_WIDTH : MINIMIZED_DRAWER_WIDTH,
  flexShrink: 0,
  transition: 'width 0.3s ease',
  '& .MuiDrawer-paper': {
    width: open ? DRAWER_WIDTH : MINIMIZED_DRAWER_WIDTH,
    boxSizing: 'border-box',
    backgroundColor: '#121A29', // Dark background
    color: '#FFFFFF',
    overflowX: 'hidden',
    borderRight: 'none',
    boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
}));

const NavItemText = styled(ListItemText)(({ theme }) => ({
  '& .MuiTypography-root': {
    fontWeight: 500,
    fontSize: '0.9rem',
    letterSpacing: '0.3px',
  },
  transition: 'opacity 0.3s ease',
}));

const GreenAccent = styled('div')<{ active: boolean }>(({ active, theme }) => ({
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  width: 3,
  backgroundColor: active ? colors.accent1 : 'transparent',
  borderRadius: '0 3px 3px 0',
  transition: 'all 0.3s ease',
}));

const UserProfileSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  backgroundColor: 'rgba(0, 0, 0, 0.15)',
  margin: theme.spacing(1),
  borderRadius: theme.spacing(1),
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: colors.accent1,
  fontWeight: 600,
  boxShadow: '0 3px 6px rgba(141, 198, 63, 0.3)',
}));

const SidebarFooter = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  fontSize: '0.75rem',
  color: 'rgba(255, 255, 255, 0.5)',
  marginTop: theme.spacing(2),
}));

const navItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Reviews', icon: <CommentIcon />, path: '/reviews' },
  { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onToggle }) => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <SidebarContainer 
      variant="permanent"
      open={open}
      isMobile={isMobile}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Sidebar Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: open ? 'flex-end' : 'center',
          p: 1.5,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <IconButton
            onClick={onToggle}
            sx={{
              color: '#FFFFFF',
              '&:hover': {
                backgroundColor: 'rgba(141, 198, 63, 0.15)'
              }
            }}
          >
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Box>

        {/* Navigation Items */}
        <List sx={{ px: 1, py: 2 }}>
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <Tooltip title={open ? '' : item.text} placement="right" arrow>
                  <ListItemButton
                    component={Link}
                    to={item.path}
                    sx={{
                      py: 1.2,
                      px: open ? 2.5 : 2,
                      borderRadius: '8px',
                      backgroundColor: active ? 'rgba(141, 198, 63, 0.15)' : 'transparent',
                      '&:hover': {
                        backgroundColor: active ? 'rgba(141, 198, 63, 0.25)' : 'rgba(255, 255, 255, 0.05)'
                      },
                      position: 'relative',
                      overflow: 'hidden',
                      justifyContent: open ? 'flex-start' : 'center'
                    }}
                  >
                    <GreenAccent active={active} />

                    <ListItemIcon 
                      sx={{ 
                        minWidth: open ? 40 : 'auto', 
                        color: active ? colors.accent1 : 'rgba(255, 255, 255, 0.7)',
                        mr: open ? 2 : 0,
                        justifyContent: 'center',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>

                    <AnimatePresence>
                      {open && (
                        <motion.div
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.3 }}
                          style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                        >
                          <NavItemText primary={item.text} />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {active && (
                      <motion.div
                        layoutId="activeIndicator"
                        style={{
                          position: 'absolute',
                          right: 10,
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor: colors.accent1,
                          display: open ? 'block' : 'none'
                        }}
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            );
          })}
        </List>

        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', my: 1 }} />

        {/* Logout Button */}
        <ListItem disablePadding sx={{ px: 1 }}>
          <ListItemButton 
            sx={{
              py: 1.2, 
              px: open ? 2.5 : 2,
              borderRadius: '8px',
              justifyContent: open ? 'flex-start' : 'center',
              '&:hover': {
                backgroundColor: 'rgba(255, 76, 76, 0.1)'
              },
            }}
          >
            <ListItemIcon 
              sx={{ 
                minWidth: open ? 40 : 'auto',
                color: '#FF6B6B',
                mr: open ? 2 : 0,
                justifyContent: 'center',
              }}
            >
              <LogoutIcon />
            </ListItemIcon>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                >
                  <NavItemText primary="Logout" />
                </motion.div>
              )}
            </AnimatePresence>
          </ListItemButton>
        </ListItem>

        <Box sx={{ flexGrow: 1 }} />

        {/* User Profile Section */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <UserProfileSection>
                <UserAvatar>A</UserAvatar>
                <Box>
                  <Typography variant="subtitle2" noWrap sx={{ color: '#FFFFFF' }}>
                    Admin User
                  </Typography>
                  <Typography variant="caption" noWrap sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    administrator@company.com
                  </Typography>
                </Box>
              </UserProfileSection>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Minimized User Avatar */}
        {!open && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <UserAvatar>A</UserAvatar>
          </Box>
        )}

        {/* Optional Footer */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SidebarFooter>
                BloxPulse v1.2.0
              </SidebarFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </SidebarContainer>
  );
};

export default Sidebar;