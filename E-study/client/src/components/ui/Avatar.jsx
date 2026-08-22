import React from 'react';

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base font-bold',
  xl: 'w-20 h-20 text-xl font-extrabold'
};

export const Avatar = ({
  name = '',
  src,
  size = 'md',
  status, // 'online' | 'offline' | 'busy'
  className = ''
}) => {
  const getInitials = (str) => {
    if (!str) return 'U';
    const parts = str.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return str.slice(0, 2).toUpperCase();
  };

  return (
    <div className="relative inline-block shrink-0">
      <div
        className={`rounded-full flex items-center justify-center font-semibold overflow-hidden border border-zinc-700 bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-md ${
          sizes[size] || sizes.md
        } ${className}`}
      >
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>
      {status && (
        <span
          className={`absolute bottom-0 right-0 rounded-full border-2 border-zinc-900 ${
            size === 'sm' ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'
          } ${
            status === 'online'
              ? 'bg-emerald-500'
              : status === 'busy'
              ? 'bg-amber-500'
              : 'bg-zinc-500'
          }`}
        />
      )}
    </div>
  );
};

export default Avatar;
