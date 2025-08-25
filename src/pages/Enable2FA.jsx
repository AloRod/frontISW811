import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import { Shield, QrCode, Smartphone, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import QRCode from 'react-qr-code';

const Enable2FA = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isShow, setIsShow] = useState(false);
    const [isEnable, setIsEnable] = useState(false);
    const [qrCodeURL, setQrCodeURL] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [showQR, setShowQR] = useState(false);
    const [showDisableConfirm, setShowDisableConfirm] = useState(false);
    const [disableCode, setDisableCode] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        const getQrCode = async () => {
            if (!user?.id) {
                setError('Usuario no encontrado');
                return;
            }

            try {
                const response = await axios.get(`/users/${user.id}/qr-2fa`);
                
                if (response.status === 200) {
                    const userData = response.data.data;
                    setQrCodeURL(userData.two_factor_url);
                    setIsEnable(userData.two_factor_enabled === '1' || userData.two_factor_enabled === true);
                    setIsShow(true);
                }
            } catch (error) {
                console.error('Error al obtener código QR:', error);
                if (error.response?.data?.error) {
                    setError(error.response.data.error);
                } else {
                    setError('No se pudieron cargar las configuraciones de 2FA');
                }
            }
        };

        getQrCode();
    }, [user]);

    const enableTFA = async (enable) => {
        if (!user?.id) {
            setError('Usuario no encontrado');
            return;
        }

        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await axios.put(`/users/${user.id}/enable-2fa`, {
                two_factor_enabled: enable,
                verify_code: enable ? verificationCode : disableCode
            });

            if (response.status === 200) {
                setIsEnable(enable);
                setMessage(enable ? '¡Autenticación de dos factores habilitada exitosamente!' : '¡Autenticación de dos factores deshabilitada exitosamente!');
                setVerificationCode('');
                setDisableCode('');
                setShowQR(false);
                setShowDisableConfirm(false);
                
                // Limpiar mensaje después de 3 segundos
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error al habilitar/deshabilitar 2FA:', error);
            if (error.response?.data?.error) {
                setError(error.response.data.error);
            } else {
                setError(enable ? 'No se pudo habilitar 2FA' : 'No se pudo deshabilitar 2FA');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleEnable2FA = async (e) => {
        e.preventDefault();
        if (!verificationCode || verificationCode.length !== 6) {
            setError('Por favor ingresa un código válido de 6 dígitos');
            return;
        }
        await enableTFA(true);
    };

    const handleDisable2FA = async (e) => {
        e.preventDefault();
        if (!disableCode || disableCode.length !== 6) {
            setError('Por favor ingresa un código válido de 6 dígitos');
            return;
        }
        await enableTFA(false);
    };

    const generateNewQR = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await axios.post(`/users/${user.id}/generate-qr`);
            if (response.status === 200) {
                setQrCodeURL(response.data.data.two_factor_url);
                setMessage('¡Nuevo código QR generado exitosamente!');
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error al generar nuevo QR:', error);
            setError('No se pudo generar el nuevo código QR');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isShow) {
        return (
            <div className="flex items-center justify-center p-4 bg-gray-50">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Cargando configuraciones de 2FA...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center p-4 bg-gray-50">
            <div className="w-full max-w-2xl flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 w-full">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                            <Shield className="w-8 h-8 text-blue-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Autenticación de Dos Factores</h1>
                        <p className="text-gray-600">Protege tu cuenta con una capa adicional de seguridad</p>
                    </div>

                    {/* Status Display */}
                    <div className="mb-8">
                        <div className={`flex items-center justify-center p-4 rounded-lg ${
                            isEnable 
                                ? 'bg-green-50 border border-green-200' 
                                : 'bg-yellow-50 border border-yellow-200'
                        }`}>
                            {isEnable ? (
                                <>
                                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                                    <span className="text-green-700 font-medium">La autenticación de dos factores está habilitada</span>
                                </>
                            ) : (
                                <>
                                    <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                                    <span className="text-yellow-700 font-medium">La autenticación de dos factores está deshabilitada</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Error and Success Messages */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                            <p className="text-red-600 text-sm text-center">{error}</p>
                        </div>
                    )}

                    {message && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                            <p className="text-green-600 text-sm text-center">{message}</p>
                        </div>
                    )}

                    {/* 2FA Configuration */}
                    <div className="space-y-6">
                        {!isEnable ? (
                            // Enable 2FA Section
                            <div className="space-y-6">
                                <div className="text-center">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Habilitar Autenticación de Dos Factores</h3>
                                    <p className="text-gray-600 text-sm mb-4">
                                        Escanea el código QR con tu aplicación autenticadora para comenzar
                                    </p>
                                </div>

                                {!showQR ? (
                                    <div className="text-center">
                                        <button
                                            onClick={() => setShowQR(true)}
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                                        >
                                            <QrCode className="w-4 h-4 mr-2" />
                                            Mostrar Código QR
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {/* QR Code */}
                                        <div className="flex justify-center">
                                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                                                {qrCodeURL && <QRCode value={qrCodeURL} size={200} />}
                                            </div>
                                        </div>

                                        <div className="text-center space-y-4">
                                            <div>
                                                <h4 className="text-gray-900 font-medium mb-2">Pasos para habilitar 2FA:</h4>
                                                <ol className="text-gray-600 text-sm space-y-1 text-left max-w-md mx-auto">
                                                    <li>1. Descarga una aplicación autenticadora (Google Authenticator, Authy, etc.)</li>
                                                    <li>2. Escanea el código QR de arriba con tu aplicación</li>
                                                    <li>3. Ingresa el código de 6 dígitos de tu aplicación abajo</li>
                                                    <li>4. Haz clic en "Habilitar 2FA" para activar</li>
                                                </ol>
                                            </div>

                                            {/* Verification Code Input */}
                                            <form onSubmit={handleEnable2FA} className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Código de Verificación
                                                    </label>
                                                    <input
                                                        ref={inputRef}
                                                        type="text"
                                                        maxLength="6"
                                                        value={verificationCode}
                                                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                                                        placeholder="Ingresa código de 6 dígitos"
                                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-center text-lg font-mono"
                                                        inputMode="numeric"
                                                        pattern="[0-9]*"
                                                    />
                                                </div>

                                                <div className="flex space-x-3">
                                                    <button
                                                        type="submit"
                                                        disabled={isLoading || verificationCode.length !== 6}
                                                        className={`flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200 ${
                                                            isLoading || verificationCode.length !== 6
                                                                ? 'opacity-50 cursor-not-allowed'
                                                                : ''
                                                        }`}
                                                    >
                                                        {isLoading ? 'Habilitando...' : 'Habilitar 2FA'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowQR(false)}
                                                        className="px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-200"
                                                    >
                                                        Cancelar
                                                    </button>
                                                </div>
                                            </form>

                                            <button
                                                onClick={generateNewQR}
                                                disabled={isLoading}
                                                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200 disabled:opacity-50"
                                            >
                                                Generar nuevo código QR
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Disable 2FA Section
                            <div className="space-y-6">
                                <div className="text-center">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Deshabilitar Autenticación de Dos Factores</h3>
                                    <p className="text-gray-600 text-sm mb-4">
                                        Ingresa tu código de verificación para deshabilitar 2FA
                                    </p>
                                </div>

                                {!showDisableConfirm ? (
                                    <div className="text-center">
                                        <button
                                            onClick={() => setShowDisableConfirm(true)}
                                            className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
                                        >
                                            <XCircle className="w-4 h-4 mr-2" />
                                            Deshabilitar 2FA
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleDisable2FA} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Código de Verificación
                                            </label>
                                            <input
                                                type="text"
                                                maxLength="6"
                                                value={disableCode}
                                                onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, ''))}
                                                placeholder="Ingresa código de 6 dígitos"
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-center text-lg font-mono"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                            />
                                        </div>

                                        <div className="flex space-x-3">
                                            <button
                                                type="submit"
                                                disabled={isLoading || disableCode.length !== 6}
                                                className={`flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 ${
                                                    isLoading || disableCode.length !== 6
                                                        ? 'opacity-50 cursor-not-allowed'
                                                        : ''
                                                }`}
                                            >
                                                {isLoading ? 'Deshabilitando...' : 'Deshabilitar 2FA'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowDisableConfirm(false)}
                                                className="px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-200"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Enable2FA;
