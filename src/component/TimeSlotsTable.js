// src/components/TimeSlotsTable.js

import React from 'react';
import { motion } from 'framer-motion';

const TimeSlotsTable = ({ timeSlots, onSelectTimeSlot }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Time Slot
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {timeSlots.map((slot, index) => (
            <React.Fragment key={slot.id}>
              {/* Separate morning and afternoon */}
              {index === 3 && (
                <tr>
                  <td colSpan="3" className="px-6 py-2 text-center text-sm text-gray-500">
                    Afternoon Sessions
                  </td>
                </tr>
              )}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {slot.time}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      slot.available
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {slot.available ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onSelectTimeSlot(slot)}
                    disabled={!slot.available}
                    className={`px-3 py-1 rounded-md text-white ${
                      slot.available
                        ? 'bg-blue-500 hover:bg-blue-600'
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    {slot.available ? 'Book' : 'Booked'}
                  </button>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimeSlotsTable;
