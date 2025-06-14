import React, { useEffect, useRef, useState } from 'react';
import { usePageMeta } from '../hooks/usePageMeta';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginWithGoogleCode } from '../api/endpoints';
import { getApiErrorMessage } from '../api/apiClient';

const AuthCallbackPage: React.FC = () => {
    const pageMeta = usePageMeta('register');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const hasProcessed = useRef(false);

    useEffect(() => {
        // 既に処理が実行済みであれば、何もせずに終了
        if (hasProcessed.current) {
            return;
        }
        // URLから 'code' クエリパラメータを取得
        const code = searchParams.get('code');
        const errorParam = searchParams.get('error');

        if (errorParam) {
            setError(`認証に失敗しました: ${errorParam}`);
            return;
        }

        if (code) {
            hasProcessed.current = true;
            const exchangeCodeForToken = async () => {
                try {
                    // 認証コードをバックエンドにPOSTして、アプリ独自のJWTを取得
                    const response = await loginWithGoogleCode(code);

                    // 取得したJWTでログイン処理を実行
                    login(response.access_token);

                    // メインページにリダイレクト
                    navigate('/app/dashboard', { replace: true });
                } catch (err) {
                    // バックエンドでの処理失敗
                    const errorMessage = getApiErrorMessage(err);
                    // エラーメッセージ付きでログインページに戻す
                    navigate('/login', { state: { error: errorMessage }, replace: true });
                }
            };

            exchangeCodeForToken();
        } else {
            // codeがURLにない場合はエラー
            navigate('/login', { state: { error: '認証情報が見つかりません。' }, replace: true });
        }

    }, [searchParams, login, navigate]);

    // エラーがあれば表示
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center p-8 bg-white rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">認証エラー</h1>
                    <p className="text-red-700">{error}</p>
                </div>
            </div>
        );
    }

    // 処理中はローディング表示
    return (
        <>
            {pageMeta}
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg animate-pulse">認証処理中...</p>
            </div>
        </>
    );
};

export default AuthCallbackPage;