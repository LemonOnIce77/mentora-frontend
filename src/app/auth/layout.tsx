import { redirect } from 'next/navigation';
import { getSessionHome } from '@/lib/session-home';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const home = await getSessionHome();
  if (home) redirect(home);
  return children;
}
