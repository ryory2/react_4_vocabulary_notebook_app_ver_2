import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // ★インポート
import AppRoutes from './routes/AppRoutes'; // ★AppRouterからリネーム
import './App.css';
import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;