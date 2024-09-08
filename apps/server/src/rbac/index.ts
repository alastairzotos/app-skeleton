import { AccessControl } from "@repo/rbac";
import { UserData } from "decorators/principal.decorator";

export type Collection = {
  ownerId: string;
}

export type OtherTable = {
  someData: string;
}

interface ResourceMap {
  collection: Collection;
  otherTable: OtherTable;
}

export const ac = new AccessControl<UserData, ResourceMap>({
  getUserRole: (user) => user.role,
});

 ac.grant('user')
  .create('collection')
  .read('collection', (user, collection) => collection.ownerId === user.userId)
  .update('collection', (user, collection) => collection.ownerId === user.userId)
  .delete('collection', (user, collection) => collection.ownerId === user.userId);

ac.grant('admin')
  .create('collection')
  .read('collection')
  .update('collection')
  .delete('collection');
