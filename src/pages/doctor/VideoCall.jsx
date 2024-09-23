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
      })
        .then((room) => {
          setRoom(room);
  
          // Attach local video track to localVideoRef
          const localParticipant = room.localParticipant;
          localParticipant.videoTracks.forEach((publication) => {
            const localTrack = publication.track;
            if (localVideoRef.current && localTrack) {
              localVideoRef.current.innerHTML = ""; // Clear previous local video
              localVideoRef.current.appendChild(localTrack.attach());
            }
          });
  
          // **Handle participant joining**
          room.on("participantConnected", (participant) => {
            console.log(`${participant.identity} connected`);
  
            // Handle track subscription for the participant
            participant.on("trackSubscribed", (track) => {
              console.log(`Track subscribed: ${track.kind}`);
  
              if (track.kind === "video" && remoteVideoRef.current) {
                remoteVideoRef.current.innerHTML = ""; // Clear previous remote video
                remoteVideoRef.current.appendChild(track.attach());
              }
            });
          });
  
          // Handle participant leaving
          room.on("participantDisconnected", (participant) => {
            console.log(`${participant.identity} disconnected`);
            participant.tracks.forEach((publication) => {
              if (publication.track) {
                publication.track.detach().forEach((element) => element.remove());
              }
            });
          });
        })
        .catch((error) => {
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
      <div>
        <p>
          Remote Video Ref:{" "}
          {remoteVideoRef.current
            ? `Attached (${remoteVideoRef.current.tagName})`
            : "Not Attached"}
        </p>
        <p>
          Local Video Ref:{" "}
          {localVideoRef.current
            ? `Attached (${localVideoRef.current.tagName})`
            : "Not Attached"}
        </p>
      </div>
    </div>
  );
};

export default VideoCall;
