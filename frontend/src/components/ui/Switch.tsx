import React from 'react';

type SwitchProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export const Switch: React.FC<SwitchProps> = ({ label, className = '', ...props }) => (
  <label className="inline-flex items-center gap-2">
    {label && <span className="text-sm text-gray-700 dark:text-gray-200">{label}</span>}
    <span className="relative inline-flex h-6 w-10 items-center">
      <input
        type="checkbox"
        className={`peer sr-only ${className}`}
        {...props}
      />
      <div className="h-6 w-10 rounded-full bg-gray-300 transition peer-checked:bg-emerald-500"></div>
      <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-4"></div>
    </span>
  </label>
);

export default Switch;
