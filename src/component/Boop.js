import React, { useState, useEffect } from 'react';
import { startOfWeek, addDays, format, isValid } from 'date-fns';
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
import lunar from 'chinese-lunar'; // Library for Lunar date conversion
import { Moon, Hemisphere } from 'lunarphase-js'; // Library for moon phases

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
  minHeight: '200px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const Divider = styled('hr')(({ theme }) => ({
  border: 'none',
  height: '4px', // Thickness of the line
  backgroundColor: 'orange', // Orange color for distinction
  margin: theme.spacing(2, 0), // Margin for spacing
  width: '100%', // Full width
}));

const WeeklyCalendar = ({ onSelectTimeSlot, selectedDate, setAvailableTimes }) => {
  const [availableSlots, setAvailableSlots] = useState({});

  const timeSlots = ['04:00', '05:00', '06:00', '07:00', '16:00', '17:00'];
  const currentDate = selectedDate && isValid(selectedDate) ? selectedDate : new Date();

  useEffect(() => {
    fetchAvailableSlots(currentDate);
  }, [currentDate]);

  const fetchAvailableSlots = async (date) => {
    try {
      const startOfWeekDate = startOfWeek(date);
      const endOfWeekDate = addDays(startOfWeekDate, 6);
      const response = await axios.get(`http://localhost:8080/api/spray-sessions/available-slots`, {
        params: {
          startDate: format(startOfWeekDate, 'yyyy-MM-dd'),
          endDate: format(endOfWeekDate, 'yyyy-MM-dd'),
        },
      });
      setAvailableSlots(response.data);
      // Flatten the available slots into a single list for the entire week and pass it to the parent
      const availableTimesForPicker = Object.values(response.data).flat();
      setAvailableTimes(new Set(availableTimesForPicker.map(time => time.slice(0, 5)))); // Only HH:mm format
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
    const weekStart = startOfWeek(currentDate);
    return Array.from({ length: 7 }).map((_, index) => {
      const date = addDays(weekStart, index);

      // Convert the Gregorian date to Lunar using chinese-lunar
      const lunarDate = lunar.solarToLunar(date);
      const lunarDay = lunarDate.day;
      const lunarMonth = lunarDate.month;
      const isLeapMonth = lunarDate.isLeap ? "(Leap)" : "";

      // Get the lunar phase emoji using lunarphase-js
      const moonPhaseEmoji = Moon.lunarPhaseEmoji(date, Hemisphere.NORTHERN);

      return (
        <Grid item xs={12} sm={6} md={4} lg={1.7} key={index} sx={{ display: 'flex' }}>
          <DayPaper elevation={3}>
            <Typography variant="h6" align="center" sx={{ fontWeight: 'bold', mb: 1 }}>
              {format(date, 'EEE')}
            </Typography>
            <Typography variant="body1" align="center" sx={{ mb: 1 }}>
              {format(date, 'dd/MM')} <br />
              {`${moonPhaseEmoji} ${lunarDay}/${lunarMonth} ${isLeapMonth}`}
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
    return (
      <Box>
        {timeSlots.slice(0, 4).map((time, index) => { // Morning Slots
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
        })}
        <Divider /> {/* Orange line separator */}
        {timeSlots.slice(4).map((time, index) => { // Afternoon Slots
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
        })}
      </Box>
    );
  };

  return (
    <Container maxWidth={false} disableGutters>
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Grid container spacing={2} wrap="wrap">
          {renderWeek()}
        </Grid>
      </Paper>
    </Container>
  );
};

export default WeeklyCalendar;
