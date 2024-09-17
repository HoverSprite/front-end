import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import { BellIcon } from '@heroicons/react/24/outline';

import { useAuth } from '../context/AuthContext';

const NotificationIcon = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [debugMessages, setDebugMessages] = useState([]);
  const [allSeen, setAllSeen] = useState(false); // Track if all notifications are seen/unseen
  const { user } = useAuth();
  const dropdownRef = useRef(null);

  // Fetch notifications from the server
  const fetchExistingNotifications = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/notifications`);
      const seenNotifications = JSON.parse(localStorage.getItem(`seenNotifications_${user.sub}`) || '[]');

      const updatedNotifications = response.data.map(notification => ({
        ...notification,
        seen: seenNotifications.includes(notification.id),
      }));

      setNotifications(updatedNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setDebugMessages(prev => [...prev, `Error fetching notifications: ${error.message}`]);
    }
  }, [user]);

  // Toggle the seen status of individual notifications
  const toggleSeenStatus = (notificationId) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === notificationId ? { ...notification, seen: !notification.seen } : notification
      )
    );

    const seenNotifications = JSON.parse(localStorage.getItem(`seenNotifications_${user.sub}`) || '[]');

    if (seenNotifications.includes(notificationId)) {
      const updatedSeen = seenNotifications.filter(id => id !== notificationId);
      localStorage.setItem(`seenNotifications_${user.sub}`, JSON.stringify(updatedSeen));
    } else {
      seenNotifications.push(notificationId);
      localStorage.setItem(`seenNotifications_${user.sub}`, JSON.stringify(seenNotifications));
    }
  };

  // Toggle seen/unseen status for all notifications
  const toggleAllSeenStatus = () => {
    const allNowSeen = !allSeen;
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({ ...notification, seen: allNowSeen }))
    );

    if (allNowSeen) {
      const allNotificationIds = notifications.map(notification => notification.id);
      localStorage.setItem(`seenNotifications_${user.sub}`, JSON.stringify(allNotificationIds));
    } else {
      localStorage.removeItem(`seenNotifications_${user.sub}`);
    }

    setAllSeen(allNowSeen);
  };

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

      const subscriptionTopic = `/topic/${user.sub}`;
      console.log(`Subscribing to: ${subscriptionTopic}`);
      setDebugMessages(prev => [...prev, `Subscribing to: ${subscriptionTopic}`]);

      client.subscribe(subscriptionTopic, function (message) {
        console.log('Received message:', message.body);
        setDebugMessages(prev => [...prev, `Received message: ${message.body}`]);

        const newNotification = {
          id: Date.now(),
          message: message.body,
          createdAt: new Date().toISOString(),
          seen: false,
        };

        setNotifications(prevNotifications => [newNotification, ...prevNotifications]);
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
  }, [user, fetchExistingNotifications]);

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const hasUnseenNotifications = notifications.some(notification => !notification.seen);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="relative p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
      >
        <BellIcon className="h-6 w-6" />
        {hasUnseenNotifications && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
        )}
      </button>

      {isOpen && (
        <div ref={dropdownRef} className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="px-4 py-2 text-xs text-gray-400 flex justify-between items-center">
            <span>Notifications</span>
            <button
              onClick={toggleAllSeenStatus}
              className="text-xs text-blue-500 hover:text-blue-700 focus:outline-none"
            >
              {allSeen ? 'Mark all as unseen' : 'Mark all as seen'}
            </button>
          </div>
          {notifications.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-700">No notifications</div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${
                  notification.seen ? 'text-gray-400' : 'text-gray-700 font-semibold'
                }`}
                onClick={() => toggleSeenStatus(notification.id)}
              >
                <p>{notification.message}</p>
                <p className="text-xs text-gray-400">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;
