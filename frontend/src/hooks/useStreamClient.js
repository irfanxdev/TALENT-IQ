import { useState, useEffect, useRef } from "react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import { initializeStreamClient, disconnectStreamClient } from "../lib/stream";
import { sessionApi } from "../api/sessions";

function useStreamClient(session, loadingSession, isHost, isParticipant) {
  const [streamClient, setStreamClient] = useState(null);
  const [call, setCall] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isInitializingCall, setIsInitializingCall] = useState(true);

  // FIX: store references in useRef so cleanup always sees the latest values
  const videoCallRef = useRef(null);
  const chatClientRef = useRef(null);
  const streamClientRef = useRef(null);

  useEffect(() => {
    const initCall = async () => {
      if (!session?.callId) return;
      if (!isHost && !isParticipant) return;
      if (session.status === "completed") return;

      try {
        const { token, userId, userName, userImage } =
          await sessionApi.getStreamToken();

        // 1️⃣ Initialize Stream Video client
        const videoClient = await initializeStreamClient(
          {
            id: userId,
            name: userName,
            image: userImage,
          },
          token
        );

        streamClientRef.current = videoClient;
        setStreamClient(videoClient);

        // 2️⃣ Join call
        const callObj = videoClient.call("default", session.callId);
        await callObj.join({ create: true });

        videoCallRef.current = callObj;
        setCall(callObj);

        // 3️⃣ Initialize Stream Chat client
        const apiKey = import.meta.env.VITE_STREAM_API_KEY;
        const chatInstance = StreamChat.getInstance(apiKey);

        await chatInstance.connectUser(
          {
            id: userId,
            name: userName,
            image: userImage,
          },
          token
        );

        chatClientRef.current = chatInstance;
        setChatClient(chatInstance);

        // 4️⃣ Join chat channel
        const chatChannel = chatInstance.channel("messaging", session.callId);
        await chatChannel.watch();

        setChannel(chatChannel);
      } catch (error) {
        console.error("Error initializing call:", error);
        toast.error("Failed to join video call");
      } finally {
        setIsInitializingCall(false);
      }
    };

    if (session && !loadingSession) initCall();

    // -----------------------
    // SAFE CLEANUP (bug-free)
    // -----------------------
    return () => {
      (async () => {
        try {
          console.log("Running cleanup…");

          const callObj = videoCallRef.current;
          const chatInstance = chatClientRef.current;
          const streamInstance = streamClientRef.current;

          // 1️⃣ Leave call (only if joined)
          if (callObj?.state?.callingState === "joined") {
            console.log("Leaving call…");
            await callObj.leave();
          } else {
            console.log("Skipping leave — call not joined or already left.");
          }

          // 2️⃣ Disconnect chat
          if (chatInstance) {
            console.log("Disconnecting chat user…");
            await chatInstance.disconnectUser();
          }

          // 3️⃣ Disconnect main Stream client
          if (streamInstance) {
            console.log("Disconnecting Stream Video client…");
            await disconnectStreamClient();
          }

          // Clear refs
          videoCallRef.current = null;
          chatClientRef.current = null;
          streamClientRef.current = null;

        } catch (error) {
          console.error("Cleanup error:", error.message);
        }
      })();
    };
  }, [session?.callId, session?.status, loadingSession, isHost, isParticipant]);

  return {
    streamClient,
    call,
    chatClient,
    channel,
    isInitializingCall,
  };
}

export default useStreamClient;
