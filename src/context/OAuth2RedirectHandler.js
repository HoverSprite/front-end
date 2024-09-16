import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const { loginWithOAuth } = useAuth();

  useEffect(() => {
    const handleOAuthLogin = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) {
          await loginWithOAuth(token);
          navigate('/');
        } else {
          navigate('/signin');
        }
      } catch (error) {
        console.error('OAuth login failed:', error);
        navigate('/signin');
      }
    };

    handleOAuthLogin();
  }, [navigate, loginWithOAuth]);

  return <div>Processing login...</div>;
};

export default OAuth2RedirectHandler;