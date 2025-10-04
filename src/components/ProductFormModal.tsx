import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CreateProductData } from '../types';

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateProductData) => Promise<void>;
    title?: string;
    initialData?: CreateProductData;
}

interface FormErrors {
    title?: string;
    description?: string;
    price?: string;
    category?: string;
    brand?: string;
    stock?: string;
    discountPercentage?: string;
}

const CATEGORIES = [
    'beauty',
    'fragrances',
    'furniture',
    'groceries',
    'home-decoration',
    'kitchen-accessories',
    'laptops',
    'mens-shirts',
    'mens-shoes',
    'mens-watches',
    'mobile-accessories',
    'motorcycle',
    'skin-care',
    'smartphones',
    'sports-accessories',
    'sunglasses',
    'tablets',
    'tops',
    'vehicle',
    'womens-bags',
    'womens-dresses',
    'womens-jewellery',
    'womens-shoes',
    'womens-watches'
];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    title = 'Agregar Producto',
    initialData
}) => {
    const getInitialFormData = (): CreateProductData => {
        return initialData || {
            title: '',
            description: '',
            price: 0,
            category: '',
            brand: '',
            stock: 0,
            discountPercentage: 0
        };
    };

    const [formData, setFormData] = useState<CreateProductData>(getInitialFormData());

    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset o cargar form cuando se abre/cierra el modal
    useEffect(() => {
        if (isOpen) {
            // Cargar datos iniciales si existen (modo edición)
            setFormData(getInitialFormData());
        } else {
            // Reset cuando se cierra
            setFormData(getInitialFormData());
            setErrors({});
            setTouched({});
            setIsSubmitting(false);
        }
    }, [isOpen, initialData]);

    const validateField = (name: string, value: string | number): string | undefined => {
        switch (name) {
            case 'title':
                if (!value || (typeof value === 'string' && value.trim().length === 0)) {
                    return 'El título es requerido';
                }
                if (typeof value === 'string' && value.trim().length < 3) {
                    return 'El título debe tener al menos 3 caracteres';
                }
                break;
            case 'description':
                if (!value || (typeof value === 'string' && value.trim().length === 0)) {
                    return 'La descripción es requerida';
                }
                if (typeof value === 'string' && value.trim().length < 10) {
                    return 'La descripción debe tener al menos 10 caracteres';
                }
                break;
            case 'price':
                if (!value || Number(value) <= 0) {
                    return 'El precio debe ser mayor a 0';
                }
                break;
            case 'category':
                if (!value || (typeof value === 'string' && value.trim().length === 0)) {
                    return 'La categoría es requerida';
                }
                break;
            case 'brand':
                if (!value || (typeof value === 'string' && value.trim().length === 0)) {
                    return 'La marca es requerida';
                }
                break;
            case 'stock':
                if (value === undefined || value === null || Number(value) < 0) {
                    return 'El stock debe ser mayor o igual a 0';
                }
                break;
            case 'discountPercentage':
                if (Number(value) < 0 || Number(value) > 100) {
                    return 'El descuento debe estar entre 0 y 100';
                }
                break;
        }
        return undefined;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const numericFields = ['price', 'stock', 'discountPercentage'];

        // Para campos numéricos, guardar como número o vacío
        let processedValue: string | number = value;
        if (numericFields.includes(name)) {
            processedValue = value === '' ? 0 : Number(value);
        }

        setFormData(prev => ({
            ...prev,
            [name]: processedValue
        }));

        // Validar en tiempo real si el campo ha sido tocado
        if (touched[name]) {
            const error = validateField(name, processedValue);
            setErrors(prev => ({
                ...prev,
                [name]: error
            }));
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));

        const numericFields = ['price', 'stock', 'discountPercentage'];
        const processedValue = numericFields.includes(name) ? Number(value) : value;

        const error = validateField(name, processedValue);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key as keyof CreateProductData]);
            if (error) {
                newErrors[key as keyof FormErrors] = error;
            }
        });

        setErrors(newErrors);
        setTouched({
            title: true,
            description: true,
            price: true,
            category: true,
            brand: true,
            stock: true,
            discountPercentage: true
        });

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Error al enviar formulario:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && !isSubmitting) {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50"
                    onClick={handleBackdropClick}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-md h-[90vh] sm:h-auto sm:max-h-[85vh] overflow-hidden flex flex-col"
                    >
                        <form onSubmit={handleSubmit} className="flex flex-col h-full">
                            {/* Título del modal - Fixed Header */}
                            <div className="flex-shrink-0 px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-gray-100 bg-white">
                                <h2 className="text-lg sm:text-xl font-bold text-gray-800">{title}</h2>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 py-3 sm:py-4" style={{ WebkitOverflowScrolling: 'touch' }}>
                                <div className="space-y-3.5">
                                    {/* Título */}
                                    <div>
                                        <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">
                                            Título <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            disabled={isSubmitting}
                                            className={`w-full px-3 py-2 text-sm rounded-lg border-2 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed ${errors.title && touched.title
                                                ? 'border-red-500 focus:border-red-600 bg-red-50/50'
                                                : 'border-gray-300 focus:border-purple-500'
                                                }`}
                                            placeholder="Ej: iPhone 15 Pro Max"
                                        />
                                        <AnimatePresence>
                                            {errors.title && touched.title && (
                                                <motion.p
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="text-red-500 text-sm mt-1"
                                                >
                                                    {errors.title}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Descripción */}
                                    <div>
                                        <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">
                                            Descripción <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            disabled={isSubmitting}
                                            rows={4}
                                            className={`w-full px-3 py-2 text-sm rounded-lg border-2 transition-all outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed ${errors.description && touched.description
                                                ? 'border-red-500 focus:border-red-600 bg-red-50/50'
                                                : 'border-gray-300 focus:border-purple-500'
                                                }`}
                                            placeholder="Descripción detallada del producto..."
                                        />
                                        <AnimatePresence>
                                            {errors.description && touched.description && (
                                                <motion.p
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="text-red-500 text-sm mt-1"
                                                >
                                                    {errors.description}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Categoría y Marca */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-1">
                                                Categoría <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                id="category"
                                                name="category"
                                                value={formData.category}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                disabled={isSubmitting}
                                                className={`w-full px-3 py-2 text-sm rounded-lg border-2 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed ${errors.category && touched.category
                                                    ? 'border-red-500 focus:border-red-600 bg-red-50/50'
                                                    : 'border-gray-300 focus:border-purple-500'
                                                    }`}
                                            >
                                                <option value="">Seleccionar categoría</option>
                                                {CATEGORIES.map(cat => (
                                                    <option key={cat} value={cat}>
                                                        {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
                                                    </option>
                                                ))}
                                            </select>
                                            <AnimatePresence>
                                                {errors.category && touched.category && (
                                                    <motion.p
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="text-red-500 text-sm mt-1"
                                                    >
                                                        {errors.category}
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        <div>
                                            <label htmlFor="brand" className="block text-sm font-semibold text-gray-700 mb-1">
                                                Marca <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="brand"
                                                name="brand"
                                                value={formData.brand}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                disabled={isSubmitting}
                                                className={`w-full px-3 py-2 text-sm rounded-lg border-2 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed ${errors.brand && touched.brand
                                                    ? 'border-red-500 focus:border-red-600 bg-red-50/50'
                                                    : 'border-gray-300 focus:border-purple-500'
                                                    }`}
                                                placeholder="Ej: Apple"
                                            />
                                            <AnimatePresence>
                                                {errors.brand && touched.brand && (
                                                    <motion.p
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="text-red-500 text-sm mt-1"
                                                    >
                                                        {errors.brand}
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    {/* Precio, Stock y Descuento */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div>
                                            <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-1">
                                                Precio ($) <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                id="price"
                                                name="price"
                                                value={formData.price || ''}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                disabled={isSubmitting}
                                                min="0"
                                                step="0.01"
                                                className={`w-full px-3 py-2 text-sm rounded-lg border-2 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed ${errors.price && touched.price
                                                    ? 'border-red-500 focus:border-red-600 bg-red-50/50'
                                                    : 'border-gray-300 focus:border-purple-500'
                                                    }`}
                                                placeholder="0.00"
                                            />
                                            <AnimatePresence>
                                                {errors.price && touched.price && (
                                                    <motion.p
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="text-red-500 text-sm mt-1"
                                                    >
                                                        {errors.price}
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        <div>
                                            <label htmlFor="stock" className="block text-sm font-semibold text-gray-700 mb-1">
                                                Stock <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                id="stock"
                                                name="stock"
                                                value={formData.stock || ''}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                disabled={isSubmitting}
                                                min="0"
                                                step="1"
                                                className={`w-full px-3 py-2 text-sm rounded-lg border-2 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed ${errors.stock && touched.stock
                                                    ? 'border-red-500 focus:border-red-600 bg-red-50/50'
                                                    : 'border-gray-300 focus:border-purple-500'
                                                    }`}
                                                placeholder="0"
                                            />
                                            <AnimatePresence>
                                                {errors.stock && touched.stock && (
                                                    <motion.p
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="text-red-500 text-sm mt-1"
                                                    >
                                                        {errors.stock}
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        <div>
                                            <label htmlFor="discountPercentage" className="block text-sm font-semibold text-gray-700 mb-1">
                                                Descuento (%)
                                            </label>
                                            <input
                                                type="number"
                                                id="discountPercentage"
                                                name="discountPercentage"
                                                value={formData.discountPercentage || ''}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                disabled={isSubmitting}
                                                min="0"
                                                max="100"
                                                step="0.1"
                                                className={`w-full px-3 py-2 text-sm rounded-lg border-2 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed ${errors.discountPercentage && touched.discountPercentage
                                                    ? 'border-red-500 focus:border-red-600 bg-red-50/50'
                                                    : 'border-gray-300 focus:border-purple-500'
                                                    }`}
                                                placeholder="0"
                                            />
                                            <AnimatePresence>
                                                {errors.discountPercentage && touched.discountPercentage && (
                                                    <motion.p
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="text-red-500 text-sm mt-1"
                                                    >
                                                        {errors.discountPercentage}
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Botones - Fixed Footer */}
                            <div className="flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 bg-white">
                                <div className="flex gap-2 sm:gap-3">
                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={onClose}
                                        disabled={isSubmitting}
                                        className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-200 text-gray-700 rounded-xl text-sm sm:text-base font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Cancelar
                                    </motion.button>
                                    <motion.button
                                        type="submit"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        disabled={isSubmitting}
                                        className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm sm:text-base font-medium hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                                />
                                                <span>Guardando...</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>Guardar</span>
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
