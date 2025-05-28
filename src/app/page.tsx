import { supabaseAdmin } from '@/lib/supabase';
import ServicesGrid from '@/components/ServicesGrid';

export default async function Home() {
  const { data: services, error } = await supabaseAdmin.from('services').select('*');
  if (error) {
    throw error;
  }

  return <ServicesGrid services={services ?? []} />;
}
