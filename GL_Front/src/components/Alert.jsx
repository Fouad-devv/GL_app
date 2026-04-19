import React from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi';

export const Alert = ({ 
  type = 'info', 
  message, 
  onClose, 
  duration = 5000,
  closeable = true 
}) => {
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    if (duration && visible) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, visible, onClose]);

  if (!visible) return null;

  const alertConfig = {
    error: { bgColor: 'bg-red-50', borderColor: 'border-red-200', textColor: 'text-red-700', icon: FiAlertCircle },
    success: { bgColor: 'bg-green-50', borderColor: 'border-green-200', textColor: 'text-green-700', icon: FiCheckCircle },
    warning: { bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', textColor: 'text-yellow-700', icon: FiAlertCircle },
    info: { bgColor: 'bg-blue-50', borderColor: 'border-blue-200', textColor: 'text-blue-700', icon: FiInfo },
  };

  const config = alertConfig[type] || alertConfig.info;
  const Icon = config.icon;

  return (
    <div className={`${config.bgColor} border-l-4 ${config.borderColor} p-4 rounded flex items-start gap-3`}>
      <Icon className={`text-xl flex-shrink-0 ${config.textColor}`} />
      <p className={`flex-1 ${config.textColor}`}>{message}</p>
      {closeable && (
        <button
          onClick={() => {
            setVisible(false);
            onClose?.();
          }}
          className={`flex-shrink-0 ${config.textColor} hover:opacity-70`}
        >
          <FiX />
        </button>
      )}
    </div>
  );
};
