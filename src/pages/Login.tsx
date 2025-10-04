import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export const Login: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [touched, setTouched] = useState({ username: false, password: false });
    const [showPassword, setShowPassword] = useState(false);

    const { login, loading } = useAuth();
    const navigate = useNavigate();

    const isUsernameValid = username.trim().length > 0;
    const isPasswordValid = password.trim().length > 0;
    const isFormValid = isUsernameValid && isPasswordValid;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setTouched({ username: true, password: true });

        if (!isFormValid) {
            setError('Por favor completa todos los campos');
            return;
        }

        try {
            await login({ username, password });
            navigate("/products");
        } catch (error) {
            setError("Credenciales inválidas. Por favor, verifica tus datos.");
        }
    };

    const handleBlur = (field: 'username' | 'password') => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const showUsernameError = touched.username && !isUsernameValid;
    const showPasswordError = touched.password && !isPasswordValid;

    const FloatingParticle = ({ delay = 0, duration = 3 }: { delay?: number; duration?: number }) => (
        <motion.div
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 100 - 50, 0],
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
                duration,
                repeat: Infinity,
                delay,
                ease: "easeInOut"
            }}
            style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
            }}
        />
    );

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-2 sm:p-4">
            {/* Gradiente animado */}
            <motion.div
                className="absolute inset-0 opacity-50"
                animate={{
                    background: [
                        "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3), transparent 50%)",
                        "radial-gradient(circle at 80% 50%, rgba(236, 72, 153, 0.3), transparent 50%)",
                        "radial-gradient(circle at 50% 80%, rgba(99, 102, 241, 0.3), transparent 50%)",
                        "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3), transparent 50%)",
                    ],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />

            {/* Partículas */}
            {[...Array(20)].map((_, i) => (
                <FloatingParticle key={i} delay={i * 0.2} duration={3 + Math.random() * 2} />
            ))}

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-6 overflow-hidden">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />

                    <div className="relative z-10">
                        {/* Logo */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="flex justify-center mb-3 sm:mb-4"
                        >
                            <div className="relative">
                                <motion.div
                                    animate={{
                                        boxShadow: [
                                            "0 0 20px rgba(139, 92, 246, 0.5)",
                                            "0 0 60px rgba(236, 72, 153, 0.8)",
                                            "0 0 20px rgba(139, 92, 246, 0.5)",
                                        ],
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl flex items-center justify-center transform rotate-6"
                                >
                                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </motion.div>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 border-2 sm:border-4 border-transparent border-t-purple-300 border-r-pink-300 rounded-3xl"
                                />
                            </div>
                        </motion.div>

                        {/* Título */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-center mb-3 sm:mb-5"
                        >
                            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                                Bienvenido
                            </h1>
                            <p className="text-xs sm:text-sm text-purple-100/80">Inicia sesión para continuar</p>
                        </motion.div>

                        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                            {/* Username */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="space-y-1.5 sm:space-y-2"
                            >
                                <label className="block text-xs sm:text-sm font-semibold text-white/90 tracking-wide">Usuario</label>
                                <div className="relative group">
                                    <motion.div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity" />
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <motion.svg
                                                animate={{ scale: username ? [1, 1.2, 1] : 1 }}
                                                transition={{ duration: 0.3 }}
                                                className={`w-5 h-5 transition-colors ${username ? 'text-purple-300' : 'text-white/50'}`}
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </motion.svg>
                                        </div>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            onBlur={() => handleBlur('username')}
                                            placeholder="Ingresa tu usuario"
                                            disabled={loading}
                                            className={`w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white/10 backdrop-blur-sm border-2 rounded-xl text-white placeholder-white/50 transition-all duration-300
                                                ${showUsernameError
                                                    ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/30'
                                                    : 'border-white/20 focus:border-purple-400 focus:ring-4 focus:ring-purple-500/30'
                                                }
                                                focus:outline-none focus:bg-white/20 disabled:opacity-50`}
                                        />
                                    </div>
                                </div>
                                <AnimatePresence>
                                    {showUsernameError && (
                                        <motion.p
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="text-sm text-red-300 flex items-center gap-1 pl-1"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            El usuario es requerido
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </motion.div>

                            {/* Password */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="space-y-1.5 sm:space-y-2"
                            >
                                <label className="block text-xs sm:text-sm font-semibold text-white/90 tracking-wide">Contraseña</label>
                                <div className="relative group">
                                    <motion.div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity" />
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <motion.svg
                                                animate={{ scale: password ? [1, 1.2, 1] : 1 }}
                                                transition={{ duration: 0.3 }}
                                                className={`w-5 h-5 transition-colors ${password ? 'text-purple-300' : 'text-white/50'}`}
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </motion.svg>
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            onBlur={() => handleBlur('password')}
                                            placeholder="Ingresa tu contraseña"
                                            disabled={loading}
                                            className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base bg-white/10 backdrop-blur-sm border-2 rounded-xl text-white placeholder-white/50 transition-all duration-300
                                                ${showPasswordError
                                                    ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/30'
                                                    : 'border-white/20 focus:border-purple-400 focus:ring-4 focus:ring-purple-500/30'
                                                }
                                                focus:outline-none focus:bg-white/20 disabled:opacity-50`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/60 hover:text-white/90 transition-colors"
                                        >
                                            {showPassword ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <AnimatePresence>
                                    {showPasswordError && (
                                        <motion.p
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="text-sm text-red-300 flex items-center gap-1 pl-1"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            La contraseña es requerida
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </motion.div>

                            {/* Error */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                        className="flex items-center gap-3 p-4 bg-red-500/20 backdrop-blur-sm border border-red-400/50 rounded-xl text-red-100"
                                    >
                                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm font-medium">{error}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Botón */}
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading || !isFormValid}
                                className="relative w-full py-2.5 sm:py-3 px-4 sm:px-6 overflow-hidden rounded-xl font-bold text-sm sm:text-base text-white disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-[length:200%_100%] animate-[shimmer_3s_linear_infinite]" />
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative flex items-center justify-center gap-2">
                                    {loading ? (
                                        <>
                                            <motion.svg animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-6 h-6" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </motion.svg>
                                            <span>Iniciando sesión...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Iniciar Sesión</span>
                                            <motion.svg initial={{ x: 0 }} animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </motion.svg>
                                        </>
                                    )}
                                </div>
                            </motion.button>
                        </form>

                        {/* Credenciales */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-4 sm:mt-5">
                            <div className="relative mb-3 sm:mb-4">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/20" /></div>
                                <div className="relative flex justify-center"><span className="px-3 sm:px-4 text-xs text-white/60 bg-transparent">Credenciales de prueba</span></div>
                            </div>
                            <div className="space-y-2 bg-white/5 backdrop-blur-sm p-2.5 sm:p-3 rounded-xl border border-white/10">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-[10px] sm:text-xs font-medium text-white/70">Usuario:</span>
                                    <motion.code
                                        whileHover={{ scale: 1.05, backgroundColor: "rgba(139, 92, 246, 0.3)" }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setUsername('emilys')}
                                        className="px-2 sm:px-2.5 py-1 sm:py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-purple-200 font-mono text-[10px] sm:text-xs cursor-pointer transition-all"
                                    >
                                        emilys
                                    </motion.code>
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-[10px] sm:text-xs font-medium text-white/70">Contraseña:</span>
                                    <motion.code
                                        whileHover={{ scale: 1.05, backgroundColor: "rgba(236, 72, 153, 0.3)" }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setPassword('emilyspass')}
                                        className="px-2 sm:px-2.5 py-1 sm:py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-pink-200 font-mono text-[10px] sm:text-xs cursor-pointer transition-all"
                                    >
                                        emilyspass
                                    </motion.code>
                                </div>
                                <p className="text-[10px] sm:text-xs text-center text-white/50 pt-1">💡 Haz clic para autocompletar</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            <style>{`
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
        </div>
    );
};
