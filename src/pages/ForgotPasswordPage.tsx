import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { requestPasswordReset } from '../api/endpoints';
import { getApiErrorMessage } from '../api/apiClient';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setIsSubmitting(true);
        try {
            const response = await requestPasswordReset({ email });
            setMessage(response.message);
        } catch (err) {
            setError(getApiErrorMessage(err));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800">パスワード再設定</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        ご登録のメールアドレスを入力してください。パスワード再設定用のリンクを送信します。
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}
                    {message && <div className="p-3 text-sm text-green-700 bg-green-100 rounded-lg">{message}</div>}

                    <div>
                        <label htmlFor="email" className="text-sm font-bold text-gray-600 block">メールアドレス</label>
                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-2 mt-1 border rounded-md" />
                    </div>

                    <div>
                        <button type="submit" disabled={isSubmitting} className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg disabled:opacity-50">
                            {isSubmitting ? '送信中...' : '再設定メールを送信'}
                        </button>
                    </div>
                </form>
                <div className="text-center">
                    <Link to="/login" className="text-sm text-blue-600 hover:underline">ログインページに戻る</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;