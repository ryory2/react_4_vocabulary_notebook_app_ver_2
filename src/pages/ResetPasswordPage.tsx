import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../api/endpoints';
import { getApiErrorMessage } from '../api/apiClient';

const ResetPasswordPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [token, setToken] = useState<string | null>(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const tokenFromUrl = searchParams.get('token');
        if (!tokenFromUrl) {
            setError('無効なページです。リンクを確認してください。');
        }
        setToken(tokenFromUrl);
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!token) return;
        if (password !== confirmPassword) {
            setError('パスワードが一致しません。');
            return;
        }
        setError(null);
        setIsSubmitting(true);
        try {
            await resetPassword({ token, password });
            navigate('/login', { state: { message: 'パスワードが正常に更新されました。新しいパスワードでログインしてください。' } });
        } catch (err) {
            setError(getApiErrorMessage(err));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!token && !error) {
        return <div>読み込み中...</div>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-center">新しいパスワードの設定</h1>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}

                    <div>
                        <label htmlFor="password" className="text-sm font-bold text-gray-600 block">新しいパスワード</label>
                        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-2 mt-1 border rounded-md" />
                    </div>
                    <div>
                        <label htmlFor="confirm-password" className="text-sm font-bold text-gray-600 block">新しいパスワード (確認用)</label>
                        <input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full p-2 mt-1 border rounded-md" />
                    </div>

                    <div>
                        <button type="submit" disabled={isSubmitting || !token} className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg disabled:opacity-50">
                            {isSubmitting ? '更新中...' : 'パスワードを更新'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;