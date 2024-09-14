// import React, { useEffect, useState } from 'react';
// import { Client } from '@stomp/stompjs';
// import axios from 'axios';

// const NotificationBox = ({ userId, userRole }) => {
//   const [notifications, setNotifications] = useState([]);
//   const [isConnected, setIsConnected] = useState(false);

//   useEffect(() => {
//     // Fetch existing notifications
//     const fetchNotifications = async () => {
//       try {
//         const response = await axios.get(`/api/notifications?userId=${userId}&userRole=${userRole}`);
//         setNotifications(response.data);
//       } catch (error) {
//         console.error('Error fetching notifications:', error);
//       }
//     };

//     fetchNotifications();

//     // Set up WebSocket connection
//     const client = new Client({
//       brokerURL: 'ws://localhost:8080/api/ws',
//       connectHeaders: {
//         login: 'guest',
//         passcode: 'guest',
//       },
//       debug: function (str) {
//         console.log(str);
//       },
//       reconnectDelay: 5000,
//       heartbeatIncoming: 4000,
//       heartbeatOutgoing: 4000,
//     });

//     client.onConnect = function () {
//       console.log('Connected to WebSocket');
//       setIsConnected(true);

//       client.subscribe(`/topic/${userRole.toLowerCase()}/${userId}`, function (message) {
//         const newNotification = JSON.parse(message.body);
//         setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
//       });
//     };

//     client.onStompError = function (frame) {
//       console.error('Broker reported error: ' + frame.headers['message']);
//       console.error('Additional details: ' + frame.body);
//     };

//     client.onDisconnect = function () {
//       console.log('Disconnected from WebSocket');
//       setIsConnected(false);
//     };

//     client.activate();

//     return () => {
//       client.deactivate();
//     };
//   }, [userId, userRole]);

//   const markAsRead = async (notificationId) => {
//     try {
//       await axios.post(`/api/notifications/${notificationId}/read`);
//       setNotifications((prevNotifications) =>
//         prevNotifications.map((notification) =>
//           notification.id === notificationId ? { ...notification, isRead: true } : notification
//         )
//       );
//     } catch (error) {
//       console.error('Error marking notification as read:', error);
//     }
//   };

//   return (
//     <div className="fixed bottom-4 right-4 w-64 bg-white shadow-lg rounded-lg overflow-hidden">
//       <div className="bg-green-600 text-white px-4 py-2 font-bold flex justify-between items-center">
//         <span>Notifications</span>
//         <span className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-300' : 'bg-red-500'}`}></span>
//       </div>
//       <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
//         {notifications.map((notification) => (
//           <li
//             key={notification.id}
//             className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
//               notification.isRead ? 'text-gray-500' : 'font-bold'
//             }`}
//             onClick={() => markAsRead(notification.id)}
//           >
//             {notification.message}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default NotificationBox;