import React, { useCallback, useEffect, useMemo, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import {
    OpenVidu,
    Publisher,
    Session,
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
import {
    Button,
    chakra,
    Heading,
    HStack,
    IconButton,
    Text,
    Tooltip,
    VStack,
} from "@chakra-ui/react";
import Paper from "components/Paper/Paper";
import {
    BsCameraVideoFill,
    BsCameraVideoOffFill,
    BsMicFill,
    BsMicMuteFill,
} from "react-icons/bs";
import { FaPhoneSlash } from "react-icons/fa";
import { VideoLayout } from "./components/VideoLayout";

type SessionEvenHandler = Parameters<Session["on"]>["1"];

const ClassSession = () => {
    const { sessionId, grade, section } = useParams<"sessionId" | "grade" | "section">();

    const school = useAuthStore((s) => s.user?.school);
    const { data } = useTitumirQuery<ClassSessionMetadata | null>(
        QueryContextKey.CLASS_SESSION,
        async (api) => {
            if (!school || !grade || !section || !sessionId) return null;
            const sessionMetadata = await api.joinDevelopmentSession(
                school?._id,
                parseInt(grade),
                section,
                sessionId,
            );
            return sessionMetadata.json;
        },
        { refetchOnReconnect: false, refetchOnWindowFocus: false },
    );

    const openvidu = useMemo(() => new OpenVidu(), []);
    const session = useMemo(() => openvidu.initSession(), []);

    const [isConnected, setIsConnected] = useState(false);
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [publisher, setPublisher] = useState<Publisher>();
    const [publishAudio, setPublishAudio] = useState(true);
    const [publishVideo, setPublishVideo] = useState(true);

    useEffect(() => {
        return () => {
            session.disconnect();
        };
    }, []);

    useEffect(() => {
        const onStreamCreated: SessionEvenHandler = (event) => {
            const subscriber = session.subscribe((event as StreamEvent).stream, "");
            setSubscribers((prev) => [...prev, subscriber]);
        };
        const onStreamDestroyed: SessionEvenHandler = (event) => {
            event.preventDefault();
            deleteSubscriber((event as StreamEvent).stream.streamManager);
        };
        const onSessionException: SessionEvenHandler = (exception) => {
            console.error("[OpenViduException]: ", exception);
        };

        session.on("streamCreated", onStreamCreated);
        session.on("streamDestroyed", onStreamDestroyed);
        session.on("exception", onSessionException);

        return () => {
            session.off("streamCreated", onStreamCreated);
            session.off("streamDestroyed", onStreamDestroyed);
            session.off("exception", onSessionException);
        };
    });

    useEffect(() => {
        publisher?.publishAudio(publishAudio);
    }, [publishAudio]);
    useEffect(() => {
        publisher?.publishVideo(publishVideo);
    }, [publishVideo]);

    function toggleAudio() {
        setPublishAudio(!publishAudio);
    }

    function toggleVideo() {
        setPublishVideo(!publishVideo);
    }

    function deleteSubscriber(streamManager: StreamManager) {
        setSubscribers(
            subscribers.filter(
                (subscriber) =>
                    subscriber.stream.streamId !== streamManager.stream.streamId,
            ),
        );
    }

    const joinSession = useCallback(async () => {
        if (data?.token) {
            try {
                await session.connect(data?.token);
                setIsConnected(true);
                const publisher = openvidu.initPublisher("", {
                    audioSource: undefined,
                    videoSource: undefined,
                    publishAudio,
                    publishVideo,
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
    }, [data?.token, session, openvidu, publishAudio, publishVideo]);

    const leaveSession = useCallback(() => {
        session.disconnect();
        unstable_batchedUpdates(() => {
            setSubscribers([]);
            setPublisher(undefined);
            setIsConnected(false);
        });
    }, [session]);

    const controls = (
        <>
            <Tooltip label="Mute/Unmute Mic">
                <IconButton
                    shadow="md"
                    rounded="50%"
                    variant="ghost"
                    aria-label="Mute/Unmute Mic"
                    colorScheme="red"
                    icon={publishAudio ? <BsMicFill /> : <BsMicMuteFill />}
                    onClick={toggleAudio}
                />
            </Tooltip>
            <Tooltip label="Turn on/off camera">
                <IconButton
                    shadow="md"
                    rounded="50%"
                    colorScheme="blue"
                    variant="ghost"
                    aria-label="Turn on/off camera"
                    icon={publishVideo ? <BsCameraVideoFill /> : <BsCameraVideoOffFill />}
                    onClick={toggleVideo}
                />
            </Tooltip>
        </>
    );

    if (isConnected) {
        return (
            <VStack>
                <chakra.section w="full">
                    <HStack justify="space-between" px="2" py="1">
                        <Heading size="lg">Session</Heading>
                        <Text>
                            <chakra.span color="green.400">{grade}</chakra.span>
                            {" / "}
                            <chakra.span color="blue.400">
                                {section && decodeURI(section)}
                            </chakra.span>
                            {" / "}
                            <chakra.span color="pink.400">{sessionId}</chakra.span>
                        </Text>
                    </HStack>
                </chakra.section>
                {publisher && (
                    <VideoLayout publisher={publisher} subscribers={subscribers} />
                )}
                <HStack justify="center" pos="fixed" bottom="5%">
                    {controls}
                    <Tooltip label="Leave conference">
                        <IconButton
                            icon={<FaPhoneSlash />}
                            aria-label="leave conference"
                            onClick={leaveSession}
                            colorScheme="red"
                            rounded="50%"
                            shadow="md"
                        />
                    </Tooltip>
                </HStack>
            </VStack>
        );
    }

    return (
        <Paper mt="5">
            <VStack align="flex-start" p="2">
                <Heading alignSelf="center" size="lg">
                    Join Session
                </Heading>
                <Text>
                    Grade: <chakra.span color="green.400">{grade}</chakra.span>
                </Text>
                <Text>
                    Section:{" "}
                    <chakra.span color="blue.400">
                        {section && decodeURI(section)}
                    </chakra.span>
                </Text>
                <Text>
                    Session: <chakra.span color="pink.400">{sessionId}</chakra.span>
                </Text>
                <HStack alignSelf="center" py="2">
                    {controls}
                </HStack>
                <Button alignSelf="center" onClick={joinSession}>
                    Join
                </Button>
            </VStack>
        </Paper>
    );
};

export default ClassSession;
