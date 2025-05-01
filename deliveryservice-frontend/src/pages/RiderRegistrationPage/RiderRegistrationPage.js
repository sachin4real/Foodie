import React, { useState } from 'react';
import InputField from '../../components/InputField/InputField'; 
import Button from '../../components/Button/Button'; 
import { useNavigate } from 'react-router-dom'; 
import { registerRider } from '../../services/api'; 

const RiderRegistrationPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    vehicle: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await registerRider(formData);
      setSuccessMessage(response.data);
      setError('');
      navigate('/riders/login');
    } catch (err) {
      setError('Error during registration');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-end bg-cover bg-center px-8" style={{ backgroundImage: "url('https://img.freepik.com/free-photo/front-view-male-courier-yellow-uniform-holding-notepad-little-food-package-writing-notes-pink-background_140725-40765.jpg?t=st=1745916302~exp=1745919902~hmac=22ea971cbf16096fd396b6567ef264b522ba16b90a6302ad9f43407f0b371d97&w=2000')" }}>
      <div className="bg-white/30 backdrop-blur-md border border-white/40 p-10 rounded-3xl shadow-2xl w-full max-w-md animate-fade-in-up">
        <h2 className="text-4xl font-extrabold text-center text-white mb-8 drop-shadow-lg">Become a Rider</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="bg-white/50 focus:ring-4 focus:ring-green-300 rounded-md"
          />
          <InputField
            type="text"
            name="contact"
            placeholder="Contact Number"
            value={formData.contact}
            onChange={handleChange}
            required
            className="bg-white/50 focus:ring-4 focus:ring-green-300 rounded-md"
          />
          <InputField
            type="text"
            name="vehicle"
            placeholder="Vehicle Details (Bike/Car)"
            value={formData.vehicle}
            onChange={handleChange}
            required
            className="bg-white/50 focus:ring-4 focus:ring-green-300 rounded-md"
          />
          <InputField
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="bg-white/50 focus:ring-4 focus:ring-green-300 rounded-md"
          />
          <InputField
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="bg-white/50 focus:ring-4 focus:ring-green-300 rounded-md"
          />
          <InputField
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="bg-white/50 focus:ring-4 focus:ring-green-300 rounded-md"
          />

          <Button
            label="Register Now"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-transform hover:scale-105"
          />
        </form>

        <p className="mt-6 text-center text-white text-sm">
          Already have an account?{' '}
          <span onClick={() => navigate('/riders/login')} className="text-green-300 font-semibold cursor-pointer underline">
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default RiderRegistrationPage;
