import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { setGlobalLogout } from '../api/apiClient';

import Layout from '../components/Layout';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import LandingPage from '../pages/LandingPage';
import VocablaryApp from '../pages/VocablaryApp';
import AdminPage from '../pages/AdminPage';
import NotFound from '../pages/NotFound';
import VerifyEmailPage from '../pages/VerifyEmailPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import DashboardPage from '../pages/DashboardPage';
import AuthCallbackPage from '../pages/AuthCallbackPage';
// ... 他のページのインポート

// ★ 認証済みユーザーのみアクセス可能なルートをラップするコンポーネント
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>読み込み中...</div>; // 初回認証チェック中はローディング表示
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AppRoutes: React.FC = () => {
    // ★ apiClientのグローバルlogout関数を設定するロジック
    const { logout } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        setGlobalLogout(() => {
            logout();
            navigate('/login');
        });
    }, [logout, navigate]);

    return (
        <Routes>
            {/* --- Public Routes (認証不要) --- */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            {/* パスワードリセットなどもここに追加 */}

            {/* 共通のLayoutを使うが、認証は不要なルート群 */}
            <Route path="/" element={<Layout />}>
                {/* index はルートパス("/") を意味する */}
                <Route index element={<LandingPage />} />
                {/* 他に公開したいページがあればここに追加 (例: /about, /features) */}
            </Route>

            {/* --- Protected Routes (認証が必要) --- */}
            {/* 共通のLayoutを使い、かつ認証が必要なルート群 */}
            <Route path="/app" element={<PrivateRoute><Layout /></PrivateRoute>}>
                <Route index element={<Navigate to="/app/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="flashcards" element={<VocablaryApp />} />
                <Route path="admin" element={<AdminPage />} />
                {/* 他の保護したいページ (About, Sampleなど) もここに入れる */}
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;