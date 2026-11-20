import type { Prisma } from '@prisma/client';

export const adminApproval = {
  status: 'APPROVED', reviewed_by: { not: null }, reviewed_at: { not: null },
} satisfies Prisma.mentor_applicationsWhereInput;

export const verifiedMentor = {
  onboarding_completed: true, status_mentor: 'APPROVED',
  nama_lengkap: { not: '' }, nama_panggilan: { not: '' }, universitas: { not: '' }, prodi: { not: '' },
  semester: { not: '' }, domisili: { not: '' }, tgl_lahir: { not: '' },
  mentor_applications_mentor_applications_user_idTousers: { some: adminApproval },
} satisfies Prisma.usersWhereInput;

export const approvalCount = {
  select: { mentor_applications_mentor_applications_user_idTousers: { where: adminApproval } },
} as const;

export function mentorIdentity(user: ApplicantProfile & { role: string; status_mentor: string;
  _count: { mentor_applications_mentor_applications_user_idTousers: number } }) {
  const verified = hasMentorProfile(user) && user.status_mentor === 'APPROVED'
    && user._count.mentor_applications_mentor_applications_user_idTousers > 0;
  return {
    role: user.role === 'Admin' ? 'Admin' : verified ? 'Mentor' : 'Mentee',
    statusMentor: user.status_mentor === 'APPROVED' && !verified ? 'NONE' : user.status_mentor,
  };
}

// Fields required by the onboarding form.
export const mentorProfileFields = {
  onboarding_completed: true, nama_lengkap: true, nama_panggilan: true,
  universitas: true, prodi: true, semester: true, domisili: true, tgl_lahir: true,
} as const;

type ApplicantProfile = { onboarding_completed: boolean } &
  Record<Exclude<keyof typeof mentorProfileFields, 'onboarding_completed'>, string | null>;

export function hasMentorProfile(p: ApplicantProfile) {
  return p.onboarding_completed && hasProfileDetails(p);
}

export function hasProfileDetails(p: Omit<ApplicantProfile, 'onboarding_completed'>) {
  return [p.nama_lengkap, p.nama_panggilan, p.universitas,
    p.prodi, p.semester, p.domisili, p.tgl_lahir].every(value => !!value?.trim());
}
