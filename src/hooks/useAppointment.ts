import { Appointment as AppointmentType, Doctor, Patient } from '@/generated/prisma';
import useSWR from 'swr';

export type Appointment = AppointmentType & {
  doctor: Doctor;
  patient: Patient;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function useAppointments() {
  const { data, error, mutate } = useSWR<Appointment[]>('/api/appointments', fetcher);

  return {
    appointments:
      data?.map((appointment) => ({
        ...appointment,
        date: new Date(appointment.date)
      })) || [],
    isLoading: !error && !data,
    isError: error,
    mutate
  };
}
