// ===================================
// TIPOS DE AUTENTICACIÓN
// ===================================

export interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: string;
    image: string;
}

export interface AuthResponse {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: string;
    image: string;
    accessToken: string;
    refreshToken: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

// ===================================
// TIPOS DE PRODUCTOS
// ===================================

export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
}

export interface ProductsResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

export interface CreateProductData {
    title: string;
    description: string;
    price: number;
    category: string;
    brand: string;
    stock: number;
    discountPercentage: number;
}

export interface UpdateProductData {
    title?: string;
    description?: string;
    price?: number;
    category?: string;
    brand?: string;
    stock?: number;
    discountPercentage?: number;
}
