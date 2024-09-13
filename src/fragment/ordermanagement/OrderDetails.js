import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, DollarSign, Users, Crop, ChevronDown, Edit, Plus, Save, X, ChevronRight, Activity, CreditCard  } from 'lucide-react';
import { format, parse, setHours, setMinutes, addHours } from 'date-fns';
import DatePicker from 'react-datepicker';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'leaflet/dist/leaflet.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { sendUpdatedOrderToAPI, fetchAvailableSprayersAPI } from '../../service/DataService';
import { useNavigate } from 'react-router-dom';

const OrderDetails = ({ orderData, onUpdate }) => {
  const [order, setOrder] = useState(orderData);
  const [originalOrder, setOriginalOrder] = useState(orderData);
  const [isEditing, setIsEditing] = useState(false);
  const [editedFields, setEditedFields] = useState({});
  const [availableSprayers, setAvailableSprayers] = useState({});
  const [activeTab, setActiveTab] = useState('assigned');
  const [removedSprayers, setRemovedSprayers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setOrder(orderData);
    setOriginalOrder(orderData);
  }, [orderData]);

  const SprayerCard = ({ sprayer, count, onAdd, onRemove, isPrimary, onSetPrimary, isAssigned }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-sm p-4 mb-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {sprayer.profilePictureUrl ? (
              <img src={sprayer.profilePictureUrl} alt={`${sprayer.firstName} ${sprayer.lastName}`} className="w-full h-full object-cover" />
            ) : (
              <Users size={24} className="text-gray-500" />
            )}
          </div>
          <div>
            <p className="font-medium text-sm">{sprayer.firstName} {sprayer.lastName}</p>
            <p className="text-xs text-gray-500">{sprayer.expertise}</p>
            {count !== undefined && (
              <div className="flex items-center mt-1">
                <Activity size={12} className="text-blue-500 mr-1" />
                <span className="text-xs text-blue-500">{count} orders this week</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          {isAssigned ? (
            <>
              {isPrimary ? (
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                  Primary
                </span>
              ) : (
                <button
                  onClick={onSetPrimary}
                  className="text-blue-600 hover:text-blue-800 text-xs"
                >
                  Set as Primary
                </button>
              )}
              {isEditing && (
                <button
                  onClick={onRemove}
                  className="flex items-center justify-center w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                >
                  <X size={12} />
                </button>
              )}
            </>
          ) : (
            <button
              onClick={onAdd}
              className="flex items-center justify-center w-6 h-6 bg-green-500 text-white rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
            >
              <Plus size={12} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );

  useEffect(() => {
    if (isEditing) {
      fetchAvailableSprayers();
    }
  }, [isEditing]);

  const fetchAvailableSprayers = async () => {
    try {
      const response = await fetchAvailableSprayersAPI(1, order.id);
      setAvailableSprayers(response.data);
    } catch (error) {
      console.error('Error fetching available sprayers:', error);
    }
  };

  const handlePayment = () => {
    navigate(`/payment?orderId=${order.id}`);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedFields({});
    setOriginalOrder({ ...order }); // Store the original order state
    setRemovedSprayers([]);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedFields({});
    setOrder({ ...originalOrder }); // Restore the original order state
    setRemovedSprayers([]);

    // Restore the original sprayer assignments
    setAvailableSprayers(prevAvailable => {
      const updatedAvailableSprayers = { ...prevAvailable };
      removedSprayers.forEach(sprayer => {
        const expertise = sprayer.expertise;
        if (!updatedAvailableSprayers[expertise]) {
          updatedAvailableSprayers[expertise] = [];
        }
        updatedAvailableSprayers[expertise] = updatedAvailableSprayers[expertise].filter(
          ({ first }) => first.id !== sprayer.id
        );
      });
      return updatedAvailableSprayers;
    });
  };

  const handleSave = async () => {
    const updatedOrder = { ...order, ...editedFields };
    await sendUpdatedOrderToAPI(updatedOrder);
    // setOrder(updatedOrder);
    setIsEditing(false);
    onUpdate(updatedOrder);
    setRemovedSprayers([]);
  };

  const handleChange = (field, value) => {
    setEditedFields({ ...editedFields, [field]: value });
  };

  const handleAutoAssignChange = (checked) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      autoAssign: checked // Update state with new toggle value
    }));
  };

  const handleAddSprayer = (sprayer) => {
    const updatedSprayerAssignments = [
      ...order.sprayerAssignments,
      {
        sprayer: {
          ...sprayer,
          id: sprayer.id,
        },
        isPrimary: order.sprayerAssignments.length === 0,
      },
    ];
    setOrder({ ...order, sprayerAssignments: updatedSprayerAssignments });

    // Remove the added sprayer from the available sprayers list
    const updatedAvailableSprayers = { ...availableSprayers };
    Object.keys(updatedAvailableSprayers).forEach(expertise => {
      updatedAvailableSprayers[expertise] = updatedAvailableSprayers[expertise].filter(
        ({ first }) => first.id !== sprayer.id
      );
    });
    setAvailableSprayers(updatedAvailableSprayers);
  };

  const handleRemoveSprayer = (sprayerId) => {
    const removedAssignment = order.sprayerAssignments.find(assignment => assignment.sprayer.id === sprayerId);

    if (!removedAssignment) {
      console.error(`Sprayer with id ${sprayerId} not found in assignments`);
      return;
    }

    const updatedSprayerAssignments = order.sprayerAssignments.filter(
      (assignment) => assignment.sprayer.id !== sprayerId
    );

    // Update primary sprayer if necessary
    if (removedAssignment.isPrimary && updatedSprayerAssignments.length > 0) {
      updatedSprayerAssignments[0].isPrimary = true;
    }

    setOrder(prevOrder => ({
      ...prevOrder,
      sprayerAssignments: updatedSprayerAssignments
    }));

    // Add the removed sprayer to the removedSprayers list
    setRemovedSprayers(prevRemoved => [...prevRemoved, removedAssignment.sprayer]);

    // Add the removed sprayer back to the available sprayers list
    const removedSprayer = removedAssignment.sprayer;
    setAvailableSprayers(prevAvailable => {
      const updatedAvailableSprayers = { ...prevAvailable };
      const expertise = removedSprayer.expertise;
      if (!updatedAvailableSprayers[expertise]) {
        updatedAvailableSprayers[expertise] = [];
      }
      updatedAvailableSprayers[expertise].push({ first: removedSprayer, second: 0 });
      return updatedAvailableSprayers;
    });
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
        <div className="flex flex-col items-end space-y-2">
          <StatusBadge status={order.status} />
          {order.status === 'SPRAY_COMPLETED' && (
            <motion.button
              onClick={handlePayment}
              className="group relative px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 ease-in-out"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center">
                <CreditCard className="mr-2 h-4 w-4" />
                Pay Now
              </span>
              <span className="absolute left-0 top-0 h-full w-0 bg-white opacity-20 transition-all duration-300 ease-out group-hover:w-full"></span>
            </motion.button>
          )}
        </div>
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

      {order.status != 'PENDING' && (
        <div className="mt-6">
          <div className="flex items-center justify-between wrap">
            <h3 className="text-lg font-semibold">Sprayer Management</h3>
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={order.autoAssign} className="sr-only peer" disabled={!isEditing} onChange={(e) => handleAutoAssignChange(e.target.checked)} />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex mb-4 border-b">
            <button
              className={`pb-2 px-4 text-sm font-medium ${activeTab === 'assigned' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
              onClick={() => setActiveTab('assigned')}
            >
              Assigned Sprayers
            </button>
            {isEditing && (
              <button
                className={`pb-2 px-4 text-sm font-medium ${activeTab === 'available' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                onClick={() => setActiveTab('available')}
              >
                Available Sprayers
              </button>
            )}
          </div>

          {activeTab === 'assigned' && (
            <div>
              {order.sprayerAssignments.map((assignment) => (
                <SprayerCard
                  key={assignment.sprayer.id}
                  sprayer={assignment.sprayer}
                  isPrimary={assignment.isPrimary}
                  onSetPrimary={() => handleSetPrimarySprayer(assignment.sprayer.id)}
                  onRemove={() => handleRemoveSprayer(assignment.sprayer.id)}
                  isAssigned={true}
                />
              ))}
              {order.sprayerAssignments.length === 0 && (
                <p className="text-gray-500 text-sm">No sprayers assigned yet.</p>
              )}
            </div>
          )}

          {activeTab === 'available' && isEditing && (
            <div>
              {Object.entries(availableSprayers).map(([expertise, sprayers]) => (
                <div key={expertise} className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">{expertise}</h4>
                  {sprayers
                    .filter(({ first: sprayer }) =>
                      !order.sprayerAssignments.some(a => a.sprayer.id === sprayer.id)
                    )
                    .map(({ first: sprayer, second: count }) => (
                      <SprayerCard
                        key={sprayer.id}
                        sprayer={sprayer}
                        count={count}
                        onAdd={() => handleAddSprayer(sprayer)}
                        isAssigned={false} // Already filtered out, so this will always be false
                      />
                    ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-8 flex flex-wrap justify-between items-center">
        <div className="flex space-x-4">
          {order.status === 'PENDING' && (
            <button
              onClick={() => handleStatusChange('CONFIRMED')}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Confirm
            </button>
          )}
          {order.status === 'ASSIGNED' && (
            <button
              onClick={() => handleStatusChange('IN_PROGRESS')}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              In Spray Progress
            </button>
          )}
          {order.status === 'IN_PROGRESS' && (
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
            (order.status !== 'IN_PROGRESS' && order.status !== 'SPRAY_COMPLETED' && order.status != 'COMPLETED') && (
              <button
              onClick={handleEdit}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Edit className="inline-block mr-2" size={16} />
              Edit Order
            </button>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default OrderDetails;