'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { shareList } from '../actions/list-actions';
import { Share } from 'lucide-react';

interface ShareListDialogProps {
  listId: string;
}

export function ShareListDialog({ listId }: ShareListDialogProps) {
  const [email, setEmail] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleShare = async () => {
    try {
      await shareList(listId, email);
      setIsOpen(false);
      setEmail('');
      router.refresh();
    } catch (error) {
      console.error('Failed to share list:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='ghost' size='icon'>
          <Share />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Del listen</DialogTitle>
          <DialogDescription>
            Skriv inn eposten til den du vil dele listen med.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='email' className='text-right'>
              Epost
            </Label>
            <Input
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='col-span-3'
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleShare}>Del</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
