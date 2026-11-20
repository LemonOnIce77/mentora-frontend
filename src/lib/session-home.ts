import { cookies } from 'next/headers';
import { accountHome } from './account-home';
import { verifyToken } from './auth';
import { prisma } from './prisma';

export async function getSessionHome() {
  const token = cookies().get('mentora_token')?.value;
  const session = token && verifyToken(token);
  if (!session || !Number.isSafeInteger(session.userId)) return null;

  const user = await prisma.users.findUnique({
    where: { id: BigInt(session.userId) },
    select: { role: true, onboarding_completed: true },
  });
  return user && accountHome({ role: user.role, onboardingCompleted: !!user.onboarding_completed });
}
