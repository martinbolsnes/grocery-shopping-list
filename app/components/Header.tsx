import Link from 'next/link';
import { auth, signOut } from '../../auth';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default async function Header() {
  const session = await auth();
  return (
    <div className='bg-background border-b border-border px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-10'>
      <h1 className='font-mono text-xl'>Lista</h1>
      {session ? (
        <form
          action={async () => {
            'use server';
            await signOut();
          }}
        >
          <Button variant='outline' size='icon' type='submit'>
            <LogOut />
          </Button>
        </form>
      ) : (
        <Link href='/signin'>
          <Button variant='outline'>Logg inn</Button>
        </Link>
      )}
    </div>
  );
}
