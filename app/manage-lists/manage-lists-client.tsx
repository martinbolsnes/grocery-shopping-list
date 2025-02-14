'use client';

import { useState } from 'react';
import type { Session } from 'next-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { updateListName, deleteList } from '../actions/list-actions';
import { toast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface List {
  id: string;
  name: string;
  owner: {
    email: string;
    name?: string | null;
    image?: string | null;
  };
}

interface ManageListsClientProps {
  lists: List[];
  session: Session;
}

export function ManageListsClient({
  lists,
  session,
}: ManageListsClientProps): JSX.Element {
  const [editingList, setEditingList] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEdit = (listId: string, currentName: string) => {
    setEditingList(listId);
    setNewName(currentName);
  };

  const handleSave = async (listId: string) => {
    setLoading(true);
    try {
      await updateListName(listId, newName);
      setEditingList(null);
      setLoading(false);
      toast({
        title: 'Lagret',
        description: 'Nytt navn på listen er lagret',
      });
    } catch (error) {
      toast({
        title: 'Feil',
        description: 'En feil skjedde ved oppdatering av listen',
        variant: 'destructive',
      });
      throw new Error(`Error editing form: ${error}`);
    }
  };

  const handleDeleteClick = (listId: string) => {
    setListToDelete(listId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    if (listToDelete) {
      try {
        await deleteList(listToDelete);
        setDeleteDialogOpen(false);
        setListToDelete(null);
        setLoading(false);
        toast({
          title: 'Slettet',
          description: 'Listen er slettet',
        });
      } catch (error) {
        toast({
          title: 'Feil',
          description:
            'Klarte ikke slette listen. Sjekk at listen er tom før du sletter og at du er eier av listen',
          variant: 'destructive',
        });
        throw new Error(`Error deleting form: ${error}`);
      }
    }
  };

  return (
    <>
      <div className='grid gap-4'>
        {lists.map((list) => (
          <Card key={list.id}>
            <CardHeader>
              <CardTitle className='font-sans'>{list.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {editingList === list.id ? (
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className='mb-2'
                />
              ) : (
                <div className='flex items-center space-x-2'>
                  <p className='font-serif'>Eier</p>
                  <Avatar className='h-8 w-8'>
                    <AvatarImage
                      src={list.owner.image || ''}
                      alt={list.owner.name || ''}
                    />
                    <AvatarFallback>
                      {list.owner.name?.charAt(0) || 'O'}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
            </CardContent>
            <CardFooter className='flex justify-between'>
              {list.owner.email === session.user?.email && (
                <>
                  {editingList === list.id ? (
                    <Button
                      className='font-serif'
                      onClick={() => handleSave(list.id)}
                    >
                      {loading ? <LoadingSpinner /> : 'Lagre'}
                    </Button>
                  ) : (
                    <Button
                      className='font-serif'
                      variant='secondary'
                      onClick={() => handleEdit(list.id, list.name)}
                    >
                      Endre navn
                    </Button>
                  )}
                  <Button
                    className='font-serif'
                    variant='destructive'
                    onClick={() => handleDeleteClick(list.id)}
                  >
                    Slett liste
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='font-sans'>Bekreft sletting</DialogTitle>
            <DialogDescription className='font-serif'>
              Er du sikker på at du vil slette listen? Denne handlingen er
              permanent
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-x-2 sm:space-y-0'>
            <Button
              className='font-serif'
              variant='outline'
              onClick={() => setDeleteDialogOpen(false)}
            >
              Avbryt
            </Button>
            <Button
              className='font-serif'
              variant='destructive'
              onClick={handleDeleteConfirm}
            >
              {loading ? <LoadingSpinner /> : 'Slett'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
