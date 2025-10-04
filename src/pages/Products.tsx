import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { productService } from "../services/productService";
import type { Product, CreateProductData } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { ProductFormModal } from "../components";

export const Products: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const productsPerPage = 10;
    const totalPages = Math.ceil(total / productsPerPage);

    useEffect(() => {
        loadProducts();
    }, [currentPage]);

    // Manejar mensaje de eliminación exitosa
    useEffect(() => {
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
            // Limpiar el state para que no se muestre al recargar
            window.history.replaceState({}, document.title);
            setTimeout(() => setSuccessMessage(null), 3000);
        }
    }, [location]);

    const loadProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const skip = (currentPage - 1) * productsPerPage;
            const response = await productService.getProducts(productsPerPage, skip);
            setProducts(response.products);
            setTotal(response.total);
        } catch (err) {
            setError("Error al cargar los productos");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            loadProducts();
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await productService.searchProducts(searchQuery);
            setProducts(response.products);
            setTotal(response.total);
            setCurrentPage(1);
        } catch (err) {
            setError("Error al buscar productos");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleViewProduct = (id: number) => {
        navigate(`/products/${id}`);
    };

    const handleCreateProduct = async (data: CreateProductData) => {
        try {
            await productService.createProduct(data);
            setSuccessMessage('¡Producto creado exitosamente!');
            setTimeout(() => setSuccessMessage(null), 3000);
            loadProducts(); // Recargar la lista
        } catch (err) {
            console.error('Error al crear producto:', err);
            throw err;
        }
    };

    const handleEditProduct = async (data: CreateProductData) => {
        if (!editingProduct) return;

        try {
            await productService.updateProduct(editingProduct.id, data);
            setSuccessMessage('¡Producto actualizado exitosamente!');
            setTimeout(() => setSuccessMessage(null), 3000);
            loadProducts(); // Recargar la lista
            setEditingProduct(null);
        } catch (err) {
            console.error('Error al actualizar producto:', err);
            throw err;
        }
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                        key={star}
                        className={`w-4 h-4 ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
                <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 overflow-x-hidden" style={{ width: '100vw', maxWidth: '100vw', overflowX: 'hidden', position: 'relative' }}>
            {/* Header */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="bg-white/80 backdrop-blur-lg border-b border-purple-100 sticky top-0 z-50 shadow-sm overflow-x-hidden"
                style={{ width: '100%', maxWidth: '100vw' }}
            >
                <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6" style={{ maxWidth: '1280px' }}>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                            <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                                className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0"
                            >
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </motion.div>
                            <div className="min-w-0">
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 truncate">Productos</h1>
                                <p className="text-sm text-gray-500 truncate">Hola, {user?.firstName}! 👋</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 flex-shrink-0">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsAddModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-shadow"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span className="hidden sm:inline">Agregar Producto</span>
                                <span className="sm:hidden">Agregar</span>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-shadow"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span className="hidden sm:inline">Cerrar Sesión</span>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Main Content */}
            <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8" style={{ maxWidth: '1280px' }}>
                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 sm:mb-8"
                >
                    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-purple-100 p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    placeholder="Buscar productos..."
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all"
                                />
                                <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSearch}
                                className="px-4 sm:px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm sm:text-base font-medium shadow-lg hover:shadow-xl transition-all whitespace-nowrap"
                            >
                                Buscar
                            </motion.button>
                            {searchQuery && (
                                <motion.button
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => { setSearchQuery(""); loadProducts(); }}
                                    className="px-4 sm:px-6 py-3 bg-gray-200 text-gray-700 rounded-xl text-sm sm:text-base font-medium hover:bg-gray-300 transition-colors whitespace-nowrap"
                                >
                                    Limpiar
                                </motion.button>
                            )}
                        </div>

                        {/* View Toggle */}
                        <div className="flex flex-wrap items-center gap-2 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                            <span className="text-xs sm:text-sm font-medium text-gray-600">Vista:</span>
                            <div className="flex gap-1.5 sm:gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setViewMode('table')}
                                    className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-base font-medium transition-all ${viewMode === 'table'
                                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    <span className="hidden sm:inline">Tabla</span>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setViewMode('cards')}
                                    className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-base font-medium transition-all ${viewMode === 'cards'
                                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                    </svg>
                                    <span className="hidden sm:inline">Tarjetas</span>
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Error Message */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-6 p-4 bg-red-100 border border-red-300 rounded-xl text-red-700 flex items-center gap-3"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full"
                        />
                    </div>
                ) : (
                    <>
                        {/* Table View */}
                        {viewMode === 'table' ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-purple-100 overflow-hidden"
                            >
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                            <tr>
                                                <th className="px-3 py-3 text-left text-xs font-semibold">Imagen</th>
                                                <th className="px-3 py-3 text-left text-xs font-semibold">Producto</th>
                                                <th className="hidden md:table-cell px-3 py-3 text-left text-xs font-semibold">Categoría</th>
                                                <th className="px-3 py-3 text-left text-xs font-semibold">Precio</th>
                                                <th className="hidden lg:table-cell px-3 py-3 text-left text-xs font-semibold">Rating</th>
                                                <th className="hidden sm:table-cell px-3 py-3 text-left text-xs font-semibold">Stock</th>
                                                <th className="px-3 py-3 text-center text-xs font-semibold">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            <AnimatePresence mode="popLayout">
                                                {products.map((product, index) => (
                                                    <motion.tr
                                                        key={product.id}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: 20 }}
                                                        transition={{ delay: index * 0.05 }}
                                                        className="hover:bg-purple-50/50 transition-colors"
                                                    >
                                                        <td className="px-3 py-3">
                                                            <img
                                                                src={product.thumbnail}
                                                                alt={product.title}
                                                                className="w-12 h-12 object-cover rounded-lg shadow-md"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-3">
                                                            <div className="font-medium text-gray-800 text-sm">{product.title}</div>
                                                            <div className="text-xs text-gray-500">{product.brand}</div>
                                                        </td>
                                                        <td className="hidden md:table-cell px-3 py-3">
                                                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                                                {product.category}
                                                            </span>
                                                        </td>
                                                        <td className="px-3 py-3">
                                                            <div className="font-bold text-green-600 text-sm">${product.price.toFixed(2)}</div>
                                                            {product.discountPercentage > 0 && (
                                                                <span className="text-xs text-red-500">-{product.discountPercentage}%</span>
                                                            )}
                                                        </td>
                                                        <td className="hidden lg:table-cell px-3 py-3">
                                                            {renderStars(product.rating)}
                                                        </td>
                                                        <td className="hidden sm:table-cell px-3 py-3">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock > 50 ? 'bg-green-100 text-green-700' :
                                                                product.stock > 20 ? 'bg-yellow-100 text-yellow-700' :
                                                                    'bg-red-100 text-red-700'
                                                                }`}>
                                                                {product.stock}
                                                            </span>
                                                        </td>
                                                        <td className="px-3 py-3 text-center">
                                                            <div className="flex items-center justify-center gap-1.5">
                                                                <motion.button
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                    onClick={() => handleViewProduct(product.id)}
                                                                    className="inline-flex items-center gap-1 px-2 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-xs font-medium shadow-md hover:shadow-lg transition-shadow"
                                                                    title="Ver detalle"
                                                                >
                                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                    </svg>
                                                                    <span className="hidden sm:inline">Ver</span>
                                                                </motion.button>
                                                                <motion.button
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setEditingProduct(product);
                                                                        setIsEditModalOpen(true);
                                                                    }}
                                                                    className="inline-flex items-center gap-1 px-2 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-xs font-medium shadow-md hover:shadow-lg transition-shadow"
                                                                    title="Editar producto"
                                                                >
                                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                    </svg>
                                                                    <span className="hidden sm:inline">Editar</span>
                                                                </motion.button>
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </AnimatePresence>
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        ) : (
                            /* Cards View */
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                <AnimatePresence mode="popLayout">
                                    {products.map((product, index) => (
                                        <motion.div
                                            key={product.id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ delay: index * 0.05 }}
                                            whileHover={{ y: -5 }}
                                            onClick={() => handleViewProduct(product.id)}
                                            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-purple-100 overflow-hidden cursor-pointer hover:shadow-2xl transition-all"
                                        >
                                            {/* Image */}
                                            <div className="relative aspect-square overflow-hidden bg-gray-100">
                                                <img
                                                    src={product.thumbnail}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover"
                                                />
                                                {product.discountPercentage > 0 && (
                                                    <div className="absolute top-3 right-3 px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold shadow-lg">
                                                        -{product.discountPercentage}% OFF
                                                    </div>
                                                )}
                                                <div className="absolute top-3 left-3">
                                                    <span className="px-3 py-1 bg-purple-500/90 backdrop-blur-sm text-white rounded-full text-xs font-medium shadow-lg">
                                                        {product.category}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-5 space-y-3">
                                                {/* Title & Brand */}
                                                <div>
                                                    <h3 className="font-bold text-lg text-gray-800 line-clamp-2 mb-1">
                                                        {product.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">{product.brand}</p>
                                                </div>

                                                {/* Rating */}
                                                <div className="flex items-center gap-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <svg
                                                            key={star}
                                                            className={`w-4 h-4 ${star <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))}
                                                    <span className="ml-2 text-sm font-medium text-gray-600">
                                                        {product.rating.toFixed(1)}
                                                    </span>
                                                </div>

                                                {/* Price */}
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-2xl font-bold text-green-600">
                                                        ${product.price.toFixed(2)}
                                                    </span>
                                                    {product.discountPercentage > 0 && (
                                                        <span className="text-sm text-gray-400 line-through">
                                                            ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Stock & Actions */}
                                                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${product.stock > 50 ? 'bg-green-100 text-green-700' :
                                                        product.stock > 20 ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-red-100 text-red-700'
                                                        }`}>
                                                        Stock: {product.stock}
                                                    </span>

                                                    <div className="flex items-center gap-2">
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setEditingProduct(product);
                                                                setIsEditModalOpen(true);
                                                            }}
                                                            className="w-9 h-9 flex items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                                                            title="Editar producto"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </motion.button>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleViewProduct(product.id);
                                                            }}
                                                            className="w-9 h-9 flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                                                            title="Ver detalle"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        )}

                        {/* Pagination */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8 sm:mt-5 bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-purple-100 p-4 sm:p-3"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                                <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                                    Mostrando {((currentPage - 1) * productsPerPage) + 1} - {Math.min(currentPage * productsPerPage, total)} de {total} productos
                                </div>

                                <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="px-2 sm:px-4 py-1.5 sm:py-2 bg-white border-2 border-purple-200 text-purple-600 rounded-lg text-xs sm:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-50 transition-colors"
                                    >
                                        <span className="hidden sm:inline">Anterior</span>
                                        <span className="sm:hidden">◀</span>
                                    </motion.button>

                                    <div className="flex items-center gap-1 sm:gap-1.5">
                                        {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                                            let pageNumber;
                                            if (totalPages <= 3) {
                                                pageNumber = i + 1;
                                            } else if (currentPage <= 2) {
                                                pageNumber = i + 1;
                                            } else if (currentPage >= totalPages - 1) {
                                                pageNumber = totalPages - 2 + i;
                                            } else {
                                                pageNumber = currentPage - 1 + i;
                                            }

                                            return (
                                                <motion.button
                                                    key={pageNumber}
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => setCurrentPage(pageNumber)}
                                                    className={`w-8 h-8 sm:w-11 sm:h-11 rounded-lg text-xs sm:text-base font-medium transition-all ${currentPage === pageNumber
                                                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                                        : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-purple-300'
                                                        }`}
                                                >
                                                    {pageNumber}
                                                </motion.button>
                                            );
                                        })}
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-2 sm:px-4 py-1.5 sm:py-2 bg-white border-2 border-purple-200 text-purple-600 rounded-lg text-xs sm:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-50 transition-colors"
                                    >
                                        <span className="hidden sm:inline">Siguiente</span>
                                        <span className="sm:hidden">▶</span>
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </main>

            {/* Modal de Agregar Producto */}
            <ProductFormModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleCreateProduct}
                title="Agregar Producto"
            />

            {/* Modal de Editar Producto */}
            {editingProduct && (
                <ProductFormModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setEditingProduct(null);
                    }}
                    onSubmit={handleEditProduct}
                    title="Editar Producto"
                    initialData={{
                        title: editingProduct.title,
                        description: editingProduct.description,
                        price: editingProduct.price,
                        category: editingProduct.category,
                        brand: editingProduct.brand,
                        stock: editingProduct.stock,
                        discountPercentage: editingProduct.discountPercentage
                    }}
                />
            )}

            {/* Mensaje de éxito */}
            <AnimatePresence>
                {successMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-2"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">{successMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
