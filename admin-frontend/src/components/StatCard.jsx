import React from 'react';

const StatCard = ({ title, count, color }) => {
  let bgColor = '';

  // Setting background color based on the card
  if (color === 'green') {
    bgColor = 'bg-green-500';
  } else if (color === 'blue') {
    bgColor = 'bg-blue-500';
  } else if (color === 'red') {
    bgColor = 'bg-red-500';
  }

  return (
    <div className={`${bgColor} p-6 rounded-xl shadow-md`}>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="text-3xl font-bold text-white">{count}</p>
    </div>
  );
};

export default StatCard;
