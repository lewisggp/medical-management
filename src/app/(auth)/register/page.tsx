'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, TextField, Typography, Grid, Alert, MenuItem } from '@mui/material';
import Link from 'next/link';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DoctorFormValues, doctorSchema } from '@/schemas/Doctor';
import { specialties } from '@/lib/doctor-specialties';

export default function RegisterPage() {
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorSchema)
  });

  useFieldArray({ control, name: 'schedules' });

  const onSubmit = async (data: DoctorFormValues) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      router.push('/login?registered=true');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        py: 4
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Clinica Del Adulto Mayor
      </Typography>
      <Typography variant="h6" gutterBottom>
        Doctor Registration
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2, width: '100%', maxWidth: '600px' }}>
          {error}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          width: '100%',
          maxWidth: '600px',
          mt: 3
        }}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField fullWidth label="Full Name" {...register('name')} error={!!errors.name} helperText={errors.name?.message} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField fullWidth label="Email" type="email" {...register('email')} error={!!errors.email} helperText={errors.email?.message} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Password"
              type="password"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              {...register('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField fullWidth label="License Number" {...register('license')} error={!!errors.license} helperText={errors.license?.message} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField fullWidth label="Phone Number" {...register('phone')} error={!!errors.phone} helperText={errors.phone?.message} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              select
              label="Specialty"
              defaultValue={specialties[0]}
              {...register('specialty')}
              error={!!errors.specialty}
              helperText={errors.specialty?.message}
            >
              {specialties.map((specialty) => (
                <MenuItem key={specialty} value={specialty}>
                  {specialty}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Register
        </Button>

        <Typography variant="body2" align="center">
          Already have an account?{' '}
          <Link href="/login" style={{ textDecoration: 'none' }}>
            Sign in
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
