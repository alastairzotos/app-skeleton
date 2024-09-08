import { AccessControl } from "@repo/rbac";
import { UserData } from "decorators/principal.decorator";

export const ac = new AccessControl<UserData, 'collection' | 'other-table'>();

export type Collection = {
  ownerId: string;
}

ac.grant('user')
  .read<Collection>('collection', (user, collection) => collection.ownerId === user.userId)
  .write<Collection>('collection', (user, collection) => collection.ownerId === user.userId)
  .delete<Collection>('collection', (user, collection) => collection.ownerId === user.userId);

ac.grant('admin')
  .read('collection')
  .write('collection')
  .delete('collection');
