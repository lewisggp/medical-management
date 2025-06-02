'use client';

import { Appointment } from '@/hooks/useAppointment';
import { Delete, Edit, Visibility } from '@mui/icons-material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Skeleton, IconButton, Box, Chip } from '@mui/material';
import { appointmentStatuses, appointmentTypes } from '@/schemas/Appointment';

interface AppointmentTableProps {
  appointments: Appointment[];
  onEdit: (appointment: Appointment) => void;
  onView: (appointment: Appointment) => void;
  onDelete: (appointment: Appointment) => void;
  isLoading: boolean;
}

// Función para obtener el color según el estado
const getStatusColor = (status: string) => {
  switch (status) {
    case 'SCHEDULED':
      return 'primary';
    case 'COMPLETED':
      return 'success';
    case 'CANCELLED':
      return 'error';
    default:
      return 'default';
  }
};

// Función para obtener el color según el tipo
const getTypeColor = (type: string) => {
  switch (type) {
    case 'GENERAL':
      return 'primary';
    case 'SPECIALIST':
      return 'secondary';
    case 'EMERGENCY':
      return 'error';
    case 'FOLLOW_UP':
      return 'info';
    case 'OTHER':
      return 'warning';
    default:
      return 'default';
  }
};

// Función para obtener la etiqueta del estado
const getStatusLabel = (status: string) => {
  return appointmentStatuses.find((s) => s.value === status)?.label || status;
};

// Función para obtener la etiqueta del tipo
const getTypeLabel = (type: string) => {
  return appointmentTypes.find((t) => t.value === type)?.label || type;
};

const AppointmentTable = ({ appointments, onEdit, onView, onDelete, isLoading }: AppointmentTableProps) => {
  if (isLoading) {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {[...Array(7)].map((_, index) => (
                <TableCell key={index} sx={{ borderBottomColor: 'primary.main' }}>
                  <Skeleton variant="text" />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(5)].map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {[...Array(7)].map((_, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <Skeleton variant="text" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ borderBottomColor: 'primary.main' }}>Paciente</TableCell>
            <TableCell sx={{ borderBottomColor: 'primary.main' }}>Doctor</TableCell>
            <TableCell sx={{ borderBottomColor: 'primary.main' }}>Fecha</TableCell>
            <TableCell sx={{ borderBottomColor: 'primary.main' }}>Hora</TableCell>
            <TableCell sx={{ borderBottomColor: 'primary.main' }}>Tipo</TableCell>
            <TableCell sx={{ borderBottomColor: 'primary.main' }}>Estado</TableCell>
            <TableCell sx={{ borderBottomColor: 'primary.main' }}>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {appointments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                No se encontraron citas
              </TableCell>
            </TableRow>
          ) : (
            appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>{appointment.patient.name}</TableCell>
                <TableCell>{appointment.doctor.name}</TableCell>
                <TableCell>{new Date(appointment.date).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(appointment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                <TableCell>
                  <Chip label={getTypeLabel(appointment.type)} color={getTypeColor(appointment.type)} size="small" />
                </TableCell>
                <TableCell>
                  <Chip label={getStatusLabel(appointment.status)} color={getStatusColor(appointment.status)} size="small" />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" color="info" onClick={() => onView(appointment)}>
                      <Visibility fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="primary" onClick={() => onEdit(appointment)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => onDelete(appointment)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AppointmentTable;
