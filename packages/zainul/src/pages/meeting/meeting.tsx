import React from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";

const Meeting = () => {
    return (
        <div>
            <JitsiMeeting roomName="COOL_NAME" domain="localhost:8443" />
        </div>
    );
};

export default Meeting;
