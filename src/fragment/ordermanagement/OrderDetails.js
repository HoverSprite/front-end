import React, { useState, useEffect } from 'react';
import { Search, Bell, ChevronDown, MapPin, Calendar, Users, Plus, Trash2, Crop, Edit, Check, X, DollarSign, PlayCircle, CheckCircle } from 'lucide-react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { motion } from 'framer-motion';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const localizer = momentLocalizer(moment);


const SpraySessionCalendar = ({ spraySession }) => {
  const events = [
    {
      title: 'Spray Session',
      start: new Date(spraySession.date),
      end: new Date(spraySession.date),
    },
  ];

  return (
    <div className="h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={['month', 'week', 'day']}
        defaultDate={new Date(spraySession.date)}
        defaultView="week"
      />
    </div>
  );
};



const KPICard = ({ icon, title, value }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        {icon}
        <h3 className="text-sm md:text-lg font-semibold ml-2">{title}</h3>
      </div>
    </div>
    <p className="text-lg md:text-2xl font-bold mt-2">{value}</p>
  </motion.div>
);

const EditableField = ({ label, value, onChange, type = "text" }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    {type === "datetime" ? (
      <DatePicker
        selected={new Date(value)}
        onChange={onChange}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat="MMMM d, yyyy h:mm aa"
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    )}
  </div>
);

