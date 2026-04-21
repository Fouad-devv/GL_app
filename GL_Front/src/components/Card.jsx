import React from 'react';

export const Card = ({ title, subtitle, children, className = '', footer = null }) => (
  <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-6 ${className}`}>
    {title && (
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">{title}</h3>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
    )}
    <div>{children}</div>
    {footer && (
      <div className="border-t border-gray-100 pt-4 mt-4">{footer}</div>
    )}
  </div>
);

export const StatsCard = ({ title, value, icon: Icon, color = 'blue' }) => {
  const themes = {
    blue:   { ring: 'ring-blue-100',   icon: 'bg-blue-500',   val: 'text-blue-600'   },
    green:  { ring: 'ring-green-100',  icon: 'bg-green-500',  val: 'text-green-600'  },
    red:    { ring: 'ring-red-100',    icon: 'bg-red-500',    val: 'text-red-600'    },
    yellow: { ring: 'ring-amber-100',  icon: 'bg-amber-500',  val: 'text-amber-600'  },
    purple: { ring: 'ring-violet-100', icon: 'bg-violet-500', val: 'text-violet-600' },
  };
  const t = themes[color] || themes.blue;

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm ring-1 ${t.ring} p-5 hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider truncate">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${t.val}`}>{value}</p>
        </div>
        {Icon && (
          <div className={`${t.icon} p-2.5 rounded-xl flex-shrink-0 ml-3`}>
            <Icon className="text-white text-xl" />
          </div>
        )}
      </div>
    </div>
  );
};
