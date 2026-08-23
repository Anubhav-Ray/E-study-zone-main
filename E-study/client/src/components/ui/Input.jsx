import React from 'react';

export const Input = ({
  label,
  error,
  helperText,
  icon: Icon,
  rightElement,
  className = '',
  id,
  required,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
            {label}
            {required && <span className="text-pink-500 ml-1">*</span>}
          </label>
        </div>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-zinc-500">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          required={required}
          className={`w-full bg-zinc-950/70 border border-zinc-800 rounded-xl py-2.5 px-3.5 text-sm text-zinc-100 placeholder-zinc-500 transition-all duration-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed ${
            Icon ? 'pl-10' : ''
          } ${rightElement ? 'pr-11' : ''} ${
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
          } ${className}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
      {helperText && !error && <p className="text-xs text-zinc-500">{helperText}</p>}
    </div>
  );
};

export default Input;
