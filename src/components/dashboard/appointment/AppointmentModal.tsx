'use client';

import { useEffect, useMemo, useState } from 'react';
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
  MenuItem,
  FormHelperText
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AppointmentFormValues, appointmentSchema, appointmentStatuses, appointmentTypes } from '@/schemas/Appointment';
import useDoctors from '@/hooks/useDoctor';
import usePatients from '@/hooks/usePatient';
import { Appointment } from '@/hooks/useAppointment';
import { specialties } from '@/lib/doctor-specialties';
import { format, isWithinInterval, set } from 'date-fns';

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
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(specialties[0]);
  const [selectedDoctor, setSelectedDoctor] = useState<(typeof doctors)[0] | null>(null);
  const [existingAppointments, setExistingAppointments] = useState<any[]>([]);

  // Fetch existing appointments when modal opens
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch('/api/appointments');
        if (!response.ok) throw new Error('Error fetching appointments');
        const appointments = await response.json();
        setExistingAppointments(appointments);
        if (typeof window !== 'undefined') {
          window.existingAppointments = appointments;
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast.error('Error loading appointments');
      }
    };

    if (open) {
      fetchAppointments();
    }
  }, [open]);

  // Set current appointment ID for edit mode
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.currentAppointmentId = appointment?.id;
    }
  }, [appointment]);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
    setError
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientId: -1,
      doctorId: -1,
      type: 'GENERAL',
      description: '',
      date: new Date(),
      notes: '',
      status: 'SCHEDULED'
    }
  });

  const watchDoctorId = watch('doctorId');

  useEffect(() => {
    if (appointment) {
      reset(appointment);
      const doctor = doctors.find((d) => d.id === appointment.doctorId);
      setSelectedDoctor(doctor || null);
      if (doctor) {
        setSelectedSpecialty(doctor.specialty);
      }
    }
  }, [appointment, reset, doctors]);

  useEffect(() => {
    const doctor = doctors.find((d) => d.id === watchDoctorId);
    setSelectedDoctor(doctor || null);
    if (typeof window !== 'undefined') {
      window.selectedDoctor = doctor || null;
    }
  }, [watchDoctorId, doctors]);

  useEffect(() => {
    if (watch('date')) {
      trigger('date');
    }
  }, [selectedDoctor, watch('date'), trigger]);

  const isDayAvailable = (date: Date) => {
    if (!selectedDoctor) return false;

    const dayOfWeek = date.getDay();
    const schedule = selectedDoctor.schedules.find((s) => s.dayOfWeek === dayOfWeek);

    return !!schedule;
  };

  const isTimeAvailable = (time: Date) => {
    if (!selectedDoctor) return false;

    const dayOfWeek = time.getDay();
    const schedule = selectedDoctor.schedules.find((s) => s.dayOfWeek === dayOfWeek);

    if (!schedule) return false;

    const [startHour, startMinute] = schedule.startTime.split(':').map(Number);
    const [endHour, endMinute] = schedule.endTime.split(':').map(Number);

    const scheduleStart = set(time, { hours: startHour, minutes: startMinute });
    const scheduleEnd = set(time, { hours: endHour, minutes: endMinute });

    return isWithinInterval(time, { start: scheduleStart, end: scheduleEnd });
  };

  const handleDateChange = (date: Date | null) => {
    if (!date) return;

    const currentDate = watch('date') || new Date();
    const newDate = new Date(date);
    newDate.setHours(currentDate.getHours());
    newDate.setMinutes(currentDate.getMinutes());

    if (isDayAvailable(newDate)) {
      setValue('date', newDate, { shouldValidate: true });
    } else {
      toast.error('El doctor no atiende este día');
    }
  };

  const handleTimeChange = (time: Date | null) => {
    if (!time) return;

    const currentDate = watch('date') || new Date();
    const newDate = new Date(currentDate);
    newDate.setHours(time.getHours());
    newDate.setMinutes(time.getMinutes());

    if (isTimeAvailable(newDate)) {
      setValue('date', newDate, { shouldValidate: true });
    } else {
      toast.error('El horario seleccionado está fuera del horario de atención del doctor');
    }
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

  const getScheduleText = () => {
    if (!selectedDoctor) return 'Seleccione un doctor para ver los horarios disponibles';

    return selectedDoctor.schedules
      .map((schedule) => {
        const day = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][schedule.dayOfWeek];
        return `${day}: ${schedule.startTime} - ${schedule.endTime}`;
      })
      .join('\n');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isCreate && 'Agendar Nueva Cita'}
        {isEdit && 'Editar Cita'}
        {isView && 'Detalles de la Cita'}
      </DialogTitle>
      <DialogContent>
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
                        <MenuItem value={-1}>Seleccione un paciente</MenuItem>
                        {patients.map((patient) => (
                          <MenuItem key={patient.id} value={patient.id}>
                            {patient.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.patientId && <FormHelperText>{errors.patientId.message}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Especialidad</InputLabel>
                  <Select
                    value={selectedSpecialty}
                    onChange={(e) => {
                      setSelectedSpecialty(e.target.value as string);
                      setValue('doctorId', -1, { shouldValidate: true });
                      setSelectedDoctor(null);
                    }}
                    label="Especialidad"
                    disabled={isView}
                  >
                    {specialties.map((specialty) => (
                      <MenuItem key={specialty} value={specialty}>
                        {specialty}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="doctorId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.doctorId}>
                      <InputLabel>Doctor</InputLabel>
                      <Select
                        {...field}
                        label="Doctor"
                        disabled={isView}
                        onChange={(e) => {
                          field.onChange(Number(e.target.value));
                        }}
                      >
                        <MenuItem value={-1}>Seleccione un doctor</MenuItem>
                        {doctors.map((doctor) => (
                          <MenuItem key={doctor.id} value={doctor.id}>
                            {doctor.name} - {doctor.specialty}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.doctorId && <FormHelperText>{errors.doctorId.message}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Horarios Disponibles" multiline rows={3} value={getScheduleText()} fullWidth disabled variant="filled" />
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
                      disabled={isView || !selectedDoctor}
                      shouldDisableDate={(date) => !isDayAvailable(date)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.date,
                          helperText: errors.date?.message || (!selectedDoctor ? 'Seleccione un doctor primero' : '')
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
                      disabled={isView || !selectedDoctor || !watch('date')}
                      shouldDisableTime={(timeValue, type) => {
                        if (type !== 'hours' && type !== 'minutes') return false;
                        const date = watch('date');
                        if (!date) return true;

                        const testDate = new Date(date);
                        if (type === 'hours') {
                          testDate.setHours(timeValue.getHours());
                        } else {
                          testDate.setMinutes(timeValue.getMinutes());
                        }
                        return !isTimeAvailable(testDate);
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.date,
                          helperText: errors.date?.message || (!selectedDoctor ? 'Seleccione un doctor primero' : '')
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
