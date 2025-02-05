'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { pusher } from '@/lib/pusher';
import type { Item, List } from '@prisma/client';
import { authorizeUser } from './auth-actions';

export async function getLists() {
  const user = await authorizeUser();

  return prisma.list.findMany({
    where: {
      OR: [{ ownerId: user.id }, { sharedWith: { some: { id: user.id } } }],
    },
    select: {
      id: true,
      name: true,
      items: { select: { id: true, name: true, completed: true } },
      owner: { select: { id: true, name: true, email: true, image: true } },
      sharedWith: {
        select: { id: true, name: true, email: true, image: true },
      },
    },
  });
}

export async function createList(formData: FormData): Promise<List> {
  const user = await authorizeUser();
  const name = formData.get('name') as string;

  const list = await prisma.list.create({
    data: {
      name,
      owner: { connect: { id: user.id } },
    },
  });

  revalidatePath('/');
  await pusher.trigger('grocery-shopping-lists', 'list-updated', {});

  return list;
}

export async function shareList(listId: string, email: string) {
  const user = await authorizeUser();

  const result = await prisma.$transaction(async (prisma) => {
    const list = await prisma.list.findUnique({
      where: { id: listId },
      select: { ownerId: true },
    });

    if (!list || list.ownerId !== user.id) {
      throw new Error('Unauthorized or List not found');
    }

    const userToShare = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!userToShare) {
      throw new Error('User not found');
    }

    return prisma.list.update({
      where: { id: listId },
      data: {
        sharedWith: {
          connect: { id: userToShare.id },
        },
      },
    });
  });

  revalidatePath('/');
  await pusher.trigger('grocery-shopping-lists', 'list-updated', {});

  return { result, message: 'List shared successfully' };
}

export async function addItem(formData: FormData): Promise<Item> {
  const user = await authorizeUser();
  const listId = formData.get('listId') as string;
  const name = formData.get('name') as string;

  const item = await prisma.item.create({
    data: {
      name,
      list: {
        connect: {
          id: listId,
          OR: [{ ownerId: user.id }, { sharedWith: { some: { id: user.id } } }],
        },
      },
    },
  });

  revalidatePath(`/lists/${listId}`);
  await pusher.trigger('grocery-shopping-lists', 'list-updated', { listId });

  return item;
}

export async function toggleItemCompletion(formData: FormData): Promise<Item> {
  const user = await authorizeUser();
  const itemId = formData.get('itemId') as string;

  const item = await prisma.item.findUnique({
    where: {
      id: itemId,
      list: {
        OR: [{ ownerId: user.id }, { sharedWith: { some: { id: user.id } } }],
      },
    },
    select: { completed: true, listId: true, id: true },
  });

  if (!item) throw new Error('Unauthorized or Item not found');

  const updatedItem = await prisma.item.update({
    where: { id: itemId },
    data: { completed: !item.completed },
    include: { list: true },
  });

  revalidatePath(`/lists/${updatedItem.list.id}`);
  await pusher.trigger('grocery-shopping-lists', 'list-updated', {
    listId: updatedItem.list.id,
  });

  return updatedItem;
}

export async function deleteItem(formData: FormData): Promise<Item> {
  const user = await authorizeUser();
  const itemId = formData.get('itemId') as string;

  if (!itemId) {
    throw new Error('Invalid request: itemId is required');
  }

  const deletedItem = await prisma.item.delete({
    where: {
      id: itemId,
      list: {
        OR: [{ ownerId: user.id }, { sharedWith: { some: { id: user.id } } }],
      },
    },
  });

  if (!deletedItem) {
    throw new Error('Unauthorized or Item not found');
  }

  revalidatePath('/');
  await pusher.trigger('grocery-shopping-lists', 'list-updated', {});

  return deletedItem;
}
