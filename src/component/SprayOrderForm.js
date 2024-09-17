import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, DollarSign, Users, Plus, X, Phone, Check, Leaf } from 'lucide-react';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import WeeklyCalendar from './Boop'; // Your custom WeeklyCalendar component
import { sendCreateOrderToAPI } from '../service/DataService';
import { useAuth } from '../context/AuthContext';
import lunar from 'chinese-lunar'; // Library for Lunar date conversion

const SprayOrderForm = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    cropType: '',
    area: '',
    dateTime: new Date(),
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
  const baseURL = 'http://localhost:8080/api';

  const userRole = user.roles[0].includes('ROLE_RECEPTIONIST') ? 'RECEPTIONIST' : 'FARMER';
  const userId = user.sub;

  useEffect(() => {
    const cost = parseFloat(formData.area) * 30000;
    setTotalCost(isNaN(cost) ? 0 : cost);
  }, [formData.area]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDatePickerChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      dateTime: date,
    }));
  };

  const handleTimeSlotSelect = (date, time) => {
    const selectedDateTime = new Date(`${format(date, 'yyyy-MM-dd')}T${time}`);
    // Convert the selected Gregorian date to Lunar using the chinese-lunar library
  const lunarDate = lunar.solarToLunar(date);
  const lunarDay = lunarDate.day;
  const lunarMonth = lunarDate.month;
  const lunarYear = lunarDate.year;
  const isLeapMonth = lunarDate.isLeap;

  setFormData((prevData) => ({
    ...prevData,
    dateTime: selectedDateTime,
    lunarDate: {
      year: lunarYear,
      month: lunarMonth,
      day: lunarDay,
      isLeapMonth,
    },
  }));
};

  const handleFarmerLookup = async () => {
    setError('');
    setFarmerDetails(null);
    setIsManualEntry(false);
    setLoading(true);

    try {
      const response = await axios.get(`${baseURL}/user/${userId}/receptionist/farmers/search`, {
        params: { phoneNumber: farmerPhone }
      });

      if (response.data) {
        setFarmerDetails(response.data);
        setFormData((prevData) => ({
          ...prevData,
          fullName: response.data.fullName || '',
          location: response.data.homeAddress || '',
          farmerId: response.data.id || '',
        }));
      } else {
        throw new Error('No farmer data received');
      }
    } catch (err) {
      console.error('Error fetching farmer details:', err);
      setError('No farmer found with this phone number. Please enter farmer details manually.');
      setIsManualEntry(true);
      setFarmerDetails({
        phoneNumber: farmerPhone,
        fullName: '',
        homeAddress: '',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManualInputChange = (e) => {
    const { name, value } = e.target;
    setFarmerDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    let farmerInfo;
    if (userRole === 'RECEPTIONIST') {
      farmerInfo = {
        id: farmerDetails?.id || '',
        phoneNumber: farmerPhone,
        fullName: farmerDetails?.fullName || '',
      };
    }
  
    try {
      const sprayOrderRequest = {
        farmer: farmerInfo,
        cropType: formData.cropType,
        area: parseFloat(formData.area),
        dateTime: formData.dateTime,
        lunarDate: {
          year: formData.lunarDate.year,
          month: formData.lunarDate.month,
          day: formData.lunarDate.day,
          isLeapMonth: formData.lunarDate.isLeapMonth,
        },
        cost: totalCost,
        location: formData.location || farmerDetails?.homeAddress,
        spraySession: {
          date: format(new Date(formData.dateTime), 'yyyy-MM-dd'),
          startTime: format(new Date(formData.dateTime), 'HH:mm:ss'),
          endTime: format(
            new Date(new Date(formData.dateTime).getTime() + 60 * 60 * 1000),
            'HH:mm:ss'
          )
        }
      };
  
      const response = await sendCreateOrderToAPI(sprayOrderRequest);
      setSuccess('Order created successfully!');
      setFormData({
        cropType: '',
        area: '',
        dateTime: null,
        location: '',
        farmerId: '',
      });
      setFarmerDetails(null);
      setFarmerPhone('');
      setIsManualEntry(false);
    } catch (error) {
      console.error('Error creating order:', error);
      setError('An error occurred while creating the order. Please try again.');
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
        {userRole === 'RECEPTIONIST' && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Farmer Information</h3>
            <div className="flex space-x-4 mb-4">
              <div className="flex-grow">
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    <Phone size={16} />
                  </span>
                  <input
                    type="tel"
                    value={farmerPhone}
                    onChange={(e) => setFarmerPhone(e.target.value)}
                    placeholder="Enter farmer's phone number"
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
                {loading ? 'Fetching...' : 'Fetch Details'}
              </button>
            </div>
            {isManualEntry && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.5 }}
                className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6"
              >
                <div className="sm:col-span-6">
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="fullName"
                      id="fullName"
                      value={farmerDetails?.fullName || ''}
                      onChange={handleManualInputChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
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
                      required
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
                      <p>Name: {farmerDetails.fullName}</p>
                      <p>Phone: {farmerDetails.phoneNumber}</p>
                      <p>Address: {farmerDetails.homeAddress}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

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
            <WeeklyCalendar
              onSelectTimeSlot={handleTimeSlotSelect}
              selectedDate={formData.dateTime}
            />
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Selected Date and Time</label>
              <DatePicker
                selected={formData.dateTime instanceof Date ? formData.dateTime : null}
                onChange={handleDatePickerChange}
                showTimeSelect
                dateFormat="dd/MM/yyyy HH:mm"
                customInput={
                  <input
                    className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
                    placeholder="DD/MM/YYYY HH:mm"
                  />
                }
              />
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

        <div className="mt-8 flex justify-end">
          <motion.button
            type="submit"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700"
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
