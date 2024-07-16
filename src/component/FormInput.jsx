// src/components/FormInput.jsx
import React from 'react';

const FormInput = ({ label, type, name, value, onChange }) => {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input
        type={type}
        className="form-control"
        name={name}
        value={value}
        onChange={onChange}
        required
      />
    </div>
  );
};

export default FormInput;
