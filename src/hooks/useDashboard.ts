import { Appointment as AppointmentType, Doctor, Patient } from '@/generated/prisma';
import useSWR from 'swr';

export type Appointment = AppointmentType & {
  doctor: Doctor;
  patient: Patient;
};

type DashboardData = {
  totalDoctors: number;
  totalPatients: number;
  newAppointments: number;
  todayAppointments: number;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function useDashboard() {
  const { data: dashboardData, error: dashboardError } = useSWR<DashboardData>('/api/dashboard', fetcher);
  const { data: upcomingAppointments, error: appointmentsError } = useSWR<Appointment[]>('/api/appointments/upcoming', fetcher);

  return {
    dashboardData: dashboardData || {
      totalDoctors: 0,
      totalPatients: 0,
      newAppointments: 0,
      todayAppointments: 0
    },
    upcomingAppointments:
      upcomingAppointments?.map((appointment) => ({
        ...appointment,
        date: new Date(appointment.date)
      })) || [],
    isLoading: !dashboardData && !dashboardError,
    isError: dashboardError || appointmentsError
  };
}
