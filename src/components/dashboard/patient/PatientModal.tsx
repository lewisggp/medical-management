'use client';

import { useEffect } from 'react';
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
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Grid
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Patient } from '@/generated/prisma';
import { PatientFormValues, patientSchema } from '@/schemas/Patient';
import { bloodTypes } from '@/lib/blood-types';

interface PatientModalProps {
  open: boolean;
  onClose: () => void;
  patient: Patient | null;
  action: 'create' | 'edit' | 'view';
  onSuccess: () => void;
}

const PatientModal = ({ open, onClose, patient, action, onSuccess }: PatientModalProps) => {
  const isCreate = action === 'create';
  const isEdit = action === 'edit';
  const isView = action === 'view';

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: patient ?? {}
  });

  useEffect(() => {
    if (patient) {
      reset(patient);
    } else {
      reset({});
    }
  }, [patient, reset]);

  const onSubmit = async (data: PatientFormValues) => {
    try {
      const url = patient ? `/api/patients/${patient.id}` : '/api/patients';
      const method = patient ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar el paciente');
      }

      toast.success(isCreate ? 'Paciente creado exitosamente' : 'Paciente actualizado exitosamente');
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
        {isCreate && 'Agregar Nuevo Paciente'}
        {isEdit && 'Editar Paciente'}
        {isView && 'Detalles del Paciente'}
      </DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Información Personal
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Nombre del Paciente"
                      fullWidth
                      margin="normal"
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
                      margin="normal"
                      type="email"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      disabled={isView}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
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
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="dateOfBirth"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label="Fecha de Nacimiento"
                      maxDate={new Date()}
                      disabled={isView}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          margin: 'normal',
                          error: !!errors.dateOfBirth,
                          helperText: errors.dateOfBirth?.message
                        }
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="license"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Cédula"
                      fullWidth
                      margin="normal"
                      error={!!errors.license}
                      helperText={errors.license?.message}
                      disabled={isView}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Dirección"
                      fullWidth
                      margin="normal"
                      error={!!errors.address}
                      helperText={errors.address?.message}
                      disabled={isView}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Información Médica
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="bloodType"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth margin="normal" error={!!errors.bloodType}>
                      <InputLabel>Tipo de Sangre</InputLabel>
                      <Select {...field} label="Tipo de Sangre" disabled={isView}>
                        {bloodTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.bloodType && (
                        <Typography color="error" variant="caption">
                          {errors.bloodType.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="allergies"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Alergias"
                      fullWidth
                      margin="normal"
                      multiline
                      rows={2}
                      placeholder="Ingrese las alergias del paciente (opcional)"
                      error={!!errors.allergies}
                      helperText={errors.allergies?.message}
                      disabled={isView}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Controller
                  name="medicalHistory"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Historia Médica"
                      fullWidth
                      margin="normal"
                      multiline
                      rows={4}
                      placeholder="Ingrese la historia médica del paciente (opcional)"
                      error={!!errors.medicalHistory}
                      helperText={errors.medicalHistory?.message}
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
                  {isCreate ? 'Crear' : 'Actualizar'}
                </Button>
              )}
            </DialogActions>
          </Box>
        </LocalizationProvider>
      </DialogContent>
    </Dialog>
  );
};

export default PatientModal;
