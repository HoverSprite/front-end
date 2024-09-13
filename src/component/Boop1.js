// import React, { useEffect, useState, useCallback } from 'react';
// import { Client } from '@stomp/stompjs';
// import axios from 'axios';

// const NotificationWebSocket = ({ userId, userRole }) => {
//   const [notifications, setNotifications] = useState([]);
//   const [isConnected, setIsConnected] = useState(false);
//   const [debugMessages, setDebugMessages] = useState([]);

//   const fetchExistingNotifications = useCallback(async () => {
//     try {
//       const response = await axios.get(`http://localhost:8080/api/notifications?userId=${userId}&userRole=${userRole}`);
//       setNotifications(response.data.sort((a, b) => {
//         if (a.isRead === b.isRead) {
//           return new Date(b.createdAt) - new Date(a.createdAt);
//         }
//         return a.isRead ? 1 : -1;
//       }));
//     } catch (error) {
//       console.error('Error fetching notifications:', error);
//       setDebugMessages(prev => [...prev, `Error fetching notifications: ${error.message}`]);
//     }
//   }, [userId, userRole]);

//   const markNotificationAsSeen = useCallback(async (notificationId) => {
//     try {
//       await axios.post(`http://localhost:8080/api/notifications/${notificationId}/read`);
//       setNotifications(prevNotifications =>
//         prevNotifications.map(notification =>
//           notification.id === notificationId
//             ? { ...notification, isRead: true }
//             : notification
//         )
//       );
//     } catch (error) {
//       console.error('Error marking notification as read:', error);
//       setDebugMessages(prev => [...prev, `Error marking notification as read: ${error.message}`]);
//     }
//   }, []);

//   useEffect(() => {
//     fetchExistingNotifications();

//     const client = new Client({
//       brokerURL: 'ws://localhost:8080/api/ws',
//       connectHeaders: {
//         login: 'guest',
//         passcode: 'guest',
//       },
//       debug: function (str) {
//         console.log(str);
//         setDebugMessages(prev => [...prev, `Debug: ${str}`]);
//       },
//       reconnectDelay: 5000,
//       heartbeatIncoming: 4000,
//       heartbeatOutgoing: 4000,
//     });

//     client.onConnect = function () {
//       console.log('Connected to WebSocket');
//       setIsConnected(true);
//       setDebugMessages(prev => [...prev, 'Connected to WebSocket']);

//       const subscriptionTopic = `/topic/${userRole.toLowerCase()}/${userId}`;
//       console.log(`Subscribing to: ${subscriptionTopic}`);
//       setDebugMessages(prev => [...prev, `Subscribing to: ${subscriptionTopic}`]);

//       client.subscribe(subscriptionTopic, function (message) {
//         const newNotification = message.body;
//         console.log('Received message:', newNotification);
//         setDebugMessages(prev => [...prev, `Received message: ${newNotification}`]);
//         setNotifications(prevNotifications => [{
//           id: Date.now(), // Temporary ID
//           message: newNotification,
//           createdAt: new Date().toISOString(),
//           isRead: false
//         }, ...prevNotifications]);
//       });
//     };

//     client.onStompError = function (frame) {
//       console.error('Broker reported error: ' + frame.headers['message']);
//       console.error('Additional details: ' + frame.body);
//       setDebugMessages(prev => [...prev, `Error: ${frame.headers['message']} - ${frame.body}`]);
//     };

//     client.onDisconnect = function () {
//       console.log('Disconnected from WebSocket');
//       setIsConnected(false);
//       setDebugMessages(prev => [...prev, 'Disconnected from WebSocket']);
//     };

//     client.activate();

//     return () => {
//       client.deactivate();
//     };
//   }, [userId, userRole, fetchExistingNotifications]);

//   const handleNotificationClick = (notification) => {
//     if (!notification.isRead) {
//       markNotificationAsSeen(notification.id);
//     }
//   };

//   return (
//     <div className="bg-white p-4 rounded-lg shadow-md">
//       <h2 className="text-xl font-bold mb-4">Notifications</h2>
//       {isConnected ? (
//         <div>
//           <ul className="space-y-2 mb-4">
//             {notifications.map((notification) => (
//               <li
//                 key={notification.id}
//                 className={`p-2 rounded cursor-pointer ${
//                   notification.isRead ? 'bg-gray-100' : 'bg-blue-100'
//                 }`}
//                 onClick={() => handleNotificationClick(notification)}
//               >
//                 <p className="font-semibold">{notification.message}</p>
//                 <p className="text-xs text-gray-500">
//                   {new Date(notification.createdAt).toLocaleString()}
//                 </p>
//               </li>
//             ))}
//           </ul>
//           <h3 className="text-lg font-semibold mb-2">Debug Messages:</h3>
//           <ul className="space-y-1 text-sm text-gray-600">
//             {debugMessages.map((msg, index) => (
//               <li key={index}>{msg}</li>
//             ))}
//           </ul>
//         </div>
//       ) : (
//         <p>Connecting to notification service...</p>
//       )}
//     </div>
//   );
// };

// export default NotificationWebSocket;