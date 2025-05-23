import React, { useState } from 'react';
import { 
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, 
  ListItemText, AppBar, Toolbar, IconButton, Typography,
  useTheme, useMediaQuery, Avatar, Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CommentIcon from '@mui/icons-material/Comment';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import InfoIcon from '@mui/icons-material/Info';
import { colors } from '../theme/theme';
import ParticleBackground from './ParticleBackground';
import InfobloxLogo from '../assets/Infoblox_Logo_Primary_RGB 1.svg';
import BloxPulseLogo from '../assets/bloxpulse-logo.png';

// Constants
const DRAWER_WIDTH = 260;
const CLOSED_DRAWER_WIDTH = 70;

// Styled components
const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: DRAWER_WIDTH,
    boxSizing: 'border-box',
    backgroundColor: colors.cardBg,
    backdropFilter: 'blur(12px)',
    borderRight: `1px solid ${colors.borderColor}`,
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)',
    transition: theme.transitions.create(['width', 'transform'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
  },
}));

const MiniDrawer = styled(Drawer)(({ theme }) => ({
  width: CLOSED_DRAWER_WIDTH,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: CLOSED_DRAWER_WIDTH,
    boxSizing: 'border-box',
    backgroundColor: colors.cardBg,
    backdropFilter: 'blur(12px)',
    borderRight: `1px solid ${colors.borderColor}`,
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)',
    transition: theme.transitions.create(['width', 'transform'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
  },
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: colors.cardBg,
  backdropFilter: 'blur(12px)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
  borderBottom: `1px solid ${colors.borderColor}`,
  color: colors.darkGray,
}));

const Logo = styled('div')({
  fontWeight: 'bold',
  fontSize: '1.6rem',
  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent2} 100%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  display: 'flex',
  alignItems: 'center',
  letterSpacing: '-0.5px',
  '& img': {
    height: '30px',
    marginRight: '12px',
  },
});

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  minHeight: '100vh',
  background: `radial-gradient(circle at 90% 10%, rgba(141, 198, 63, 0.03) 0%, rgba(0, 0, 0, 0) 50%),
               radial-gradient(circle at 10% 90%, rgba(0, 114, 198, 0.03) 0%, rgba(0, 0, 0, 0) 50%)`,
  backgroundAttachment: 'fixed',
}));

const NavItemText = styled(ListItemText)({
  '& .MuiTypography-root': {
    fontWeight: 500,
    fontSize: '0.95rem',
    letterSpacing: '0.2px',
  }
});

const ColorBar = styled('div')<{ active: boolean }>(({ active }) => ({
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  width: 3,
  background: active ? `linear-gradient(to bottom, ${colors.primary}, ${colors.accent2})` : 'transparent',
  borderRadius: '0 4px 4px 0',
  transition: 'all 0.3s ease',
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 36,
  height: 36,
  backgroundColor: colors.primary,
  fontWeight: 'bold',
  fontSize: '0.9rem',
  boxShadow: '0 2px 10px rgba(0, 114, 198, 0.2)',
}));

