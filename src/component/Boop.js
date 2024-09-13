import React, { useState, useEffect } from 'react';
import { startOfWeek, addDays, format } from 'date-fns';
import axios from 'axios';
import {
  Grid,
  Paper,
  Typography,
  Button,
  Tooltip,
  Box,
  Container,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const TimeSlotButton = styled(Button)(({ theme, available }) => ({
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(1),
  backgroundColor: available ? theme.palette.success.light : theme.palette.action.disabledBackground,
  color: available ? theme.palette.success.contrastText : theme.palette.text.disabled,
  '&:hover': {
    backgroundColor: available ? theme.palette.success.main : theme.palette.action.disabledBackground,
  },
}));

const DayPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  minHeight: '200px',  // Ensure responsiveness
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',  // Ensure even spacing
  alignItems: 'center',
}));

const WeeklyCalendar = ({ onSelectTimeSlot }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState({});

  const timeSlots = ['04:00', '05:00', '06:00', '07:00', '16:00', '17:00'];

  useEffect(() => {
    fetchAvailableSlots();
  }, [selectedDate]);

  const fetchAvailableSlots = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/spray-sessions/available-slots`, {
        params: {
          startDate: format(startOfWeek(selectedDate), 'yyyy-MM-dd'),
          endDate: format(addDays(startOfWeek(selectedDate), 6), 'yyyy-MM-dd'),
        },
      });
      setAvailableSlots(response.data);
    } catch (error) {
      console.error('Error fetching available slots:', error);
    }
  };

  const isSlotAvailable = (date, time) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const formattedTime = `${time}:00`;
    return availableSlots[dateStr] && availableSlots[dateStr].includes(formattedTime);
  };

  const handleSlotSelect = (date, time) => {
    if (isSlotAvailable(date, time)) {
      onSelectTimeSlot(date, time);
    }
  };

  const renderWeek = () => {
    const weekStart = startOfWeek(selectedDate);
    return Array.from({ length: 7 }).map((_, index) => {
      const date = addDays(weekStart, index);
      return (
        <Grid item xs={12} sm={6} md={4} lg={1.7} key={index} sx={{ display: 'flex' }}>
          <DayPaper elevation={3}>
            <Typography variant="h6" align="center" sx={{ fontWeight: 'bold', mb: 1 }}>
              {format(date, 'EEE')}
            </Typography>
            <Typography variant="body1" align="center" sx={{ mb: 1 }}>
              {format(date, 'dd/MM')}
            </Typography>
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              {renderTimeSlots(date)}
            </Box>
          </DayPaper>
        </Grid>
      );
    });
  };

  const renderTimeSlots = (date) => {
    return timeSlots.map((time, index) => {
      const available = isSlotAvailable(date, time);
      return (
        <Tooltip
          key={index}
          title={available ? 'Available' : 'Not Available'}
          arrow
          placement="top"
        >
          <TimeSlotButton
            fullWidth
            variant="contained"
            available={available ? 1 : 0}
            onClick={() => handleSlotSelect(date, time)}
            disabled={!available}
          >
            {time}
          </TimeSlotButton>
        </Tooltip>
      );
    });
  };

  return (
    <Container maxWidth={false} disableGutters>
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
          Select a Time Slot
        </Typography>
        <Grid container spacing={2} wrap="wrap">
          {renderWeek()}
        </Grid>
      </Paper>
    </Container>
  );
};

export default WeeklyCalendar;
