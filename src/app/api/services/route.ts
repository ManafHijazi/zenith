import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  const { data: services, error } = await supabaseAdmin.from('services').select('*');
  if (error) throw error;
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
    const { error: upErr } = await supabaseAdmin.storage
      .from(process.env.SUPABASE_BUCKET!)
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });
    if (upErr) throw upErr;
    const { data } = supabaseAdmin.storage
      .from(process.env.SUPABASE_BUCKET!)
      .getPublicUrl(filename);
    imageUrl = data.publicUrl;
  }

  // Create the record via Supabase
  const { data: service, error: insertErr } = await supabaseAdmin
    .from('services')
    .insert([
      {
        name,
        description,
        price: parseFloat(priceStr),
        imageUrl,
      },
    ])
    .single();
  if (insertErr) throw insertErr;
  return NextResponse.json(service);
}
