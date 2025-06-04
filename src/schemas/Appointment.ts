import { z } from 'zod';
import { isWithinInterval, set, addMinutes } from 'date-fns';

// Define the schedule type
interface DoctorSchedule {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

interface Doctor {
  id: number;
  schedules: DoctorSchedule[];
  specialty: string;
}

interface Appointment {
  id: number;
  date: Date;
  doctorId: number;
}

declare global {
  interface Window {
    selectedDoctor: Doctor | null;
    existingAppointments: Appointment[];
    currentAppointmentId?: number;
  }
}

export const appointmentSchema = z
  .object({
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
  })
  .superRefine((data, ctx) => {
    // Skip validation if no doctor is selected
    if (!data.doctorId || data.doctorId <= 0) return;

    // Get the doctor's schedule for the selected day
    const doctor = typeof window !== 'undefined' ? window.selectedDoctor : null;
    if (!doctor) return;

    const dayOfWeek = data.date.getDay();
    const schedule = doctor.schedules.find((s: DoctorSchedule) => s.dayOfWeek === dayOfWeek);

    // If no schedule found for this day
    if (!schedule) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El doctor no atiende este día',
        path: ['date']
      });
      return;
    }

    // Check if time is within schedule
    const [startHour, startMinute] = schedule.startTime.split(':').map(Number);
    const [endHour, endMinute] = schedule.endTime.split(':').map(Number);

    const scheduleStart = set(data.date, { hours: startHour, minutes: startMinute });
    const scheduleEnd = set(data.date, { hours: endHour, minutes: endMinute });

    if (!isWithinInterval(data.date, { start: scheduleStart, end: scheduleEnd })) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'La hora seleccionada está fuera del horario de atención del doctor',
        path: ['date']
      });
      return;
    }

    // Check for overlapping appointments for specialists
    if (doctor.specialty !== 'GENERAL') {
      const existingAppointments = typeof window !== 'undefined' ? window.existingAppointments : [];
      if (!existingAppointments) return;

      // Assume each appointment takes 30 minutes
      const appointmentStart = data.date;
      const appointmentEnd = addMinutes(data.date, 30);

      const hasOverlap = existingAppointments.some((appointment) => {
        // Skip the current appointment being edited
        if (window.currentAppointmentId && appointment.id === window.currentAppointmentId) {
          return false;
        }

        const existingStart = new Date(appointment.date);
        const existingEnd = addMinutes(existingStart, 30);

        return (
          appointment.doctorId === data.doctorId &&
          ((appointmentStart >= existingStart && appointmentStart < existingEnd) ||
            (appointmentEnd > existingStart && appointmentEnd <= existingEnd) ||
            (appointmentStart <= existingStart && appointmentEnd >= existingEnd))
        );
      });

      if (hasOverlap) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Ya existe una cita programada para este horario',
          path: ['date']
        });
      }
    }
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
