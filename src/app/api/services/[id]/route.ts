import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  const { data: service, error } = await supabaseAdmin
    .from('services')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return NextResponse.json(service);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  const formData = await req.formData();
  const name = formData.get('name') as string;
  const price = parseFloat(formData.get('price') as string);
  const description = formData.get('description') as string;
  const file = formData.get('image') as File | null;

  let imageUrl: string | undefined;
  if (file && file instanceof File) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `${Date.now()}.${ext}`;
    const { error: upErr } = await supabaseAdmin.storage
      .from(process.env.SUPABASE_BUCKET!)
      .upload(filename, buffer, {
        contentType: file.type,
      });
    if (upErr) throw upErr;
    const { data } = supabaseAdmin.storage
      .from(process.env.SUPABASE_BUCKET!)
      .getPublicUrl(filename);
    imageUrl = data.publicUrl;
  }

  const updatePayload: { name: string; description: string; price: number; imageUrl?: string } = {
    name,
    description,
    price,
  };
  if (imageUrl) updatePayload.imageUrl = imageUrl;

  const { data: service, error } = await supabaseAdmin
    .from('services')
    .update(updatePayload)
    .eq('id', id)
    .single();
  if (error) throw error;
  return NextResponse.json(service);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params;
  const id = Number(rawId);

  const { error } = await supabaseAdmin.from('services').delete().eq('id', id);
  if (error) throw error;
  return NextResponse.json({ ok: true });
}
