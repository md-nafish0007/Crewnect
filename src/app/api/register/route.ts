import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, gender, major, bio } = body;

    // 1. Validate required fields
    if (!name || !email || !gender) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 2. Validate college email format
    if (!email.endsWith("@delhitechnicalcampus.ac.in")) {
      return NextResponse.json(
        { error: "Only @delhitechnicalcampus.ac.in email addresses are allowed." },
        { status: 403 }
      );
    }

    // 3. Check if email already registered
    const existing = await prisma.student.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "This email is already registered." },
        { status: 409 }
      );
    }

    // 4. Create User
    const student = await prisma.student.create({
      data: {
        name,
        email,
        gender,
        major,
        bio,
      },
    });

    return NextResponse.json({ success: true, student }, { status: 201 });

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
