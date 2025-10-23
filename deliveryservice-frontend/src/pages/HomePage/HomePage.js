import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const nav = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('riderToken');
    nav(token ? '/rider/dashboard' : '/riders/login', { replace: true });
  }, [nav]);
  return null;
};

export default HomePage;
