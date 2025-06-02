import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { appointmentSchema } from '@/schemas/Appointment';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const appointments = await prisma.appointment.findMany({
      include: {
        patient: true,
        doctor: true
      },
      orderBy: {
        date: 'desc'
      }
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ error: 'Error fetching appointments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    data.date = new Date(data.date);

    const validatedData = appointmentSchema.parse(data);

    const appointment = await prisma.appointment.create({
      data: {
        ...validatedData,
        notes: validatedData.notes || '',
        description: validatedData.description || ''
      },
      include: {
        patient: true,
        doctor: true
      }
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json({ error: 'Error creating appointment' }, { status: 500 });
  }
}
