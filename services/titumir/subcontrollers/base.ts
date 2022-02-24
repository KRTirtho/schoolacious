import { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import {
  SupabaseClient,
  PostgrestResponse,
  PostgrestSingleResponse,
  PostgrestMaybeSingleResponse,
} from '@supabase/supabase-js';
import { PartialKey } from '..';

export interface FiltersObject<T> {
  eq?: Partial<T>;
  neq?: Partial<T>;
  gt?: Partial<T>;
  gte?: Partial<T>;
  lt?: Partial<T>;
  lte?: Partial<T>;
  like?: Partial<T>;
  ilike?: Partial<T>;
  is?: Record<keyof T, boolean | null>;
  in?: Record<keyof T, T[keyof T][]>;
  rangeGt?: Record<keyof T, string>;
  rangeGte?: Record<keyof T, string>;
  rangeLt?: Record<keyof T, string>;
  rangeLte?: Record<keyof T, string>;
  rangeAdjacent?: Record<keyof T, string>;
  contains?: Record<keyof T, T[keyof T][]>;
  containedBy?: Record<keyof T, T[keyof T][]>;
  overlaps?: Record<keyof T, T[keyof T][]>;
  textSearch?: [
    column: keyof T,
    value: T[keyof T][],
    options:
      | {
          config?: string;
          type?: 'plain' | 'phrase' | 'websearch' | null;
        }
      | undefined
  ][];
  or?: Parameters<PostgrestFilterBuilder<T>['not']>[];
  not?: Parameters<PostgrestFilterBuilder<T>['filter']>[];
  filters?: Parameters<PostgrestFilterBuilder<T>['filter']>[];
}

export interface BaseControllerGetOrListOptions<TSchema>
  extends FiltersObject<TSchema> {
  columns?: Array<keyof TSchema>;
}

export interface BaseControllerUpdateOrDeleteOptions<
  USchema,
  T extends boolean = true
> extends FiltersObject<USchema> {
  single?: T;
}

type ObjectLikeFilterOperators =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'like'
  | 'ilike'
  | 'is'
  | 'in'
  | 'rangeGt'
  | 'rangeGte'
  | 'rangeLt'
  | 'rangeLte'
  | 'rangeAdjacent'
  | 'contains'
  | 'containedBy'
  | 'overlaps';

type TupleLikeFilterOperators = 'textSearch' | 'or' | 'not' | 'filter';

interface ControllerCreateOptions {
  returning?: 'minimal' | 'representation';
  count?: null | 'exact' | 'planned' | 'estimated';
}

export default abstract class BaseController<
  T extends Record<string, unknown>
> {
  constructor(public supabase: SupabaseClient, public tableName: string) {
    this.tableName = tableName;
  }

  protected addObjectLikeOp(
    builder: PostgrestFilterBuilder<T>,
    data: Record<string, unknown>,
    op: ObjectLikeFilterOperators
  ): PostgrestFilterBuilder<T> {
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const val = data[key];
        (builder[op] as (arg1: unknown, arg2: unknown) => unknown)(key, val);
      }
    }
    return builder;
  }

  protected addTupleLikeOp(
    builder: PostgrestFilterBuilder<T>,
    data: [are1: any, arg2: any, arg3: unknown][],
    op: TupleLikeFilterOperators
  ): PostgrestFilterBuilder<T> {
    for (const [arg1, arg2, arg3] of data) {
      builder[op](arg1, arg2, arg3);
    }
    return builder;
  }

  protected interpretFilters<F extends FiltersObject<T>>(
    builder: PostgrestFilterBuilder<T>,
    { filters, textSearch, or, not, ...objectLikeOp }: F
  ): PostgrestFilterBuilder<T> {
    for (const opKey in objectLikeOp) {
      if (Object.prototype.hasOwnProperty.call(objectLikeOp, opKey)) {
        const op = objectLikeOp[opKey as keyof typeof objectLikeOp] ?? {};
        builder = this.addObjectLikeOp(
          builder,
          op,
          opKey as ObjectLikeFilterOperators
        );
      }
    }

    builder = this.addTupleLikeOp(builder, textSearch ?? [], 'textSearch');
    builder = this.addTupleLikeOp(builder, or ?? [], 'or');
    builder = this.addTupleLikeOp(builder, not ?? [], 'not');
    builder = this.addTupleLikeOp(builder, filters ?? [], 'filter');

    return builder;
  }

  async create(
    data:
      | PartialKey<T, 'id' | 'created_at' | 'updated_at'>
      | PartialKey<T, 'id' | 'created_at' | 'updated_at'>[],
    options?: ControllerCreateOptions
  ): Promise<PostgrestResponse<T>> {
    return await this.supabase.from<T>(this.tableName).insert(data, options);
  }

  delete(
    options?: BaseControllerUpdateOrDeleteOptions<T, true>
  ): Promise<PostgrestSingleResponse<T>>;
  delete(
    options?: BaseControllerUpdateOrDeleteOptions<T, false>
  ): Promise<PostgrestSingleResponse<T>>;
  async delete({
    single = true,
    ...options
  }: BaseControllerUpdateOrDeleteOptions<T, boolean> = {}): Promise<
    PostgrestSingleResponse<T> | PostgrestResponse<T>
  > {
    let builder = this.supabase.from<T>(this.tableName).delete();
    if (options) builder = this.interpretFilters(builder, options);
    return await (single ? builder.single() : builder);
  }

  async get(
    id: string,
    options?: BaseControllerGetOrListOptions<T>
  ): Promise<PostgrestMaybeSingleResponse<T>> {
    let builder = this.supabase
      .from<T>(this.tableName)
      .select(options?.columns?.join(','))
      .eq('id', id as T[keyof T]);
    if (options) builder = this.interpretFilters(builder, options);
    return await builder.maybeSingle();
  }

  async list(
    options?: BaseControllerGetOrListOptions<T>
  ): Promise<PostgrestResponse<T>> {
    let builder = this.supabase
      .from<T>(this.tableName)
      .select(options?.columns?.join(','));
    if (options) builder = this.interpretFilters(builder, options);
    return await builder;
  }

  update(
    data: Partial<T>,
    options?: BaseControllerUpdateOrDeleteOptions<T, true>
  ): Promise<PostgrestSingleResponse<T>>;
  update(
    data: Partial<T>,
    options?: BaseControllerUpdateOrDeleteOptions<T, false>
  ): Promise<PostgrestResponse<T>>;
  async update(
    data: Partial<T>,
    options?: BaseControllerUpdateOrDeleteOptions<T, boolean>
  ): Promise<PostgrestSingleResponse<T> | PostgrestResponse<T>> {
    let builder = this.supabase.from<T>(this.tableName).update(data);
    if (options) builder = this.interpretFilters(builder, options);
    return await (options?.single ? builder.single() : builder);
  }
}
