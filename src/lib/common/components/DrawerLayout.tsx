'use client';
import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ReceiptIcon from '@mui/icons-material/Receipt';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import Anchor from './Anchor';
import ColorModeSelect from './ColorModeSelect';
import Driver from '../icons/driver.svg';
import GateUp from '../icons/gate-up.svg';
import Profile from '../icons/profile.svg';

const drawerWidth = 240;

const DriverIcon = styled(Driver)(({theme}) => ({
  fill: theme.palette.text.primary,
}));
const GateUpIcon = styled(GateUp)(({theme}) => ({
  fill: theme.palette.text.primary,
}));
const ProfileIcon = styled(Profile)(({theme}) => ({
  fill: theme.palette.text.primary,
}));

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({open}) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    }
  ]
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
      },
    },
  ],
}));

export default function DrawerLayout({ children }: any) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                marginRight: 5,
              },
              open && { display: 'none' },
            ]}
          >
          <MenuIcon />
          </IconButton>
          <Box sx={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" noWrap component="div">
              Barkin
            </Typography>
            <ColorModeSelect />
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List sx={{ bgcolor: 'background.default', color: 'text.primary', height: '100%' }}>
          {['Propriedades', 'Motoristas', 'Estacionamento', 'Pedidos', 'Perfil'].map((text, index) => {
            let link = '';
            if (index == 0) {
              link = '/propriedades';
            } else if (index == 1) {
              link = '/motoristas';
            } else if (index == 2) {
              link = '/estacionamento';
            } else if (index == 3) {
              link = '/pedidos';
            } else if (index == 4) {
              link = '/perfil/editar';
            }
            return (
              <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  sx={[
                    {
                      minHeight: 48,
                      px: 2.5,
                    },
                    open
                      ? {
                          justifyContent: 'initial',
                        }
                      : {
                          justifyContent: 'center',
                        },
                  ]}
                >
                  <ListItemIcon
                    sx={[
                      {
                        minWidth: 0,
                        justifyContent: 'center',
                      },
                      open
                        ? {
                            mr: 3,
                          }
                        : {
                            mr: 'auto',
                          },
                    ]}
                  >
                    {index === 0 && (
                      <Anchor href="/propriedades">
                        <MapsHomeWorkIcon fontSize='large' sx={[ (theme) => ({ color: theme.palette.text.primary })]}/>
                      </Anchor>
                    )

                    }
                    {index === 1 && (
                      <Anchor href="/motoristas">
                        <DriverIcon />
                      </Anchor>
                    )}
                    {index === 2 && (
                      <Anchor href="/estacionamento">
                        <GateUpIcon />
                      </Anchor>
                    )}
                    {index === 3 && (
                      <Anchor href="/pedidos">
                        <ReceiptIcon fontSize='large' sx={[ (theme) => ({ color: theme.palette.text.primary }), { marginRight: '4px' }]} />
                      </Anchor>
                    )}
                    {index === 4 && (
                      <Anchor href="/perfil/editar">
                        <ProfileIcon />
                      </Anchor>
                    )}
                  </ListItemIcon>

                  <ListItemText sx={[
                    open
                      ? {
                          opacity: 1,
                        }
                      : {
                          opacity: 0,
                        },
                  ]}>
                    <Anchor
                      sx={{ color: 'black' }}
                      href={link}
                    >
                      {text}
                    </Anchor>
                  </ListItemText>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
