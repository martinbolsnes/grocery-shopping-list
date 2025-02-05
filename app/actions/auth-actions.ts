'use server';

import { auth } from '@/auth';

export async function authorizeUser() {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  return session.user;
}
