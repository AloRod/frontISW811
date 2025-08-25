import React from 'react';
import axios from '../api/axios';
import { Link, useNavigate } from "react-router-dom"; 
import { useAuth } from '../hooks/useAuth';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = React.useState({
        email: '',
        password: '',
    });
    const [error, setError] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try { 
            const response = await axios.post('/login', formData);
            
            if (response.status !== 200) {
                setError('El inicio de sesión falló. Por favor verifica tus credenciales.');
                throw new Error('Login failed');
            }

            const data = response.data;
            const user = data.data;
            
            // Verificar si el usuario tiene 2FA habilitado
            if (user.two_factor_enabled) {
                // Redirigir a la página de verificación 2FA
                navigate(`/verify-2fa?id=${user.id}`);
            } else {
                // Login normal sin 2FA
                login(user.id, `${user.first_name} ${user.last_name}`);
            }
        } catch (err) {
            console.error('Error de inicio de sesión:', err);
            
            // Manejo mejorado de errores
            if (err.response?.data) {
                const { data, status } = err.response;
                
                if (status === 422 && data.errors) {
                    // Errores de validación
                    const firstError = Object.values(data.errors)[0];
                    setError(Array.isArray(firstError) ? firstError[0] : firstError);
                } else if (data.error) {
                    // Mensaje de error del servidor
                    setError(data.error);
                } else if (data.message) {
                    setError(data.message);
                } else {
                    setError('El inicio de sesión falló. Por favor verifica tus credenciales.');
                }
            } else if (err.code === 'NETWORK_ERROR') {
                setError('Error de red. Por favor verifica tu conexión.');
            } else {
                setError('El inicio de sesión falló. Por favor verifica tus credenciales.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-900 via-slate-900 to-purple-900">
            <div className="w-full max-w-md">
                <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-slate-700/50">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Iniciar Sesión</h1>
                        <p className="text-slate-400">Accede a tu cuenta</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                                <p className="text-red-400 text-sm text-center">{error}</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    placeholder="Tu correo electrónico"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    placeholder="Tu contraseña"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform ${
                                isLoading 
                                    ? 'opacity-50 cursor-not-allowed' 
                                    : 'hover:scale-[1.02] hover:shadow-xl'
                            }`}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Iniciando sesión...
                                </div>
                            ) : (
                                'Iniciar Sesión'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-400">
                            ¿No tienes una cuenta?{' '}
                            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200">
                                Registrarse
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;