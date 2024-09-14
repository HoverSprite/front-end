import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
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
  CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
import NotificationIcon from './NotificationIcon';

const SprayerDashboard = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignedOrders();
  }, []);

  const fetchAssignedOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/user/${user.id}/sprayer/orders`);
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching assigned orders:', error);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:8080/api/user/${user.id}/sprayer/orders/${orderId}`, {
        status: newStatus
      });
      fetchAssignedOrders(); // Refresh the orders after update
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  if (loading) {
    return <CircularProgress />;
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
                      <Button onClick={() => handleStatusUpdate(order.id, 'IN_PROGRESS')}>
                        Start Spray
                      </Button>
                    )}
                    {order.status === 'IN_PROGRESS' && (
                      <Button onClick={() => handleStatusUpdate(order.id, 'SPRAY_COMPLETED')}>
                        Complete Spray
                      </Button>
                    )}
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