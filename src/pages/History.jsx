import React from 'react';
import TableBanner from '../components/Table/TableBanner';
import Table from '../components/Table/Table';
import { useState } from 'react';
import { useEffect } from 'react';
import EmptyState from '../components/EmptyState';
import EmptyHistoryIcon from '../assets/EmptyHistoryIcon';
import TableSkeleton from '../components/Table/TableSkeleton';
import { useAuth } from '../hooks/useAuth';
import axios from '../api/axios';

const History = () => {
    const header = ['post', 'social network', 'status', 'date'];
    const [historyType, setHistoryType] = useState('all');
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [rowsInfo, setRowsInfo] = useState([]);

    const { user } = useAuth();

    const getHistory = async (url) => {
        try {
            const response = await axios.get(url);
            const data = response.data;
            setRowsInfo(data.data || data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    useEffect(() => {
        setIsLoadingHistory(true);
        if (historyType === 'all') {
            getHistory(`/histories/user/${user.id}`);
        } else {
            getHistory(`/histories/user/${user.id}/queue`);
        }
    }, [historyType, user?.id]);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Historial de Publicaciones</h1>
                <p className="mt-2 text-gray-600">
                    Revisa todas tus publicaciones anteriores y su rendimiento.
                </p>
            </div>

            {/* Contenido principal */}
            <div className="relative overflow-hidden bg-white rounded-lg shadow-md border border-gray-200">
                {
                    isLoadingHistory ?
                        <TableSkeleton />
                        :
                        (rowsInfo.length === 0 && historyType === 'all') ?
                            <EmptyState 
                                title="Historial vacío"
                                description="No se encontraron publicaciones para mostrar"
                                btnTitle="Nueva publicación"
                                redirectTo="/"
                            >
                                <EmptyHistoryIcon width="3rem" height="3rem" styleClass="mx-auto text-gray-600 mb-4" />
                            </EmptyState>
                            :
                            <>
                                <TableBanner setHistoryType={setHistoryType} historyType={historyType} />
                                <Table header={header} rowsInfo={rowsInfo} />
                            </>
                }
            </div>
        </div>
    );
};

export default History;
