import React from 'react';

const Alert = ({ type, message }) => {

  const getColorClass = (type) => {
    const colorMap = {
      Info: 'text-blue-800 border-blue-300 bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:bg-blue-800/20',
      Danger: 'text-red-800 border-red-300 bg-red-50 dark:text-red-400 dark:border-red-800 dark:bg-red-800/20',
      Success: 'text-green-800 border-green-300 bg-green-50 dark:text-green-400 dark:border-green-800 dark:bg-green-800/20',
      Warning: 'text-yellow-800 border-yellow-300 bg-yellow-50 dark:text-yellow-400 dark:border-yellow-800 dark:bg-yellow-800/20',
      Dark: 'text-gray-800 border-gray-300 bg-gray-50 dark:text-gray-400 dark:border-gray-800 dark:bg-gray-800/20',
    };
    return colorMap[type] || 'text-gray-800 border-gray-300 bg-gray-50 dark:text-gray-400 dark:border-gray-800 dark:bg-gray-800/20800';
  };

  const colorClass = getColorClass(type);

  return (
    <div className={`flex items-center p-4 mb-4 mt-4 text-sm ${colorClass} border rounded-lg`} role="alert">
      <svg className="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
      </svg>
      <span className="sr-only">Info</span>
      <div>
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};

export default Alert;