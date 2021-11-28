import React, { useEffect, useMemo, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import {
    OpenVidu,
    Publisher,
    StreamEvent,
    StreamManager,
    Subscriber,
    VideoInsertMode,
} from "openvidu-browser";
import { useParams } from "react-router-dom";
import useTitumirQuery from "hooks/useTitumirQuery";
import { QueryContextKey } from "configs/enums";
import { useAuthStore } from "state/authorization-store";
import { ClassSessionMetadata } from "services/api/titumir";
import { Button, chakra, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import OpenViduVideo from "./components/OpenViduVideo";

const ClassSession = () => {
    const { sessionId, grade, section } =
        useParams<{ sessionId: string; grade: string; section: string }>();

    const school = useAuthStore((s) => s.user?.school);
    const { data } = useTitumirQuery<ClassSessionMetadata | null>(
        QueryContextKey.CLASS_SESSION,
        async (api) => {
            if (!school || !grade || !section) return null;
            const sessionMetadata = await api.joinSession(
                school?._id,
                parseInt(grade),
                section,
                sessionId,
            );
            return sessionMetadata.json;
        },
    );

    const openvidu = useMemo(() => new OpenVidu(), []);
    const session = useMemo(() => openvidu.initSession(), []);

    const [isConnected, setIsConnected] = useState(false);
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [publisher, setPublisher] = useState<Publisher>();

    useEffect(() => {
        return () => {
            session.disconnect();
        };
    }, []);

    function deleteSubscriber(streamManager: StreamManager) {
        const index = subscribers.indexOf(streamManager as Subscriber, 0);
        if (index > -1) {
            const copySubscriber = [...subscribers];
            copySubscriber.splice(index, 1);
            setSubscribers(copySubscriber);
        }
    }

    async function joinSession() {
        session.on("streamCreated", (event) => {
            const subscriber = session.subscribe((event as StreamEvent).stream, "");

            setSubscribers([...subscribers, subscriber]);
        });

        session.on("streamDestroyed", (event) => {
            event.preventDefault();
            deleteSubscriber((event as StreamEvent).stream.streamManager);
        });

        session.on("exception", (exception) => {
            console.error("[OpenViduException]: ", exception);
        });

        if (data?.token) {
            try {
                await session.connect(data?.token);
                setIsConnected(true);
                const publisher = openvidu.initPublisher("", {
                    audioSource: undefined,
                    videoSource: undefined,
                    publishAudio: true,
                    publishVideo: true,
                    resolution: "1280x720",
                    frameRate: 25,
                    insertMode: VideoInsertMode.APPEND,
                    mirror: false,
                });

                await session.publish(publisher);
                setPublisher(publisher);
            } catch (error) {
                console.error("[OpenViduConnectionException]: ", error);
            }
        }
    }

    function leaveSession() {
        session.disconnect();
        unstable_batchedUpdates(() => {
            setSubscribers([]);
            setPublisher(undefined);
            setIsConnected(false);
        });
    }

    if (isConnected) {
        return (
            <VStack>
                <chakra.section w="full">
                    <HStack justify="space-between" px="2" py="1">
                        <Heading>
                            Session <chakra.span color="green.400">{grade}</chakra.span>
                            {" > "}
                            <chakra.span color="blue.400">
                                {decodeURI(section)}
                            </chakra.span>
                            {" > "}
                            <chakra.span color="pink.400">{sessionId}</chakra.span>
                        </Heading>
                        <Button onClick={leaveSession} colorScheme="red">
                            Leave
                        </Button>
                    </HStack>
                </chakra.section>
                <HStack w="full" wrap="wrap">
                    {publisher && <OpenViduVideo streamManager={publisher} />}
                    {subscribers.map((subscriber, i) => (
                        <OpenViduVideo key={i} streamManager={subscriber} />
                    ))}
                </HStack>
            </VStack>
        );
    }

    return (
        <VStack>
            <Heading size="lg">Join Session</Heading>
            <Text fontSize="lg">
                <chakra.span color="green.400">{grade}</chakra.span>
                {" > "}
                <chakra.span color="blue.400">{decodeURI(section)}</chakra.span>
                {" > "}
                <chakra.span color="pink.400">{sessionId}</chakra.span>
            </Text>
            <Button onClick={joinSession}>Join</Button>
        </VStack>
    );
};

export default ClassSession;
