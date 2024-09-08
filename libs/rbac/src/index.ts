type ResourceMap<C extends string> = Record<C, any>;

export interface ACConfig<U>{
  getUserRole: (user: U) => string;
}

export type PermissionCheck<U, R = any> = (user: U, resource?: R) => boolean;

export interface Permissions<U, R = any> {
  create?: boolean;
  read?: PermissionCheck<U, R>;
  update?: PermissionCheck<U, R>;
  delete?: PermissionCheck<U, R>;
}

export class Grant<U, C extends string, RMap extends ResourceMap<C>> {
  /** @internal */
  permissions: Record<string, Permissions<U, RMap[C]>> = {};

  create(resourceType: C, allowed = true) {
    this.permissions[resourceType] = this.permissions[resourceType] || {};
    this.permissions[resourceType].create = allowed;
    return this;
  }

  read<K extends C>(resourceType: K, check: PermissionCheck<U, RMap[K]> = () => true) {
    this.permissions[resourceType] = this.permissions[resourceType] || {};
    this.permissions[resourceType].read = check as any;
    return this;
  }

  update<K extends C>(resourceType: K, check: PermissionCheck<U, RMap[K]> = () => true) {
    this.permissions[resourceType] = this.permissions[resourceType] || {};
    this.permissions[resourceType].update = check as any;
    return this;
  }

  delete<K extends C>(resourceType: K, check: PermissionCheck<U, RMap[K]> = () => true) {
    this.permissions[resourceType] = this.permissions[resourceType] || {};
    this.permissions[resourceType].delete = check as any;
    return this;
  }
}

export class PermissionChecker<U, C extends string, RMap extends ResourceMap<C>> {
  constructor(private user: U, private grant: Grant<U, C, RMap>) {}

  create(resourceType: C) {
    return this.grant.permissions[resourceType]?.create || false;
  }

  read<K extends C>(resourceType: K, resource?: RMap[K]) {
    return this.grant.permissions[resourceType]?.read?.(this.user, resource) || false;
  }

  update<K extends C>(resourceType: K, resource?: RMap[K]) {
    return this.grant.permissions[resourceType]?.update?.(this.user, resource) || false;
  }

  delete<K extends C>(resourceType: K, resource?: RMap[K]) {
    return this.grant.permissions[resourceType]?.delete?.(this.user, resource) || false;
  }
}

export class AccessControl<U, RMap extends ResourceMap<string> = ResourceMap<string>> {
  private grants: Record<string, Grant<U, Extract<keyof RMap, string>, RMap>> = {};

  constructor(private config: ACConfig<U>) {}

  grant(role: string) {
    const grant = new Grant<U, Extract<keyof RMap, string>, RMap>();

    this.grants[role] = grant;

    return grant;
  }

  can(user: U): PermissionChecker<U, Extract<keyof RMap, string>, RMap> | null {
    const grant = this.grants[this.config.getUserRole(user)];

    if (!grant) {
      return null;
    }

    return new PermissionChecker<U, Extract<keyof RMap, string>, RMap>(user, grant);
  }
}
