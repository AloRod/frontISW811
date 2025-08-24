import React from 'react';

const Spinner = ({ text = "Cargando...", size = "md" }) => {
    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-8 w-8", 
        lg: "h-12 w-12"
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                <div className="text-center">
                    <div className={`animate-spin rounded-full ${sizeClasses[size]} border-b-2 border-blue-600 mx-auto mb-4`}></div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {text}
                    </h2>
                    <p className="text-gray-600">
                        Procesando, por favor espera...
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Spinner;
