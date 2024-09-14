// src/components/StompWebSocket.js
import React, { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';

const StompWebSocket = () => {
  const [messages, setMessages] = useState([]);
  const [messageToSend, setMessageToSend] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const client = new Client({
    brokerURL: 'ws://localhost:8080/api/ws', // Your WebSocket endpoint
    connectHeaders: {
      login: 'guest',
      passcode: 'guest',
    },
    debug: function (str) {
      console.log(str);
    },
    reconnectDelay: 5000, // Reconnect after 5 seconds if connection is lost
    heartbeatIncoming: 4000, // Send a heartbeat every 4 seconds
    heartbeatOutgoing: 4000, // Expect a heartbeat every 4 seconds from the server
  });

  useEffect(() => {
    client.onConnect = function () {
      console.log('Connected to WebSocket');
      setIsConnected(true);

      // Subscribe to the topic '/topic/notifications'
      client.subscribe('/topic/farmer/1', function (message) {
        const newMessage = message.body;
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    };

    client.onStompError = function (frame) {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    client.onDisconnect = function () {
      console.log('Disconnected from WebSocket');
      setIsConnected(false);
    };

    // Activate the STOMP client
    client.activate();

    // Clean up the WebSocket connection on component unmount
    return () => {
      client.deactivate();
    };
  }, []);

  const sendMessage = () => {
    if (messageToSend && isConnected) {
      client.publish({
        destination: '/app/broadcast', // Broadcast destination
        body: messageToSend,
      });
      setMessageToSend(''); // Clear the input after sending
    } else {
      console.log('Client is not connected, unable to send message');
    }
  };

  return (
    <div>
      <h1>WebSocket Client</h1>
      <div>
        <h2>Messages:</h2>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
      <div>
        <input
          type="text"
          value={messageToSend}
          onChange={(e) => setMessageToSend(e.target.value)}
          placeholder="Enter message"
          disabled={!isConnected}
        />
        <button onClick={sendMessage} disabled={!isConnected}>
          Send Message
        </button>
      </div>
    </div>
  );
};

export default StompWebSocket;
