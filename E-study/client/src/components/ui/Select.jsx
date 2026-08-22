import React from 'react';
import { ChevronDown } from 'lucide-react';

export const Select = ({
  label,
  error,
  helperText,
  options = [],
  className = '',
  id,
  required,
  placeholder = 'Select an option...',
  children,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
          {label}
          {required && <span className="text-pink-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        <select
          id={selectId}
          required={required}
          className={`w-full appearance-none bg-zinc-950/70 border border-zinc-800 rounded-xl py-2.5 pl-3.5 pr-10 text-sm text-zinc-100 placeholder-zinc-500 transition-all duration-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed ${
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
          } ${className}`}
          {...props}
        >
          {placeholder && <option value="" className="bg-zinc-900 text-zinc-400">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-zinc-900 text-zinc-100">
              {opt.label}
            </option>
          ))}
          {children}
        </select>
        <div className="absolute right-3 pointer-events-none text-zinc-500">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
      {helperText && !error && <p className="text-xs text-zinc-500">{helperText}</p>}
    </div>
  );
};

export default Select;
