import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { mailjet } from '@/lib/mailjet';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  // 1. Parse payload
  const { email: userEmail, services: serviceIds } = await req.json();

  // 2. Fetch service details
  const services = await prisma.service.findMany({
    where: { id: { in: serviceIds.map(Number) } },
  });

  // 3. Build full HTML email with logo and styled table
  const htmlBody = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>New Zenith Services Request</title>
  </head>
  <body style="width=100%; font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td>
          <table width="600" align="center" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
            <tr>
              <td style="padding: 20px;">
                <h2 style="margin: 0 0 10px;">New Services Request</h2>
                <p><strong>Requested by:</strong> ${userEmail}</p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-top: 20px;">
                <table width="80%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                  ${services
                    .map(
                      (s: {
                        imageUrl: string;
                        name: string;
                        description: string;
                        price: number;
                      }) => `
                    <tr>
                      <td style="padding: 10px; border-bottom: 1px solid #eee; width: 100px;">
                        <img src="${s.imageUrl}" alt="${
                        s.name
                      }" width="80" style="border-radius: 4px;" />
                      </td>
                      <td style="padding: 10px; border-bottom: 1px solid #eee; vertical-align: top;">
                        <h3 style="margin: 0 0 5px;">${s.name}</h3>
                        <p style="margin: 0 0 5px; color: #666; font-size: 14px;">${
                          s.description
                        }</p>
                        <p style="margin: 0; font-weight: bold;">$${s.price.toFixed(2)}</p>
                      </td>
                    </tr>`
                    )
                    .join('')}
                </table>
  </body>
</html>
`;

  // 4. Send via Mailjet
  await mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: process.env.MAILJET_FROM_EMAIL!,
          Name: process.env.MAILJET_FROM_NAME!,
        },
        To: [{ Email: 'manafmhijazi@gmail.com', Name: 'Manaf Hijazi' }],
        Subject: 'New Zenith Services Request',
        HTMLPart: htmlBody,
      },
    ],
  });

  return NextResponse.json({ ok: true });
}
