'use client';

import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AppointmentFormValues, appointmentSchema, appointmentStatuses, appointmentTypes } from '@/schemas/Appointment';
import useDoctors from '@/hooks/useDoctor';
import usePatients from '@/hooks/usePatient';
import { Appointment } from '@/hooks/useAppointment';

interface AppointmentModalProps {
  open: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  action: 'create' | 'edit' | 'view';
  onSuccess: () => void;
}

const AppointmentModal = ({ open, onClose, appointment, action, onSuccess }: AppointmentModalProps) => {
  const isCreate = action === 'create';
  const isEdit = action === 'edit';
  const isView = action === 'view';

  const { doctors } = useDoctors();
  const { patients } = usePatients();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: appointment ?? {}
  });

  useEffect(() => {
    if (appointment) {
      reset(appointment);
    }
  }, [appointment, reset]);

  const handleDateChange = (date: Date | null) => {
    if (!date) return;

    const currentDate = watch('date') || new Date();
    const newDate = new Date(date);
    newDate.setHours(currentDate.getHours());
    newDate.setMinutes(currentDate.getMinutes());

    setValue('date', newDate, { shouldValidate: true });
  };

  const handleTimeChange = (time: Date | null) => {
    if (!time) return;

    const currentDate = watch('date') || new Date();
    const newDate = new Date(currentDate);
    newDate.setHours(time.getHours());
    newDate.setMinutes(time.getMinutes());

    setValue('date', newDate, { shouldValidate: true });
  };

  const onSubmit = async (data: AppointmentFormValues) => {
    try {
      const url = appointment ? `/api/appointments/${appointment.id}` : '/api/appointments';
      const method = appointment ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar la cita');
      }

      toast.success(isCreate ? 'Cita creada exitosamente' : 'Cita actualizada exitosamente');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Ocurrió un error inesperado');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isCreate && 'Agendar Nueva Cita'}
        {isEdit && 'Editar Cita'}
        {isView && 'Detalles de la Cita'}
      </DialogTitle>
      <DialogContent>
        {JSON.stringify(errors)}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="patientId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.patientId}>
                      <InputLabel>Paciente</InputLabel>
                      <Select {...field} label="Paciente" disabled={isView}>
                        {patients.map((patient) => (
                          <MenuItem key={patient.id} value={patient.id}>
                            {patient.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="doctorId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.doctorId}>
                      <InputLabel>Doctor</InputLabel>
                      <Select {...field} label="Doctor" disabled={isView}>
                        {doctors.map((doctor) => (
                          <MenuItem key={doctor.id} value={doctor.id}>
                            {doctor.name} - {doctor.specialty}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Fecha"
                      value={field.value}
                      onChange={handleDateChange}
                      minDate={new Date()}
                      disabled={isView}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.date,
                          helperText: errors.date?.message
                        }
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="date"
                  control={control}
                  render={() => (
                    <TimePicker
                      label="Hora"
                      value={watch('date') ?? new Date()}
                      onChange={handleTimeChange}
                      disabled={isView || !watch('date')}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.date,
                          helperText: errors.date?.message
                        }
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.type}>
                      <InputLabel>Tipo de Consulta</InputLabel>
                      <Select {...field} label="Tipo de Consulta" disabled={isView}>
                        {appointmentTypes.map((type) => (
                          <MenuItem key={type.value} value={type.value}>
                            {type.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.status}>
                      <InputLabel>Estado</InputLabel>
                      <Select {...field} label="Estado" disabled={isView}>
                        {appointmentStatuses.map((status) => (
                          <MenuItem key={status.value} value={status.value}>
                            {status.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Notas Adicionales"
                      fullWidth
                      multiline
                      rows={3}
                      error={!!errors.notes}
                      helperText={errors.notes?.message}
                      disabled={isView}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <DialogActions>
              <Button onClick={onClose}>{isView ? 'Cerrar' : 'Cancelar'}</Button>
              {!isView && (
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  {isCreate ? 'Agendar' : 'Actualizar'}
                </Button>
              )}
            </DialogActions>
          </Box>
        </LocalizationProvider>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModal;
