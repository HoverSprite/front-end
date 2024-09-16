import React, { useState } from 'react';

const CustomDateTimePicker = ({ value, onChange }) => {
  const [dateTimeString, setDateTimeString] = useState(formatDateTime(value));

  function formatDateTime(date) {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }

  function handleInputChange(e) {
    const inputValue = e.target.value;
    setDateTimeString(inputValue);
    
    const date = new Date(inputValue);
    if (!isNaN(date.getTime())) {
      onChange(date);
    }
  }

  return (
    <input
      type="datetime-local"
      value={dateTimeString}
      onChange={handleInputChange}
      style={{ width: '100%', padding: '8px', fontSize: '16px' }}
    />
  );
};

export default CustomDateTimePicker;