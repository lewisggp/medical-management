import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { doctorSchema } from '@/schemas/Doctor';
import bcrypt from 'bcryptjs';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { id: parseInt(id) },
      include: {
        schedules: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    });

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor no encontrado' }, { status: 404 });
    }

    return NextResponse.json(doctor);
  } catch (error) {
    console.error('Error obteniendo doctor:', error);
    return NextResponse.json({ error: 'Error obteniendo doctor' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Validate the data
    const data = await request.json();
    const validatedData = doctorSchema.parse(data);
    const { schedules, confirmPassword, ...doctorData } = validatedData;

    // Check if doctor exists
    const existingDoctor = await prisma.doctor.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: true
      }
    });

    if (!existingDoctor) {
      return NextResponse.json({ error: 'Doctor no encontrado' }, { status: 404 });
    }

    // Check if email is being changed and if it's already in use
    if (doctorData.email !== existingDoctor.email) {
      const [emailInUseDoctor, emailInUseUser] = await Promise.all([
        prisma.doctor.findUnique({
          where: { email: doctorData.email }
        }),
        prisma.user.findUnique({
          where: { email: doctorData.email }
        })
      ]);

      if (emailInUseDoctor || emailInUseUser) {
        return NextResponse.json({ error: 'Email ya en uso' }, { status: 400 });
      }
    }

    // Hash password if it exists
    if (doctorData.password) {
      const hashedPassword = await bcrypt.hash(doctorData.password, 10);
      doctorData.password = hashedPassword;
    } else {
      delete doctorData.password;
    }

    // Update doctor and user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update user first
      await tx.user.update({
        where: { id: existingDoctor.userId },
        data: {
          email: doctorData.email,
          name: doctorData.name,
          ...(doctorData.password && { password: doctorData.password })
        }
      });

      // Delete existing schedules
      await tx.doctorSchedule.deleteMany({
        where: { doctorId: parseInt(id) }
      });

      // Update doctor with new schedules
      const updatedDoctor = await tx.doctor.update({
        where: { id: parseInt(id) },
        data: {
          ...doctorData,
          schedules: {
            create: schedules
          }
        },
        include: {
          schedules: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true
            }
          }
        }
      });

      return updatedDoctor;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error actualizando doctor:', error);
    return NextResponse.json({ error: 'Error actualizando doctor' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Get doctor to delete
    const doctor = await prisma.doctor.findUnique({
      where: { id: parseInt(id) },
      include: { user: true }
    });

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor no encontrado' }, { status: 404 });
    }

    // Delete in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete doctor's schedules first (due to foreign key constraint)
      await tx.doctorSchedule.deleteMany({
        where: { doctorId: parseInt(id) }
      });

      // Delete doctor
      await tx.doctor.delete({
        where: { id: parseInt(id) }
      });

      // Delete associated user
      if (doctor.userId) {
        await tx.user.delete({
          where: { id: doctor.userId }
        });
      }
    });

    return NextResponse.json({ message: 'Doctor eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando doctor:', error);
    return NextResponse.json({ error: 'Error eliminando doctor' }, { status: 500 });
  }
}
