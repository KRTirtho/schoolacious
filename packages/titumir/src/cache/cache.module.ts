import { ClientOpts } from "redis";
import { CacheModule as NestCacheModule, Global, Module } from "@nestjs/common";
import * as RedisStore from "cache-manager-redis-store";
import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from "../../config";

@Global()
@Module({
    imports: [
        NestCacheModule.register<ClientOpts>({
            store: RedisStore,
            host: REDIS_HOST,
            port: parseInt(REDIS_PORT ?? ""),
            auth_pass: REDIS_PASSWORD,
        }),
    ],
    exports: [NestCacheModule],
})
export class CacheModule {}
