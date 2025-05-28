import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const services = await prisma.service.findMany();
  return NextResponse.json(services);
}

export async function POST(req: Request) {
  const data = await req.json();
  const service = await prisma.service.create({ data });
  return NextResponse.json(service);
}
