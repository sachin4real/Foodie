import React from 'react';

const Button = ({ label, className = '', ...props }) => (
  <button
    {...props}
    className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
  >
    {label}
  </button>
);

export default Button;
