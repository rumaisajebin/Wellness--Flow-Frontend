import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const { access } = useSelector((state) => state.auth);

  const fetchNotifications = async () => {
    const response = await axios.get(
      "http://127.0.0.1:8000/account/notifications/",
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );
    return response.data;
  };

  useEffect(() => {
    const getNotifications = async () => {
      const data = await fetchNotifications();
      setNotifications(data);
    };
    getNotifications();
  }, []);

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notification) => (
          <li key={notification.id}>
            <p>{notification.message}</p>
            <small>{new Date(notification.created_at).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationPage;
