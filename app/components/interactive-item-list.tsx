'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { addItem, toggleItemCompletion } from '../actions/list-actions';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from './LoadingSpinner';

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

  const handleAddItem = async (formData: FormData) => {
    startTransition(async () => {
      const newItem = await addItem(formData);
      setItems([...items, newItem]);
      router.refresh();
    });
  };

  const handleToggleCompletion = async (itemId: string) => {
    const formData = new FormData();
    formData.append('itemId', itemId);
    startTransition(async () => {
      const updatedItem = await toggleItemCompletion(formData);
      setItems(items.map((item) => (item.id === itemId ? updatedItem : item)));
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
          className='mr-2 text-base'
        />
        <Button type='submit' variant='default' disabled={isPending}>
          {isPending ? <LoadingSpinner /> : 'Legg til'}
        </Button>
      </form>
      <ul className='space-y-4'>
        {items.map((item) => (
          <li key={item.id} className='flex items-center'>
            <div className='flex items-center space-x-2'>
              <Checkbox
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
          </li>
        ))}
      </ul>
    </div>
  );
}
