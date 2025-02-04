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
  title: 'Logg inn',
  description: 'Logg inn med din bruker',
};

export default function LoginPage() {
  return (
    <div className='container mx-auto flex min-h-screen justify-center'>
      <Card className='w-full max-w-md border-none mt-8 bg-background'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold'>Logg inn</CardTitle>
          <CardDescription>
            Velg foretrukket innloggingsmetode.
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
              Google
            </Button>
          </form>
          <form
            action={async () => {
              'use server';
              await signIn('github', { redirectTo: '/' });
            }}
          >
            <Button variant='secondary' className='w-full' type='submit'>
              Github
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
