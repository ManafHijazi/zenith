import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const service = await prisma.service.findUnique({
    where: { id: Number(params.id) },
  });
  return NextResponse.json(service);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  // Await dynamic params
  const { id } = await params;

  // Parse multipart form
  const formData = await req.formData();
  const name = formData.get('name') as string;
  const priceStr = formData.get('price') as string;
  const description = formData.get('description') as string;
  const file = formData.get('image') as File | null;

  // Handle file upload if provided
  let imageUrl: string | undefined;
  if (file && file instanceof File) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `${Date.now()}.${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, filename), buffer);
    imageUrl = `/uploads/${filename}`;
  }

  // Build update data
  const updateData: { name: string; description: string; price: number; imageUrl?: string } = {
    name,
    description,
    price: parseFloat(priceStr),
  };
  if (imageUrl) updateData.imageUrl = imageUrl;

  // Perform update
  const service = await prisma.service.update({
    where: { id: Number(id) },
    data: updateData,
  });
  return NextResponse.json(service);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await prisma.service.delete({
    where: { id: Number(params.id) },
  });
  return NextResponse.json({ ok: true });
}
