import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const doctores = await prisma.doctor.findMany({
      omit: { password: true }
    });

    return NextResponse.json(doctores);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener los doctores' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const doctor = await prisma.doctor.create({ data });

    return NextResponse.json(doctor, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear el doctor' }, { status: 500 });
  }
}
