import { z } from 'zod';

export const appointmentSchema = z.object({
  patientId: z.number().min(0, 'Paciente es requerido'),
  doctorId: z.number().min(0, 'Doctor es requerido'),
  type: z.enum(['GENERAL', 'SPECIALIST', 'EMERGENCY', 'FOLLOW_UP', 'OTHER']),
  date: z
    .date({
      required_error: 'Fecha de la cita es requerida',
      invalid_type_error: 'Debe ser una fecha válida'
    })
    .refine((date) => date >= new Date(), {
      message: 'La fecha de la cita no puede ser en el pasado'
    }),
  description: z.string().optional(),
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED']),
  notes: z.string().optional()
});

export type AppointmentFormValues = z.infer<typeof appointmentSchema>;

export const appointmentStatuses = [
  { value: 'SCHEDULED', label: 'Programada' },
  { value: 'COMPLETED', label: 'Completada' },
  { value: 'CANCELLED', label: 'Cancelada' }
] as const;

export const appointmentTypes = [
  { value: 'GENERAL', label: 'Consulta General' },
  { value: 'SPECIALIST', label: 'Especialista' },
  { value: 'EMERGENCY', label: 'Emergencia' },
  { value: 'FOLLOW_UP', label: 'Control' },
  { value: 'OTHER', label: 'Otro' }
] as const;
