import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productService } from "../services/productService";
import type { Product, CreateProductData } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { ProductFormModal } from "../components";

export const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        loadProduct();
    }, [id]);

    const loadProduct = async () => {
        if (!id) return;

        setLoading(true);
        setError(null);
        try {
            const data = await productService.getProductById(Number(id));
            setProduct(data);
        } catch (err) {
            setError("Error al cargar el producto");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!product) return;

        setDeleting(true);
        try {
            await productService.deleteProduct(product.id);
            navigate("/products", { state: { message: "Producto eliminado exitosamente" } });
        } catch (err) {
            setError("Error al eliminar el producto");
            console.error(err);
        } finally {
            setDeleting(false);
            setShowDeleteModal(false);
        }
    };

    const handleEditProduct = async (data: CreateProductData) => {
        if (!product) return;

        try {
            await productService.updateProduct(product.id, data);
            setSuccessMessage('¡Producto actualizado exitosamente!');
            setTimeout(() => setSuccessMessage(null), 3000);
            loadProduct(); // Recargar el producto
        } catch (err) {
            console.error('Error al actualizar producto:', err);
            throw err;
        }
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <motion.svg
                        key={star}
                        whileHover={{ scale: 1.2 }}
                        className={`w-5 h-5 ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </motion.svg>
                ))}
                <span className="ml-2 text-lg font-bold text-gray-700">{rating.toFixed(1)}</span>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full"
                />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center p-4 overflow-x-hidden" style={{ width: '100vw', maxWidth: '100vw', overflowX: 'hidden' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
                >
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Producto no encontrado</h2>
                    <p className="text-gray-600 mb-6">{error || "El producto que buscas no existe"}</p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/products")}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium shadow-lg"
                    >
                        Volver a productos
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex flex-col overflow-hidden overflow-x-hidden" style={{ width: '100vw', maxWidth: '100vw', overflowX: 'hidden', position: 'relative' }}>
            {/* Header Navigation */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="bg-white/90 backdrop-blur-md border-b border-purple-100 z-50 shadow-sm flex-shrink-0 overflow-x-hidden"
                style={{ width: '100%', maxWidth: '100vw' }}
            >
                <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-3" style={{ maxWidth: '1280px' }}>
                    <div className="flex items-center justify-between">
                        <motion.button
                            whileHover={{ scale: 1.05, x: -5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate("/products")}
                            className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-gray-700 transition-all text-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Volver
                        </motion.button>

                        <div className="flex items-center gap-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowEditModal(true)}
                                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-medium shadow-md text-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span className="hidden sm:inline">Editar</span>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowDeleteModal(true)}
                                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-medium shadow-md text-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span className="hidden sm:inline">Eliminar</span>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden overflow-x-hidden" style={{ width: '100%', maxWidth: '100vw' }}>
                <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 h-full py-4" style={{ maxWidth: '1280px' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-2xl overflow-hidden h-full flex flex-col"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 flex-1 min-h-0">
                            {/* Left Side - Image Gallery */}
                            <div className="p-6 bg-gray-50 flex flex-col min-h-0">
                                {/* Main Image */}
                                <div className="relative flex-1 rounded-xl overflow-hidden bg-white shadow-lg mb-3 min-h-0">
                                    <img
                                        src={product.images[selectedImage]}
                                        alt={product.title}
                                        className="w-full h-full object-contain p-3 transition-opacity duration-200"
                                    />

                                    {/* Navigation Arrows */}
                                    {product.images.length > 1 && (
                                        <>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => setSelectedImage(i => (i === 0 ? product.images.length - 1 : i - 1))}
                                                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center z-10"
                                            >
                                                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </motion.button>

                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => setSelectedImage(i => (i === product.images.length - 1 ? 0 : i + 1))}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center z-10"
                                            >
                                                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </motion.button>
                                        </>
                                    )}
                                </div>

                                {/* Thumbnails */}
                                <div className="grid grid-cols-4 gap-2 flex-shrink-0">
                                    {product.images.map((image, index) => (
                                        <motion.button
                                            key={index}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setSelectedImage(index)}
                                            className={`aspect-square rounded-lg overflow-hidden bg-white shadow transition-all ${selectedImage === index
                                                ? 'ring-3 ring-purple-500'
                                                : 'ring-2 ring-gray-200 hover:ring-purple-300'
                                                }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`${product.title} ${index + 1}`}
                                                className="w-full h-full object-cover p-1"
                                            />
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* Right Side - Product Info */}
                            <div className="p-6 flex flex-col overflow-y-auto min-h-0">
                                {/* Category & Title */}
                                <div className="mb-3">
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold mb-2"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                        {product.category}
                                    </motion.span>

                                    <motion.h1
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-2xl font-bold text-gray-900 mb-1 leading-tight"
                                    >
                                        {product.title}
                                    </motion.h1>

                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-sm text-gray-600"
                                    >
                                        Marca: <span className="font-bold text-purple-600">{product.brand}</span>
                                    </motion.p>
                                </div>

                                {/* Rating */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mb-3"
                                >
                                    {renderStars(product.rating)}
                                </motion.div>

                                {/* Price & Stock */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-4 border border-green-100"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <div className="text-xs text-gray-600 mb-0.5">Precio</div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-3xl font-bold text-green-600">
                                                    ${product.price.toFixed(2)}
                                                </span>
                                                {product.discountPercentage > 0 && (
                                                    <>
                                                        <span className="text-sm text-gray-400 line-through">
                                                            ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                                                        </span>
                                                        <span className="px-2 py-0.5 bg-red-500 text-white rounded-full text-xs font-bold">
                                                            -{product.discountPercentage}%
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-gray-600 mb-1">Stock</div>
                                            <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${product.stock > 50 ? 'bg-green-500 text-white' :
                                                product.stock > 20 ? 'bg-yellow-500 text-white' :
                                                    'bg-red-500 text-white'
                                                }`}>
                                                {product.stock}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Description */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mb-4"
                                >
                                    <h3 className="text-base font-bold text-gray-900 mb-1">Descripción</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
                                </motion.div>

                                {/* Additional Info */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200 mt-auto"
                                >
                                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3">
                                        <div className="text-xs text-purple-600 font-medium mb-0.5">ID</div>
                                        <div className="text-lg font-bold text-purple-700">#{product.id}</div>
                                    </div>
                                    <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-3">
                                        <div className="text-xs text-pink-600 font-medium mb-0.5">Categoría</div>
                                        <div className="text-lg font-bold text-pink-700">{product.category}</div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                        onClick={() => !deleting && setShowDeleteModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
                        >
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>

                            <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
                                ¿Eliminar producto?
                            </h2>
                            <p className="text-gray-600 text-center mb-6">
                                Esta acción no se puede deshacer. El producto <strong>{product.title}</strong> será eliminado permanentemente.
                            </p>

                            <div className="flex gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setShowDeleteModal(false)}
                                    disabled={deleting}
                                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors disabled:opacity-50"
                                >
                                    Cancelar
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {deleting ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                            />
                                            Eliminando...
                                        </>
                                    ) : (
                                        'Eliminar'
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal de Editar Producto */}
            {product && (
                <ProductFormModal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    onSubmit={handleEditProduct}
                    title="Editar Producto"
                    initialData={{
                        title: product.title,
                        description: product.description,
                        price: product.price,
                        category: product.category,
                        brand: product.brand,
                        stock: product.stock,
                        discountPercentage: product.discountPercentage
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
