'use client';

// React
import { useEffect, useState } from 'react';

// Third-party imports
import { Controller, useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';

// MUI
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Grid,
  IconButton,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

// Schemas and Types
import { DoctorFormValues, doctorSchema, daysOfWeek } from '@/schemas/Doctor';
import { Doctor } from '@/hooks/useDoctor';

// Utils
import { specialties } from '@/lib/doctor-specialties';

interface DoctorModalProps {
  open: boolean;
  onClose: () => void;
  doctor: Doctor | null;
  action: 'create' | 'edit' | 'view';
  onSuccess: () => void;
}

const DoctorModal = ({ open, onClose, doctor, action, onSuccess }: DoctorModalProps) => {
  const isCreate = action === 'create';
  const isEdit = action === 'edit';
  const isView = action === 'view';

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      ...doctor,
      schedules: doctor?.schedules || []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'schedules'
  });

  useEffect(() => {
    if (doctor) {
      reset({
        ...doctor,
        password: '',
        confirmPassword: ''
      });
    } else {
      reset({
        name: '',
        email: '',
        license: '',
        phone: '',
        specialty: '',
        password: '',
        confirmPassword: '',
        schedules: []
      });
    }
  }, [doctor, reset]);

  const onSubmit = async (data: DoctorFormValues) => {
    try {
      const url = doctor ? `/api/doctors/${doctor.id}` : '/api/doctors';
      const method = doctor ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar el doctor');
      }

      toast.success(isCreate ? 'Doctor creado exitosamente' : 'Doctor actualizado exitosamente');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Ocurrió un error inesperado');
    }
  };

  const handleAddSchedule = () => {
    append({
      dayOfWeek: 1,
      startTime: '09:00',
      endTime: '17:00'
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isCreate && 'Agregar Nuevo Doctor'}
        {isEdit && 'Editar Doctor'}
        {isView && 'Detalles del Doctor'}
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nombre del Doctor"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    disabled={isView}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Correo Electrónico"
                    fullWidth
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    disabled={isView}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name="specialty"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.specialty}>
                    <InputLabel>Especialidad</InputLabel>
                    <Select {...field} label="Especialidad" disabled={isView}>
                      {specialties.map((specialty) => (
                        <MenuItem key={specialty} value={specialty}>
                          {specialty}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name="license"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Licencia Médica"
                    fullWidth
                    error={!!errors.license}
                    helperText={errors.license?.message}
                    disabled={isView}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Teléfono" fullWidth error={!!errors.phone} helperText={errors.phone?.message} disabled={isView} />
                )}
              />
            </Grid>

            {(isCreate || isEdit) && (
              <>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Contraseña"
                        type="password"
                        fullWidth
                        error={!!errors.password}
                        helperText={errors.password?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Confirmar Contraseña"
                        type="password"
                        fullWidth
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                      />
                    )}
                  />
                </Grid>
              </>
            )}

            <Grid size={{ xs: 12 }}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Horarios de Atención</Typography>
                {!isView && (
                  <Button startIcon={<AddIcon />} onClick={handleAddSchedule} variant="contained" size="small">
                    Agregar Horario
                  </Button>
                )}
              </Box>

              <Grid container spacing={2}>
                {fields.map((field, index) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={field.id}>
                    <Card>
                      <CardContent>
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 12 }}>
                            <Controller
                              name={`schedules.${index}.dayOfWeek`}
                              control={control}
                              render={({ field }) => (
                                <FormControl fullWidth>
                                  <InputLabel>Día</InputLabel>
                                  <Select {...field} label="Día" disabled={isView}>
                                    {daysOfWeek.map((day) => (
                                      <MenuItem key={day.value} value={day.value}>
                                        {day.label}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              )}
                            />
                          </Grid>

                          <Grid size={{ xs: 6 }}>
                            <Controller
                              name={`schedules.${index}.startTime`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="Hora Inicio"
                                  type="time"
                                  fullWidth
                                  InputLabelProps={{ shrink: true }}
                                  disabled={isView}
                                />
                              )}
                            />
                          </Grid>

                          <Grid size={{ xs: 6 }}>
                            <Controller
                              name={`schedules.${index}.endTime`}
                              control={control}
                              render={({ field }) => (
                                <TextField {...field} label="Hora Fin" type="time" fullWidth InputLabelProps={{ shrink: true }} disabled={isView} />
                              )}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                      {!isView && (
                        <CardActions sx={{ justifyContent: 'flex-end' }}>
                          <IconButton size="small" color="error" onClick={() => remove(index)}>
                            <DeleteIcon />
                          </IconButton>
                        </CardActions>
                      )}
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>

          <DialogActions>
            <Button onClick={onClose}>{isView ? 'Cerrar' : 'Cancelar'}</Button>
            {!isView && (
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isCreate ? 'Crear' : 'Actualizar'}
              </Button>
            )}
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorModal;
