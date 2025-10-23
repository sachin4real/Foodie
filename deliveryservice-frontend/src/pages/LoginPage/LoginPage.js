import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginRider, setAuthToken } from '../../services/api';
import InputField from '../../components/InputField/InputField';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await loginRider(formData);
      localStorage.setItem('riderToken', data.token);
      setAuthToken(data.token);
      navigate('/rider/dashboard');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-end bg-cover bg-center px-10"
      style={{ backgroundImage:
        "url('https://img.freepik.com/free-photo/front-view-male-courier-yellow-uniform-holding-notepad-little-food-package-writing-notes-pink-desk_140725-40766.jpg?w=2000')" }}
    >
      <div className="bg-white/30 backdrop-blur-md border border-white/40 p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <h2 className="text-4xl font-extrabold text-center text-white mb-8 drop-shadow-lg">Rider Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
          <InputField type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg">Login</button>
        </form>
        <p className="mt-6 text-center text-white text-sm">
          Don't have an account?{' '}
          <span onClick={() => navigate('/riders/register')} className="text-blue-300 cursor-pointer underline">
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