const LocationPicker = ({ latitude, longitude, onLocationChange }) => {
  const MapEvents = () => {
    useMapEvents({
      click(e) {
        onLocationChange(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  return (
    <MapContainer 
      center={[latitude, longitude]} 
      zoom={13} 
      style={{ height: '300px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[latitude, longitude]} />
      <MapEvents />
    </MapContainer>
  );
};

const SprayerManagement = ({ sprayers, onAdd, onRemove }) => {
  const [newSprayer, setNewSprayer] = useState({ firstName: '', lastName: '', expertise: '' });

  const handleAdd = () => {
    onAdd({ ...newSprayer, id: Date.now() });
    setNewSprayer({ firstName: '', lastName: '', expertise: '' });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Manage Sprayers</h3>
      {sprayers.map((sprayer) => (
        <motion.div
          key={sprayer.id}
          className="flex items-center justify-between bg-gray-100 p-2 rounded-md"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          <span className="text-sm md:text-base">{`${sprayer.firstName} ${sprayer.lastName} (${sprayer.expertise})`}</span>
          <button
            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors duration-300"
            onClick={() => onRemove(sprayer.id)}
          >
            <Trash2 size={16} />
          </button>
        </motion.div>
      ))}
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
        <input
          className="border border-gray-300 rounded p-2 flex-grow focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="First Name"
          value={newSprayer.firstName}
          onChange={(e) => setNewSprayer({ ...newSprayer, firstName: e.target.value })}
        />
        <input
          className="border border-gray-300 rounded p-2 flex-grow focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Last Name"
          value={newSprayer.lastName}
          onChange={(e) => setNewSprayer({ ...newSprayer, lastName: e.target.value })}
        />
        <input
          className="border border-gray-300 rounded p-2 flex-grow focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Expertise"
          value={newSprayer.expertise}
          onChange={(e) => setNewSprayer({ ...newSprayer, expertise: e.target.value })}
        />
        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-300" onClick={handleAdd}>Add</button>
      </div>
    </div>
  );
};


const ActionButton = ({ icon, label, onClick, color, hoverColor }) => (
  <motion.button
    whileHover={{ scale: 1.05, backgroundColor: hoverColor }}
    whileTap={{ scale: 0.95 }}
    className={`flex items-center justify-center px-4 py-2 rounded-full text-white font-medium transition-colors duration-300 ${color}`}
    onClick={onClick}
  >
    {icon}
    <span className="ml-2">{label}</span>
  </motion.button>
);

const StatusButton = ({ status, currentStatus, onClick }) => {
  const getStatusProps = () => {
    switch (status) {
      case "Confirm":
        return { icon: <Check size={18} />, color: "bg-green-500", hoverColor: "#22c55e" };
      case "Spray In-Progress":
        return { icon: <PlayCircle size={18} />, color: "bg-blue-500", hoverColor: "#3b82f6" };
      case "Spray Completed":
        return { icon: <CheckCircle size={18} />, color: "bg-purple-500", hoverColor: "#a855f7" };
      default:
        return { icon: <Check size={18} />, color: "bg-gray-500", hoverColor: "#6b7280" };
    }
  };

  const { icon, color, hoverColor } = getStatusProps();

  return (
    <ActionButton
      icon={icon}
      label={status}
      onClick={() => onClick(status)}
      color={currentStatus === status ? color : "bg-gray-300"}
      hoverColor={hoverColor}
    />
  );
};

const OrderActions = ({ isEditing, setIsEditing, handleSave, handleStatusChange, currentStatus }) => (
  <div className="mt-6 flex flex-col gap-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-wrap gap-2"
    >
      {isEditing ? (
        <>
          <ActionButton
            icon={<Check size={18} />}
            label="Save Changes"
            onClick={handleSave}
            color="bg-green-500"
            hoverColor="#22c55e"
          />
          <ActionButton
            icon={<X size={18} />}
            label="Cancel"
            onClick={() => setIsEditing(false)}
            color="bg-red-500"
            hoverColor="#ef4444"
          />
        </>
      ) : (
        <ActionButton
          icon={<Edit size={18} />}
          label="Edit Order"
          onClick={() => setIsEditing(true)}
          color="bg-blue-500"
          hoverColor="#3b82f6"
        />
      )}
    </motion.div>
    {!isEditing && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-wrap gap-2"
      >
        <StatusButton status="Confirm" currentStatus={currentStatus} onClick={handleStatusChange} />
        <StatusButton status="Spray In-Progress" currentStatus={currentStatus} onClick={handleStatusChange} />
        <StatusButton status="Spray Completed" currentStatus={currentStatus} onClick={handleStatusChange} />
        <ActionButton
          icon={<DollarSign size={18} />}
          label="Pay"
          onClick={() => handleStatusChange("Paid")}
          color="bg-yellow-500"
          hoverColor="#eab308"
        />
      </motion.div>
    )}
  </div>
);


const OrderDetails = ({ orderData, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(orderData);

  const handleChange = (field, value) => {
    setEditedData({ ...editedData, [field]: value });
    if (field === 'dateTime') {
      setEditedData(prevState => ({
        ...prevState,
        spraySession: {
          ...prevState.spraySession,
          date: value
        }
      }));
    }
  };

  const handleSave = () => {
    onUpdate(editedData);
    setIsEditing(false);
  };

  const handleAddSprayer = (newSprayer) => {
    setEditedData({
      ...editedData,
      sprayerAssignments: [...editedData.sprayerAssignments, { id: Date.now(), sprayer: newSprayer }],
    });
  };

  const handleRemoveSprayer = (sprayerId) => {
    setEditedData({
      ...editedData,
      sprayerAssignments: editedData.sprayerAssignments.filter(
        (assignment) => assignment.sprayer.id !== sprayerId
      ),
    });
  };

  const handleStatusChange = (newStatus) => {
    setEditedData({ ...editedData, status: newStatus });
    onUpdate({ ...editedData, status: newStatus });
  };

  const handleLocationChange = (lat, lng) => {
    setEditedData({
      ...editedData,
      latitude: lat,
      longitude: lng,
    });
  };

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">Order ID: {orderData.id}</h2>
            <p className="text-sm text-gray-500">{new Date(orderData.dateTime).toLocaleString()}</p>
            <span className={`bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm mt-2 inline-block`}>
              {orderData.status}
            </span>
          </div>
        </div>
        <OrderActions
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          handleSave={handleSave}
          handleStatusChange={handleStatusChange}
          currentStatus={orderData.status}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-4 md:p-6 rounded-lg shadow-md"
          >
            <h3 className="text-lg md:text-xl font-bold mb-4">Order Overview</h3>
            {isEditing ? (
              <>
                <EditableField
                  label="Crop Type"
                  value={editedData.cropType}
                  onChange={(value) => handleChange('cropType', value)}
                />
                <EditableField
                  label="Area (m²)"
                  value={editedData.area}
                  onChange={(value) => handleChange('area', parseFloat(value))}
                  type="number"
                />
                <EditableField
                  label="Cost ($)"
                  value={editedData.cost}
                  onChange={(value) => handleChange('cost', parseFloat(value))}
                  type="number"
                />
              </>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <KPICard icon={<Crop size={20} className="text-green-600" />} title="Crop Type" value={editedData.cropType} />
                <KPICard icon={<MapPin size={20} className="text-blue-600" />} title="Area" value={`${editedData.area} m²`} />
                <KPICard icon={<DollarSign size={20} className="text-yellow-600" />} title="Cost" value={`$${editedData.cost.toFixed(2)}`} />
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-4 md:p-6 rounded-lg shadow-md"
          >
            <h3 className="text-lg font-semibold mb-4">Field Location</h3>
            {isEditing ? (
              <>
                <EditableField
                  label="Location Description"
                  value={editedData.location}
                  onChange={(value) => handleChange('location', value)}
                />
                <p className="mb-2">Click on the map to update the location:</p>
                <LocationPicker
                  latitude={editedData.latitude}
                  longitude={editedData.longitude}
                  onLocationChange={handleLocationChange}
                />
              </>
            ) : (
              <>
                <p className="mb-2">{editedData.location}</p>
                <div className="h-48 md:h-64 rounded-lg overflow-hidden shadow-lg">
                  <MapContainer 
                    center={[editedData.latitude, editedData.longitude]} 
                    zoom={13} 
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[editedData.latitude, editedData.longitude]} />
                  </MapContainer>
                </div>
              </>
            )}
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y:0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white p-4 md:p-6 rounded-lg shadow-md"
          >
            <h3 className="text-lg font-semibold mb-4">Farmer Information</h3>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
                {orderData.farmer.firstName[0]}{orderData.farmer.lastName[0]}
              </div>
              <div>
                <p className="font-semibold text-lg">{`${orderData.farmer.firstName} ${orderData.farmer.lastName}`}</p>
                <p className="text-sm text-gray-600">{orderData.farmer.emailAddress || 'N/A'}</p>
                <p className="text-sm text-gray-600">{orderData.farmer.phoneNumber || 'N/A'}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white p-4 md:p-6 rounded-lg shadow-md"
          >
            <h3 className="text-lg font-semibold mb-4">Assigned Sprayers</h3>
            {isEditing ? (
              <SprayerManagement
                sprayers={editedData.sprayerAssignments.map((assignment) => assignment.sprayer)}
                onAdd={handleAddSprayer}
                onRemove={handleRemoveSprayer}
              />
            ) : (
              <div className="space-y-2">
                {orderData.sprayerAssignments.map((assignment) => (
                  <motion.div
                    key={assignment.id}
                    className="flex items-center p-2 bg-gray-100 rounded-md"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {assignment.sprayer.firstName[0]}
                    </div>
                    <div>
                      <span className="text-sm md:text-base font-medium">{`${assignment.sprayer.firstName} ${assignment.sprayer.lastName}`}</span>
                      <p className="text-xs text-gray-600">{assignment.sprayer.expertise}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="bg-white p-4 md:p-6 rounded-lg shadow-md"
          >
            <h3 className="text-lg font-semibold mb-4">Spray Session Calendar</h3>
            {isEditing ? (
              <EditableField
                label="Spray Session Date"
                value={editedData.spraySession.date}
                onChange={(date) => handleChange('spraySession', { ...editedData.spraySession, date })}
                type="datetime"
              />
            ) : (
              <SpraySessionCalendar spraySession={editedData.spraySession} />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;