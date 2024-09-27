import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { BASE_URL } from "../../axiosConfig";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import PatientLayout from "../../component/PatientLayout";
import DoctorLayout from "../../component/DoctorLayout";
import "./services/Chat.css";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const chatSocket = useRef(null);
  const [isSocketOpen, setIsSocketOpen] = useState(false);
  const messageEndRef = useRef(null);

  // Extract query parameters from the URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const PatientId = queryParams.get("patientId");
  const doctorId = queryParams.get("doctorId");
  const { access, role, isLogged } = useSelector((state) => state.auth);

  // Decode the access token to get user info
  const userInfo = jwtDecode(access);
  const sender = userInfo.user_id;
  let receiver;

  if (isLogged) {
    if (sender === doctorId) {
      receiver = PatientId;
    } else {
      receiver = doctorId;
    }

    console.log(`Sender: ${sender}, Receiver: ${receiver}`);
  } else {
    console.log("User is not logged in");
  }

  const room_name = `${sender}_${receiver}`;

  useEffect(() => {
    if (sender && receiver) {
      console.log("Connecting to room:", room_name);

      chatSocket.current = new WebSocket(
        `ws://127.0.0.1:8000/ws/chat/${room_name}/`
      );

      chatSocket.current.onopen = () => {
        console.log("WebSocket connection established.");
        setIsSocketOpen(true);
      };

      chatSocket.current.onmessage = function (e) {
        const data = JSON.parse(e.data);
        console.log("Received message from socket:", data);

        const formattedMessage = {
          id: data.id || null,
          message: data.message,
          sender: {
            id: userInfo.user_id,
            username: userInfo.username,
          },
          receiver: {
            id: receiver,
            username: "Receiver Username",
          },
          timestamp: new Date().toISOString(),
        };

        setMessages((prevMessages) => [...prevMessages, formattedMessage]);
      };

      chatSocket.current.onclose = function (e) {
        console.error("Chat socket closed unexpectedly:", e);
        setIsSocketOpen(false);
      };

      const fetchChatMessages = async () => {
        const roomName = `${Math.min(sender, receiver)}_${Math.max(
          sender,
          receiver
        )}`;
        console.log("roomName", roomName);

        try {
          const response = await fetch(
            `${BASE_URL}chat/messages/${roomName}/`,
            {
              headers: {
                Authorization: `Bearer ${access}`,
              },
            }
          );

          const data = await response.json();
          console.log("Fetched messages:", data);
          setMessages(data);
        } catch (error) {
          console.error("Failed to fetch chat messages:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchChatMessages();
    }

    return () => {
      if (
        chatSocket.current &&
        chatSocket.current.readyState === WebSocket.OPEN
      ) {
        chatSocket.current.close();
        console.log("WebSocket connection closed from cleanup");
      }
    };
  }, [sender, receiver]);

  const sendMessage = async () => {
    if (newMessage.trim() === "") {
      console.log("Message is empty, not sending");
      return;
    }

    const messageData = {
      message: newMessage,
      sender: sender,
      room: `${sender}_${receiver}`,
      receiver: parseInt(receiver, 10),
    };
    console.log("messageData====", messageData);

    if (isSocketOpen) {
      console.log("Sending message via WebSocket:", messageData);
      chatSocket.current.send(JSON.stringify(messageData));
    } else {
      console.warn("WebSocket is not open, message not sent via WebSocket");
    }

    try {
      const apiResponse = await fetch(`${BASE_URL}chat/send-message/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify(messageData),
      });

      console.log(
        "API response status for sending message:",
        apiResponse.status
      );

      if (!apiResponse.ok) {
        console.error("Failed to send message to API:", apiResponse);
      } else {
        const responseData = await apiResponse.json();
        console.log("Message sent successfully to API:", responseData);
      }
    } catch (error) {
      console.error("Error sending message to API:", error);
    }

    setNewMessage("");
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const renderLayout = () => {
    if (role === "patient") {
      return <PatientLayout>{renderChat()}</PatientLayout>;
    } else if (role === "doctor") {
      return <DoctorLayout>{renderChat()}</DoctorLayout>;
    }
    return null;
  };

  const renderChat = () => (
    <div className="container p-4">
      <h1 className="h3 mb-3">Messages</h1>
      <div className="card">
        <div className="row">
          <div className="d-flex">
            <div className="position-relative p-2 flex-grow-1">
              <div
                className="chat-messages p-4"
                style={{
                  flexGrow: 1,
                  overflowY: "auto",
                  height: "70vh",
                  zIndex: 2,
                }}
              >
                {loading ? (
                  <p>Loading chat...</p>
                ) : messages.length === 0 ? (
                  <p>No chat messages yet. Start the conversation!</p>
                ) : (
                  messages.map((msg, index) => {
                    const date = new Date(msg.timestamp);
                    const timeString = date.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    const isSender = msg.sender.id === sender;

                    return (
                      <div
                        key={index}
                        className={`my-2 p-2 rounded text-white ${
                          isSender
                            ? "bg-primary ms-auto"
                            : "bg-secondary me-auto"
                        }`}
                        style={{
                          maxWidth: "70%",
                          alignSelf: isSender ? "flex-end" : "flex-start",
                        }}
                      >
                        <p className="mb-0">
                          <b>{isSender ? "You" : msg.sender.username}:</b>{" "}
                          {typeof msg.message === "object"
                            ? JSON.stringify(msg.message)
                            : msg.message}{" "}
                          <span
                            style={{ fontSize: "0.8em", color: "lightgray" }}
                          >
                            {timeString}
                          </span>
                        </p>
                      </div>
                    );
                  })
                )}
                <div ref={messageEndRef} />
              </div>
            </div>
          </div>

          <div className="input-group px-5 pb-1">
            <input
              id="chat-message-input"
              type="text"
              className="form-control"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <div className="input-group-append">
              <button onClick={sendMessage} className="btn btn-success">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  return <div>{renderLayout()}</div>;
};
export default Chat;
