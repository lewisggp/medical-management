'use client';

import { useState } from 'react';
import { Box, Button, TextField, Typography, FormControl, InputLabel, Select, MenuItem, Stack, Chip } from '@mui/material';
import { Add, Search, DateRange, Clear } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import useAppointments from '@/hooks/useAppointment';
import useDoctors from '@/hooks/useDoctor';
import AppointmentTable from '@/components/dashboard/appointment/AppointmentTable';
import AppointmentModal from '@/components/dashboard/appointment/AppointmentModal';
import DeleteConfirmationModal from '@/components/dashboard/appointment/DeleteAppointment';
import { appointmentStatuses, appointmentTypes } from '@/schemas/Appointment';
import { Appointment } from '@/hooks/useAppointment';
import { format } from 'date-fns';

const AppointmentManagement = () => {
  const { appointments, isLoading, mutate } = useAppointments();
  const { doctors } = useDoctors();
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [doctorFilter, setDoctorFilter] = useState<string | number>('');
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  const [action, setAction] = useState<'create' | 'edit' | 'view'>('create');

  const filteredAppointments = appointments.filter((appointment) => {
    // Filtro de búsqueda general
    const matchesSearch =
      searchTerm == '' ||
      appointment.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.type.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtro por estado
    const matchesStatus = statusFilter === '' || appointment.status === statusFilter;

    // Filtro por tipo
    const matchesType = typeFilter === '' || appointment.type === typeFilter;

    // Filtro por doctor
    const matchesDoctor = doctorFilter === '' || appointment.doctorId === doctorFilter;

    // Filtro por rango de fechas
    const appointmentDate = new Date(appointment.date);
    const matchesDateRange =
      (!dateRange.start || appointmentDate >= dateRange.start) &&
      (!dateRange.end || appointmentDate <= new Date(dateRange.end.setHours(23, 59, 59, 999)));

    return matchesSearch && matchesStatus && matchesType && matchesDoctor && matchesDateRange;
  });

  const handleOpenCreate = () => {
    setAction('create');
    setSelectedAppointment(null);
    setOpenModal(true);
  };

  const handleOpenEdit = (appointment: Appointment) => {
    setAction('edit');
    setSelectedAppointment(appointment);
    setOpenModal(true);
  };

  const handleOpenView = (appointment: Appointment) => {
    setAction('view');
    setSelectedAppointment(appointment);
    setOpenModal(true);
  };

  const handleOpenDelete = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setOpenDeleteModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedAppointment(null);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSelectedAppointment(null);
  };

  const handleDelete = async () => {
    if (!selectedAppointment) return;
    try {
      await fetch(`/api/appointments/${selectedAppointment.id}`, {
        method: 'DELETE'
      });
      mutate();
      handleCloseDeleteModal();
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  const clearDateFilter = () => {
    setDateRange({ start: null, end: null });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Gestión de Citas
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpenCreate}>
          Agregar Cita
        </Button>
      </Box>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Buscar citas..."
            InputProps={{
              startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 300 }}
          />

          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel>Doctor</InputLabel>
            <Select value={doctorFilter} onChange={(e) => setDoctorFilter(e.target.value as number)} label="Doctor">
              <MenuItem value="">Todos los doctores</MenuItem>
              {doctors.map((doctor) => (
                <MenuItem key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.specialty}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel>Estado</InputLabel>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Estado">
              <MenuItem value="">Todos los estados</MenuItem>
              {appointmentStatuses.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel>Tipo</InputLabel>
            <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} label="Tipo">
              <MenuItem value="">Todos los tipos</MenuItem>
              {appointmentTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DatePicker
              label="Fecha inicial"
              value={dateRange.start}
              onChange={(date) => setDateRange({ ...dateRange, start: date })}
              slotProps={{
                textField: {
                  size: 'small',
                  sx: { width: 180 }
                }
              }}
            />
            <Typography>-</Typography>
            <DatePicker
              label="Fecha final"
              value={dateRange.end}
              onChange={(date) => setDateRange({ ...dateRange, end: date })}
              slotProps={{
                textField: {
                  size: 'small',
                  sx: { width: 180 }
                }
              }}
            />
            {dateRange.start || dateRange.end ? (
              <Button onClick={clearDateFilter} startIcon={<Clear />} size="small" sx={{ ml: 1 }}>
                Limpiar
              </Button>
            ) : null}
          </Box>
        </Box>

        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
          {doctorFilter && (
            <Chip label={`Doctor: ${doctors.find((d) => d.id === doctorFilter)?.name || doctorFilter}`} onDelete={() => setDoctorFilter('')} />
          )}
          {statusFilter && (
            <Chip
              label={`Estado: ${appointmentStatuses.find((s) => s.value === statusFilter)?.label || statusFilter}`}
              onDelete={() => setStatusFilter('')}
            />
          )}
          {typeFilter && (
            <Chip label={`Tipo: ${appointmentTypes.find((t) => t.value === typeFilter)?.label || typeFilter}`} onDelete={() => setTypeFilter('')} />
          )}
          {dateRange.start && (
            <Chip label={`Desde: ${format(dateRange.start, 'dd/MM/yyyy')}`} onDelete={() => setDateRange({ ...dateRange, start: null })} />
          )}
          {dateRange.end && (
            <Chip label={`Hasta: ${format(dateRange.end, 'dd/MM/yyyy')}`} onDelete={() => setDateRange({ ...dateRange, end: null })} />
          )}
        </Stack>
      </LocalizationProvider>

      <AppointmentTable
        appointments={filteredAppointments}
        onEdit={handleOpenEdit}
        onView={handleOpenView}
        onDelete={handleOpenDelete}
        isLoading={isLoading}
      />

      <AppointmentModal open={openModal} onClose={handleCloseModal} appointment={selectedAppointment} action={action} onSuccess={mutate} />

      <DeleteConfirmationModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDelete}
        title="¿Estás seguro?"
        message={`Estás a punto de eliminar la cita con el paciente ${selectedAppointment?.patient.name}. Esta acción no se puede deshacer.`}
      />
    </Box>
  );
};

export default AppointmentManagement;
