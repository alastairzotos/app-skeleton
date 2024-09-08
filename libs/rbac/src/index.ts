type ResourceMap<C extends string> = Record<C, any>;

export type UserBase = {
  role: string;
};

export type PermissionCheck<U extends UserBase = { role: string }, R = any> = (user: U, resource?: R) => boolean;

export interface Permissions<U extends UserBase = UserBase, R = any> {
  read?: PermissionCheck<U, R>;
  write?: PermissionCheck<U, R>;
  delete?: PermissionCheck<U, R>;
}

export class Grant<U extends UserBase, C extends string, RMap extends ResourceMap<C>> {
  permissions: Record<string, Permissions<U, RMap[C]>> = {};

  read<K extends C>(resourceType: K, check: PermissionCheck<U, RMap[K]> = () => true) {
    this.permissions[resourceType] = this.permissions[resourceType] || {};
    this.permissions[resourceType].read = check as any;
    return this;
  }

  write<K extends C>(resourceType: K, check: PermissionCheck<U, RMap[K]> = () => true) {
    this.permissions[resourceType] = this.permissions[resourceType] || {};
    this.permissions[resourceType].write = check as any;
    return this;
  }

  delete<K extends C>(resourceType: K, check: PermissionCheck<U, RMap[K]> = () => true) {
    this.permissions[resourceType] = this.permissions[resourceType] || {};
    this.permissions[resourceType].delete = check as any;
    return this;
  }
}

export class PermissionChecker<U extends UserBase, C extends string, RMap extends ResourceMap<C>> {
  constructor(private user: U, private grant: Grant<U, C, RMap>) {}

  read<K extends C>(resourceType: K, resource?: RMap[K]) {
    return this.grant.permissions[resourceType]?.read?.(this.user, resource) || false;
  }

  write<K extends C>(resourceType: K, resource?: RMap[K]) {
    return this.grant.permissions[resourceType]?.write?.(this.user, resource) || false;
  }

  delete<K extends C>(resourceType: K, resource?: RMap[K]) {
    return this.grant.permissions[resourceType]?.delete?.(this.user, resource) || false;
  }
}

export class AccessControl<U extends UserBase, C extends string = string, RMap extends ResourceMap<C> = ResourceMap<C>> {
  private grants: Record<string, Grant<U, C, RMap>> = {};

  grant(role: string) {
    const grant = new Grant<U, C, RMap>();

    this.grants[role] = grant;

    return grant;
  }

  can<R = any>(user: U): PermissionChecker<U, C, RMap> | null {
    const grant = this.grants[user.role];

    if (!grant) {
      return null;
    }

    return new PermissionChecker<U, C, RMap>(user, grant);
  }
}
