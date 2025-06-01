import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { patientSchema } from '@/schemas/Patient';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const patients = await prisma.patient.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(patients);
  } catch (error) {
    console.error('Error encontrando pacientes:', error);
    return NextResponse.json({ error: 'Error encontrando pacientes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const data = await request.json();
    data.dateOfBirth = new Date(data.dateOfBirth);

    // Validate the data
    const validatedData = patientSchema.parse(data);

    // Check if patient with email already exists
    const existingPatient = await prisma.patient.findUnique({
      where: { email: validatedData.email }
    });

    if (existingPatient) {
      return NextResponse.json({ error: 'Paciente con este email ya existe' }, { status: 400 });
    }

    // Create patient
    const patient = await prisma.patient.create({
      data: {
        ...validatedData,
        allergies: validatedData.allergies || '',
        medicalHistory: validatedData.medicalHistory || ''
      }
    });

    return NextResponse.json(patient, { status: 201 });
  } catch (error) {
    console.error('Error creando paciente:', error);
    return NextResponse.json({ error: 'Error creando paciente' }, { status: 500 });
  }
}
