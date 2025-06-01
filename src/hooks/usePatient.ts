import { Patient } from '@/generated/prisma';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function usePatients() {
  const { data, error, mutate } = useSWR<Patient[]>('/api/patients', fetcher);

  return {
    patients:
      data?.map((patient) => ({
        ...patient,
        dateOfBirth: new Date(patient.dateOfBirth)
      })) || [],
    isLoading: !error && !data,
    isError: error,
    mutate
  };
}
