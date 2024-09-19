import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { BASE_URL } from '../../axiosConfig';

const SendSMS = () => {
  const { access } = useSelector((state) => state.auth);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState(null);

  const sendSMS = async () => {
    try {
      const res = await fetch(`${BASE_URL}/send-sms/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({
          to: phoneNumber,
          message: message,
        }),
      });
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error('Error sending SMS', error);
    }
  };

  return (
    <div>
      <h2>Send SMS</h2>
      <input
        type="text"
        placeholder="Recipient Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendSMS}>Send SMS</button>
      {response && <div>{response.message || response.error}</div>}
    </div>
  );
};

export default SendSMS;
