import React, { useEffect, useState, useRef } from "react";
import Peer from "peerjs";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import "bootstrap/dist/css/bootstrap.min.css";
import { useParams } from "react-router-dom";
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash } from 'react-icons/fa';
import "./css/VideoCall.css"
import PatientLayout from "../../component/PatientLayout";
import DoctorLayout from "../../component/DoctorLayout";

const VideoCall = () => {
  const { room_name } = useParams();
  const [localPeerId, setLocalPeerId] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [callStatus, setCallStatus] = useState("waiting");
  const [notification, setNotification] = useState("");
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [peer, setPeer] = useState(null);
  const [isInCall, setIsInCall] = useState(false);
  const [videoSocket, setVideoSocket] = useState(null);
  const [remotePeerId, setRemotePeerId] = useState("");
  const [remoteUserName, setRemoteUserName] = useState("");
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const { access ,role} = useSelector((state) => state.auth);
  console.log("User Role:", role);
  const userInfo = jwtDecode(access);
  const currentUser = userInfo.user_id;

  useEffect(() => {
    const peerInstance = new Peer();

    peerInstance.on("open", (id) => {
      console.log("My peer Id", id);
      setLocalPeerId(id);

      const socket = new WebSocket(
        `wss://rareblu.shop/ws/video-call/${room_name}/${currentUser}/`
      );

      setVideoSocket(socket);

      socket.onopen = () => {
        socket.send(
          JSON.stringify({ action: "join", peer_id: id, user_id: currentUser })
        );
      };

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if (message.action === "joined") {
          console.log(
            `${message.user.id} has joined the call. Peer ID: ${message.peer_id}`
          );

          if (message.user.id !== currentUser) {
            setRemotePeerId(message.peer_id);
            setRemoteUserName(message.user.id);
          }
        }

        if (message.action === "call") {
          console.log(`Incoming call from ${message.user.id} with Peer ID: ${message.peer_id}`);

          if (message.user.id !== currentUser) {
            setRemotePeerId(message.peer_id);
            setCallStatus("incoming");
            setNotification(`Incoming call from ${message.user.id}`);
          }
        }

        if (message.action === "decline" && message.peer_id === localPeerId) {
          console.log("Call declined by the remote user.");
          setIsInCall(false);
          setRemoteStream(null);
          setNotification("The remote user declined the call.");
          if (localStream) {
            localStream.getTracks().forEach((track) => track.stop());
          }
        }

        if (message.action === "end_call") {
          console.log("Call ended by the remote user.");
          setIsInCall(false);
          setRemoteStream(null);
          setNotification("The remote user has ended the call.");
          if (localStream) {
            localStream.getTracks().forEach((track) => track.stop());
          }
        }

        if (message.action === "mute" && message.user.id !== currentUser) {
          console.log(`${message.user.id} muted their mic.`);
          setIsMicOn(false);
          if (localStream) {
            localStream.getAudioTracks().forEach((track) => (track.enabled = false));
          }
        }

        if (message.action === "unmute" && message.user.id !== currentUser) {
          console.log(`${message.user.id} unmuted their mic.`);
          setIsMicOn(true);
          if (localStream) {
            localStream.getAudioTracks().forEach((track) => (track.enabled = true));
          }
        }

        if (message.action === "camera_off" && message.user.id !== currentUser) {
          console.log(`${message.user.id} turned off their camera.`);
          setIsCameraOn(false);
          if (localStream) {
            localStream.getVideoTracks().forEach((track) => (track.enabled = false));
          }
        }

        if (message.action === "camera_on" && message.user.id !== currentUser) {
          console.log(`${message.user.id} turned on their camera.`);
          setIsCameraOn(true);
          if (localStream) {
            localStream.getVideoTracks().forEach((track) => (track.enabled = true));
          }
        }
      };

      socket.onclose = (event) => {
        console.log("WebSocket closed. Reason:", event.reason);
      };

      socket.onerror = (error) => {
        console.error("WebSocket error observed:", error);
      };
    });

    peerInstance.on("call", (call) => {
      console.log("Received call from:", call.peer);
      if (!isInCall) {
        navigator.mediaDevices
          .getUserMedia({ video: isCameraOn, audio: isMicOn })
          .then((stream) => {
            setLocalStream(stream);
            localVideoRef.current.srcObject = stream;
            call.answer(stream);

            call.on("stream", (remoteStream) => {
              setRemoteStream(remoteStream);
              remoteVideoRef.current.srcObject = remoteStream;
              setCallStatus("in-call");
              setIsInCall(true);
            });
          });
      }
    });

    setPeer(peerInstance);

    return () => {
      peerInstance.destroy();
      if (videoSocket) {
        videoSocket.close();
      }
    };
  }, [room_name, currentUser, isCameraOn, isMicOn]);

  const makeCall = (remotePeerId) => {
    console.log(isInCall, peer, remotePeerId);
    
    if (isInCall || !peer || !remotePeerId) return;

    navigator.mediaDevices
      .getUserMedia({ video: isCameraOn, audio: isMicOn })
      .then((stream) => {
        setLocalStream(stream);
        localVideoRef.current.srcObject = stream;

        const call = peer.call(remotePeerId, stream);
        call.on("stream", (remoteStream) => {
          setRemoteStream(remoteStream);
          remoteVideoRef.current.srcObject = remoteStream;
          setCallStatus("in-call");
          setIsInCall(true);
        });

        if (videoSocket) {
          videoSocket.send(
            JSON.stringify({
              action: "call",
              peer_id: localPeerId,
              user_id: currentUser,
            })
          );
        }
      })
      .catch((error) => {
        console.error("Failed to access local media:", error);
      });
  };

  const toggleCamera = () => {
    const newCameraStatus = !isCameraOn;
    setIsCameraOn(newCameraStatus);
    
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = newCameraStatus;
      });
  
      if (videoSocket) {
        videoSocket.send(
          JSON.stringify({
            action: newCameraStatus ? "camera_on" : "camera_off",
            peer_id: localPeerId,
            user_id: currentUser,
          })
        );
      }
    }
  };
  
  const toggleMic = () => {
    setIsMicOn((prev) => !prev);
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));

      if (videoSocket) {
        videoSocket.send(
          JSON.stringify({
            action: isMicOn ? "mute" : "unmute",
            peer_id: localPeerId,
            user_id: currentUser,
          })
        );
      }
    }
  };

  const handleEndCall = () => {
    setIsInCall(false);
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    if (videoSocket) {
      videoSocket.send(
        JSON.stringify({
          action: "end_call",
          peer_id: localPeerId,
          user_id: currentUser,
        })
      );
    }
    setRemoteStream(null);
    setNotification("Call ended.");
  };
  const renderLayout = () => {
    if (role === "patient") {
      return <PatientLayout>{renderVideo()}</PatientLayout>;
    } else if (role === "doctor") {
      return <DoctorLayout>{renderVideo()}</DoctorLayout>;
    }
    return null;
  };
  const renderVideo = () => {
  return (
    <div className="container-fluid d-flex flex-column align-items-center justify-content-center vh-100 video-call-bg">
    <div className="position-relative w-100" style={{ maxWidth: '800px', aspectRatio: '16/9' }}>
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="w-100 h-100 video-frame remote-video"
        // className="w-100 h-100 video-frame"
      />
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        className="position-absolute local-video"
      />
    </div>

    <div className="mt-3">
      {callStatus === "waiting" && (
        <button
          onClick={() => makeCall(remotePeerId)}
          className="btn btn-success btn-lg"
        >
          Call
        </button>
      )}
      {callStatus === "incoming" && !isInCall && (
        <div className="alert alert-info">{notification}</div>
      )}
      {isInCall && (
        <div className="d-flex justify-content-center mt-2">
          <button onClick={toggleMic} className="btn btn-secondary mx-1 btn-icon">
            {isMicOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
          </button>
          <button onClick={toggleCamera} className="btn btn-secondary mx-1 btn-icon">
            {isCameraOn ? <FaVideo /> : <FaVideoSlash />}
          </button>
          <button onClick={handleEndCall} className="btn btn-danger mx-1 btn-lg">
            End Call
          </button>
        </div>
      )}
      {notification && <div className="alert alert-danger mt-2">{notification}</div>}
    </div>
  </div>
  );
}
return renderLayout();
};

export default VideoCall;
