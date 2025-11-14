import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const ErrorAlert = ({ message }) => {
  if (!message) return null;

  return (
    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
      <AlertCircle size={18} />
      {message}
    </div>
  );
};

export const ProcessingAlert = () => {
  return (
    <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
      <RefreshCw size={18} className="animate-spin" />
      Analyzing receipt...
    </div>
  );
};
