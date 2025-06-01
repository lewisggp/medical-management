'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Doctor } from '@/generated/prisma';
import { toast } from 'react-toastify';
import { DoctorFormValues, doctorSchema } from '@/schemas/Doctor';
import { specialties } from '@/lib/doctor-specialties';

interface DoctorFormProps {
  doctor?: Doctor;
  onSubmit: (data: DoctorFormValues) => Promise<void>;
  onCancel: () => void;
}

const DoctorForm = ({ doctor, onSubmit, onCancel }: DoctorFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      name: doctor?.name || '',
      email: doctor?.email || '',
      license: doctor?.license || '',
      phone: doctor?.phone || '',
      specialty: doctor?.specialty || '',
      password: ''
    }
  });

  useEffect(() => {
    if (doctor) {
      reset({
        name: doctor.name,
        email: doctor.email,
        license: doctor.license,
        phone: doctor.phone,
        specialty: doctor.specialty,
        password: ''
      });
    }
  }, [doctor, reset]);

  const handleFormSubmit = async (data: DoctorFormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      toast.success(doctor ? 'Doctor actualizado exitosamente' : 'Doctor creado exitosamente');
    } catch (error) {
      toast.error('Error al guardar el doctor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        {doctor ? 'Editar Doctor' : 'Agregar Nuevo Doctor'}
      </Typography>

      <TextField margin="normal" fullWidth label="Nombre del Doctor" {...register('name')} error={!!errors.name} helperText={errors.name?.message} />

      <TextField
        margin="normal"
        fullWidth
        label="Correo Electrónico"
        type="email"
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
      />

      <TextField
        margin="normal"
        fullWidth
        label="Licencia Médica"
        {...register('license')}
        error={!!errors.license}
        helperText={errors.license?.message}
      />

      <TextField margin="normal" fullWidth label="Teléfono" {...register('phone')} error={!!errors.phone} helperText={errors.phone?.message} />

      <FormControl fullWidth margin="normal" error={!!errors.specialty}>
        <InputLabel>Especialidad</InputLabel>
        <Select label="Especialidad" {...register('specialty')} defaultValue={doctor?.specialty || ''}>
          {specialties.map((specialty) => (
            <MenuItem key={specialty} value={specialty}>
              {specialty}
            </MenuItem>
          ))}
        </Select>
        {errors.specialty && (
          <Typography color="error" variant="caption">
            {errors.specialty.message}
          </Typography>
        )}
      </FormControl>

      <TextField
        margin="normal"
        fullWidth
        label="Contraseña"
        type="password"
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
        <Button variant="outlined" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {doctor ? 'Actualizar' : 'Registrar'}
        </Button>
      </Box>
    </Box>
  );
};

export default DoctorForm;
