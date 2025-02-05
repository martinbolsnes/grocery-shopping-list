'use client';

import { useState, useTransition, useOptimistic, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  addItem,
  deleteItem,
  toggleItemCompletion,
} from '../actions/list-actions';
import { LoadingSpinner } from './LoadingSpinner';
import { Plus } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';

interface Item {
  id: string;
  name: string;
  completed: boolean;
}

interface InteractiveItemListProps {
  listId: string;
  initialItems: Item[];
}

export function InteractiveItemList({
  listId,
  initialItems,
}: InteractiveItemListProps) {
  const [items, setItems] = useState(initialItems);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [optimisticItems, addOptimisticItem] = useOptimistic(
    items,
    (state, newItem: Item) => [...state, newItem]
  );

  const handleAddItem = async (formData: FormData) => {
    const name = formData.get('name') as string;
    const tempId = `temp-${Date.now()}`;

    const optimisticItem = {
      id: tempId,
      name,
      completed: false,
    };

    setItems((prevItems) => [...prevItems, optimisticItem]);

    startTransition(async () => {
      const newItem = await addItem(formData);

      setItems((prevItems) =>
        prevItems.map((item) => (item.id === tempId ? newItem : item))
      );

      router.refresh();
    });
  };

  const debouncedToggleCompletion = useDebouncedCallback((itemId: string) => {
    const formData = new FormData();
    formData.append('itemId', itemId);
    startTransition(async () => {
      const updatedItem = await toggleItemCompletion(formData);
      setItems((prevItems) =>
        prevItems.map((item) => (item.id === itemId ? updatedItem : item))
      );
      router.refresh();
    });
  }, 300);

  const handleToggleCompletion = useCallback(
    (itemId: string) => {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, completed: !item.completed } : item
        )
      );
      debouncedToggleCompletion(itemId);
    },
    [debouncedToggleCompletion]
  );

  const handleDeleteItem = async (formData: FormData) => {
    const itemId = formData.get('itemId') as string;

    if (!itemId) {
      console.error('Invalid request: itemId is required');
      return;
    }

    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));

    startTransition(async () => {
      await deleteItem(formData);
      router.refresh();
    });
  };

  return (
    <div>
      <form action={handleAddItem} className='mb-4 flex'>
        <input type='hidden' name='listId' value={listId} />
        <Input
          type='text'
          name='name'
          placeholder='Ny ting'
          className='mr-2 text-base font-serif'
        />
        <Button
          type='submit'
          variant='default'
          disabled={isPending}
          className='font-serif'
        >
          {isPending ? <LoadingSpinner /> : 'Legg til'}
        </Button>
      </form>
      <ul className='space-y-4'>
        {optimisticItems.map((item) => (
          <li
            key={item.id}
            className='flex items-center justify-between font-sans font-bold'
          >
            <div className='flex items-center space-x-2'>
              <Checkbox
                className='h-7 w-7'
                id={item.id}
                checked={item.completed}
                onCheckedChange={() => handleToggleCompletion(item.id)}
                disabled={isPending}
              />
              <label
                htmlFor={item.id}
                className={`text-xl ${
                  item.completed ? 'line-through text-muted-foreground' : ''
                }`}
              >
                {item.name}
              </label>
            </div>
            <form action={handleDeleteItem}>
              <input type='hidden' name='itemId' value={item.id} />
              <Button
                type='submit'
                variant='outline'
                size='icon'
                className='h-8 w-8'
              >
                <Plus className='rotate-45' />
              </Button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
