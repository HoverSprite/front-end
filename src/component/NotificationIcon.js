import React, { useState, useEffect, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import { BellIcon } from '@heroicons/react/24/outline';

const NotificationIcon = ({ userId, userRole }) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [debugMessages, setDebugMessages] = useState([]);

  const fetchExistingNotifications = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/notifications?userId=${userId}&userRole=${userRole}`);
      const seenNotifications = JSON.parse(localStorage.getItem(`seenNotifications_${userId}`) || '[]');
      
      const updatedNotifications = response.data.map(notification => ({
        ...notification,
        seen: seenNotifications.includes(notification.id)
      }));

      setNotifications(updatedNotifications.sort((a, b) => {
        if (a.seen === b.seen) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return a.seen ? 1 : -1;
      }));

      setHasNewNotifications(updatedNotifications.some(n => !n.seen));
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setDebugMessages(prev => [...prev, `Error fetching notifications: ${error.message}`]);
    }
  }, [userId, userRole]);

  const markAsSeen = useCallback((notificationId) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, seen: true }
          : notification
      )
    );

    const seenNotifications = JSON.parse(localStorage.getItem(`seenNotifications_${userId}`) || '[]');
    if (!seenNotifications.includes(notificationId)) {
      seenNotifications.push(notificationId);
      localStorage.setItem(`seenNotifications_${userId}`, JSON.stringify(seenNotifications));
    }

    setHasNewNotifications(notifications.some(n => !n.seen));
  }, [userId, notifications]);

  useEffect(() => {
    fetchExistingNotifications();

    const client = new Client({
      brokerURL: 'ws://localhost:8080/api/ws',
      connectHeaders: {
        login: 'guest',
        passcode: 'guest',
      },
      debug: function (str) {
        console.log(str);
        setDebugMessages(prev => [...prev, `Debug: ${str}`]);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = function () {
      console.log('Connected to WebSocket');
      setIsConnected(true);
      setDebugMessages(prev => [...prev, 'Connected to WebSocket']);

      const subscriptionTopic = `/topic/${userRole.toLowerCase()}/${userId}`;
      console.log(`Subscribing to: ${subscriptionTopic}`);
      setDebugMessages(prev => [...prev, `Subscribing to: ${subscriptionTopic}`]);

      client.subscribe(subscriptionTopic, function (message) {
        console.log('Received message:', message.body);
        setDebugMessages(prev => [...prev, `Received message: ${message.body}`]);
        
        try {
          const newNotification = {
            id: Date.now(), // Temporary ID
            message: message.body,
            createdAt: new Date().toISOString(),
            seen: false
          };
          setNotifications(prevNotifications => [newNotification, ...prevNotifications]);
          setHasNewNotifications(true);
        } catch (error) {
          console.error('Error processing message:', error);
          setDebugMessages(prev => [...prev, `Error processing message: ${error.message}`]);
        }
      });
    };

    client.onStompError = function (frame) {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
      setDebugMessages(prev => [...prev, `Error: ${frame.headers['message']} - ${frame.body}`]);
    };

    client.onDisconnect = function () {
      console.log('Disconnected from WebSocket');
      setIsConnected(false);
      setDebugMessages(prev => [...prev, 'Disconnected from WebSocket']);
    };

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [userId, userRole, fetchExistingNotifications]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasNewNotifications(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="relative p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
      >
        <BellIcon className="h-6 w-6" />
        {hasNewNotifications && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
        )}
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-4 py-2 text-xs text-gray-400">Notifications</div>
          {notifications.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-700">No notifications</div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${
                  notification.seen ? 'text-gray-400' : 'text-gray-700 font-semibold'
                }`}
                onClick={() => markAsSeen(notification.id)}
              >
                <p>{notification.message}</p>
                <p className="text-xs text-gray-400">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
          <h3 className="text-lg font-semibold mb-2 px-4">Debug Messages:</h3>
          <ul className="space-y-1 text-sm text-gray-600 px-4 max-h-40 overflow-y-auto">
            {debugMessages.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;