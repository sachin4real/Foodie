import React from 'react';

const Button = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
  >
    {label}
  </button>
);

export default Button;
