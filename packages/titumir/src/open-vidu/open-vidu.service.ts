import { Inject, Injectable } from "@nestjs/common";
import { OpenVidu } from "openvidu-node-client";

export interface OpenViduOptions {
    url: string;
    secret: string;
}

@Injectable()
export class OpenViduService extends OpenVidu {
    constructor(@Inject("OPENVIDU_OPTIONS") private options: OpenViduOptions) {
        super(options.url, options.secret);
    }
}
