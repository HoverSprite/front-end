import React, { useState, useEffect, useCallback } from 'react';
import { motion,AnimatePresence  } from 'framer-motion';
import { MapPin, Calendar, DollarSign, Users, Crop, ChevronDown, Edit, Plus, Save, X, ChevronRight, Activity, CreditCard, QrCode, Star, ArrowLeft, ExternalLink  } from 'lucide-react';
import { format, parse, setHours, setMinutes, addHours } from 'date-fns';
import DatePicker from 'react-datepicker';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { sendUpdatedOrderToAPI, fetchAvailableSprayersAPI, sendFeedbackToAPI } from '../../service/DataService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LazyImage = ({ imageData, alt, onImageClick }) => {
  const [imageUrl, setImageUrl] = useState(null);

  const decompressImage = useCallback(() => {
    if (!imageUrl) {
      const url = `data:image/jpeg;base64,${imageData.imageStr}`;
      setImageUrl(url);
    }
    onImageClick(`data:image/jpeg;base64,${imageData.imageStr}`);
  }, [imageData, imageUrl, onImageClick]);

  return (
    <div 
      className="w-20 h-20 bg-gray-200 rounded-md cursor-pointer flex items-center justify-center relative"
      onClick={decompressImage}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={alt}
          className="w-full h-full object-cover rounded-md"
        />
      ) : (
        <ExternalLink size={24} className="text-gray-400" />
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          decompressImage();
        }}
        className="absolute bottom-1 right-1 bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <ExternalLink size={12} />
      </button>
    </div>
  );
};

