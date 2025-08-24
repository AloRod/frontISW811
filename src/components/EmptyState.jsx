import React from 'react';
import { Link } from 'react-router-dom';

const EmptyState = ({ title, description, btnTitle, redirectTo, children }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center">
                {children}
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {title}
                </h3>
                <p className="text-gray-600 mb-6">
                    {description}
                </p>
                {btnTitle && redirectTo && (
                    <Link
                        to={redirectTo}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                        {btnTitle}
                    </Link>
                )}
            </div>
        </div>
    );
};

export default EmptyState;
