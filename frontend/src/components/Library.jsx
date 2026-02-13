import React from 'react';

// 1. Button - Reusable styled button with variants
export const Button = ({ label, variant = 'primary', ...props }) => {
  const styles = variant === 'primary' 
    ? "bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors" 
    : "border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors";
  return <button className={styles} {...props}>{label || 'Button'}</button>;
};

// 2. Card - Structured container
export const Card = ({ title, description, children }) => (
  <div className="border border-gray-200 rounded-xl p-5 shadow-sm bg-white mb-4">
    {title && <h3 className="text-lg font-bold text-gray-800 mb-1">{title}</h3>}
    {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}
    <div className="space-y-4">{children}</div>
  </div>
);

// 3. Input - Standardized form field
export const Input = ({ label, placeholder, type = 'text', ...props }) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <label className="text-xs font-bold text-gray-500 uppercase tracking-tight">{label}</label>}
    <input 
      {...props}
      type={type} 
      placeholder={placeholder} 
      className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
    />
  </div>
);

// 4. Navbar - Top navigation with dynamic links and robust label handling
export const Navbar = ({ logoText = "RYZE", links = [] }) => (
  <nav className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-white shadow-sm mb-6">
    <div className="font-black text-xl tracking-tighter text-blue-600">{logoText}</div>
    <div className="flex gap-6">
      {links.map((link, i) => {
        // Extract string label from potential AI objects
        const label = typeof link === 'object' && link !== null 
          ? (link.label || link.text || link.url || "Link") 
          : link;
        return (
          <span key={i} className="text-xs font-bold text-gray-400 cursor-pointer hover:text-black transition-colors uppercase">
            {label}
          </span>
        );
      })}
    </div>
  </nav>
);

// 5. Table - Data Presentation
export const Table = ({ headers = [], rows = [] }) => (
  <div className="overflow-hidden border border-gray-100 rounded-xl shadow-sm">
    <table className="w-full text-sm text-left">
      <thead className="bg-gray-50 border-b border-gray-100">
        <tr>
          {headers.map((h, i) => <th key={i} className="px-4 py-3 font-bold text-gray-600 uppercase text-[10px] tracking-widest">{h}</th>)}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {rows.map((row, i) => (
          <tr key={i} className="bg-white hover:bg-blue-50/30 transition-colors">
            {row.map((cell, j) => <td key={j} className="px-4 py-3 text-gray-600">{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// 6. Sidebar - Layout wrapper
export const Sidebar = ({ items = [], children }) => (
  <div className="flex w-full border border-gray-200 rounded-2xl overflow-hidden h-[450px] bg-white shadow-inner">
    <div className="w-48 bg-gray-50 border-r border-gray-100 p-4 space-y-1 flex-shrink-0">
      <div className="text-[10px] font-black text-gray-400 uppercase mb-4 px-2">Menu</div>
      {items.map((item, i) => {
        // Extract string label from potential AI objects
        const label = typeof item === 'object' && item !== null 
          ? (item.label || item.text || "Item") 
          : item;
        return (
          <div key={i} className="text-xs font-bold text-gray-600 p-2.5 hover:bg-white hover:text-blue-600 hover:shadow-sm rounded-lg transition-all cursor-pointer">
            {label}
          </div>
        );
      })}
    </div>
    <div className="flex-1 p-6 bg-white overflow-y-auto">
      {children}
    </div>
  </div>
);

// 7. Chart - Mocked Visual Data
export const Chart = ({ title, type = "Performance" }) => (
  <div className="border border-gray-100 rounded-xl p-5 bg-white shadow-sm">
    <div className="flex justify-between items-center mb-6">
      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">{title}</h4>
      <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">{type}</span>
    </div>
    <div className="h-32 w-full flex items-end justify-around gap-2 px-2">
      {[50, 80, 40, 95, 60, 85, 30].map((h, i) => (
        <div 
          key={i} 
          style={{ height: `${h}%` }} 
          className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md opacity-90 hover:opacity-100 transition-opacity" 
        />
      ))}
    </div>
  </div>
);

// 8. Modal - Defensive rendering for children
export const Modal = ({ title, children, isOpen = true }) => {
  if (!isOpen) return null;
  return (
    <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl max-w-sm w-full p-8 shadow-2xl border border-white/20 animate-in zoom-in-95 duration-200">
        <h3 className="text-xl font-black text-gray-800 mb-2 tracking-tight">{title}</h3>
        <div className="text-sm text-gray-500 leading-relaxed mb-6">
          {/* If children is an object with a text property, render text to avoid Error #31 */}
          {typeof children === 'object' && children !== null ? (children.text || JSON.stringify(children)) : children}
        </div>
        <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
          Confirm & Close
        </button>
      </div>
    </div>
  );
};