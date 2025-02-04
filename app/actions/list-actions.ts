'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { pusher } from '@/lib/pusher';

export async function getLists() {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  return prisma.list.findMany({
    where: {
      OR: [
        { ownerId: session.user.id },
        { sharedWith: { some: { id: session.user.id } } },
      ],
    },
    include: {
      items: true,
      owner: { select: { name: true, email: true, image: true } },
      sharedWith: {
        select: { name: true, email: true, id: true, image: true },
      },
    },
  });
}

export async function createList(formData: FormData): Promise<any> {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const name = formData.get('name') as string;

  const list = await prisma.list.create({
    data: {
      name,
      owner: { connect: { id: session.user.id } },
    },
  });

  revalidatePath('/');
  await pusher.trigger('grocery-shopping-lists', 'list-updated', {});

  return list;
}

export async function shareList(listId: string, email: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const list = await prisma.list.findUnique({
    where: { id: listId },
    include: { owner: true },
  });

  if (!list) {
    throw new Error('List not found');
  }

  if (list.ownerId !== session.user.id) {
    throw new Error('Unauthorized');
  }

  const userToShare = await prisma.user.findUnique({
    where: { email },
  });

  if (!userToShare) {
    throw new Error('User not found');
  }

  await prisma.list.update({
    where: { id: listId },
    data: {
      sharedWith: {
        connect: { id: userToShare.id },
      },
    },
  });

  revalidatePath('/');
  await pusher.trigger('grocery-shopping-lists', 'list-updated', {});

  return { message: 'List shared successfully' };
}

export async function addItem(formData: FormData): Promise<any> {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const listId = formData.get('listId') as string;
  const name = formData.get('name') as string;

  const list = await prisma.list.findUnique({
    where: { id: listId },
    include: { sharedWith: true },
  });

  if (!list) {
    throw new Error('List not found');
  }

  if (
    list.ownerId !== session.user.id &&
    !list.sharedWith.some((user) => user.id === session.user?.id)
  ) {
    throw new Error('Unauthorized');
  }

  const item = await prisma.item.create({
    data: {
      name,
      list: { connect: { id: listId } },
    },
  });

  revalidatePath('/');
  await pusher.trigger('grocery-shopping-lists', 'list-updated', {});

  return item;
}

export async function toggleItemCompletion(formData: FormData): Promise<any> {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const itemId = formData.get('itemId') as string;

  const item = await prisma.item.findUnique({
    where: { id: itemId },
    include: { list: { include: { sharedWith: true } } },
  });

  if (!item) {
    throw new Error('Item not found');
  }

  if (
    item.list.ownerId !== session.user.id &&
    !item.list.sharedWith.some((user) => user.id === session.user?.id)
  ) {
    throw new Error('Unauthorized');
  }

  const updatedItem = await prisma.item.update({
    where: { id: itemId },
    data: { completed: !item.completed },
  });

  revalidatePath('/');
  await pusher.trigger('grocery-shopping-lists', 'list-updated', {});

  return updatedItem;
}
