import { CacheModule as NestCacheModule, Global, Module } from "@nestjs/common";
import * as RedisStore from "cache-manager-redis-store";

@Global()
@Module({
    imports: [
        NestCacheModule.register({
            store: RedisStore,
            host: "redis",
            port: 6379,
        }),
    ],
    exports: [NestCacheModule],
})
export class CacheModule {}
