import { auth } from '@/auth';
import { getLists } from '../actions/list-actions';
import { ManageListsClient } from './manage-lists-client';

export default async function ManageLists() {
  const session = await auth();

  if (!session) {
    return (
      <div className='container mx-auto p-4'>
        Logg inn for å se dine lister.
      </div>
    );
  }

  const lists = await getLists();

  return (
    <div className='container mx-auto p-4 max-w-2xl'>
      <h1 className='text-2xl font-sans font-bold mb-4'>Dine lister</h1>
      <ManageListsClient lists={lists} session={session} />
    </div>
  );
}
