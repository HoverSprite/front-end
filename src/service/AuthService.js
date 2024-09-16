import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { noTokenApi } from '../utils/axiosConfig';

let accessToken = null;

const setAccessToken = (token) => {
  accessToken = token;
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

const getAccessToken = () => accessToken;

const signin = async (username, password) => {
  try {
    const response = await noTokenApi.post('/auth/signin', { username, password });
    const accessToken = response.data.jwt;
    setAccessToken(accessToken);
    
    const decodedToken = jwtDecode(accessToken);
    const userRole = decodedToken.role;
    
    return {
      ...decodedToken,
      role: userRole
    };
  } catch (error) {
    console.error('Signin error:', error);
    throw error;
  }
};

const signout = async () => {
  try {
    await axios.post('/auth/signout');
  } catch (error) {
    console.error('Signout error:', error);
  } finally {
    setAccessToken(null);
  }
};

const refreshToken = async () => {
  try {
    // The refresh token cookie will be sent automatically
    const response = await noTokenApi.post('/auth/refresh');
    
    console.log('Token refresh successful');
    
    // Check if the response contains a new access token
    if (response.data && response.data.jwt) {
      setAccessToken(response.data.jwt);
      return jwtDecode(response.data.jwt);
    } else {
      throw new Error('No new access token received');
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    setAccessToken(null);
    throw error;
  }
};

const getUserInfo = () => {
  if (!accessToken) return null;
  return jwtDecode(accessToken);
};

const signup = async (userData) => {
  try {
    const response = await noTokenApi.post('/auth/signup', userData);
    return response.data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

const oauth_signup = async (userData) => {
  console.log("here")
  try {
    const response = await noTokenApi.post('/auth/oauth2-signup', userData);
    return response.data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

export const authService = {
  signin,
  signup,
  oauth_signup,
  signout,
  refreshToken,
  getUserInfo,
  getAccessToken,
};

export default authService;