import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { signIn } from '@/auth';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account',
};

export default function LoginPage() {
  return (
    <div className='container mx-auto flex min-h-screen'>
      <Card className='w-full max-w-md border-none mt-8'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold'>Logg inn</CardTitle>
          <CardDescription>
            Velg foretrukket innlogginsmetode.
            <br />
            Hvis dette er første gang du logger inn vil en bruker bli oprettet
            for deg.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <form
            action={async () => {
              'use server';
              await signIn('google', { redirectTo: '/' });
            }}
          >
            <Button className='w-full' type='submit'>
              Logg inn med Google
            </Button>
          </form>
          <form
            action={async () => {
              'use server';
              await signIn('github', { redirectTo: '/' });
            }}
          >
            <Button variant='secondary' className='w-full' type='submit'>
              Logg inn med Github
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
