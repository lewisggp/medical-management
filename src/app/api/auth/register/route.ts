import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, password, license, phone, specialty } = data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Check if doctor with license already exists
    const existingDoctor = await prisma.doctor.findUnique({
      where: { license },
    });

    if (existingDoctor) {
      return NextResponse.json(
        { error: "Doctor with this license already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and doctor in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      // Create doctor
      const doctor = await tx.doctor.create({
        data: {
          name,
          email,
          license,
          phone,
          specialty,
          password: hashedPassword,
          userId: user.id,
        },
      });

      return { user, doctor };
    });

    // Return success without sensitive data
    return NextResponse.json(
      {
        message: "Registration successful",
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}
