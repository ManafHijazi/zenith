import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const services = await prisma.service.findMany();
  return NextResponse.json(services);
}

export async function POST(req: Request) {
  // Parse multipart form
  const formData = await req.formData();
  const name = formData.get('name') as string;
  const priceStr = formData.get('price') as string;
  const description = formData.get('description') as string;
  const file = formData.get('image') as File | null;

  // Handle file upload
  let imageUrl = '';
  if (file && file instanceof File) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `${Date.now()}.${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, filename), buffer);
    imageUrl = `/uploads/${filename}`;
  }

  // Create the record
  const service = await prisma.service.create({
    data: {
      name,
      description,
      price: parseFloat(priceStr),
      imageUrl,
    },
  });

  return NextResponse.json(service);
}
