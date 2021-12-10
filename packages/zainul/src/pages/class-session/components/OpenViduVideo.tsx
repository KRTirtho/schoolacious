import { chakra } from "@chakra-ui/react";
import { StreamManager } from "openvidu-browser";
import React, { FC, useEffect, useRef, ComponentPropsWithoutRef } from "react";

interface OpenViduVideoProps extends ComponentPropsWithoutRef<"video"> {
    streamManager: StreamManager;
}

const OpenViduVideo: FC<OpenViduVideoProps> = ({ streamManager, ...props }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            streamManager.addVideoElement(videoRef.current);
        }
        return () => {
            streamManager.removeAllVideos();
        };
    }, [videoRef.current]);

    return (
        <chakra.div display="inline-block">
            <video
                style={{ aspectRatio: "16 / 9", ...props.style }}
                autoPlay
                ref={videoRef}
                {...props}
            />
        </chakra.div>
    );
};

export default OpenViduVideo;
