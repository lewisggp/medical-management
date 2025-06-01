'use client';

// React
import { useEffect } from 'react';

// Third-party imports
import { Controller, useForm } from 'react-hook-form';
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
  Typography
} from '@mui/material';

// Schemas and Types
import { Doctor } from '@/generated/prisma';
import { DoctorFormValues, doctorSchema } from '@/schemas/Doctor';

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
    defaultValues: doctor ?? {}
  });

  useEffect(() => {
    if (doctor) reset(doctor);
  }, [doctor, reset]);

  const onSubmit = async (data: DoctorFormValues) => {
    try {
      const { confirmPassword, ...submitData } = data;

      if (isEdit && !submitData.password) delete submitData.password;

      const url = doctor ? `/api/doctors/${doctor.id}` : '/api/doctors';
      const method = doctor ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar el doctor');
      }

      toast.success(isCreate ? 'Doctor creado exitosamente' : 'Doctor actualizado exitosamente', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Ocurrió un error inesperado', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isCreate && 'Agregar Nuevo Doctor'}
          {isEdit && 'Editar Doctor'}
          {isView && 'Detalles del Doctor'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nombre del Doctor"
                  fullWidth
                  margin="normal"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={isView}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Correo Electrónico"
                  fullWidth
                  margin="normal"
                  type="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={isView}
                />
              )}
            />

            <Controller
              name="license"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Licencia Médica"
                  fullWidth
                  margin="normal"
                  error={!!errors.license}
                  helperText={errors.license?.message}
                  disabled={isView}
                />
              )}
            />

            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Teléfono"
                  fullWidth
                  margin="normal"
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  disabled={isView}
                />
              )}
            />

            <Controller
              name="specialty"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth margin="normal" error={!!errors.specialty}>
                  <InputLabel>Especialidad</InputLabel>
                  <Select {...field} label="Especialidad" disabled={isView}>
                    {specialties.map((spec) => (
                      <MenuItem key={spec} value={spec}>
                        {spec}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.specialty && (
                    <Typography color="error" variant="caption">
                      {errors.specialty.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />

            {isCreate && (
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Contraseña"
                    fullWidth
                    margin="normal"
                    type="password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    required
                  />
                )}
              />
            )}

            {isEdit && (
              <>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Nueva Contraseña (opcional)"
                      fullWidth
                      margin="normal"
                      type="password"
                      error={!!errors.password}
                      helperText={errors.password?.message}
                    />
                  )}
                />

                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Confirmar Nueva Contraseña"
                      fullWidth
                      margin="normal"
                      type="password"
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword?.message}
                    />
                  )}
                />
              </>
            )}

            <DialogActions sx={{ mt: 3 }}>
              <Button onClick={onClose}>Cancelar</Button>
              {action !== 'view' && (
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  {isSubmitting ? 'Guardando...' : isCreate ? 'Crear' : 'Actualizar'}
                </Button>
              )}
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DoctorModal;
