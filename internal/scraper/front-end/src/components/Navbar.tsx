import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  ButtonProps,
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
  Container
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { Link, LinkProps } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import { colors } from '../theme/theme';

// Styled components
const DarkAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#1E293B', // Dark background
  color: colors.white,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  position: 'sticky',
  top: 0,
  zIndex: theme.zIndex.drawer + 1,
}));

const WhiteLogo = styled('div')({
  fontWeight: 'bold',
  fontSize: '1.6rem',
  color: colors.white,
  display: 'flex',
  alignItems: 'center',
  letterSpacing: '-0.5px',
  '& img': {
    height: '30px',
    marginRight: '12px',
  },
});

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '20px',
  padding: '8px 16px',
  backgroundColor: colors.accent1,
  color: colors.white,
  fontWeight: 600,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: colors.accent1Dark,
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 10px rgba(141, 198, 63, 0.3)',
  },
  transition: 'all 0.3s ease',
}));

const GhostButton = styled(Button)(({ theme }) => ({
  color: colors.white,
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  marginLeft: theme.spacing(2),
  textTransform: 'none',
}));

// Styling for nav links
const NavLinkStyled = styled(Link)(({ theme }) => ({
  color: colors.white,
  fontWeight: 500,
  textDecoration: 'none',
  marginRight: theme.spacing(2),
  padding: theme.spacing(1, 2),
  borderRadius: '8px',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(141, 198, 63, 0.15)',
    textDecoration: 'none',
  }
}));

interface NavbarProps {
  onMenuClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <DarkAppBar>
      <Container maxWidth="xl">
        <Toolbar sx={{ 
          py: 1,
          px: { xs: 1, sm: 2 },
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          {/* Left side - Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <WhiteLogo>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                BloxPulse
              </motion.span>
            </WhiteLogo>
          </Box>
          
          {/* Middle - Navigation (hide on mobile) */}
          {!isMobile && (
            <Box sx={{ display: 'flex', mx: 2, alignItems: 'center' }}>
              <NavLinkStyled to="/">Dashboard</NavLinkStyled>
              <NavLinkStyled to="/reviews">Reviews</NavLinkStyled>
              <NavLinkStyled to="/analytics">Analytics</NavLinkStyled>
              <NavLinkStyled to="/settings">Settings</NavLinkStyled>
            </Box>
          )}
          
          {/* Right side - Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" size="small" sx={{ mr: 1 }}>
              <SearchIcon />
            </IconButton>
            <IconButton color="inherit" size="small" sx={{ mr: 1 }}>
              <NotificationsIcon />
            </IconButton>
            {!isMobile && <GhostButton>Help</GhostButton>}
            <ActionButton variant="contained">
              Get Started
            </ActionButton>
          </Box>
        </Toolbar>
      </Container>
    </DarkAppBar>
  );
};

export default Navbar;