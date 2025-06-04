import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { doctorSchema } from '@/schemas/Doctor';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const doctors = await prisma.doctor.findMany({
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

    return NextResponse.json(doctors);
  } catch (error) {
    console.error('Error obteniendo doctores:', error);
    return NextResponse.json({ error: 'Error obteniendo doctores' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Validate the data
    const data = await request.json();
    const validatedData = doctorSchema.parse(data);
    const { schedules, confirmPassword, ...doctorData } = validatedData;

    if (!doctorData.password) {
      return NextResponse.json({ error: 'La contraseña es necesaria' }, { status: 400 });
    }

    // Check if doctor with email already exists
    const existingDoctor = await prisma.doctor.findUnique({
      where: { email: validatedData.email }
    });

    if (existingDoctor) {
      return NextResponse.json({ error: 'Doctor con este email ya existe' }, { status: 400 });
    }

    // Check if user with email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: doctorData.email }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Usuario con este email ya existe' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(doctorData.password, 10);

    // Create user and doctor in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user first
      const user = await tx.user.create({
        data: {
          email: doctorData.email,
          name: doctorData.name,
          password: hashedPassword
        }
      });

      // Create doctor with user relation
      const doctor = await tx.doctor.create({
        data: {
          ...doctorData,
          password: hashedPassword,
          userId: user.id,
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

      return doctor;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creando doctor:', error);
    return NextResponse.json({ error: 'Error creando doctor' }, { status: 500 });
  }
}
