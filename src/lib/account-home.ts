export function accountHome(user: { role: string; onboardingCompleted: boolean }) {
  if (user.role.toLowerCase() === 'admin') return '/admin';
  return user.onboardingCompleted ? '/dashboard' : '/onboarding';
}
