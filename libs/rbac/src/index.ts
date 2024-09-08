export type UserBase = {
  role: string;
};

export type PermissionCheck<U extends UserBase = { role: string }, R = any> = (user: U, resource?: R) => boolean;

export interface Permissions {
  read?: PermissionCheck;
  write?: PermissionCheck;
  delete?: PermissionCheck;
}

export class Grant<U extends UserBase> {
  permissions: Record<string, Permissions> = {};

  read<R = any>(resourceType: string, check: PermissionCheck<U, R> = () => true) {
    this.permissions[resourceType] = this.permissions[resourceType] || {};
    this.permissions[resourceType].read = check as any;
    return this;
  }

  write<R>(resourceType: string, check: PermissionCheck<U, R> = () => true) {
    this.permissions[resourceType] = this.permissions[resourceType] || {};
    this.permissions[resourceType].write = check as any;
    return this;
  }

  delete<R>(resourceType: string, check: PermissionCheck<U, R> = () => true) {
    this.permissions[resourceType] = this.permissions[resourceType] || {};
    this.permissions[resourceType].delete = check as any;
    return this;
  }
}

export class PermissionChecker<U extends UserBase> {
  constructor(private user: U, private grant: Grant<U>) {}

  read<R = any>(resourceType: string, resource?: R) {
    return this.grant.permissions[resourceType]?.read?.(this.user, resource) || false;
  }

  write<R = any>(resourceType: string, resource?: R) {
    return this.grant.permissions[resourceType]?.write?.(this.user, resource) || false;
  }

  delete<R = any>(resourceType: string, resource?: R) {
    return this.grant.permissions[resourceType]?.delete?.(this.user, resource) || false;
  }
}

export class AccessControl<U extends UserBase> {
  private grants: Record<string, Grant<U>> = {};

  grant(role: string) {
    const grant = new Grant<U>();

    this.grants[role] = grant;

    return grant;
  }

  can(user: U): PermissionChecker<U> | null {
    const grant = this.grants[user.role];

    if (!grant) {
      return null;
    }

    return new PermissionChecker<U>(user, grant);
  }
}
