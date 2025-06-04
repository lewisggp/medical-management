import { DoctorSchedule, Doctor as DoctorType } from '@/generated/prisma';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

export type Doctor = DoctorType & {
  schedules: DoctorSchedule[];
};

export default function useDoctors() {
  const { data, error, mutate } = useSWR<Doctor[]>('/api/doctors', fetcher);

  return {
    doctors: data || [],
    isLoading: !error && !data,
    isError: error,
    mutate
  };
}
