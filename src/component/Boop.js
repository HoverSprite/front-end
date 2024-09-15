import React, { useState, useEffect } from 'react';
import { startOfWeek, addDays, format, isSameDay } from 'date-fns';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const WeeklyCalendar = ({ onSelectTimeSlot }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState({});
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date()));

  const timeSlots = ['04:00', '05:00', '06:00', '07:00', '16:00', '17:00'];

  useEffect(() => {
    fetchAvailableSlots();
  }, [currentWeek]);

  const fetchAvailableSlots = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/spray-sessions/available-slots`, {
        params: {
          startDate: format(currentWeek, 'yyyy-MM-dd'),
          endDate: format(addDays(currentWeek, 6), 'yyyy-MM-dd'),
        },
      });
      console.log(response.data)
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
      setSelectedDate(date);
    }
  };

  const changeWeek = (direction) => {
    setCurrentWeek(prev => addDays(prev, direction * 7));
  };

  const renderWeek = () => {
    return Array.from({ length: 7 }).map((_, index) => {
      const date = addDays(currentWeek, index);
      return (
        <div key={index} className="flex-1 min-w-0">
          <div className={`text-center py-2 ${isSameDay(date, selectedDate) ? 'bg-blue-100' : ''}`}>
            <p className="text-sm font-medium text-gray-900">{format(date, 'EEE')}</p>
            <p className="text-sm text-gray-600">{format(date, 'd')}</p>
          </div>
          <div className="mt-1">
            {timeSlots.map((time, timeIndex) => {
              const available = isSlotAvailable(date, time);
              return (
                <button
                  key={timeIndex}
                  onClick={() => handleSlotSelect(date, time)}
                  className={`w-full py-1 text-xs ${
                    available
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  } ${
                    isSameDay(date, selectedDate) && format(selectedDate, 'HH:mm') === time
                      ? 'ring-2 ring-blue-500'
                      : ''
                  }`}
                  disabled={!available}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-3 bg-green-500 text-white">
        <button
          onClick={() => changeWeek(-1)}
          className="p-1 rounded-full hover:bg-green-600 transition-colors duration-200"
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-lg font-semibold flex items-center">
          <Calendar size={24} className="mr-2" />
          {format(currentWeek, 'MMMM yyyy')}
        </h2>
        <button
          onClick={() => changeWeek(1)}
          className="p-1 rounded-full hover:bg-green-600 transition-colors duration-200"
        >
          <ChevronRight size={24} />
        </button>
      </div>
      <div className="flex">
        {Array.from({ length: 7 }).map((_, index) => {
          const date = addDays(currentWeek, index);
          return (
            <div key={index} className="flex-1 min-w-0 border-r last:border-r-0">
              <div className={`text-center py-2 ${isSameDay(date, selectedDate) ? 'bg-green-100' : ''}`}>
                <p className="text-sm font-medium text-gray-900">{format(date, 'EEE')}</p>
                <p className="text-sm text-gray-600">{format(date, 'd')}</p>
              </div>
              <div className="mt-1 px-1">
                {timeSlots.map((time, timeIndex) => {
                  const available = isSlotAvailable(date, time);
                  return (
                    <motion.button
                      key={timeIndex}
                      onClick={() => handleSlotSelect(date, time)}
                      className={`w-full py-2 my-1 text-xs rounded-md transition-colors duration-200 ${
                        available
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      } ${
                        isSameDay(date, selectedDate) && format(selectedDate, 'HH:mm') === time
                          ? 'ring-2 ring-green-500'
                          : ''
                      }`}
                      disabled={!available}
                      whileHover={{ scale: available ? 1.05 : 1 }}
                      whileTap={{ scale: available ? 0.95 : 1 }}
                    >
                      {time}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default WeeklyCalendar;