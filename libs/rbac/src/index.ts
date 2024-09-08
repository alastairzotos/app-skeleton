type ResourceMap<C extends string> = Record<C, any>;

export interface ACConfig<U>{
  getUserRole: (user: U) => string;
}

export type PermissionCheck<U, R = any> = (user: U, resource?: R) => Promise<boolean> | boolean;
const defaultPermissionCheck: PermissionCheck<any, any> = () => true;

export interface Permissions<U, R = any> {
  create?: PermissionCheck<U, R>;
  read?: PermissionCheck<U, R>;
  update?: PermissionCheck<U, R>;
  delete?: PermissionCheck<U, R>;
}

export class Grant<U, C extends string, RMap extends ResourceMap<C>> {
  /** @internal */
  permissions: Record<string, Permissions<U, RMap[C]>> = {};

  create<K extends C>(resourceType: K, check: PermissionCheck<U, RMap[K]> = defaultPermissionCheck) {
    this.permissions[resourceType] = this.permissions[resourceType] || {};
    this.permissions[resourceType].create = check as any;
    return this;
  }

  read<K extends C>(resourceType: K, check: PermissionCheck<U, RMap[K]> = defaultPermissionCheck) {
    this.permissions[resourceType] = this.permissions[resourceType] || {};
    this.permissions[resourceType].read = check as any;
    return this;
  }

  update<K extends C>(resourceType: K, check: PermissionCheck<U, RMap[K]> = defaultPermissionCheck) {
    this.permissions[resourceType] = this.permissions[resourceType] || {};
    this.permissions[resourceType].update = check as any;
    return this;
  }

  delete<K extends C>(resourceType: K, check: PermissionCheck<U, RMap[K]> = defaultPermissionCheck) {
    this.permissions[resourceType] = this.permissions[resourceType] || {};
    this.permissions[resourceType].delete = check as any;
    return this;
  }
}

export class PermissionChecker<U, C extends string, RMap extends ResourceMap<C>> {
  constructor(private user: U, private grant: Grant<U, C, RMap>) {}

  async create<K extends C>(resourceType: K, resource?:  RMap[K]) {
    return await this.grant.permissions[resourceType]?.create?.(this.user, resource) || false;
  }

  async read<K extends C>(resourceType: K, resource?: RMap[K]) {
    return await this.grant.permissions[resourceType]?.read?.(this.user, resource) || false;
  }

  async update<K extends C>(resourceType: K, resource?: RMap[K]) {
    return await this.grant.permissions[resourceType]?.update?.(this.user, resource) || false;
  }

  async delete<K extends C>(resourceType: K, resource?: RMap[K]) {
    return await this.grant.permissions[resourceType]?.delete?.(this.user, resource) || false;
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
