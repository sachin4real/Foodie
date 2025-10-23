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
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    // simple, direct state update for snappy typing
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        contact: formData.contact.trim(),
        vehicle: formData.vehicle.trim(),
        email: formData.email.trim(),
        password: formData.password,
      };

      await registerRider(payload);
      navigate('/riders/login', { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        'Error during registration';
      setError(msg);
      // eslint-disable-next-line no-console
      console.error('Register failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-end bg-cover bg-center px-8"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/free-photo/front-view-male-courier-yellow-uniform-holding-notepad-little-food-package-writing-notes-pink-background_140725-40765.jpg?w=2000')",
      }}
    >
      <div className="bg-white/30 backdrop-blur-md border border-white/40 p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <h2 className="text-4xl font-extrabold text-center text-white mb-8 drop-shadow-lg">
          Become a Rider
        </h2>

        {error && (
          <p className="text-red-600 text-center mb-4 font-medium">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField name="name"     placeholder="Full Name"                value={formData.name}            onChange={handleChange} required />
          <InputField name="contact"  placeholder="Contact Number"           value={formData.contact}         onChange={handleChange} required />
          <InputField name="vehicle"  placeholder="Vehicle Details (Bike/Car)" value={formData.vehicle}       onChange={handleChange} required />
          <InputField type="email"    name="email"    placeholder="Email Address" value={formData.email}      onChange={handleChange} required autoComplete="email" />
          <InputField type="password" name="password" placeholder="Password"     value={formData.password}    onChange={handleChange} required autoComplete="new-password" />
          <InputField type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required autoComplete="new-password" />

          <Button
            type="submit"
            label={submitting ? 'Registering…' : 'Register Now'}
            disabled={submitting}
            className="w-full"
          />
        </form>

        <p className="mt-6 text-center text-white text-sm">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/riders/login')}
            className="text-green-300 font-semibold cursor-pointer underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default RiderRegistrationPage;
