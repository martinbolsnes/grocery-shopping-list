'use client';

import { useState, useRef } from 'react';
import { createList, getLists } from '../actions/list-actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function CreateListForm() {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      await createList(formData);

      if (formRef.current) {
        formRef.current.reset();
      } else {
        throw new Error('Form reset failed');
      }
    } catch (error) {
      toast({
        title: 'Feil',
        description: `Det skjedde en feil ved oprettelse av ny liste: ${error}`,
      });
      throw new Error(`Error submitting form: ${error}`);
    } finally {
      setLoading(false);
      await getLists();
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className='flex'>
      <Input
        type='text'
        name='name'
        placeholder='Ny liste'
        className='mr-2 text-base'
      />
      <Button variant='secondary' size='icon' type='submit' disabled={loading}>
        <Plus className='h-4 w-4' />
      </Button>
    </form>
  );
}
