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
import { useToast } from '@/hooks/use-toast';

interface ShareListDialogProps {
  listId: string;
}

export function ShareListDialog({ listId }: ShareListDialogProps) {
  const [email, setEmail] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleShare = async () => {
    try {
      await shareList(listId, email);
      setIsOpen(false);
      setEmail('');
      router.refresh();
    } catch (error) {
      toast({
        title: 'Feil ved deling av liste',
        description: `${error}`,
        variant: 'destructive',
      });
      throw new Error(`Failed to share list: ${error}`);
    }
    toast({
      title: 'Listen er delt',
      description: 'Personen du vil dele med kan nå se listen din',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='ghost' size='icon'>
          <Share />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader className='flex flex-col text-left'>
          <DialogTitle className='font-sans font-bold'>Del listen</DialogTitle>
          <DialogDescription className='font-serif'>
            Skriv inn eposten til den du vil dele listen med.
            <br />
            PS: Personen må ha en registrert konto
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-2'>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='email' className='text-left font-serif'>
              Epost
            </Label>
            <Input
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='col-span-3 text-base font-serif'
              placeholder='Epost'
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleShare} className='font-sans font-bold'>
            Del
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
