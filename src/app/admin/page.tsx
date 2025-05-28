import prisma from '@/lib/prisma';
import AdminServices from '@/components/AdminServices';

export default async function AdminPage() {
  const services = await prisma.service.findMany();
  return <AdminServices initial={services} />;
}
