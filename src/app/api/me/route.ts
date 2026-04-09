import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const student = await prisma.student.findUnique({
    where: { id: session.userId as string }
  });

  if (!student) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  return NextResponse.json({ 
    user: {
      id: student.id,
      name: student.name,
      email: student.email
    }
  }, { status: 200 });
}
