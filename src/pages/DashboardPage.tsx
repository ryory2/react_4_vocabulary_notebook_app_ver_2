import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getReviewSummary } from '../api/endpoints';
import { getApiErrorMessage } from '../api/apiClient';
import { ReviewSummary } from '../types/review';

const DashboardPage: React.FC = () => {
    // ユーザー情報を取得 (AuthContextを拡張してユーザー名を保持する場合)
    // const { user } = useAuth(); 

    const [summary, setSummary] = useState<ReviewSummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await getReviewSummary();
                setSummary(data);
            } catch (err) {
                setError(getApiErrorMessage(err));
            } finally {
                setIsLoading(false);
            }
        };
        fetchSummary();
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return <p className="text-lg animate-pulse">データを読み込んでいます...</p>;
        }
        if (error) {
            return <p className="text-lg text-red-500">{error}</p>;
        }
        if (summary) {
            return (
                <>
                    <p className="text-xl text-gray-700 mb-6">
                        本日レビューする単語は <span className="font-bold text-3xl text-blue-600">{summary.review_count}</span> 個です。
                    </p>
                    {summary.review_count > 0 ? (
                        <Link to="/app/flashcards" className="bg-green-500 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-600 transition-colors shadow-lg">
                            復習を始める
                        </Link>
                    ) : (
                        <p className="text-lg text-green-600">本日の復習は完了です！</p>
                    )}
                </>
            );
        }
        return null;
    };

    return (
        <div className="p-4 sm:p-6 md:p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
                {/* こんにちは、{user?.name || 'ゲスト'}さん！ */}
                こんにちは！
            </h1>

            <div className="bg-white p-8 rounded-lg shadow-md text-center mb-8">
                {renderContent()}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link to="/app/flashcards" className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                    <h2 className="text-xl font-bold mb-2">フラッシュカード</h2>
                    <p className="text-gray-600">復習セッションを開始して、記憶を定着させましょう。</p>
                </Link>
                <Link to="/app/admin" className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                    <h2 className="text-xl font-bold mb-2">単語の管理</h2>
                    <p className="text-gray-600">新しい単語を追加したり、既存の単語を編集・削除します。</p>
                </Link>
            </div>
        </div>
    );
};

export default DashboardPage;