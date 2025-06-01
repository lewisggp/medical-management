'use client';

// Next
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

// MUI
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import {
  Home as HomeIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  ExitToApp as ExitToAppIcon
} from '@mui/icons-material';

// Components
const menuItems = [
  { text: 'Inicio', icon: <HomeIcon />, path: '/dashboard' },
  { text: 'Doctores', icon: <PeopleIcon />, path: '/dashboard/doctors' },
  { text: 'Horarios', icon: <ScheduleIcon />, path: '/dashboard/schedules' },
  { text: 'Citas Médicas', icon: <CalendarIcon />, path: '/dashboard/appointments' },
  { text: 'Pacientes', icon: <PersonIcon />, path: '/dashboard/patients' }
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex">
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box'
          }
        }}
      >
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton component={Link} href={item.path} selected={pathname === item.path}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Cerrar Sesión" onClick={() => signOut()} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
