// src/component/SprayerDashboard.js

import React, { useEffect, useState } from 'react';
import { API_URL, fetchQRCode } from '../service/DataService';
import QRCodeComponent from '../component/qrcode/QRCodeComponent';
import { Link } from 'react-router-dom';
import NotificationIcon from './NotificationIcon';
import { useUser } from '../contexts/UserContext'; // Import useUser
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns'; // Import the format function from date-fns
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  IconButton
} from '@mui/material';
import { QrCode } from 'lucide-react';

const SprayerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser(); // Get user from context
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignedOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAssignedOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/user/${user.id}/sprayer/orders`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        console.error('Failed to fetch orders:', response.statusText);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching assigned orders:', error);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/user/${user.id}/sprayer/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        fetchAssignedOrders(); // Refresh the orders after update
      } else {
        console.error('Failed to update order status:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleViewQRCode = (orderId) => {
    navigate(`/qr?orderId=${orderId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Sprayer Dashboard
        </Typography>
        <NotificationIcon userId={user.id} userRole="SPRAYER" />
        <Link to="/map">
          <Button variant="contained" color="primary" sx={{ mb: 2 }}>
            View Map
          </Button>
        </Link>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
                <TableCell>QR Code</TableCell> {/* New Column for QR Code */}
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{format(new Date(order.dateTime), 'dd/MM/yyyy HH:mm')}</TableCell>
                  <TableCell>{order.location}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>
                    {order.status === 'ASSIGNED' && (
                      <Button variant="contained" color="success" onClick={() => handleStatusUpdate(order.id, 'IN_PROGRESS')}>
                        Start Spray
                      </Button>
                    )}
                    {order.status === 'IN_PROGRESS' && (
                      <Button variant="contained" color="warning" onClick={() => handleStatusUpdate(order.id, 'SPRAY_COMPLETED')}>
                        Complete Spray
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleViewQRCode(order.id)}>
                      <QrCode />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default SprayerDashboard;
