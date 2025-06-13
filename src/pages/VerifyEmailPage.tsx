import React, { useEffect, useState } from 'react';
import { usePageMeta } from '../hooks/usePageMeta';
import { Link, useSearchParams } from 'react-router-dom';
import { verifyAccount } from '../api/endpoints';
import { getApiErrorMessage } from '../api/apiClient';

const VerifyEmailPage: React.FC = () => {
    const pageMeta = usePageMeta('verifyEmail');
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [message, setMessage] = useState('アカウントを認証しています...');

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            setStatus('error');
            setMessage('有効化トークンが見つかりません。');
            return;
        }

        const verify = async () => {
            try {
                const response = await verifyAccount(token);
                setStatus('success');
                setMessage(response.message);
            } catch (err) {
                const errorMessage = getApiErrorMessage(err);
                setMessage(errorMessage || 'アカウントの有効化に失敗しました。');
            }
        };

        verify();
    }, [searchParams]);

    return (
        <>
            {pageMeta}
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 text-center bg-white rounded-lg shadow-md">
                    {status === 'verifying' && <p className="text-lg animate-pulse">{message}</p>}
                    {status === 'success' && (
                        <>
                            <h1 className="text-2xl font-bold text-green-600 mb-4">認証完了！</h1>
                            <p className="text-gray-700 mb-6">{message}</p>
                            <Link to="/login" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">
                                ログインページへ
                            </Link>
                        </>
                    )}
                    {status === 'error' && (
                        <>
                            <h1 className="text-2xl font-bold text-red-600 mb-4">認証エラー</h1>
                            <p className="text-gray-700 mb-6">{message}</p>
                            <Link to="/register" className="text-sm text-blue-600 hover:underline">
                                もう一度登録を試す
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default VerifyEmailPage;