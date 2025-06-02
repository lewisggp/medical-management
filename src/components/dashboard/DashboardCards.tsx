'use client';

import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import { LocalHospital, PersonOutline, EventNote, Today } from '@mui/icons-material';
import { Doctor, Patient, Appointment } from '@/generated/prisma';

interface DashboardCardsProps {
  totalDoctors: number;
  totalPatients: number;
  newAppointments: number;
  todayAppointments: number;
}

const DashboardCards = ({ totalDoctors, totalPatients, newAppointments, todayAppointments }: DashboardCardsProps) => {
  const cards = [
    {
      title: 'Doctores',
      value: totalDoctors,
      icon: <LocalHospital sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: '#E3F2FD'
    },
    {
      title: 'Pacientes',
      value: totalPatients,
      icon: <PersonOutline sx={{ fontSize: 40, color: 'success.main' }} />,
      color: '#E8F5E9'
    },
    {
      title: 'Citas Nuevas',
      value: newAppointments,
      icon: <EventNote sx={{ fontSize: 40, color: 'warning.main' }} />,
      color: '#FFF3E0'
    },
    {
      title: 'Citas de Hoy',
      value: todayAppointments,
      icon: <Today sx={{ fontSize: 40, color: 'error.main' }} />,
      color: '#FFEBEE'
    }
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
          <Card sx={{ bgcolor: card.color }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {card.value}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {card.title}
                  </Typography>
                </Box>
                {card.icon}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardCards;
