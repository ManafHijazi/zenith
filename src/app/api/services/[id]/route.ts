import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const updates = await req.json();
  const service = await prisma.service.update({
    where: { id: Number(params.id) },
    data: updates,
  });
  return NextResponse.json(service);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await prisma.service.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ ok: true });
}
