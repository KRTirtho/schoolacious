import {
    Grid,
    GridItem,
    IconButton,
    useBreakpointValue,
    AbsoluteCenter,
    useDisclosure,
} from "@chakra-ui/react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { Publisher, Subscriber } from "openvidu-browser";
import React, { FC, useMemo } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import OpenViduVideo from "./OpenViduVideo";

interface VideoLayoutProps {
    publisher: Publisher;
    subscribers: Subscriber[];
}

export const VideoLayout: FC<VideoLayoutProps> = ({
    publisher,
    subscribers: _subscribers,
}) => {
    // base -> 2x2 grid or less (aspect ratio 9/16) (max elements: 4)
    // sm -> same as base
    // md -> 3x4 grid or less (max elements: 12)
    // lg -> 4x4 grid or less (max elements: 16)
    // xl -> 5x4 grid or less (max elements: 20)
    // 2xl -> 5x5 grid or less (max elements: 25)

    const subscribers = _subscribers.concat(_subscribers).concat(_subscribers);

    const allowedTotalElements =
        useBreakpointValue({
            base: 4,
            sm: 4,
            md: 12,
            lg: 16,
            xl: 20,
            "2xl": 25,
        }) ?? 4;

    const videoSubscribers = useMemo(
        () => subscribers.filter((subscriber) => subscriber.stream.hasVideo),
        [subscribers],
    );

    const viewableSubscribers = useMemo(() => {
        if (videoSubscribers.length >= allowedTotalElements) {
            return videoSubscribers.slice(0, allowedTotalElements);
        } else {
            return videoSubscribers.concat(
                subscribers
                    .filter((subscriber) => !subscriber.stream.hasVideo)
                    .slice(0, allowedTotalElements - videoSubscribers.length),
            );
        }
    }, [videoSubscribers.length, allowedTotalElements]);

    const responsiveCols = useMemo(() => {
        const breakpoints = {
            base: 2,
            sm: 2,
            md: 3,
            lg: 4,
            xl: 4,
            "2xl": 5,
        };

        for (const key in breakpoints) {
            if (Object.prototype.hasOwnProperty.call(breakpoints, key)) {
                // type-safe key
                const safeKey = key as keyof typeof breakpoints;
                const cols = breakpoints[safeKey];

                const colNum = subscribers.length > cols ? cols : subscribers.length;

                breakpoints[safeKey] = colNum;
            }
        }

        return breakpoints;
    }, [subscribers.length]);

    const columns = useBreakpointValue(responsiveCols) ?? 2;

    const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });

    const animationVariants: Variants = {
        initial: {
            right: "-100%",
        },
        animate: {
            right: 0,
        },
        exit: {
            right: "-100%",
        },
    };

    const publisherVideoToggle = (
        <IconButton
            aria-label="Hide own video"
            icon={isOpen ? <FaAngleRight /> : <FaAngleLeft />}
            variant="ghost"
            colorScheme="white"
            rounded="50%"
            onClick={onToggle}
        />
    );
    return (
        <>
            <Grid
                flex={3}
                gap={2}
                templateRows={`repeat(auto-fill, .5fr)`}
                templateColumns={`repeat(${columns}, 1fr)`}
            >
                {viewableSubscribers.map((subscriber, i) => (
                    <GridItem key={i}>
                        <OpenViduVideo streamManager={subscriber} />
                    </GridItem>
                ))}
            </Grid>

            <AnimatePresence exitBeforeEnter initial={false}>
                {!isOpen && (
                    <motion.div
                        style={{ position: "fixed", bottom: "15%" }}
                        initial={{ right: "-100%" }}
                        animate={{ right: 0 }}
                        exit={{ right: "-100%" }}
                        transition={{ bounce: 0 }}
                    >
                        {publisherVideoToggle}
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence exitBeforeEnter initial={false}>
                {isOpen && (
                    <motion.div
                        style={{ position: "fixed", bottom: "5%", maxWidth: "25%" }}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={animationVariants}
                        transition={{ bounce: 0 }}
                    >
                        <AbsoluteCenter zIndex={1} axis="vertical">
                            {publisherVideoToggle}
                        </AbsoluteCenter>
                        <OpenViduVideo
                            streamManager={publisher}
                            style={{ borderRadius: "10px 0px 0px 10px" }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
