import React from 'react';
import { Linkedin, MessageSquare, Globe } from 'lucide-react';

const Table = ({ header, rowsInfo }) => {
    const getSocialNetworkIcon = (network) => {
        const networkMap = {
            'linkedin': { icon: Linkedin, color: 'text-blue-600', bgColor: 'bg-blue-100' },
            'reddit': { icon: MessageSquare, color: 'text-orange-600', bgColor: 'bg-orange-100' },
            'mastodon': { icon: Globe, color: 'text-purple-600', bgColor: 'bg-purple-100' }
        };
        
        return networkMap[network.toLowerCase()] || { icon: Globe, color: 'text-gray-600', bgColor: 'bg-gray-100' };
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'posted': { text: 'Publicado', color: 'bg-green-100 text-green-800' },
            'pending': { text: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
            'failed': { text: 'Fallido', color: 'bg-red-100 text-red-800' },
            'scheduled': { text: 'Programado', color: 'bg-blue-100 text-blue-800' }
        };
        
        const statusInfo = statusMap[status.toLowerCase()] || { text: status, color: 'bg-gray-100 text-gray-800' };
        
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                {statusInfo.text}
            </span>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return dateString;
        }
    };

    const truncateText = (text, maxLength = 50) => {
        if (!text) return '-';
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {header.map((title, index) => (
                            <th
                                key={index}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {title}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {rowsInfo && rowsInfo.length > 0 ? (
                        rowsInfo.map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-gray-50 transition-colors duration-200">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900 max-w-xs">
                                        {truncateText(row.post_text || row.content)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center space-x-2">
                                        {row.social_network && row.social_network.split(',').map((network, index) => {
                                            const networkInfo = getSocialNetworkIcon(network.trim());
                                            const IconComponent = networkInfo.icon;
                                            return (
                                                <div
                                                    key={index}
                                                    className={`w-8 h-8 rounded-full ${networkInfo.bgColor} flex items-center justify-center`}
                                                    title={network.trim()}
                                                >
                                                    <IconComponent className={`w-4 h-4 ${networkInfo.color}`} />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getStatusBadge(row.status)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(row.created_at || row.date)}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={header.length} className="px-6 py-8 text-center text-gray-500">
                                No hay datos para mostrar
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
