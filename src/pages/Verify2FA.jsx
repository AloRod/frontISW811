import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import { Shield, ArrowLeft } from 'lucide-react';
import OTPInput from '../components/OTPInput';

const Verify2FA = () => {
    const { login, auth } = useAuth();
    const navigate = useNavigate();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const isVerifyingRef = useRef(false);
    
    // Obtener el user_id de los parámetros de URL
    const user_id = new URLSearchParams(window.location.search).get('id');

    useEffect(() => {
        // Si no hay user_id, redirigir al login
        if (!user_id) {
            navigate('/');
            return;
        }
        
        // Si ya está autenticado, redirigir al dashboard
        if (auth) {
            navigate('/dashboard', { replace: true });
            return;
        }
    }, [user_id, navigate, auth]);

    const handleOTPChange = (newOtp) => {
        setOtp(newOtp);
    };

    const verifyCode = useCallback(async (code = null) => {
        // Prevenir múltiples llamadas simultáneas
        if (isVerifyingRef.current) {
            return;
        }

        const otpCode = code || otp.join('');
        if (otpCode.length !== 6) {
            setError('Por favor ingresa el código completo de 6 dígitos');
            return;
        }

        isVerifyingRef.current = true;
        setIsLoading(true);
        setError(null);
        setMessage(null);

        try {
            const response = await axios.post('/2fa/verify', {
                code: otpCode,
                user_id: user_id
            });

            if (response.status === 200) {
                const user = response.data.data;
                login(user.id, `${user.first_name} ${user.last_name}`);
                setMessage('¡Verificación exitosa! Redirigiendo...');
                
                // Navegar inmediatamente al dashboard
                navigate("/dashboard", { replace: true });
            }
        } catch (err) {
            console.error('Error de verificación 2FA:', err);
            
            if (err.response?.data) {
                const { data } = err.response;
                if (data.error) {
                    setError(data.error);
                } else if (data.message) {
                    setError(data.message);
                } else {
                    setError('Código de verificación inválido. Por favor intenta de nuevo.');
                }
            } else {
                setError('Error de red. Por favor verifica tu conexión.');
            }
        } finally {
            setIsLoading(false);
            isVerifyingRef.current = false;
        }
    }, [otp, user_id, login, navigate]);

    const handleOTPComplete = useCallback((code) => {
        // Auto-verificar cuando se complete el código
        verifyCode(code);
    }, [verifyCode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await verifyCode();
    };

    const resendCode = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            await axios.post('/2fa/resend', { user_id: user_id });
            setMessage('¡Nuevo código de verificación enviado!');
            setOtp(['', '', '', '', '', '']);
        } catch (err) {
            console.error('Error al reenviar código:', err);
            setError('No se pudo reenviar el código. Por favor intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-screen flex items-center justify-center p-4 bg-gray-50">
            <div className="w-full max-w-md flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 w-full">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                            <Shield className="w-8 h-8 text-blue-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Autenticación de Dos Factores</h1>
                        <p className="text-gray-600">Ingresa el código de 6 dígitos de tu aplicación autenticadora</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <p className="text-red-600 text-sm text-center">{error}</p>
                            </div>
                        )}

                        {message && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                <p className="text-green-600 text-sm text-center">{message}</p>
                            </div>
                        )}

                        {/* OTP Inputs */}
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Código de Verificación
                            </label>
                            <OTPInput
                                value={otp}
                                onChange={handleOTPChange}
                                onComplete={handleOTPComplete}
                                disabled={isLoading}
                            />
                            <p className="text-xs text-gray-500 text-center">
                                Ingresa el código de 6 dígitos de tu aplicación autenticadora
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || otp.join('').length !== 6}
                            className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 transform ${
                                isLoading || otp.join('').length !== 6
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:scale-[1.02] hover:shadow-lg'
                            }`}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Verificando...
                                </div>
                            ) : (
                                'Verificar Código'
                            )}
                        </button>

                        {/* Resend Code */}
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={resendCode}
                                disabled={isLoading}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200 disabled:opacity-50"
                            >
                                ¿No recibiste el código? Reenviar
                            </button>
                        </div>

                        {/* Back to Login */}
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="flex items-center justify-center mx-auto text-gray-600 hover:text-gray-700 text-sm font-medium transition-colors duration-200"
                            >
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                Volver al Inicio de Sesión
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Verify2FA;
