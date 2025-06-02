'use client';

// Next
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

// MUI
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Box,
  AppBar,
  Toolbar,
  Button,
  IconButton
} from '@mui/material';
import {
  Home as HomeIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  ExitToApp as ExitToAppIcon,
  ArrowBack as ArrowBackIcon,
  AccountCircle as AccountCircleIcon
} from '@mui/icons-material';

// Date
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const menuItems = [
  { text: 'Inicio', icon: <HomeIcon />, path: '/dashboard' },
  { text: 'Doctores', icon: <PeopleIcon />, path: '/dashboard/doctors' },
  { text: 'Horarios', icon: <ScheduleIcon />, path: '/dashboard/schedules' },
  { text: 'Citas Médicas', icon: <CalendarIcon />, path: '/dashboard/appointments' },
  { text: 'Pacientes', icon: <PersonIcon />, path: '/dashboard/patients' }
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const today = format(new Date(), 'EEEE d MMMM yyyy', { locale: es });

  return (
    <div className="flex">
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            backgroundColor: '#f5f5f5'
          }
        }}
      >
        {/* User Info */}
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <AccountCircleIcon />
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              Administrador
            </Typography>
            <Typography variant="body2" color="text.secondary">
              admin@edoc.com
            </Typography>
          </Box>
        </Box>

        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link}
                href={item.path}
                selected={pathname === item.path}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText'
                    }
                  }
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}

          <ListItem disablePadding>
            <ListItemButton onClick={() => signOut()}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Cerrar Sesión" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1 }}>
        {/* Top Bar */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            backgroundColor: 'white',
            color: 'text.primary',
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Toolbar>
            <IconButton size="large" edge="start" color="inherit" aria-label="back" sx={{ mr: 2 }}>
              <ArrowBackIcon />
              <Typography variant="body1" ml={1}>
                Atrás
              </Typography>
            </IconButton>

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body1">{today}</Typography>
              <Typography variant="body1" fontWeight="bold">
                ¡Bienvenido!
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box component="main" sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>
    </div>
  );
}
