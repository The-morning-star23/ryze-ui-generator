// frontend/src/components/Library.jsx
import React from 'react';

export const Button = ({ label, variant = 'primary', ...props }) => {
  const styles = variant === 'primary' 
    ? "bg-blue-600 text-white px-4 py-2 rounded" 
    : "border border-gray-300 px-4 py-2 rounded";
  return <button className={styles} {...props}>{label || 'Button'}</button>;
};

export const Card = ({ title, description, children }) => (
  <div className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white">
    {title && <h3 className="text-lg font-bold mb-2">{title}</h3>}
    {description && <p className="text-gray-600 mb-4">{description}</p>}
    <div className="space-y-4">{children}</div>
  </div>
);

export const Input = ({ label, placeholder, type = 'text' }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-sm font-medium">{label}</label>}
    <input type={type} placeholder={placeholder} className="border rounded px-3 py-2" />
  </div>
);

// Map string names to actual components
export const ComponentMap = {
  Button,
  Card,
  Input,
  // We will add Table, Navbar, etc. as we go
};