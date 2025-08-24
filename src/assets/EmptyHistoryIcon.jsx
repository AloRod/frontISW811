import React from 'react';
import { History } from 'lucide-react';

const EmptyHistoryIcon = ({ width = "3rem", height = "3rem", styleClass = "text-gray-600" }) => {
    return (
        <History 
            width={width} 
            height={height} 
            className={styleClass}
        />
    );
};

export default EmptyHistoryIcon;
