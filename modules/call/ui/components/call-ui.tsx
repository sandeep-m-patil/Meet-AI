import { useState } from "react"
import { StreamTheme, useCall } from "@stream-io/video-react-sdk"
import { CallLobby } from "./call-lobby";
import { CallActive } from "./call-active";
import { CallEnded } from "./call-ended";

interface Props {
    meetingName: string
}

export const CallUI = ({ meetingName }: Props) => {

    const call = useCall();
    const [show, setShow] = useState<"lobby" | "call" | "ended">("lobby");
    const [hasJoined, setHasJoined] = useState(false); // <-- track join state

    const handleJoin = async () => {
        if (!call || hasJoined) return;

        try {
            await call.join();
            setHasJoined(true);
            setShow("call");
        } catch (error) {
            console.error("Error joining call:", error);
        }
    }

    const handleLeave = () => {
        if (!call) return;
        call.endCall();
        setHasJoined(false); // reset on leave
        setShow("ended");
    }

    return (
        <StreamTheme className="h-full w-full">
            {show === "lobby" && <CallLobby onJoin={handleJoin} />}
            {show === "call" && <CallActive onLeave={handleLeave} meetingName={meetingName} />}
            {show === "ended" && <CallEnded/>}
        </StreamTheme>
    )
}
