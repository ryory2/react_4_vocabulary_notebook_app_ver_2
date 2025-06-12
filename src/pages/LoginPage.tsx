import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getApiErrorMessage } from '../api/apiClient';
import { loginUser } from '../api/endpoints';
import { config } from '../config';

const LoginPage: React.FC = () => {
    // --- State管理 ---
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    // --- メッセージのハンドリング ---
    const successMessageFromState = location.state?.message;
    const [successMessage, setSuccessMessage] = useState<string | null>(successMessageFromState);

    const urlParams = new URLSearchParams(location.search);
    const errorMessageFromUrl = urlParams.get('error') || location.state?.error;

    useEffect(() => {
        if (errorMessageFromUrl) {
            setError(errorMessageFromUrl);
        }
        // メッセージ表示後にURLをクリーンアップ
        if (location.state || location.search) {
            navigate(location.pathname, { replace: true });
        }
    }, [errorMessageFromUrl, location.pathname, location.state, navigate]);


    // --- ハンドラ関数 ---
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setIsSubmitting(true);
        try {
            const response = await loginUser({ email, password });
            login(response.access_token);
            navigate('/app/dashboard', { replace: true });
        } catch (err) {
            setError(getApiErrorMessage(err));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleLogin = () => {
        // 環境変数からGoogleのクライアントIDと、フロントエンドのコールバックURLを取得
        const clientId = config.auth.google.clientId;
        const redirectUri = config.auth.google.redirectUri;

        if (!clientId) {
            setError("Googleログインの設定が不十分です。");
            console.error("REACT_APP_GOOGLE_CLIENT_ID is not defined in .env file");
            return;
        }

        // 要求する権限の範囲
        const scope = 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile';

        // Googleの認証エンドポイントURLを組み立てる
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline`;

        // ユーザーをGoogleの認証ページにリダイレクトさせる
        window.location.href = authUrl;
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800">ログイン</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        アカウントをお持ちでないですか？{' '}
                        <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                            新規登録
                        </Link>
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                            {error}
                        </div>
                    )}
                    {successMessage && !error && (
                        <div className="p-3 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">
                            {successMessage}
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="text-sm font-bold text-gray-600 block">
                            メールアドレス
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            autoComplete="email"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-baseline">
                            <label htmlFor="password" className="text-sm font-bold text-gray-600 block">
                                パスワード
                            </label>
                            <Link to="/forgot-password" tabIndex={-1} className="text-sm text-blue-600 hover:underline">
                                パスワードを忘れましたか？
                            </Link>
                        </div>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            autoComplete="current-password"
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'ログイン中...' : 'ログイン'}
                        </button>
                    </div>
                </form>

                <div className="relative flex py-4 items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-xs text-gray-400 uppercase">または</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <div>
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-800 hover:bg-gray-50"
                    >
                        <svg className="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" /><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" /><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.223,0-9.655-3.397-11.303-8H24v-8H2.389c-0.389,2.65-0.389,5.35,0,8C4.502,36.197,13.556,44,24,44z" /><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,35.45,44,30.168,44,24C44,22.659,43.862,21.35,43.611,20.083z" /></svg>
                        Googleでログイン
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;