import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginRider } from '../../services/api';
import InputField from '../../components/InputField/InputField'; 

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginRider(formData);
      localStorage.setItem('riderToken', response.data.token);
      navigate('/rider/dashboard');
    } catch (err) {
      console.error(err);
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-end bg-cover bg-center px-10"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/free-photo/front-view-male-courier-yellow-uniform-holding-notepad-little-food-package-writing-notes-pink-desk_140725-40766.jpg?t=st=1745916728~exp=1745920328~hmac=2b94b392565bed39c254e779aff9e7086b5883c7076ae271bbb335d81b519a32&w=2000')",
      }}
    >
      <div className="bg-white/30 backdrop-blur-md border border-white/40 p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <h2 className="text-4xl font-extrabold text-center text-white mb-8 drop-shadow-lg">
          Rider Login
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="bg-white/50 focus:ring-4 focus:ring-blue-300 rounded-md"
          />
          <InputField
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="bg-white/50 focus:ring-4 focus:ring-blue-300 rounded-md"
          />

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-transform transform hover:scale-105"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-white text-sm">
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/riders/register')}
            className="text-blue-300 cursor-pointer underline"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
