import { AccessControl, AuthAction } from "./ac";

type ReadQuery<T> = number | string | (() => Promise<T>);

type CreateAccess<User, ResourceMap extends Record<string, any>> = {
  [K in keyof ResourceMap]: <T extends ResourceMap[K] = ResourceMap[K]>(values: Partial<T>) => {
    for: (user: User) => Promise<T | undefined>;
  }
}

type ReadAccess<User, ResourceMap extends Record<string, any>> = {
  [K in keyof ResourceMap]: <T extends ResourceMap[K] = ResourceMap[K]>(query: ReadQuery<T>) => {
    for: (user: User) => Promise<T | undefined>;
  }
}

type UpdateAccess<User, ResourceMap extends Record<string, any>> = {
  [K in keyof ResourceMap]: <T extends ResourceMap[K] = ResourceMap[K]>(query: ReadQuery<T>) => {
    for: (user: User) => {
      with: (values: Partial<T>) => Promise<T | undefined>
    };
  }
}

type DeleteAccess<User, ResourceMap extends Record<string, any>> = {
  [K in keyof ResourceMap]: <T = ResourceMap[K]>(id: number | string) => {
    for: (user: User) => Promise<T | void | undefined>;
  }
}

type ProtectedConfig<User, ResourceMap extends Record<string, any>, Roles extends string> = {
  accessControl: AccessControl<User, ResourceMap, Roles>;
  defaultCreate<K extends keyof ResourceMap>(resourceType: K, value: Partial<ResourceMap[K]>): Promise<ResourceMap[K]>;
  defaultRead<K extends keyof ResourceMap>(resourceType: K, resourceId: number | string): Promise<ResourceMap[K]>;
  defaultUpdate<K extends keyof ResourceMap>(resourceType: K, values: Partial<ResourceMap[K]>): Promise<ResourceMap[K]>
  defaultDelete<K extends keyof ResourceMap>(resourceType: K, resourceId: number | string): Promise<ResourceMap[K] | void | undefined>;
  throw404?(msg: string): void;
  throw403?(msg: string): void;
}

export class ProtectedRepository<User, ResourceMap extends Record<string, any>, Roles extends string> {
  protected _config?: ProtectedConfig<User, ResourceMap, Roles>;
  private _throw403?: (msg: string) => void;
  private _throw404?: (msg: string) => void;

  protected config(config: ProtectedConfig<User, ResourceMap, Roles>) {
    this._config = config;

    this._throw404 = config.throw404 || ((msg) => {
      throw new Error(msg)
    })

    this._throw403 = config.throw403 || ((msg) => {
      throw new Error(msg)
    })
  }

  create = new Proxy({} as CreateAccess<User, ResourceMap>, {
    get: <K extends Extract<keyof ResourceMap, string>>(target: CreateAccess<User, ResourceMap>, property: K) => {
      if (!(property in target)) {
        target[property] = (value: Partial<ResourceMap[K]>) => ({
          for: async (user: User) => {
            await this.can(user, 'create', property);
            return await this._config?.defaultCreate(property, value);
          }
        });
      }

      return target[property];
    }
  })

  read = new Proxy({} as ReadAccess<User, ResourceMap>, {
    get: <K extends Extract<keyof ResourceMap, string>>(target: ReadAccess<User, ResourceMap>, property: K) => {
      if (!(property in target)) {
        target[property] = (query: ReadQuery<ResourceMap[K]>) => ({
          for: async (user: User) => {
            return await this.can(user, 'read', property, query);
          }
        });
      }

      return target[property];
    }
  })

  update = new Proxy({} as UpdateAccess<User, ResourceMap>, {
    get: <K extends Extract<keyof ResourceMap, string>>(target: UpdateAccess<User, ResourceMap>, property: K) => {
      if (!(property in target)) {
        target[property] = (query: ReadQuery<ResourceMap[K]>) => ({
          for: (user: User) => ({
            with: async (values: Partial<ResourceMap[K]>) => {
              await this.can(user, 'update', property, query);
              return await this._config?.defaultUpdate(property, values);
            }
          })
        })
      }

      return target[property];
    }
  })

  delete = new Proxy({} as DeleteAccess<User, ResourceMap>, {
    get: <K extends Extract<keyof ResourceMap, string>>(target: DeleteAccess<User, ResourceMap>, property: K) => {
      if (!(property in target)) {
        target[property] = (id: number | string) => ({
          for: async (user: User) => {
            await this.can(user, 'delete', property, id);
            return await this._config?.defaultDelete(property, id);
          }
        });
      }

      return target[property];
    }
  })

  async can<K extends keyof ResourceMap>(
    user: User,
    action: AuthAction,
    resourceType: Extract<keyof ResourceMap, string>,
    query?: ReadQuery<ResourceMap[K]>
  ): Promise<ResourceMap[K] | undefined> {
    if (!this._config) {
      throw new Error(`Missing access control configuration`);
    }

    if (action === 'create') {
      if (!await this._config.accessControl.can(user).create(resourceType)) {
        this._throw403?.(`User cannot create resource ${resourceType}`);
        return;
      }
    } else {
      if (query === undefined) {
        throw new Error('Query parameter must be defined');
      }

      const resource = typeof query === 'function'
        ? await query()
        : await this._config.defaultRead(resourceType, query);

      const errorId = typeof query === 'function' ? '<handler>' : query;

      if (!resource) {
        this._throw404?.(`Resource ${resourceType}[${errorId}] does not exist`);
        return;
      }

      const canAccess = await this._config.accessControl.can(user).execute(action).on(resourceType, resource);

      if (!canAccess) {
        this._throw403?.(`User cannot ${action} resource ${resourceType}[${errorId}]`);
      }
      
      return resource;
    }
  }
}
