// src/pages/AdminPage.tsx
import React, { useEffect, useState } from 'react';
import { Word } from '../types/word';
import { getWords, createWord } from '../services/wordApi';
import WordListItem from '../components/admin/WordListItem';
import NewWordForm from '../components/admin/NewWordForm';

const AdminPage: React.FC = () => {
    const [words, setWords] = useState<Word[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    // const [filterDeleted, setFilterDeleted] = useState<boolean>(false);
    const [isCreating, setIsCreating] = useState<boolean>(false);

    // レンダリング完了後、一度だけ呼び出される
    useEffect(() => {
        fetchWords();
    }, []);

    const fetchWords = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getWords();
            setWords(data);
        } catch (err) {
            console.error('Failed to fetch words:', err);
            setError('単語の読み込みに失敗しました。');
        } finally {
            setIsLoading(false);
        }
    };

    const handleWordUpdate = (updatedWord: Word) => {
        setWords(prevWords =>
            prevWords.map(w => (w.word_id === updatedWord.word_id ? updatedWord : w))
        );
    };

    // const handleWordDelete = (deletedWordId: number) => { // 引数を受け取るように修正
    const handleWordDelete = () => { // 引数を受け取るように修正
        fetchWords();
    };

    const handleCreateWord = async (term: string, definition: string) => {
        try {
            const newWordData = { term, definition };
            const createdWord = await createWord(newWordData);
            setWords(prevWords => [createdWord, ...prevWords]);
            if (error) setError(null); // 登録成功したらエラーメッセージを消す
        } catch (err) {
            console.error('Failed to create word:', err);
            setError('新しい単語の登録に失敗しました。');
            throw err;
        }
    };

    // const filteredWords = filterDeleted ? words.filter(word => !word.deletedAt) : words;

    // ▼▼▼ 変更点1: 全画面ローディング/エラーの早期リターンを削除 ▼▼▼
    // if (isLoading && words.length === 0) {
    //     return <div className="text-center py-10">読み込み中...</div>;
    // }
    // if (error && words.length === 0) {
    //     return <div className="text-center py-10 text-red-500">{error}</div>;
    // }
    // ▲▲▲ 変更点1 ▲▲▲

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">単語管理</h1>

            <div className="mb-4 flex justify-between items-center">
                <button
                    onClick={fetchWords}
                    disabled={isLoading}
                    className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {/* isLoadingのみで判定するように変更 */}
                    {isLoading ? '更新中...' : '再読み込み'}
                </button>
                {/* <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={filterDeleted}
                        onChange={() => setFilterDeleted(!filterDeleted)}
                        className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    削除済みを隠す
                </label> */}
            </div>

            {/* ▼▼▼ 変更点2: エラーメッセージの表示位置 ▼▼▼ */}
            {error && <div className="mb-4 text-red-500 bg-red-100 border border-red-400 p-3 rounded text-center">{error}</div>}
            {/* ▲▲▲ 変更点2 ▲▲▲ */}

            {/* ▼▼▼ 変更点3: テーブル表示の構造と条件分岐 ▼▼▼ */}
            <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">単語</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">意味</th>
                            {/* <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">削除日</th> */}
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {/* NewWordForm は常に表示 */}
                        <NewWordForm
                            onWordCreate={handleCreateWord}
                            isCreating={isCreating}
                            setIsCreating={setIsCreating}
                        />
                        {/* ローディング中でなく、エラーもない場合に既存単語リストを表示 */}
                        {!isLoading && !error && words.map((word) => (
                            <WordListItem
                                key={word.word_id}
                                word={word}
                                onWordUpdate={handleWordUpdate}
                                onWordDelete={handleWordDelete}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
            {/* ▲▲▲ 変更点3 ▲▲▲ */}

            {/* ▼▼▼ 変更点4: ローディング中やデータなしのメッセージ表示位置 ▼▼▼ */}
            {isLoading && (
                <div className="text-center py-4 text-gray-500">データを読み込み中...</div>
            )}
            {!isLoading && !error && words.length === 0 && (
                <p className="text-center py-10">登録されている単語はありません。新規登録フォームから追加してください。</p>
            )}
            {/* ▲▲▲ 変更点4 ▲▲▲ */}
        </div>
    );
};

export default AdminPage;