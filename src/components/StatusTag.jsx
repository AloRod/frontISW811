import React from 'react';

const StatusTag = ({ status }) => {
  const statusConfig = {
    queue: {
      label: 'En Cola',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    },
    published: {
      label: 'Publicado',
      className: 'bg-green-100 text-green-800 border-green-200'
    },
    failed: {
      label: 'Fallido',
      className: 'bg-red-100 text-red-800 border-red-200'
    },
    scheduled: {
      label: 'Programado',
      className: 'bg-blue-100 text-blue-800 border-blue-200'
    }
  };

  const config = statusConfig[status] || statusConfig.queue;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}>
      {config.label}
    </span>
  );
};

export default StatusTag;