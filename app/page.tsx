import { Suspense } from 'react';
import { auth } from '@/auth';
import { ShareListDialog } from './components/share-list-dialog';
import { getLists } from './actions/list-actions';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InteractiveItemList } from './components/interactive-item-list';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CreateListForm from './components/create-list-form';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileText, Users } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

export default async function Home() {
  const session = await auth();

  if (!session) {
    return (
      <div className='flex flex-col mx-auto justify-center items-center mt-8 p-8'>
        <h2 className='font-mono text-3xl'>LISTA</h2>
        <p>Din eneste app for dine lister</p>
        <div className='flex flex-col space-y-4 mt-8 justify-items-center'>
          <Card>
            <CardTitle className='flex justify-items-center text-lg p-6'>
              <FileText className='mr-2' />
              Flere lister på en plass
            </CardTitle>
            <CardContent>
              Lag flere lister for forskjellige gjøremål og ha de enkelt samlet
              i en og samme app
            </CardContent>
          </Card>
          <Card>
            <CardTitle className='flex justify-items-center text-lg p-6'>
              <Users className='mr-2' />
              Del listene dine
            </CardTitle>
            <CardContent>
              Inviter andre brukere til å bruke listene dine og ha full kontroll
              på alle punkt
            </CardContent>
          </Card>
          <Link href='/signin' className='w-full'>
            <Button className='w-full'>Kom i gang</Button>
          </Link>
        </div>
      </div>
    );
  }

  const lists = await getLists();

  return (
    <main className='flex flex-col container mx-auto p-4'>
      <Suspense fallback={<Skeleton className='h-4 w-[250px]' />}>
        <div className='flex mb-4 justify-start'>
          <CreateListForm />
        </div>
      </Suspense>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        <Tabs defaultValue={lists[0]?.name}>
          <TabsList>
            {lists.map((list) => (
              <TabsTrigger value={list.name} key={list.id}>
                {list.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {lists.map((list) => (
            <TabsContent value={list.name} key={list.id}>
              <div className='flex items-center justify-between mb-2 mt-4'>
                <div className='flex items-center space-x-2'>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Avatar className='h-8 w-8'>
                        <AvatarImage
                          src={list.owner.image || ''}
                          alt={list.owner.name || ''}
                        />
                        <AvatarFallback>
                          {list.owner.name?.charAt(0) || 'O'}
                        </AvatarFallback>
                      </Avatar>
                    </PopoverTrigger>
                    <PopoverContent className='p-1 bg-primary text-foreground text-center'>
                      <p>Eier: {list.owner.name || list.owner.email}</p>
                    </PopoverContent>
                  </Popover>

                  {list.sharedWith.length > 0 && (
                    <div className='flex -space-x-2'>
                      {list.sharedWith.map((user) => (
                        <Popover key={user.id}>
                          <PopoverTrigger asChild>
                            <Avatar className='h-8 w-8 border-2 border-background'>
                              <AvatarImage
                                src={user.image || ''}
                                alt={user.name || ''}
                              />
                              <AvatarFallback>
                                {user.name?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                          </PopoverTrigger>
                          <PopoverContent className='p-1 bg-primary text-foreground text-center'>
                            <p>Delt med: {user.name || user.email}</p>
                          </PopoverContent>
                        </Popover>
                      ))}
                    </div>
                  )}
                </div>
                {list.owner.email === session.user?.email && (
                  <ShareListDialog listId={list.id} />
                )}
              </div>
              <Separator className='mb-8 mt-4' />
              <Suspense
                fallback={
                  <div className='flex flex-col gap-2'>
                    <Skeleton className='h-4 w-[150px]' />
                    <Skeleton className='h-4 w-[150px]' />
                    <Skeleton className='h-4 w-[150px]' />
                    <Skeleton className='h-4 w-[150px]' />
                  </div>
                }
              >
                <InteractiveItemList
                  listId={list.id}
                  initialItems={list.items}
                />
              </Suspense>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </main>
  );
}
