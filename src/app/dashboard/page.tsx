'use client';

import { Box, Container, Typography, CircularProgress } from '@mui/material';
import DashboardCards from '@/components/dashboard/DashboardCards';
import UpcomingAppointments from '@/components/dashboard/UpcomingAppointments';
import useDashboard from '@/hooks/useDashboard';

export default function DashboardPage() {
  const { dashboardData, upcomingAppointments, isLoading, isError } = useDashboard();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Error cargando los datos del dashboard</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <DashboardCards
        totalDoctors={dashboardData.totalDoctors}
        totalPatients={dashboardData.totalPatients}
        newAppointments={dashboardData.newAppointments}
        todayAppointments={dashboardData.todayAppointments}
      />

      <UpcomingAppointments appointments={upcomingAppointments} />
    </Container>
  );
}
