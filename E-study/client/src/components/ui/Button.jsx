import React from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
  default: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 active:scale-[0.98]',
  primary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 active:scale-[0.98]',
  secondary: 'bg-pink-600 hover:bg-pink-500 text-white shadow-lg shadow-pink-600/25 active:scale-[0.98]',
  success: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 active:scale-[0.98]',
  destructive: 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/25 active:scale-[0.98]',
  outline: 'border border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-200 hover:text-white hover:border-zinc-500 active:scale-[0.98]',
  ghost: 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 active:scale-[0.98]',
  link: 'text-indigo-400 hover:text-indigo-300 underline-offset-4 hover:underline p-0 h-auto font-medium',
  accent: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700/80 active:scale-[0.98]'
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3.5 text-base rounded-xl gap-2.5 font-semibold',
  icon: 'p-2.5 rounded-xl aspect-square'
};

export const Button = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  icon: Icon,
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 select-none ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
