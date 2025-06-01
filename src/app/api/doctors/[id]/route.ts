import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

interface DoctorData {
  name?: string;
  email?: string;
  license?: string;
  phone?: string;
  specialty?: string;
  password?: string;
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const doctor = await prisma.doctor.findUnique({
      omit: { password: true },
      where: { id: Number(id) }
    });

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor no encontrado' }, { status: 404 });
    }

    return NextResponse.json(doctor);
  } catch (error) {
    console.error('Error fetching doctor:', error);
    return NextResponse.json({ error: 'Error al obtener el doctor' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const data: DoctorData = await request.json();
    const doctorId = Number(id);

    // Check if doctor exists
    const existingDoctor = await prisma.doctor.findUnique({
      where: { id: doctorId }
    });

    if (!existingDoctor) {
      return NextResponse.json({ error: 'Doctor no encontrado' }, { status: 404 });
    }

    // Check if email is being changed to one that already exists
    if (data.email && data.email !== existingDoctor.email) {
      const emailExists = await prisma.doctor.findUnique({
        where: { email: data.email }
      });

      if (emailExists) {
        return NextResponse.json({ error: 'El correo ya está registrado' }, { status: 400 });
      }
    }

    // Prepare update data
    const updateData: Partial<DoctorData> = {
      name: data.name,
      email: data.email,
      license: data.license,
      phone: data.phone,
      specialty: data.specialty
    };

    // Hash new password if provided
    if (data.password && data.password !== existingDoctor.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const updatedDoctor = await prisma.doctor.update({
      where: { id: doctorId },
      data: updateData
    });

    // Don't return the password hash
    const { password: _, ...doctorWithoutPassword } = updatedDoctor;

    return NextResponse.json(doctorWithoutPassword);
  } catch (error) {
    console.error('Error updating doctor:', error);
    return NextResponse.json({ error: 'Error al actualizar el doctor' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const doctorId = Number(id);

    // Check if doctor exists
    const existingDoctor = await prisma.doctor.findUnique({
      where: { id: doctorId }
    });

    if (!existingDoctor) {
      return NextResponse.json({ error: 'Doctor no encontrado' }, { status: 404 });
    }

    await prisma.doctor.delete({
      where: { id: doctorId }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    return NextResponse.json({ error: 'Error al eliminar el doctor' }, { status: 500 });
  }
}
