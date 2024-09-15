import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, DollarSign, Users, Plus, X, Phone, Check, Leaf } from 'lucide-react';
import { format, parse, setHours, setMinutes, addHours } from 'date-fns';
import DatePicker from 'react-datepicker';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import 'react-datepicker/dist/react-datepicker.css';
import WeeklyCalendar from './Boop';

const SprayOrderForm = ({ userRole, userId }) => {
  const [formData, setFormData] = useState({
    cropType: '',
    area: '',
    dateTime: '',
    location: '',
    farmerId: '',
  });
  const [totalCost, setTotalCost] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [farmerPhone, setFarmerPhone] = useState('');
  const [farmerDetails, setFarmerDetails] = useState(null);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lookupMethod, setLookupMethod] = useState('phone');
  const [farmerUserId, setFarmerUserId] = useState('');
  const baseURL = 'http://localhost:8080/api';

  useEffect(() => {
    const cost = parseFloat(formData.area) * 30000;
    setTotalCost(isNaN(cost) ? 0 : cost);
  }, [formData.area]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTimeSlotSelect = (date, time) => {
    setFormData((prevData) => ({
      ...prevData,
      dateTime: `${format(date, 'yyyy-MM-dd')}T${time}`,
    }));
  };

  const handleLookupMethodChange = (newMethod) => {
    setLookupMethod(newMethod);
    setFarmerDetails(null);
    setIsManualEntry(false);
    setError('');
  };

  const handleFarmerLookup = async (e) => {
    e.preventDefault();
    setError('');
    setFarmerDetails(null);
    setIsManualEntry(false);
    setLoading(true);

    try {
      let response;
      if (lookupMethod === 'phone') {
        response = await axios.get(`${baseURL}/user/${userId}/receptionist/farmers/search`, {
          params: { phoneNumber: farmerPhone }
        });
      } else {
        response = await axios.get(`${baseURL}/user/${userId}/receptionist/farmers/${farmerUserId}`);
      }

      if (response.data) {
        setFarmerDetails(response.data);
        setFormData((prevData) => ({
          ...prevData,
          location: response.data.homeAddress || '',
          farmerId: response.data.id || '',
        }));
      } else {
        throw new Error('No farmer data received');
      }
    } catch (err) {
      console.error('Error fetching farmer details:', err);
      let errorMessage = `No farmer found with this ${lookupMethod === 'phone' ? 'phone number' : 'user ID'}. Please enter farmer details manually.`;
      if (err.response && err.response.status !== 404) {
        errorMessage = 'An error occurred while fetching farmer details. Please try again.';
      }
      setError(errorMessage);
      setIsManualEntry(true);
      setFarmerDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const handleManualEntry = (e) => {
    e.preventDefault();
    setIsManualEntry(true);
    setFarmerDetails({
      id: null,
      firstName: '',
      lastName: '',
      emailAddress: '',
      homeAddress: '',
      phoneNumber: farmerPhone,
    });
  };

  const handleManualInputChange = (e) => {
    const { name, value } = e.target;
    setFarmerDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = userRole === 'FARMER'
        ? `${baseURL}/user/${userId}/farmer/orders`
        : `${baseURL}/user/${userId}/receptionist/orders`;

      const sprayOrderRequest = {
        farmer: {
          id: userRole === 'FARMER' ? parseInt(userId) : parseInt(formData.farmerId)
        },
        cropType: formData.cropType,
        area: parseFloat(formData.area),
        dateTime: formData.dateTime,
        cost: totalCost,
        location: formData.location,
        spraySession: {
          date: format(new Date(formData.dateTime), 'yyyy-MM-dd'),
          startTime: format(new Date(formData.dateTime), 'HH:mm:ss'),
          endTime: format(
            new Date(new Date(formData.dateTime).getTime() + 60 * 60 * 1000),
            'HH:mm:ss'
          )
        }
      };

      const response = await axios.post(url, sprayOrderRequest);
      setSuccess('Order created successfully!');
      setFormData({
        cropType: '',
        area: '',
        dateTime: '',
        location: '',
        farmerId: '',
      });
      setFarmerDetails(null);
      setFarmerPhone('');
      setIsManualEntry(false);
    } catch (error) {
      console.error('Error creating order:', error);
      if (error.response && error.response.data) {
        setError(
          typeof error.response.data === 'string'
            ? error.response.data
            : JSON.stringify(error.response.data)
        );
      } else {
        setError('An error occurred while creating the order. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-2xl shadow-lg mb-4"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Leaf className="text-green-500 mr-2" size={24} />
          <h2 className="text-2xl font-bold text-gray-900">Create Spray Order</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Order Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Crop Type</label>
                <select
                  name="cropType"
                  value={formData.cropType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Select crop type</option>
                  <option value="FRUIT">Fruit</option>
                  <option value="CEREAL">Cereal</option>
                  <option value="VEGETABLE">Vegetable</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area (m²)</label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Cost (VND)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    value={totalCost.toLocaleString()}
                    className="w-full pl-10 pr-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Spray Session</h3>
            <WeeklyCalendar onSelectTimeSlot={handleTimeSlotSelect} />
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Selected Date and Time</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  name="dateTime"
                  value={formData.dateTime ? format(new Date(formData.dateTime), "MMMM d, yyyy 'at' h:mm a") : ''}
                  className="w-full pl-10 pr-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  readOnly
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Location</h3>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter location"
              required
            />
          </div>
        </div>

        {userRole === 'RECEPTIONIST' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.5 }}
            className="mt-6"
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Farmer Information</h3>
            <div className="flex space-x-4 mb-4">
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  lookupMethod === 'phone'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => handleLookupMethodChange('phone')}
              >
                Phone Number
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  lookupMethod === 'userId'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => handleLookupMethodChange('userId')}
              >
                User ID
              </button>
            </div>
            <div className="flex space-x-4 mb-4">
              <div className="flex-grow">
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    {lookupMethod === 'phone' ? <Phone size={16} /> : <Users size={16} />}
                  </span>
                  <input
                    type={lookupMethod === 'phone' ? 'tel' : 'text'}
                    value={lookupMethod === 'phone' ? farmerPhone : farmerUserId}
                    onChange={(e) =>
                      lookupMethod === 'phone'
                        ? setFarmerPhone(e.target.value)
                        : setFarmerUserId(e.target.value)
                    }
                    placeholder={`Enter farmer's ${
                      lookupMethod === 'phone' ? 'phone number' : 'user ID'
                    }`}
                    className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 sm:text-sm"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleFarmerLookup}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Fetching...
                  </span>
                ) : (
                  'Fetch Details'
                )}
              </button>
            </div>
            {!farmerDetails && !isManualEntry && (
              <button
                type="button"
                onClick={handleManualEntry}
                className="mt-2 text-sm text-blue-500 hover:text-blue-700 focus:outline-none focus:underline"
              >
                Enter Farmer Details Manually
              </button>
            )}
            {isManualEntry && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.5 }}
                className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6"
              >
                <div className="sm:col-span-3">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      value={farmerDetails?.firstName || ''}
                      onChange={handleManualInputChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      value={farmerDetails?.lastName || ''}
                      onChange={handleManualInputChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="emailAddress"
                      type="email"
                      value={farmerDetails?.emailAddress || ''}
                      onChange={handleManualInputChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="homeAddress" className="block text-sm font-medium text-gray-700">
                    Home Address
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="homeAddress"
                      id="homeAddress"
                      value={farmerDetails?.homeAddress || ''}
                      onChange={handleManualInputChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </motion.div>
            )}
            {farmerDetails && !isManualEntry && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.5 }}
                className="mt-4 bg-green-50 border-l-4 border-green-400 p-4"
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Users className="h-5 w-5 text-green-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Farmer Details</h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>Name: {farmerDetails.firstName} {farmerDetails.lastName}</p>
                      <p>Email: {farmerDetails.emailAddress}</p>
                      <p>Address: {farmerDetails.homeAddress}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        <div className="mt-8 flex justify-end">
          <motion.button
            type="submit"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <>
                <Plus className="mr-2 h-5 w-5" aria-hidden="true" />
                Create Order
              </>
            )}
          </motion.button>
        </div>
      </form>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mt-4 bg-red-50 border-l-4 border-red-400 p-4 rounded-md"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <X className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mt-4 bg-green-50 border-l-4 border-green-400 p-4 rounded-md"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <Check className="h-5 w-5 text-green-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Success</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>{success}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SprayOrderForm;