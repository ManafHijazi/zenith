import { supabaseAdmin } from '@/lib/supabase';
import AdminServices from '@/components/AdminServices';

export default async function AdminPage() {
  const { data: services, error } = await supabaseAdmin.from('services').select('*');
  if (error) {
    throw error;
  }
  return <AdminServices initial={services ?? []} />;
}
