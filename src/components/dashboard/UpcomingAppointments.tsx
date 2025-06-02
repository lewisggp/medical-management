'use client';

import { Appointment } from '@/hooks/useAppointment';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip } from '@mui/material';
import { useRouter } from 'next/navigation';

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
}

const UpcomingAppointments = ({ appointments }: UpcomingAppointmentsProps) => {
  const router = useRouter();

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2">
          Consultas Médicas hasta el miércoles
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          Acceso a una lista de consultas pendientes en los próximos 7 días
        </Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nro. de Cita</TableCell>
              <TableCell>Paciente</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Consulta</TableCell>
              <TableCell>Fecha y Hora</TableCell>
              <TableCell>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment, index) => (
              <TableRow key={appointment.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{appointment.patient.name}</TableCell>
                <TableCell>{appointment.doctor.name}</TableCell>
                <TableCell>{appointment.description}</TableCell>
                <TableCell>
                  {appointment.date.toLocaleDateString()} {appointment.date.toLocaleTimeString()}
                </TableCell>
                <TableCell>
                  <Chip
                    label={appointment.status === 'SCHEDULED' ? 'Programada' : appointment.status === 'COMPLETED' ? 'Completada' : 'Cancelada'}
                    color={appointment.status === 'SCHEDULED' ? 'primary' : appointment.status === 'COMPLETED' ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button variant="contained" onClick={() => router.push('/dashboard/appointments')}>
          Ver todas las citas
        </Button>
      </Box>
    </Box>
  );
};

export default UpcomingAppointments;
