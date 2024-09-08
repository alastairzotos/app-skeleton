export type UserBase = {
  role: string;
};

export type PermissionCheck<U extends UserBase = { role: string }, R = any> = (user: U, resource?: R) => boolean;

export interface Permissions {
  read?: PermissionCheck;
  write?: PermissionCheck;
  delete?: PermissionCheck;
}

export class Grant<U extends UserBase, C extends string = string> {
  permissions: Record<string, Permissions> = {};

  read<R = any>(resourceType: C, check: PermissionCheck<U, R> = () => true) {
    this.permissions[resourceType] = this.permissions[resourceType] || {};
    this.permissions[resourceType].read = check as any;
    return this;
  }

  write<R>(resourceType: C, check: PermissionCheck<U, R> = () => true) {
    this.permissions[resourceType] = this.permissions[resourceType] || {};
    this.permissions[resourceType].write = check as any;
    return this;
  }

  delete<R>(resourceType: C, check: PermissionCheck<U, R> = () => true) {
    this.permissions[resourceType] = this.permissions[resourceType] || {};
    this.permissions[resourceType].delete = check as any;
    return this;
  }
}

export class PermissionChecker<U extends UserBase, C extends string> {
  constructor(private user: U, private grant: Grant<U>) {}

  read<R = any>(resourceType: C, resource?: R) {
    return this.grant.permissions[resourceType]?.read?.(this.user, resource) || false;
  }

  write<R = any>(resourceType: C, resource?: R) {
    return this.grant.permissions[resourceType]?.write?.(this.user, resource) || false;
  }

  delete<R = any>(resourceType: C, resource?: R) {
    return this.grant.permissions[resourceType]?.delete?.(this.user, resource) || false;
  }
}

export class AccessControl<U extends UserBase, C extends string = string> {
  private grants: Record<string, Grant<U>> = {};

  grant(role: string) {
    const grant = new Grant<U, C>();

    this.grants[role] = grant;

    return grant;
  }

  can(user: U): PermissionChecker<U, C> | null {
    const grant = this.grants[user.role];

    if (!grant) {
      return null;
    }

    return new PermissionChecker<U, C>(user, grant);
  }
}
