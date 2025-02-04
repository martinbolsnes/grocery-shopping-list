import { Suspense } from 'react';
import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShareListDialog } from './components/share-list-dialog';
import { getLists, createList } from './actions/list-actions';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { InteractiveItemList } from './components/interactive-item-list';
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Tooltip } from '@radix-ui/react-tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default async function Home() {
  const session = await auth();

  if (!session) {
    return (
      <div className='flex mx-auto justify-center items-center mt-8'>
        Logg inn for å se dine lister.
      </div>
    );
  }

  const lists = await getLists();

  return (
    <div className='container mx-auto p-4'>
      <Suspense fallback={<Skeleton className='h-4 w-[250px]' />}>
        <CreateListForm />
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
              <div className='flex items-center justify-between mb-2'>
                <div className='flex items-center space-x-2'>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Avatar className='h-8 w-8'>
                          <AvatarImage
                            src={list.owner.image || ''}
                            alt={list.owner.name || ''}
                          />
                          <AvatarFallback>
                            {list.owner.name?.charAt(0) || 'O'}
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Owner: {list.owner.name || list.owner.email}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {list.sharedWith.length > 0 && (
                    <div className='flex -space-x-2'>
                      {list.sharedWith.map((user) => (
                        <TooltipProvider key={user.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Avatar className='h-8 w-8 border-2 border-background'>
                                <AvatarImage
                                  src={user.image || ''}
                                  alt={user.name || ''}
                                />
                                <AvatarFallback>
                                  {user.name?.charAt(0) || 'U'}
                                </AvatarFallback>
                              </Avatar>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Shared with: {user.name || user.email}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  )}
                </div>
                {list.owner.email === session.user?.email && (
                  <ShareListDialog listId={list.id} />
                )}
              </div>
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
    </div>
  );
}

function CreateListForm() {
  return (
    <form action={createList} className='mb-4 flex'>
      <Input
        type='text'
        name='name'
        placeholder='Ny liste'
        className='mr-2 text-base'
      />
      <Button variant='secondary' size='icon' type='submit'>
        <Plus className='h-4 w-4' />
      </Button>
    </form>
  );
}
