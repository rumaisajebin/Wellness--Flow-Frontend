import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { connect } from "twilio-video";

const VideoCall = () => {
  const [room, setRoom] = useState(null);
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  
  // Parse room_id and token from URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const roomId = queryParams.get("room_id");
  const token = queryParams.get("token");

  useEffect(() => {
    if (token && roomId) {
      connect(token, {
        name: roomId,
        audio: true,
        video: true,
      }).then((room) => {
        setRoom(room);
        
        const localTrack = Array.from(room.localParticipant.videoTracks.values())[0].track;
        localVideoRef.current.appendChild(localTrack.attach());

        room.on("participantConnected", (participant) => {
          participant.on("trackSubscribed", (track) => {
            remoteVideoRef.current.appendChild(track.attach());
          });
        });
      }).catch((error) => {
        console.error("Error connecting to room", error);
      });
    }
  }, [token, roomId]);

  const handleLeaveRoom = () => {
    if (room) {
      room.disconnect();
      setRoom(null);
    }
  };

  return (
    <div>
      <h2>Video Call</h2>
      <button onClick={handleLeaveRoom}>Leave Room</button>
      <div>
        <h3>Local Video</h3>
        <div ref={localVideoRef}></div>
      </div>
      <div>
        <h3>Remote Video</h3>
        <div ref={remoteVideoRef}></div>
      </div>
    </div>
  );
};

export default VideoCall;
