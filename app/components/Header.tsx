import Link from 'next/link';
import { auth, signOut } from '../../auth';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default async function Header() {
  const session = await auth();
  return (
    <div className='bg-primary border-b border-border px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-10'>
      <Link href='/'>
        <h1 className='font-mono text-2xl'>LISTA</h1>
      </Link>

      {session ? (
        <div className='flex flex-row items-center space-x-2'>
          <Avatar className='h-6 w-6'>
            <AvatarImage
              src={session.user.image || ''}
              alt={session.user.name || ''}
            />
            <AvatarFallback>
              {session.user.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>

          <form
            action={async () => {
              'use server';
              await signOut();
            }}
          >
            <Button variant='ghost' size='icon' type='submit'>
              <LogOut className='ml-2' />
            </Button>
          </form>
        </div>
      ) : (
        <Link href='/signin'>
          <Button variant='outline'>Logg inn</Button>
        </Link>
      )}
    </div>
  );
}
