import { z } from 'zod';

export const patientSchema = z.object({
  name: z.string().min(1, 'Nombre es requerido'),
  email: z.string().email('Email inválido').min(1, 'Email es requerido'),
  phone: z.string().min(1, 'Teléfono es requerido'),
  license: z.string().min(1, 'Licencia es requerida'),
  dateOfBirth: z
    .date({
      required_error: 'Fecha de nacimiento es requerida',
      invalid_type_error: 'Debe ser una fecha válida'
    })
    .refine((date) => date <= new Date(), {
      message: 'La fecha de nacimiento no puede ser en el futuro'
    })
    .refine(
      (date) => {
        const today = new Date();
        let age = today.getFullYear() - date.getFullYear();
        const monthDiff = today.getMonth() - date.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
          age--;
        }
        console.log(age);
        return age >= 60;
      },
      {
        message: 'El paciente debe tener al menos 60 años'
      }
    ),
  address: z.string().min(1, 'Dirección es requerida'),
  bloodType: z.string().min(1, 'Tipo de sangre es requerido'),
  allergies: z.string().optional(),
  medicalHistory: z.string().optional()
});

export type PatientFormValues = z.infer<typeof patientSchema>;
