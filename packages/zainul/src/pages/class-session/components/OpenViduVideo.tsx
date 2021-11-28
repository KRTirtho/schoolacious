import { chakra } from "@chakra-ui/react";
import { StreamManager } from "openvidu-browser";
import React, { FC, useEffect, useRef } from "react";

interface OpenViduVideoProps {
    streamManager: StreamManager;
}

const OpenViduVideo: FC<OpenViduVideoProps> = ({ streamManager }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            streamManager.addVideoElement(videoRef.current);
        }
    }, [videoRef.current]);

    return (
        <chakra.div>
            <video autoPlay ref={videoRef} />
        </chakra.div>
    );
};

export default OpenViduVideo;
