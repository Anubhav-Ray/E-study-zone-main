import React from 'react';

const variants = {
  default: 'bg-zinc-800 text-zinc-300 border-zinc-700',
  primary: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  secondary: 'bg-pink-500/15 text-pink-300 border-pink-500/30',
  success: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  destructive: 'bg-red-500/15 text-red-300 border-red-500/30',
  warning: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  info: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  outline: 'border-zinc-700 text-zinc-400 bg-transparent'
};

const sizes = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3.5 py-1.5 text-sm'
};

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon: Icon,
  ...props
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold uppercase tracking-wider rounded-full border transition-colors ${
        variants[variant] || variants.default
      } ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      {children}
    </span>
  );
};

export default Badge;
