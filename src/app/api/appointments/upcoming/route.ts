import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const appointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: today,
          lt: nextWeek
        }
      },
      include: {
        patient: {
          select: {
            name: true
          }
        },
        doctor: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        date: 'asc'
      },
      take: 10
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error fetching upcoming appointments:', error);
    return NextResponse.json({ error: 'Error fetching upcoming appointments' }, { status: 500 });
  }
}
