import { DynamicModule, Global, Module } from "@nestjs/common";
import { OpenViduOptions, OpenViduService } from "./open-vidu.service";

@Global()
@Module({})
export class OpenViduModule {
    static forRoot(options: OpenViduOptions): DynamicModule {
        return {
            global: true,
            module: OpenViduModule,
            providers: [
                {
                    provide: "OPENVIDU_OPTIONS",
                    useValue: options,
                },
                OpenViduService,
            ],
            exports: [OpenViduService],
        };
    }
}
