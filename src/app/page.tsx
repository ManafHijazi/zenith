import prisma from '@/lib/prisma';
import ServicesGrid from '@/components/ServicesGrid';

export default async function Home() {
  const services = await prisma.service.findMany();

  return <ServicesGrid services={services} />;
}
