import type { Product, ProductsResponse, CreateProductData, UpdateProductData } from "../types";
import { authService } from "./authService";

const API_URL = "https://dummyjson.com";

export const productService = {
    /**
     * Obtener lista de productos con paginación
     * @param limit - Número de productos por página (default: 10)
     * @param skip - Número de productos a saltar (default: 0)
     */
    async getProducts(limit: number = 10, skip: number = 0): Promise<ProductsResponse> {
        try {
            const response = await fetch(
                `${API_URL}/products?limit=${limit}&skip=${skip}`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Error al obtener productos');
            }

            const data: ProductsResponse = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },

    /**
     * Obtener un producto por ID
     * @param id - ID del producto
     */
    async getProductById(id: number): Promise<Product> {
        try {
            const response = await fetch(`${API_URL}/products/${id}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Producto no encontrado');
            }

            const data: Product = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    },

    /**
     * Buscar productos por término
     * @param query - Término de búsqueda
     */
    async searchProducts(query: string): Promise<ProductsResponse> {
        try {
            const response = await fetch(`${API_URL}/products/search?q=${encodeURIComponent(query)}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al buscar productos');
            }

            const data: ProductsResponse = await response.json();
            return data;
        } catch (error) {
            console.error('Error searching products:', error);
            throw error;
        }
    },

    /**
     * Crear un nuevo producto
     * @param productData - Datos del nuevo producto
     */
    async createProduct(productData: CreateProductData): Promise<Product> {
        try {
            const token = authService.getToken();

            const response = await fetch(`${API_URL}/products/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(productData)
            });

            if (!response.ok) {
                throw new Error('Error al crear producto');
            }

            const data: Product = await response.json();
            return data;
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    },

    /**
     * Actualizar un producto existente
     * @param id - ID del producto a actualizar
     * @param productData - Datos actualizados del producto
     */
    async updateProduct(id: number, productData: UpdateProductData): Promise<Product> {
        try {
            const token = authService.getToken();

            const response = await fetch(`${API_URL}/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(productData)
            });

            if (!response.ok) {
                throw new Error('Error al actualizar producto');
            }

            const data: Product = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    },

    /**
     * Eliminar un producto
     * @param id - ID del producto a eliminar
     */
    async deleteProduct(id: number): Promise<{ id: number; isDeleted: boolean; deletedOn: string }> {
        try {
            const token = authService.getToken();

            const response = await fetch(`${API_URL}/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al eliminar producto');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    },

    /**
     * Obtener todas las categorías de productos
     */
    async getCategories(): Promise<string[]> {
        try {
            const response = await fetch(`${API_URL}/products/categories`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener categorías');
            }

            const data: string[] = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    /**
     * Obtener productos por categoría
     * @param category - Nombre de la categoría
     */
    async getProductsByCategory(category: string): Promise<ProductsResponse> {
        try {
            const response = await fetch(`${API_URL}/products/category/${encodeURIComponent(category)}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener productos por categoría');
            }

            const data: ProductsResponse = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching products by category:', error);
            throw error;
        }
    }
};
