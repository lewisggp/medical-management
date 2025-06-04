import { z } from 'zod';

const scheduleSchema = z
  .object({
    dayOfWeek: z.number().min(0).max(6),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:mm)'),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:mm)')
  })
  .refine(
    (data) => {
      const [startHour, startMinute] = data.startTime.split(':').map(Number);
      const [endHour, endMinute] = data.endTime.split(':').map(Number);
      const startMinutes = startHour * 60 + startMinute;
      const endMinutes = endHour * 60 + endMinute;
      return endMinutes > startMinutes;
    },
    {
      message: 'La hora de fin debe ser posterior a la hora de inicio',
      path: ['endTime']
    }
  );

export const doctorSchema = z
  .object({
    name: z.string().min(1, 'Nombre es requerido'),
    email: z.string().email('Email inválido').min(1, 'Email es requerido'),
    license: z.string().min(1, 'Cédula es requerida'),
    phone: z.string().min(1, 'Teléfono es requerido'),
    specialty: z.string().min(1, 'Especialidad es requerida'),
    password: z.string().min(6, 'Mínimo 6 caracteres').optional().or(z.literal('')),
    confirmPassword: z.string().optional(),
    schedules: z.array(scheduleSchema)
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

export const daysOfWeek = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' }
];
