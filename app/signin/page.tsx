'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { signIn } from 'next-auth/react';
import { LoadingSpinner } from '../components/LoadingSpinner';

export default function LoginPage() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);

  const handleSignIn = async (provider: 'google' | 'github') => {
    if (provider === 'google') {
      setIsGoogleLoading(true);
    } else {
      setIsGithubLoading(true);
    }

    try {
      await signIn(provider, { callbackUrl: '/' });
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      if (provider === 'google') {
        setIsGoogleLoading(false);
      } else {
        setIsGithubLoading(false);
      }
    }
  };

  return (
    <div className='container mx-auto flex min-h-screen justify-center'>
      <Card className='w-full max-w-md border-none mt-8 bg-background'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-sans font-bold'>
            Logg inn
          </CardTitle>
          <CardDescription className='font-serif'>
            Velg foretrukket innloggingsmetode.
            <br />
            Hvis dette er første gang du logger inn vil en bruker bli oprettet
            for deg.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Button
            className='w-full font-sans font-medium'
            onClick={() => handleSignIn('google')}
            disabled={isGoogleLoading}
          >
            {isGoogleLoading ? (
              <>
                <LoadingSpinner />
              </>
            ) : (
              'Google'
            )}
          </Button>
          <Button
            variant='secondary'
            className='w-full'
            onClick={() => handleSignIn('github')}
            disabled={isGithubLoading}
          >
            {isGithubLoading ? (
              <>
                <LoadingSpinner />
              </>
            ) : (
              'Github'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