// Navigation items
const navItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Reviews', icon: <CommentIcon />, path: '/reviews' },
  { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [open, setOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  // Automatically close drawer on mobile
  React.useEffect(() => {
    if (isMobile) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isMobile]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  // Determine if a nav item is active
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const drawer = (
    <>
      <Toolbar sx={{ 
        display: 'flex', 
        justifyContent: open ? 'space-between' : 'center', 
        px: 2,
        height: '70px'
      }}>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Logo>
                <img 
                  src={BloxPulseLogo} 
                  alt="BloxPulse Logo" 
                  style={{ height: '36px', marginRight: '10px' }} 
                />
                <span>BloxPulse</span>
              </Logo>
            </motion.div>
          )}
        </AnimatePresence>
        {!isMobile && (
          <IconButton onClick={handleDrawerToggle} edge="end" 
            sx={{ 
              color: colors.primary,
              backgroundColor: 'rgba(0, 114, 198, 0.05)',
              '&:hover': {
                backgroundColor: 'rgba(0, 114, 198, 0.1)',
              }
            }}
          >
            {open ? <MenuIcon /> : <MenuIcon />}
          </IconButton>
        )}
      </Toolbar>
      <Divider sx={{ opacity: 0.6 }} />
      
      <Box sx={{ mt: 1, px: 1 }}>
        <List>
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  sx={{
                    px: open ? 3 : 'auto',
                    py: 1.2,
                    justifyContent: open ? 'flex-start' : 'center',
                    position: 'relative',
                    borderRadius: '10px',
                    backgroundColor: active ? 'rgba(0, 114, 198, 0.08)' : 'transparent',
                    '&:hover': {
                      backgroundColor: active ? 'rgba(0, 114, 198, 0.12)' : 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  <ColorBar active={active} />
                  <ListItemIcon
                    sx={{
                      color: active ? colors.primary : 'inherit',
                      minWidth: open ? 40 : 'auto',
                      mr: open ? 2 : 'auto',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {open && <NavItemText primary={item.text} />}
                  {active && open && (
                    <motion.div
                      layoutId="activeIndicator"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          right: 16,
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          bgcolor: colors.primary
                        }}
                      />
                    </motion.div>
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
      
      <Box sx={{ flexGrow: 1 }} />
      
      <Divider sx={{ opacity: 0.6, mb: 1 }} />
      
      <Box sx={{ px: 1, mb: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            sx={{
              px: open ? 3 : 'auto',
              py: 1.2,
              justifyContent: open ? 'flex-start' : 'center',
              borderRadius: '10px',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: open ? 40 : 'auto',
                mr: open ? 2 : 'auto',
                justifyContent: 'center',
              }}
            >
              <InfoIcon sx={{ color: colors.mediumGray }} />
            </ListItemIcon>
            {open && <NavItemText primary="Help & Info" />}
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton
            sx={{
              px: open ? 3 : 'auto',
              py: 1.2,
              justifyContent: open ? 'flex-start' : 'center',
              borderRadius: '10px',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: open ? 40 : 'auto',
                mr: open ? 2 : 'auto',
                justifyContent: 'center',
              }}
            >
              <LogoutIcon sx={{ color: colors.error }} />
            </ListItemIcon>
            {open && <NavItemText primary="Logout" />}
          </ListItemButton>
        </ListItem>
      </Box>
      
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          visibility: open ? 'visible' : 'hidden'
        }}
      >
        <UserAvatar>A</UserAvatar>
        {open && (
          <Box>
            <Typography variant="subtitle2" noWrap>
              Admin User
            </Typography>
            <Typography variant="caption" noWrap color="text.secondary">
              Administrator
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <ParticleBackground />
      <StyledAppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ height: '70px' }}>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Box>
            <img 
              src={BloxPulseLogo} 
              alt="BloxPulse Logo" 
              style={{ height: '48px' }} 
            />
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <img 
              src={InfobloxLogo} 
              alt="Infoblox Logo" 
              style={{ height: '24px' }} 
            />
            <UserAvatar sx={{ display: { xs: 'flex', md: 'none' } }}>A</UserAvatar>
          </Box>
        </Toolbar>
      </StyledAppBar>
      
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={open}
          onClose={handleDrawerToggle}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        <>
          {open ? (
            <StyledDrawer variant="permanent" open={open}>
              {drawer}
            </StyledDrawer>
          ) : (
            <MiniDrawer variant="permanent" open={!open}>
              {drawer}
            </MiniDrawer>
          )}
        </>
      )}
      
      <MainContent sx={{ 
        flexGrow: 1, 
        width: { sm: `calc(100% - ${open ? DRAWER_WIDTH : CLOSED_DRAWER_WIDTH}px)` },
        transition: theme.transitions.create(['width'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        pt: { xs: 8, sm: 10 }
      }}>
        <Box component="main" sx={{ pt: 2 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </Box>
      </MainContent>
    </Box>
  );
};

export default Layout;