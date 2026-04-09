import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/auth';
import { loginSchema } from '@/lib/validations';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Zod validation
    const parsedParams = loginSchema.safeParse(body);
    if (!parsedParams.success) {
      return NextResponse.json({ error: parsedParams.error.errors[0].message }, { status: 400 });
    }
    
    const { email, password } = parsedParams.data;

    const student = await prisma.student.findUnique({ where: { email } });
    if (!student) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    await createSession(student.id);

    return NextResponse.json({ success: true, message: "Logged in successfully" }, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
