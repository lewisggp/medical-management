import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { patientSchema } from '@/schemas/Patient';

// GET specific patient
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const patient = await prisma.patient.findUnique({
      where: { id: parseInt(id) }
    });

    if (!patient) {
      return NextResponse.json({ error: 'Paciente no encontrado' }, { status: 404 });
    }

    return NextResponse.json(patient);
  } catch (error) {
    console.error('Error encontrando paciente:', error);
    return NextResponse.json({ error: 'Error encontrando paciente' }, { status: 500 });
  }
}

// UPDATE patient
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const data = await request.json();
    data.dateOfBirth = new Date(data.dateOfBirth);

    // Validate the data
    const validatedData = patientSchema.parse(data);

    // Check if patient exists
    const existingPatient = await prisma.patient.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingPatient) {
      return NextResponse.json({ error: 'Paciente no encontrado' }, { status: 404 });
    }

    // Check if email is being changed and if it's already in use
    if (validatedData.email !== existingPatient.email) {
      const emailInUse = await prisma.patient.findUnique({
        where: { email: validatedData.email }
      });

      if (emailInUse) {
        return NextResponse.json({ error: 'Email ya en uso' }, { status: 400 });
      }
    }

    // Update patient
    const updatedPatient = await prisma.patient.update({
      where: { id: parseInt(id) },
      data: validatedData
    });

    return NextResponse.json(updatedPatient);
  } catch (error) {
    console.error('Error actualizando paciente:', error);
    return NextResponse.json({ error: 'Error actualizando paciente' }, { status: 500 });
  }
}

// DELETE patient
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Check if patient exists
    const existingPatient = await prisma.patient.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingPatient) {
      return NextResponse.json({ error: 'Paciente no encontrado' }, { status: 404 });
    }

    // Delete patient
    await prisma.patient.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: 'Paciente eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando paciente:', error);
    return NextResponse.json({ error: 'Error eliminando paciente' }, { status: 500 });
  }
}
