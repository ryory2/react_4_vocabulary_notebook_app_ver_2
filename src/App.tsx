import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // ★インポート
import AppRoutes from './routes/AppRoutes'; // ★AppRouterからリネーム
import './App.css';

function App() {
  return (
    // ★ BrowserRouterとAuthProviderで全体を囲む
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;