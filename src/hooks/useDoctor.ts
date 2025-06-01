import { Doctor } from '@/generated/prisma';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function useDoctors() {
  const { data, error, mutate } = useSWR<Doctor[]>('/api/doctors', fetcher);

  return {
    doctors: data || [],
    isLoading: !error && !data,
    isError: error,
    mutate
  };
}
