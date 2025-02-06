'use client';

import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ShareListDialog } from './share-list-dialog';
import { InteractiveItemList } from './interactive-item-list';
import { Separator } from '@/components/ui/separator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Session } from 'next-auth';

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface Item {
  id: string;
  name: string;
  completed: boolean;
}

interface List {
  id: string;
  name: string;
  owner: User;
  sharedWith: User[];
  items: Item[];
}

interface ScrollableTabsProps {
  lists: List[];
  session: Session | null;
}

export function ScrollableTabs({
  lists,
  session,
}: ScrollableTabsProps): JSX.Element {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const checkScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    };

    checkScroll();
    scrollContainer.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    return () => {
      scrollContainer.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scrollAmount = 200;
    scrollContainer.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <Tabs defaultValue={lists[0]?.name} className='w-full'>
      <div className='relative flex items-center'>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            showLeftArrow ? 'ml-8' : 'ml-0'
          }`}
        >
          <div className='flex overflow-x-auto scrollbar-hide' ref={scrollRef}>
            <TabsList className='inline-flex space-x-2'>
              {lists.map((list) => (
                <TabsTrigger
                  value={list.name}
                  key={list.id}
                  className='font-sans font-bold whitespace-nowrap'
                >
                  {list.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>
        {showLeftArrow && (
          <Button
            variant='secondary'
            size='icon'
            className='scroll-btn left-scroll absolute left-0 z-10'
            onClick={() => handleScroll('left')}
          >
            <ChevronLeft className='h-4 w-4' />
          </Button>
        )}
        {showRightArrow && (
          <Button
            variant='secondary'
            size='icon'
            className='scroll-btn right-scroll absolute right-0 z-10'
            onClick={() => handleScroll('right')}
          >
            <ChevronRight className='h-4 w-4' />
          </Button>
        )}
      </div>
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
                <PopoverContent className='p-1 bg-primary font-serif text-foreground text-center'>
                  <p>Eier: {list.owner.name || list.owner.email}</p>
                </PopoverContent>
              </Popover>

              {list.sharedWith.length > 0 && (
                <div className='flex space-x-2'>
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
                      <PopoverContent className='p-1 bg-primary font-serif text-foreground text-center'>
                        <p>Delt med: {user.name || user.email}</p>
                      </PopoverContent>
                    </Popover>
                  ))}
                </div>
              )}
            </div>
            {list.owner.email === session?.user?.email && (
              <ShareListDialog listId={list.id} />
            )}
          </div>
          <Separator className='mb-8 mt-4' />
          <InteractiveItemList listId={list.id} initialItems={list.items} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
