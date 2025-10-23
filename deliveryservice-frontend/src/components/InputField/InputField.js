import React from 'react';

const InputField = React.forwardRef(function InputField(
  {
    type = 'text',
    name,
    placeholder,
    value,
    onChange,
    className = '',
    ...rest
  },
  ref
) {
  return (
    <input
      ref={ref}
      type={type}
      name={name}
      placeholder={placeholder}
      value={value ?? ''}       
      onChange={onChange}          
      className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      autoComplete="off"
      {...rest}
    />
  );
});

export default InputField;
