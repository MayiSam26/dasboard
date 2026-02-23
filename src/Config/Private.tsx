import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CheckAuthentication: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [navigate, token]);

  return null;
};

export default CheckAuthentication;
