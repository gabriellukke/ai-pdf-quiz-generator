import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';

export function EditHeader() {
  const router = useRouter();

  return <PageHeader title="Review & Edit Questions" onBack={() => router.push('/')} />;
}

