import React from 'react';

const RiderTimeline = ({ status }) => {
  // Steps of the delivery
  const steps = [
    { label: "Assigned", key: "ASSIGNED" },
    { label: "Picked Up", key: "PICKED_UP" },
    { label: "Delivered", key: "DELIVERED" },
  ];

  // Find current active step
  const currentStepIndex = steps.findIndex(step => step.key === status);

  return (
    <div className="flex items-center justify-between mt-6 mb-4 relative">
      {/* Background Line */}
      <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-300 rounded-full z-0"></div>
      
      {/* Progress Line */}
      <div
        className="absolute top-1/2 left-0 h-1 bg-green-500 rounded-full z-10 transition-all duration-500"
        style={{
          width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
        }}
      ></div>

      {steps.map((step, index) => {
        const isActive = index <= currentStepIndex;
        return (
          <div key={step.key} className="flex-1 flex flex-col items-center z-20 relative">
            {/* Circle */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                isActive ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'
              }`}
            >
              {index + 1}
            </div>

            {/* Label */}
            <div className="mt-2 text-xs text-gray-700 font-semibold">
              {step.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RiderTimeline;
