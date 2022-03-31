import {
    DeepPartial,
    FindConditions,
    FindManyOptions,
    FindOneOptions,
    QueryRunner,
    Repository,
    SaveOptions,
} from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

export type PartialKey<T, K extends PropertyKey = PropertyKey> = Partial<
    Pick<T, Extract<keyof T, K>>
> &
    Omit<T, K> extends infer O
    ? { [P in keyof O]: O[P] }
    : never;

export default abstract class BasicEntityService<
    Entity,
    CreatePayload = DeepPartial<Entity>,
> {
    constructor(private readonly repo: Repository<Entity>) {}

    queryBuilder(alias?: string, queryRunner?: QueryRunner) {
        return this.repo.createQueryBuilder(alias, queryRunner);
    }

    create(payload: CreatePayload, options?: SaveOptions): Promise<Entity>;
    create(payload: CreatePayload[], options?: SaveOptions): Promise<Entity[]>;

    create(
        payload: CreatePayload | CreatePayload[],
        options?: SaveOptions,
    ): Promise<Entity | Entity[]> {
        const entity = this.repo.create(payload as any);
        return this.save(entity, options);
    }

    findOne(criteria: FindConditions<Entity>, options?: FindOneOptions<Entity>) {
        return this.repo.findOneOrFail(criteria, options);
    }

    find(
        conditions?: FindManyOptions<Entity>["where"],
        options: Omit<FindManyOptions<Entity>, "where"> = {},
    ) {
        conditions && Object.assign(options, { where: conditions });
        return this.repo.find(options);
    }

    findOneUnsafe(criteria: FindConditions<Entity>, options?: FindOneOptions<Entity>) {
        return this.repo.findOne(criteria, options);
    }

    async findOneAndUpdate(
        criteria: FindConditions<Entity>,
        payload: DeepPartial<Omit<Entity, "_id">>,
        options?: FindOneOptions<Entity> & SaveOptions,
    ) {
        const entity = await this.findOne(criteria, options);
        Object.assign(entity, payload);
        return await this.save(entity, options);
    }

    update(
        criteria: string | string[] | FindConditions<Entity>,
        partialEntity: QueryDeepPartialEntity<Entity>,
    ) {
        return this.repo.update(criteria, partialEntity);
    }

    save(entities: Entity | Entity, options?: SaveOptions): Promise<Entity>;
    save(entities: Entity[] | Entity, options?: SaveOptions): Promise<Entity[]>;

    save(entities: Entity[] | Entity, options?: SaveOptions) {
        if (Array.isArray(entities)) {
            return this.repo.save(entities, options);
        }
        return this.repo.save(entities, options);
    }

    // delete() {}
}
