import React from 'react';

export const Card = ({ children, className = '', hover = true, glow = false, ...props }) => {
  return (
    <div
      className={`rounded-2xl border border-zinc-800/80 bg-zinc-900/70 backdrop-blur-xl shadow-xl transition-all duration-300 ${
        hover ? 'hover:border-zinc-700/80 hover:shadow-2xl hover:shadow-indigo-950/20' : ''
      } ${glow ? 'border-indigo-500/30 shadow-indigo-900/10' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div className={`p-6 pb-3 flex flex-col space-y-1.5 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className = '', as = 'h3', ...props }) => {
  const Tag = as;
  return (
    <Tag className={`text-xl font-bold tracking-tight text-zinc-100 ${className}`} {...props}>
      {children}
    </Tag>
  );
};

export const CardDescription = ({ children, className = '', ...props }) => {
  return (
    <p className={`text-sm text-zinc-400 leading-relaxed ${className}`} {...props}>
      {children}
    </p>
  );
};

export const CardContent = ({ children, className = '', ...props }) => {
  return (
    <div className={`p-6 pt-3 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className = '', ...props }) => {
  return (
    <div className={`p-6 pt-0 border-t border-zinc-800/60 mt-4 flex items-center justify-between ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
