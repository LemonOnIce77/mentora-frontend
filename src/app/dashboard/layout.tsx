import { redirect } from 'next/navigation';
import { getSessionHome } from '@/lib/session-home';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const home = await getSessionHome();
  if (!home) redirect('/auth?tab=masuk');
  if (home === '/onboarding') redirect(home);
  return children;
}
