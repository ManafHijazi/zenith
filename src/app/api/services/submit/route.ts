import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req: Request) {
  const { email, services } = await req.json();
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Your Selected Services',
    text: `You picked service IDs: ${services.join(', ')}`,
  });
  return NextResponse.json({ ok: true });
}
