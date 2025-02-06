import { Suspense } from 'react';
import { auth } from '@/auth';
import { getLists } from './actions/list-actions';
import { Skeleton } from '@/components/ui/skeleton';
import CreateListForm from './components/create-list-form';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileText, Users } from 'lucide-react';
import { ScrollableTabs } from './components/ScrollableTabs';

export default async function Home() {
  const session = await auth();

  if (!session) {
    return (
      <div className='flex flex-col mx-auto justify-center items-center mt-8 p-8'>
        <h2 className='font-mono text-3xl'>LISTA</h2>
        <p className='font-sans font-semibold'>
          Din eneste app for dine lister
        </p>
        <div className='flex flex-col space-y-4 mt-8 justify-items-center'>
          <Card>
            <CardTitle className='flex justify-items-center font-sans font-semibold text-lg p-6'>
              <FileText className='mr-2' />
              Flere lister på en plass
            </CardTitle>
            <CardContent className='font-serif'>
              Lag flere lister for forskjellige gjøremål og ha de enkelt samlet
              i en og samme app
            </CardContent>
          </Card>
          <Card>
            <CardTitle className='flex justify-items-center font-sans font-semibold text-lg p-6'>
              <Users className='mr-2' />
              Del listene dine
            </CardTitle>
            <CardContent className='font-serif'>
              Inviter andre brukere til å bruke listene dine og ha full kontroll
              på alle punkt
            </CardContent>
          </Card>
          <Link href='/signin' className='w-full'>
            <Button className='w-full font-sans font-semibold'>
              Kom i gang
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const lists = await getLists();

  return (
    <main className='flex flex-col container mx-auto p-4'>
      <Suspense fallback={<Skeleton className='h-4 w-[250px]' />}>
        <div className='flex mb-4 justify-between'>
          <CreateListForm />
          <Link href='/manage-lists'>
            <Button variant='outline'>Endre lister</Button>
          </Link>
        </div>
      </Suspense>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        <ScrollableTabs lists={lists} session={session} />
      </div>
    </main>
  );
}
