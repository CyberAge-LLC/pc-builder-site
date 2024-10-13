import PCBuilder from '@/components/ui/PCBuilder/PCBuilder';
import {
  getProducts,
  getUser
} from '@/utils/supabase/queries';

export default async function PCBuilderPage() {

  return (
    <PCBuilder/>
  );
}
