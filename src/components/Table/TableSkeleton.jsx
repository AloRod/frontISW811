import React from 'react';

const TableSkeleton = () => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Header skeleton */}
            <div className="mb-6">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </div>

            {/* Table skeleton */}
            <div className="overflow-hidden">
                {/* Table header skeleton */}
                <div className="bg-gray-50 border-b border-gray-200">
                    <div className="grid grid-cols-4 gap-4 px-6 py-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        ))}
                    </div>
                </div>

                {/* Table rows skeleton */}
                {[1, 2, 3, 4, 5].map((row) => (
                    <div key={row} className="border-b border-gray-100 last:border-b-0">
                        <div className="grid grid-cols-4 gap-4 px-6 py-4">
                            {[1, 2, 3, 4].map((cell) => (
                                <div key={cell} className="h-4 bg-gray-100 rounded animate-pulse"></div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TableSkeleton;
