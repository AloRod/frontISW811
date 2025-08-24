import React from 'react';
import { Filter } from 'lucide-react';

const TableBanner = ({ setHistoryType, historyType }) => {
    return (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Filter className="w-5 h-5 text-gray-500" />
                    <h2 className="text-lg font-semibold text-gray-900">Filtrar historial</h2>
                </div>
                
                <div className="flex space-x-2">
                    <button
                        onClick={() => setHistoryType('all')}
                        className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors duration-200 ${
                            historyType === 'all'
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    >
                        Todo el historial
                    </button>
                    <button
                        onClick={() => setHistoryType('queue')}
                        className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors duration-200 ${
                            historyType === 'queue'
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    >
                        En cola
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TableBanner;
