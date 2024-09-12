import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, DollarSign, Users, Crop, ChevronDown, Edit, Plus, Save, X } from 'lucide-react';
import { format, parse, setHours, setMinutes, addHours } from 'date-fns';
import DatePicker from 'react-datepicker';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'leaflet/dist/leaflet.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { sendUpdatedOrderToAPI } from '../../service/DataService';

const OrderDetails = ({ orderData, onUpdate }) => {
  const [order, setOrder] = useState(orderData);
  const [isEditing, setIsEditing] = useState(false);
  const [editedFields, setEditedFields] = useState({});
  const [newSprayer, setNewSprayer] = useState({ firstName: '', lastName: '', expertise: 'NOVICE' });


  const handleEdit = () => {
    setIsEditing(true);
    setEditedFields({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedFields({});
  };

  const handleSave = async () => {
    const updatedOrder = { ...order, ...editedFields };
    setOrder(updatedOrder);
    setIsEditing(false);
    await sendUpdatedOrderToAPI(updatedOrder);
    onUpdate(updatedOrder);
  };

  const handleChange = (field, value) => {
    setEditedFields({ ...editedFields, [field]: value });
  };

  const handleAddSprayer = () => {
    if (newSprayer.firstName && newSprayer.lastName) {
      const updatedSprayerAssignments = [
        ...order.sprayerAssignments,
        {
          id: Date.now(), // Use a timestamp as a temporary ID
          sprayer: {
            ...newSprayer,
            id: Date.now(), // Use a timestamp as a temporary ID
          },
          isPrimary: order.sprayerAssignments.length === 0, // Set as primary if it's the first sprayer
        },
      ];
      setOrder({ ...order, sprayerAssignments: updatedSprayerAssignments });
      setNewSprayer({ firstName: '', lastName: '', expertise: 'NOVICE' });
    }
  };

  const handleRemoveSprayer = (id) => {
    const updatedSprayerAssignments = order.sprayerAssignments.filter(
      (assignment) => assignment.id !== id
    );
    setOrder({ ...order, sprayerAssignments: updatedSprayerAssignments });
  };

  const handleSetPrimarySprayer = (id) => {
    const updatedSprayerAssignments = order.sprayerAssignments.map(
      (assignment) => ({
        ...assignment,
        isPrimary: assignment.id === id,
      })
    );
    setOrder({ ...order, sprayerAssignments: updatedSprayerAssignments });
  };

  const handleStatusChange = async (newStatus) => {
    const updatedOrder = { ...order, status: newStatus };
    setOrder(updatedOrder);
    await sendUpdatedOrderToAPI(updatedOrder);
    onUpdate(updatedOrder);
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return format(date, "MMMM d, yyyy 'at' h:mm a");
  };

  const formatTime = (timeString) => {
    const date = parse(timeString, 'HH:mm:ss', new Date());
    return format(date, 'h:mm a');
  };

  const StatusBadge = ({ status }) => {
    const colorMap = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'CONFIRMED': 'bg-blue-100 text-blue-800',
      'ASSIGNED': 'bg-purple-100 text-purple-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorMap[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const EditableField = ({ label, value, field, type = 'text' }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {isEditing ? (
        <input
          type={type}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={editedFields[field] !== undefined ? editedFields[field] : value}
          onChange={(e) => handleChange(field, e.target.value)}
        />
      ) : (
        <p className="mt-1 text-sm text-gray-900">{value}</p>
      )}
    </div>
  );

  const EditableSelect = ({ label, value, field, options }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {isEditing ? (
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={editedFields[field] ?? value}
          onChange={(e) => handleChange(field, e.target.value)}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <p className="mt-1 text-sm text-gray-900">{value}</p>
      )}
    </div>
  );

  const EditableDateTime = ({ label, dateTimeValue, dateTimeField }) => {
    const date = new Date(dateTimeValue);
    const timeSlots = [
      { label: '6:00 AM - 7:00 AM', start: 6 },
      { label: '7:00 AM - 8:00 AM', start: 7 },
      { label: '8:00 AM - 9:00 AM', start: 8 },
      { label: '9:00 AM - 10:00 AM', start: 9 },
      { label: '10:00 AM - 11:00 AM', start: 10 },
      { label: '11:00 AM - 12:00 PM', start: 11 },
      { label: '12:00 PM - 1:00 PM', start: 12 },
      { label: '1:00 PM - 2:00 PM', start: 13 },
      { label: '2:00 PM - 3:00 PM', start: 14 },
      { label: '3:00 PM - 4:00 PM', start: 15 },
      { label: '4:00 PM - 5:00 PM', start: 16 },
      { label: '5:00 PM - 6:00 PM', start: 17 },
    ];

    const handleDateChange = (newDate) => {
      const updatedDate = setHours(setMinutes(newDate, date.getMinutes()), date.getHours());
      handleChange(dateTimeField, updatedDate.toISOString());
    };

    const handleTimeChange = (newHour) => {
      const updatedDate = setHours(new Date(editedFields[dateTimeField] || dateTimeValue), parseInt(newHour));
      handleChange(dateTimeField, updatedDate.toISOString());
    };

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {isEditing ? (
          <div className="flex flex-col space-y-2">
            <DatePicker
              selected={new Date(editedFields[dateTimeField] || dateTimeValue)}
              onChange={handleDateChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <select
              value={new Date(editedFields[dateTimeField] || dateTimeValue).getHours()}
              onChange={(e) => handleTimeChange(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              {timeSlots.map((slot) => (
                <option key={slot.start} value={slot.start}>
                  {slot.label}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <p className="mt-1 text-sm text-gray-900">
            {format(date, "MMMM d, yyyy")} {format(date, "h:mm a")} - {format(addHours(date, 1), "h:mm a")}
          </p>
        )}
      </div>
    );
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-lg shadow-md mb-4"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Order #{order.id}</h2>
          <p className="text-sm text-gray-500">{formatDateTime(order.dateTime)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Order Details</h3>
          <EditableSelect
            label="Crop Type"
            value={order.cropType}
            field="cropType"
            options={['FRUIT', 'VEGETABLE', 'GRAIN', 'OTHER']}
          />
          <EditableField label="Area (m²)" value={order.area} field="area" type="text" />
          <EditableField label="Cost (VND)" value={order.cost.toLocaleString()} field="cost" type="text" />
          <EditableDateTime
            label="Spray Session"
            dateTimeValue={order.spraySession.date + 'T' + order.spraySession.startTime}
            dateTimeField="spraySessionDateTime"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Location</h3>
          <div className="h-64 mb-4">
            <MapContainer center={[order.latitude, order.longitude]} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[order.latitude, order.longitude]}>
                <Popup>{order.location}</Popup>
              </Marker>
            </MapContainer>
          </div>
          <p className="text-sm text-gray-700 mb-2">
            <MapPin className="inline mr-2" size={16} />
            {order.location}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Farmer Information</h3>
        <p className="text-sm text-gray-700 mb-2">
          <Users className="inline mr-2" size={16} />
          {order.farmer.firstName} {order.farmer.lastName}
        </p>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Assigned Sprayers</h3>
        {order.sprayerAssignments.map((assignment) => (
          <div key={assignment.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md mb-2">
            <div>
              <p className="font-medium">{assignment.sprayer.firstName} {assignment.sprayer.lastName}</p>
              <p className="text-sm text-gray-500">Expertise: {assignment.sprayer.expertise}</p>
            </div>
            <div className="flex items-center space-x-2">
              {assignment.isPrimary ? (
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                  Primary
                </span>
              ) : (
                <button
                  onClick={() => handleSetPrimarySprayer(assignment.id)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Set as Primary
                </button>
              )}
              {isEditing && (
                              <button
                              onClick={() => handleRemoveSprayer(assignment.id)}
                              className="flex items-center justify-center w-7 h-7 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                            >
                              <X size={24} />
                            </button>
              )}
            </div>
          </div>
        ))}
        {isEditing && (
          <div className="mt-4">
            <h4 className="text-md font-semibold mb-2">Add New Sprayer</h4>
            <div className="flex flex-wrap items-center space-x-2 space-y-2">
              <input
                type="text"
                placeholder="First Name"
                value={newSprayer.firstName}
                onChange={(e) => setNewSprayer({ ...newSprayer, firstName: e.target.value })}
                className="flex-grow min-w-[200px] px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 ml-2"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={newSprayer.lastName}
                onChange={(e) => setNewSprayer({ ...newSprayer, lastName: e.target.value })}
                className="flex-grow min-w-[200px] px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 ml-2"
              />
              <select
                value={newSprayer.expertise}
                onChange={(e) => setNewSprayer({ ...newSprayer, expertise: e.target.value })}
                className="flex-grow min-w-[150px] px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 ml-2"
              >
                <option value="NOVICE">Novice</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="EXPERT">Expert</option>
              </select>
              <button
                onClick={handleAddSprayer}
                className="flex items-center justify-center w-9 h-9 bg-green-500 text-white rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
              >
                <Plus size={24} />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-wrap justify-between items-center">
        <div className="flex space-x-4">
          {order.status !== 'CONFIRMED' && (
            <button
            onClick={() => handleStatusChange('CONFIRMED')}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Confirm
          </button>
          )}
          {order.status !== 'IN_PROGRESS' && (
            <button
            onClick={() => handleStatusChange('IN_PROGRESS')}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            In Spray Progress
          </button>
          )}
          {order.status !== 'COMPLETED' && (
            <button
            onClick={() => handleStatusChange('SPRAY_COMPLETED')}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Spray Complete
          </button>
          )}
        </div>
        <div className="flex space-x-4">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <X className="inline-block mr-2" size={16} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Save className="inline-block mr-2" size={16} />
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Edit className="inline-block mr-2" size={16} />
              Edit Order
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default OrderDetails;