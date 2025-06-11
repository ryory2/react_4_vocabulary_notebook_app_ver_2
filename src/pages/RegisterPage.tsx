import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getApiErrorMessage } from '../api/apiClient';
import { createAccount } from '../api/endpoints'; // register用のAPI関数

const RegisterPage: React.FC = () => {
    // --- State管理 ---
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    // --- ハンドラ関数 ---
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        // フロントエンドでの簡単なバリデーション
        if (password !== confirmPassword) {
            setError('パスワードが一致しません。');
            return;
        }
        if (password.length < 8) {
            setError('パスワードは8文字以上で入力してください。');
            return;
        }

        setIsSubmitting(true);
        try {
            // ★ 新しいAPI関数を呼び出し
            await createAccount({ name, email, password });

            // 登録成功後、ログインページにメッセージ付きでリダイレクト
            navigate('/login', {
                state: { message: '登録を受け付けました。アカウントを有効化するため、メールを確認してください。' },
                replace: true // ブラウザの履歴に登録ページを残さない
            });

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
                    <h1 className="text-3xl font-bold text-gray-800">新規登録</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        すでにアカウントをお持ちですか？{' '}
                        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            ログイン
                        </Link>
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="name" className="text-sm font-bold text-gray-600 block">
                            ユーザー名
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            autoComplete="username"
                        />
                    </div>

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
                        <label htmlFor="password" className="text-sm font-bold text-gray-600 block">
                            パスワード (8文字以上)
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            autoComplete="new-password"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirm-password" className="text-sm font-bold text-gray-600 block">
                            パスワード (確認用)
                        </label>
                        <input
                            id="confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            autoComplete="new-password"
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? '登録中...' : '登録する'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;