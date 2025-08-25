import React from 'react';
import axios from '../api/axios';
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
    const [formData, setFormData] = React.useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        two_factor_enabled: false,
    });
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [error, setError] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isSavedUser, setIsSavedUser] = React.useState(false);
    const navigate = useNavigate();

    const createNewUser = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post('/register', formData);

            if (response.status === 201) {
                return response.data;
            }
        } catch (err) {
            console.error('Registration error:', err);

            // Manejo mejorado de errores
            if (err.response?.data) {
                const { data, status } = err.response;

                if (status === 422 && data.errors) {
                    // Errores de validación: mostrar el primer error encontrado
                    const firstError = Object.values(data.errors)[0];
                    setError(Array.isArray(firstError) ? firstError[0] : firstError);
                } else if (data.error) {
                    // Mensaje de error del servidor
                    setError(data.error);
                } else if (data.message) {
                    setError(data.message);
                } else {
                    setError('Registration failed. Please try again.');
                }
            } else if (err.code === 'NETWORK_ERROR') {
                setError('Network error. Please check your connection.');
            } else {
                setError('Registration failed. Please try again.');
            }
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Validaciones del lado del cliente
        if (formData.password.length < 8) {
            setError("The password must be at least 8 characters long.");
            return;
        }

        if (formData.password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (!formData.first_name.trim() || !formData.last_name.trim()) {
            setError("First name and last name are required");
            return;
        }

        const isSaved = await createNewUser();
        if (isSaved) {
            setIsSavedUser(true);
            // Redirigir al login después de un breve delay
            setTimeout(() => {
                navigate("/");
            }, 2000);
        }
    };

    if (isSavedUser) {
        return (
            <div className="min-h-screen w-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-900 via-slate-900 to-purple-900">
                <div className="w-full max-w-md">
                    <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-slate-700/50 text-center">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">Account Created Successfully!</h3>
                        <p className="text-slate-400 mb-4">Your account has been created. Redirecting to login...</p>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-900 via-slate-900 to-purple-900">
            <div className="w-full max-w-md">
                <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-slate-700/50">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Register</h1>
                        <p className="text-slate-400">Create your new account</p>
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
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Your First Name"
                                    value={formData.first_name}
                                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Your Last Name"
                                    value={formData.last_name}
                                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    placeholder="Your Email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    placeholder="Your Password (min 8 characters)"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                                    Creating Account...
                                </div>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-400">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;