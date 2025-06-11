import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getApiErrorMessage } from '../api/apiClient';
import { loginUser } from '../api/endpoints'; // login用のAPI関数

const LoginPage: React.FC = () => {
    // --- State管理 ---
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth(); // AuthContextからlogin関数を取得

    // 登録直後のリダイレクトメッセージを取得
    const successMessage = location.state?.message;

    // --- ハンドラ関数 ---
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            // ★ 新しいAPI関数を呼び出し
            const response = await loginUser({ email, password });

            // ★ Contextのlogin関数を呼び出してトークンを保存
            login(response.access_token);

            // ★ ダッシュボードに画面遷移
            navigate('/app/flashcards', { replace: true });

        } catch (err) {
            // ★ 共通エラーハンドラでエラーメッセージを取得
            const errorMessage = getApiErrorMessage(err);
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
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
            </div>
        </div>
    );
};

export default LoginPage;