import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { ProtectedRoute } from './components';
import { useAuth } from './context/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta raíz - redirige según autenticación */}
        <Route path="/" element={<RootRedirect />} />

        {/* Ruta pública - Login */}
        <Route path="/login" element={<Login />} />

        {/* Rutas privadas - Solo accesibles si está autenticado */}
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products/:id"
          element={
            <ProtectedRoute>
              <ProductDetail />
            </ProtectedRoute>
          }
        />

        {/* Ruta 404 - Página no encontrada */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

// Componente auxiliar para redirigir la raíz
const RootRedirect = () => {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? "/products" : "/login"} replace />;
};

// Componente simple para 404
const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-purple-600 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Página no encontrada</p>
        <a href="/" className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          Volver al inicio
        </a>
      </div>
    </div>
  );
};

export default App;