import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Phone, Mail, Home, Star, Droplet, Tractor, Cloud, Sun, Lock } from 'lucide-react';
import authService from '../service/AuthService';
import { useAuth } from '../context/AuthContext';

const UserDetailsSignUpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [errors, setErrors] = useState({});
  
  const { email: initialEmail, password: initialPassword, role, provider } = location.state || {};
  const { login, oauth2_signup } = useAuth();

  useEffect(() => {
    if (!initialEmail || (!provider && !initialPassword) || !role) {
      const timer = setTimeout(() => {
        navigate('/signup');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [initialEmail, initialPassword, role, provider, navigate]);

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    emailAddress: initialEmail || '',
    homeAddress: '',
    expertise: '',
    password: initialPassword || '',
    confirmPassword: initialPassword || ''
  });

  /**
   * Updated validateForm to accept form data as a parameter.
   */
  const validateForm = (data = formData) => {
    const newErrors = {};

    // Full Name validation
    const fullNameRegex = /^[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴĐÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸ][a-zàáạảãâầấậẩẫăằắặẳẵđèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹ]*(?:[A-Z][a-zàáạảãâầấậẩẫăằắặẳẵđèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹ]*)*(?: [A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴĐÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸ][a-zàáạảãâầấậẩẫăằắặẳẵđèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹ]*)*$/;
    if (!fullNameRegex.test(data.fullName.trim())) {
      newErrors.fullName = "Invalid full name format.";
    }

    // Phone number validation
    // Updated regex to accommodate '0' followed by 9 digits or '+84' followed by 9 digits, allowing optional spaces
    const phoneRegex = /^(0|\+84)\s?\d{3}\s?\d{3}\s?\d{3}$/;
    if (!phoneRegex.test(data.phoneNumber.trim())) {
      newErrors.phoneNumber = "Invalid phone number format. Use '0XXXXXXX' or '+84 XXXXXXX'.";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|vn)$/;
    if (!emailRegex.test(data.emailAddress.trim())) {
      newErrors.emailAddress = "Invalid email format. Only '.com' or '.vn' domains are allowed.";
    }

    // Password validation (only for non-OAuth signup)
    if (!provider) {
      const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
      if (!passwordRegex.test(data.password)) {
        newErrors.password = "Password must contain at least one capital letter and one special character, and be at least 8 characters long.";
      }
      if (data.password !== data.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
      }
    }

    return newErrors;
  };

  /**
   * Updated handleChange to validate with updated form data.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => {
      const updatedForm = { ...prevState, [name]: value };
      const validationErrors = validateForm(updatedForm);
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: validationErrors[name] || ''
      }));
      return updatedForm;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const frontendErrors = validateForm();
    if (Object.keys(frontendErrors).length > 0) {
      setErrors(frontendErrors);
      return;
    }

    setErrors({});
    const userData = {
      emailAddress: formData.emailAddress.trim(),
      passwordHash: provider ? null : formData.password,
      fullName: formData.fullName.trim(),
      homeAddress: formData.homeAddress.trim(),
      role,
      phoneNumber: formData.phoneNumber.trim(),
      expertise: role === 'SPRAYER' ? formData.expertise : null,
      oauthProvider: provider
    };

    try {
      if (provider) {
        const signinResponse = await oauth2_signup(userData);
        if (signinResponse) {
          navigate('/');
        }
      } else {
        await authService.signup(userData);
        const signinResponse = await login(userData.emailAddress, formData.password);
        if (signinResponse) {
          navigate('/');
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
      console.error("Error response:", error.response);
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: "An error occurred during signup. Please try again." });
      }
    }
  };

  if (!initialEmail || (!provider && !initialPassword) || !role) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 overflow-hidden"
      >
        <Cloud className="text-blue-100 w-64 h-64 absolute -top-16 -left-16 transform -rotate-12" />
        <Cloud className="text-blue-100 w-48 h-48 absolute top-1/4 right-1/4 transform rotate-6" />
        <Sun className="text-yellow-100 w-72 h-72 absolute -bottom-16 -right-16" />
        <Droplet className="text-green-100 w-40 h-40 absolute bottom-1/4 left-1/4 transform rotate-12" />
      </motion.div>
  
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-md p-6 w-full max-w-4xl relative z-10"
      >
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
              <Droplet className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">HoverSprite</h1>
              <p className="text-sm text-gray-500">Efficient Crop Management</p>
            </div>
          </div>
        </div>
  
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-800">Complete Your Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="fullName">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                  <input
                    className={`w-full pl-10 pr-3 py-2 text-gray-700 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white ${errors.fullName ? 'border-red-500' : ''}`}
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Trần Bách Nghệ or Tran Bach Nghe"
                    required
                  />
                </div>
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>

              {/* Phone Number Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phoneNumber">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                  <input
                    className={`w-full pl-10 pr-3 py-2 text-gray-700 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white ${errors.phoneNumber ? 'border-red-500' : ''}`}
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="e.g. 0862 123 456 or +84 862 123 456"
                    required
                  />
                </div>
                {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
              </div>

              {/* Email Address Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="emailAddress">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                  <input
                    className={`w-full pl-10 pr-3 py-2 text-gray-700 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white ${errors.emailAddress ? 'border-red-500' : ''}`}
                    type="email"
                    id="emailAddress"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                {errors.emailAddress && <p className="text-red-500 text-xs mt-1">{errors.emailAddress}</p>}
              </div>

              {/* Home Address Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="homeAddress">
                  Home Address
                </label>
                <div className="relative">
                  <Home className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                  <input
                    className="w-full pl-10 pr-3 py-2 text-gray-700 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white"
                    type="text"
                    id="homeAddress"
                    name="homeAddress"
                    value={formData.homeAddress}
                    onChange={handleChange}
                    placeholder="Enter your home address"
                    required
                  />
                </div>
              </div>

              {/* Expertise Level Field (for SPRAYER role) */}
              {role === "SPRAYER" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="expertise">
                    Expertise Level
                  </label>
                  <div className="relative">
                    <Star className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                    <select
                      className={`w-full pl-10 pr-3 py-2 text-gray-700 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white ${errors.expertise ? 'border-red-500' : ''}`}
                      id="expertise"
                      name="expertise"
                      value={formData.expertise}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Expertise</option>
                      <option value="APPRENTICE">Apprentice</option>
                      <option value="ADEPT">Adept</option>
                      <option value="EXPERT">Expert</option>
                    </select>
                  </div>
                  {errors.expertise && <p className="text-red-500 text-xs mt-1">{errors.expertise}</p>}
                </div>
              )}

              {/* Password Fields (only for non-OAuth signup) */}
              {!provider && (
                <>
                  {/* Password Field */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                      <input
                        className={`w-full pl-10 pr-3 py-2 text-gray-700 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white ${errors.password ? 'border-red-500' : ''}`}
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                      <input
                        className={`w-full pl-10 pr-3 py-2 text-gray-700 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white ${errors.confirmPassword ? 'border-red-500' : ''}`}
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        required
                      />
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                  </div>
                </>
              )}

              {/* General Errors */}
              {errors.general && <p className="text-red-500 text-sm mt-4">{errors.general}</p>}

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-green-600 text-white py-2 rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300 flex items-center justify-center"
                type="submit"
              >
                <Tractor className="inline-block w-5 h-5 mr-2" />
                Complete Registration
              </motion.button>
            </form>
          </div>

          {/* Sidebar Content */}
          <div className="bg-green-600 text-white p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Why Choose HoverSprite?</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                <span>Personalized crop management</span>
              </li>
              <li className="flex items-center">
                <Droplet className="w-5 h-5 mr-2" />
                <span>Precision spraying techniques</span>
              </li>
              <li className="flex items-center">
                <Tractor className="w-5 h-5 mr-2" />
                <span>Expert sprayers at your service</span>
              </li>
            </ul>
            <div className="mt-6 bg-white text-black p-4 rounded-md">
              <h4 className="text-lg font-semibold mb-2 text-green-600">Get Started Today</h4>
              <p className="text-sm text-gray-600">Complete your profile to access our full range of services and start optimizing your crop management.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserDetailsSignUpPage;
