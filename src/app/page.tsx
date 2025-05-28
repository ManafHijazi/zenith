import ServicesGrid from '@/components/ServicesGrid';
import prisma from '@/lib/prisma';

export default async function Home() {
  const services = await prisma.service.findMany();
  return <ServicesGrid services={services} />;
}