const OrderDetails = ({ orderData, onUpdate }) => {
  const [order, setOrder] = useState(orderData);
  const [originalOrder, setOriginalOrder] = useState(orderData);
  const [isEditing, setIsEditing] = useState(false);
  const [editedFields, setEditedFields] = useState({});
  const [availableSprayers, setAvailableSprayers] = useState({});
  const [activeTab, setActiveTab] = useState('assigned');
  const [removedSprayers, setRemovedSprayers] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();


  const [comment, setComment] = useState('');
  const [overallRating, setOverallRating] = useState(0);
  const [attentiveRating, setAttentiveRating] = useState(0);
  const [friendlyRating, setFriendlyRating] = useState(0);
  const [professionalRating, setProfessionalRating] = useState(0);
  const [images, setImages] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackError, setFeedbackError] = useState(null);

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleCommentChange = (e) => setComment(e.target.value);
  const handleRatingChange = (setter) => (value) => setter(value);
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const convertToImageUrl = (imageData) => {
    if (imageData && typeof imageData === 'object' && imageData.imageStr) {
      return `data:image/jpeg;base64,${imageData.imageStr}`;
    }
    console.error('Unrecognized image format:', imageData);
    return null;
  };

  const ImageModal = ({ isOpen, onClose, imageUrl }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-4 rounded-lg max-w-3xl max-h-3xl">
          <img src={imageUrl} alt="Enlarged feedback" className="max-w-full max-h-[80vh] object-contain" />
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  const handleSubmitFeedback = async () => {
    setIsSubmitting(true);
    setFeedbackError(null);

    try {
      const base64Images = await Promise.all(images.map(convertToBase64));

      const feedback = {
        comment,
        overallRating,
        attentiveRating,
        friendlyRating,
        professionalRating,
        images: base64Images.map(base64 => ({ imageStr: base64 }))
      };

      const response = await sendFeedbackToAPI(order.id, feedback);
      if (response.status === 200 || response.status === 201) {
        // Reset form after successful submission
        setComment('');
        setOverallRating(0);
        setAttentiveRating(0);
        setFriendlyRating(0);
        setProfessionalRating(0);
        setImages([]);
        onUpdate(order);
        // Optionally, you can update the order state or fetch updated order data here
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setFeedbackError('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const RatingStars = ({ rating, onRatingChange, onBlock = false }) => (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          size={20}
          className={`${value <= rating ? 'text-yellow-400' : 'text-gray-300'} ${
            onBlock ? '' : 'cursor-pointer hover:text-yellow-500'
          }`}
          onClick={() => {
            if (!onBlock && onRatingChange) {
              onRatingChange(value);
            }
          }}
        />
      ))}
    </div>
  );

  useEffect(() => {
    setOrder(orderData);
    setOriginalOrder(orderData);
  }, [orderData]);

  const SprayerCard = ({ sprayer, count, onAdd, onRemove, isPrimary, onSetPrimary, isAssigned }) => (
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {sprayer.profilePictureUrl ? (
              <img src={sprayer.profilePictureUrl} alt={`${sprayer.fullName}`} className="w-full h-full object-cover" />
            ) : (
              <Users size={24} className="text-gray-500" />
            )}
          </div>
          <div>
            <p className="font-medium text-sm">{sprayer.fullName}</p>
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
  );

  useEffect(() => {
    if (isEditing) {
      fetchAvailableSprayers();
    }
  }, [isEditing]);

  const fetchAvailableSprayers = async () => {
    try {
      const response = await fetchAvailableSprayersAPI(order.id);
      setAvailableSprayers(response.data);
    } catch (error) {
      console.error('Error fetching available sprayers:', error);
    }
  };

  const FeedbackDisplay = ({ feedback, setSelectedImage, setIsImageModalOpen }) => {
    const handleImageClick = (imageUrl) => {
      setSelectedImage(imageUrl);
      setIsImageModalOpen(true);
    };
  
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <p className="text-sm text-gray-700 mb-2">{feedback.comment}</p>
        <div className="flex justify-between items-start">
            <div className="flex items-center">
              <p className="text-sm font-medium mr-2 mt-3">Overall Rating:</p>
              <RatingStars rating={feedback.overallRating} onBlock={true} />
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Attentiveness</p>
            <RatingStars rating={feedback.attentiveRating} onBlock={true} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Friendliness</p>
            <RatingStars rating={feedback.friendlyRating} onBlock={true} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Professionalism</p>
            <RatingStars rating={feedback.professionalRating} onBlock={true} />
          </div>
        </div>
        {feedback.images && feedback.images.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Images</p>
            <div className="flex flex-wrap gap-2">
              {feedback.images.map((image, index) => (
                <LazyImage
                  key={index}
                  imageData={image}
                  alt={`Feedback image ${index + 1}`}
                  onImageClick={handleImageClick}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const handlePayment = () => {
    navigate(`/payment?orderId=${order.id}`);
  };

  const handleQrCodeNavigation = () => {
    navigate(`/qr?orderId=${order.id}`);
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
      autoAssign: checked
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
    await sendUpdatedOrderToAPI(updatedOrder);
    setOrder(updatedOrder);
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
          {order.status === 'SPRAY_COMPLETED' && user.roles.includes('ROLE_FARMER') && (
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
          {
            order.status === 'SPRAY_COMPLETED' && user.roles.includes('ROLE_SPRAYER') && (
              <motion.button
              onClick={handleQrCodeNavigation}
              className="group relative px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center">
                <QrCode className="h-4 w-4" />
              </span>
              <span className="absolute left-0 top-0 h-full w-0 bg-white opacity-20 transition-all duration-300 ease-out group-hover:w-full"></span>
            </motion.button>
            )
          }
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Order Details</h3>
          <EditableSelect
            label="Crop Type"
            value={order.cropType}
            field="cropType"
            options={['FRUIT', 'VEGETABLE', 'CEREAL']}
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Area (m²)</label>
            {isEditing ? (
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={editedFields.area !== undefined ? editedFields.area : order.area}
                onChange={(e) => handleChange('area', e.target.value)}
              />
            ) : (
              <p className="mt-1 text-sm text-gray-900">{order.area}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Cost (VND)</label>
            {isEditing ? (
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={editedFields.cost !== undefined ? editedFields.cost : order.cost.toLocaleString()}
                onChange={(e) => handleChange('cost', e.target.value)}
              />
            ) : (
              <p className="mt-1 text-sm text-gray-900">{order.cost.toLocaleString()}</p>
            )}
          </div>
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
          {order.farmer.fullName}
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

          {activeTab === 'available' && user.roles.includes('ROLE_RECEPTIONIST') && isEditing && (
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
          {order.status === 'PENDING' && user.roles.includes('ROLE_RECEPTIONIST') && (
            <button
              onClick={() => handleStatusChange('CONFIRMED')}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Confirm
            </button>
          )}
          {order.status === 'ASSIGNED' && user.roles.includes('ROLE_SPRAYER') && (
            <button
              onClick={() => handleStatusChange('IN_PROGRESS')}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              In Spray Progress
            </button>
          )}
          {order.status === 'IN_PROGRESS' && user.roles.includes('ROLE_SPRAYER') && (
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
            (order.status !== 'IN_PROGRESS' && order.status !== 'SPRAY_COMPLETED' && order.status != 'COMPLETED') && 
            (user.roles.includes('ROLE_RECEPTIONIST') || ( order.status === 'PENDING' && user.roles.includes('ROLE_FARMER'))) && (
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

      {order.feedBacks && order.feedBacks.length > 0 && (
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Feedback</h3>
          {order.feedBacks.map((feedback) => (
            <FeedbackDisplay 
              key={feedback.id} 
              feedback={feedback}
              setSelectedImage={setSelectedImage}
              setIsImageModalOpen={setIsImageModalOpen}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
      {order.status === 'COMPLETED' && user.roles.includes('ROLE_FARMER') && (
        <motion.div
          key="feedback-form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="mt-8 border-t pt-6"
        >
          <h3 className="text-lg font-semibold mb-4">Leave a Comment</h3>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="4"
            placeholder="Share your experience..."
            value={comment}
            onChange={handleCommentChange}
          ></textarea>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Overall Rating</p>
              <RatingStars rating={overallRating} onRatingChange={handleRatingChange(setOverallRating)} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Attentiveness</p>
              <RatingStars rating={attentiveRating} onRatingChange={handleRatingChange(setAttentiveRating)} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Friendliness</p>
              <RatingStars rating={friendlyRating} onRatingChange={handleRatingChange(setFriendlyRating)} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Professionalism</p>
              <RatingStars rating={professionalRating} onRatingChange={handleRatingChange(setProfessionalRating)} />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Images
              <input
                type="file"
                multiple
                onChange={handleImageUpload}
                className="mt-1 block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-medium
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </label>
            {images.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {images.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Uploaded ${index + 1}`}
                      className="h-20 w-20 object-cover rounded-md"
                    />
                    <button
                      onClick={() => setImages(images.filter((_, i) => i !== index))}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleSubmitFeedback}
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Submit Feedback
          </button>
        </motion.div>
      )}
      </AnimatePresence>

      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageUrl={selectedImage}
      />
    </motion.div>
  );
};

export default OrderDetails;