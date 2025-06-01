import { z } from 'zod';

export const doctorSchema = z
  .object({
    name: z.string().min(1, 'Nombre es requerido'),
    email: z.string().email('Email inválido').min(1, 'Email es requerido'),
    license: z.string().min(1, 'Cédula es requerida'),
    phone: z.string().min(1, 'Teléfono es requerido'),
    specialty: z.string().min(1, 'Especialidad es requerida'),
    password: z.string().min(6, 'Mínimo 6 caracteres').optional().or(z.literal('')),
    confirmPassword: z.string().optional()
  })
  .refine(
    (data) => {
      if (data.password && data.password.length > 0) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: 'Las contraseñas no coinciden',
      path: ['confirmPassword']
    }
  );

export type DoctorFormValues = z.infer<typeof doctorSchema>;
