import { cookies } from 'next/headers';
import { accountHome } from './account-home';
import { verifyToken } from './auth';
import { prisma } from './prisma';

export async function getSessionHome() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('mentora_token')?.value;
    const session = token && verifyToken(token);
    if (!session || !Number.isSafeInteger(session.userId)) return null;

    let user = null;
    try {
      user = await prisma.users.findUnique({
        where: { id: BigInt(session.userId) },
        select: { role: true, onboarding_completed: true },
      });
    } catch (dbErr) {
      console.warn("DB offline in getSessionHome, checking cookie fallback:", dbErr);
    }

    if (user) {
      return accountHome({
        role: user.role,
        onboardingCompleted: !!user.onboarding_completed,
      });
    }

    // Fallback if DB is offline on Vercel: read mentora_session cookie!
    const sessionCookie = cookieStore.get('mentora_session')?.value;
    if (sessionCookie) {
      try {
        const parsed = JSON.parse(decodeURIComponent(sessionCookie));
        return accountHome({
          role: parsed.role || session.role || 'Mentee',
          onboardingCompleted: parsed.onboardingCompleted !== false,
        });
      } catch {
        // ignore
      }
    }

    // Default fallback from verified token payload
    return accountHome({
      role: session.role || 'Mentee',
      onboardingCompleted: true,
    });
  } catch (err) {
    console.error("Error in getSessionHome:", err);
    return null;
  }
}
