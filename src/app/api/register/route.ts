import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/auth';
import { registerSchema } from '@/lib/validations';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Zod Validation securely asserts data shape constraints
    const parsedParams = registerSchema.safeParse(body);
    if (!parsedParams.success) {
      return NextResponse.json({ error: parsedParams.error.errors[0].message }, { status: 400 });
    }

    const { name, email, password, gender, major, bio, year, techStacks, otp } = parsedParams.data;

    // 3. Check OTP
    const verificationRecord = await prisma.otpVerification.findUnique({
      where: { email },
    });

    if (!verificationRecord) {
      return NextResponse.json({ error: "No OTP requested for this email." }, { status: 400 });
    }

    if (verificationRecord.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP." }, { status: 400 });
    }

    if (new Date() > verificationRecord.expiresAt) {
      return NextResponse.json({ error: "OTP has expired. Please request a new one." }, { status: 400 });
    }

    // 4. Check if email already registered
    const existing = await prisma.student.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "This email is already registered." },
        { status: 409 }
      );
    }

    // 5. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Delete OTP record
    await prisma.otpVerification.delete({
      where: { email },
    });

    // 7. Create User
    const student = await prisma.student.create({
      data: {
        name,
        email,
        password: hashedPassword,
        gender,
        major,
        bio,
        year,
        techStacks: Array.isArray(techStacks) ? techStacks.join(",") : "",
      },
    });

    // 8. Create session
    await createSession(student.id);

    return NextResponse.json({ success: true, student: { id: student.id, name: student.name, email: student.email } }, { status: 201 });

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
