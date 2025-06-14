import { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import apiClient from '../api/apiClient';

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean; // 初回認証チェック中の状態
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // アプリケーション起動時に、トークンの有効性を確認する
    const verifyAuth = useCallback(async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setIsLoading(false);
            return;
        }
        try {
            // /me APIを叩いてトークンがまだ有効かサーバーに確認
            await apiClient.get('/auth/me');
            setIsAuthenticated(true);
        } catch {
            // トークンが無効ならlocalStorageから削除
            localStorage.removeItem('accessToken');
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        verifyAuth();
    }, [verifyAuth]);

    const login = (token: string) => {
        localStorage.setItem('accessToken', token);
        setIsAuthenticated(true);
    };

    const logout = useCallback(() => {
        localStorage.removeItem('accessToken');
        setIsAuthenticated(false);
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
            {isLoading ? <div>読み込み中...</div> : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};