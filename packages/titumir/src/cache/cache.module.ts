import { CacheModule as NestCacheModule, Global, Module } from "@nestjs/common";
import * as RedisStore from "cache-manager-redis-store";
import { REDIS_HOST, REDIS_PORT } from "../../config";

@Global()
@Module({
    imports: [
        NestCacheModule.register({
            store: RedisStore,
            host: REDIS_HOST,
            port: REDIS_PORT,
        }),
    ],
    exports: [NestCacheModule],
})
export class CacheModule {}
