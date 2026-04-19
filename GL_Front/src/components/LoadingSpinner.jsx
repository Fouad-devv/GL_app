import React from 'react';
import { FiLoader } from 'react-icons/fi';

export const LoadingSpinner = ({ message = 'Chargement...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <FiLoader className="text-4xl text-blue-600 animate-spin" />
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
};

export const LoadingOverlay = ({ visible = false }) => {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <LoadingSpinner />
    </div>
  );
};
