// src/pages/AdminPage.tsx

import React, { useEffect, useState, useMemo } from 'react';
import { Word } from '../types/word';
import { getWords, createWord } from '../services/wordApi';
import WordListItem from '../components/admin/WordListItem';
import NewWordForm from '../components/admin/NewWordForm';
import ErrorModal from '../components/common/ErrorModal';
import SuccessToast from '../components/common/SuccessToast';

const AdminPage: React.FC = () => {
    // --- State管理 ---
    const [words, setWords] = useState<Word[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isCreating, setIsCreating] = useState<boolean>(false);

    const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
    const [modalErrorTitle, setModalErrorTitle] = useState<string>('');
    const [modalErrorMessage, setModalErrorMessage] = useState<string | null>(null);

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Word; direction: 'asc' | 'desc' } | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');

    // --- エフェクトフック ---
    useEffect(() => {
        fetchWords();
    }, []);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    // --- データ操作・ハンドラ関数 ---
    const openErrorModal = (title: string, message: string) => {
        setModalErrorTitle(title);
        setModalErrorMessage(message);
        setIsErrorModalOpen(true);
    };

    const closeErrorModal = () => {
        setIsErrorModalOpen(false);
    };

    const fetchWords = async () => {
        setIsLoading(true);
        try {
            const data = await getWords();
            setWords(data);
            if (isErrorModalOpen) closeErrorModal();
        } catch (err) {
            console.error('Failed to fetch words:', err);
            let errorMessage = '単語の読み込みに失敗しました。';
            if (err instanceof Error) errorMessage = err.message;
            openErrorModal('読込エラー', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // ★ handleWordUpdate で成功メッセージを受け取るように修正
    const handleWordUpdate = (updatedWord: Word, successMessage: string) => {
        setWords(prevWords =>
            prevWords.map(w => (w.word_id === updatedWord.word_id ? updatedWord : w))
        );
        setSuccessMessage(successMessage);
    };

    const handleWordDelete = (deletedWordId: string, successMessage: string) => {
        setWords(prevWords => prevWords.filter(w => w.word_id !== deletedWordId));
        setSuccessMessage(successMessage);
    };

    const handleCreateWord = async (term: string, definition: string) => {
        try {
            const newWordData = { term, definition };
            const createdWord = await createWord(newWordData);
            setWords(prevWords => [createdWord, ...prevWords]);
            if (isErrorModalOpen) closeErrorModal();
            setSuccessMessage(`「${term}」を登録しました。`);
        } catch (err) {
            console.error('Failed to create word:', err);
            let errorMessage = '新しい単語の登録に失敗しました。';
            if (err instanceof Error) errorMessage = err.message;
            openErrorModal('登録エラー', errorMessage);
            if (err instanceof Error) throw err;
            else throw new Error(errorMessage);
        }
    };

    const requestSort = (key: keyof Word) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // --- 表示用データの計算 (useMemo) ---
    const filteredAndSortedWords = useMemo(() => {
        let processedWords = [...words];

        if (searchTerm.trim() !== '') {
            const lowercasedFilter = searchTerm.toLowerCase();
            processedWords = processedWords.filter(word =>
                word.term.toLowerCase().includes(lowercasedFilter) ||
                word.definition.toLowerCase().includes(lowercasedFilter)
            );
        }

        if (sortConfig !== null) {
            const currentSortConfig = sortConfig;
            processedWords.sort((a, b) => {
                const valA = a[currentSortConfig.key] || '';
                const valB = b[currentSortConfig.key] || '';
                if (valA < valB) return currentSortConfig.direction === 'asc' ? -1 : 1;
                if (valA > valB) return currentSortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return processedWords;
    }, [words, searchTerm, sortConfig]);


    return (
        <div className="container mx-auto p-4">
            {/* --- 通知・モーダルエリア --- */}
            <SuccessToast
                message={successMessage}
                onClose={() => setSuccessMessage(null)}
            />
            <ErrorModal
                isOpen={isErrorModalOpen}
                onClose={closeErrorModal}
                title={modalErrorTitle}
                message={modalErrorMessage}
            />

            <h1 className="text-2xl font-bold mb-6">単語管理</h1>

            {/* --- 1. 新規登録エリア --- */}
            <div className="mb-6">
                <div className="flex justify-end">
                    <button
                        onClick={() => setIsFormVisible(!isFormVisible)}
                        className={`px-4 py-2 text-white rounded-lg shadow transition-colors ${isFormVisible
                            ? 'bg-gray-500 hover:bg-gray-600'
                            : 'bg-green-500 hover:bg-green-600'
                            }`}
                    >
                        {isFormVisible ? '登録フォームを閉じる' : '新しい単語を登録する'}
                    </button>
                </div>

                <div className={`grid transition-all duration-500 ease-in-out ${isFormVisible ? 'grid-rows-[1fr] mt-4' : 'grid-rows-[0fr]'
                    }`}>
                    <div className="overflow-hidden">
                        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border">
                            <table>
                                <tbody>
                                    <NewWordForm
                                        onWordCreate={handleCreateWord}
                                        isCreating={isCreating}
                                        setIsCreating={setIsCreating}
                                    />
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- 2. 一覧表示エリア --- */}
            <div>
                <div className="mb-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">登録済み単語一覧</h2>
                    <button
                        onClick={fetchWords}
                        disabled={isLoading}
                        className={`px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? '更新中...' : '再読み込み'}
                    </button>
                </div>

                <div className="mb-4">
                    <div className="relative w-full md:w-1/2 lg:w-1/3">
                        <input
                            type="text"
                            placeholder="単語や意味で検索..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <div className="absolute top-0 left-0 inline-flex items-center justify-center h-full w-10 text-gray-400">
                            <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-100">
                            <tr className="hidden md:table-row">
                                <th
                                    className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5 cursor-pointer hover:bg-gray-200"
                                    onClick={() => requestSort('term')}
                                >
                                    単語 {sortConfig?.key === 'term' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                                </th>
                                <th
                                    className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5 cursor-pointer hover:bg-gray-200"
                                    onClick={() => requestSort('definition')}
                                >
                                    意味 {sortConfig?.key === 'definition' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                                </th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    操作
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 md:divide-y-0">
                            {!isLoading && filteredAndSortedWords.map((word) => (
                                <WordListItem
                                    key={word.word_id}
                                    word={word}
                                    onWordUpdate={handleWordUpdate}
                                    onWordDelete={handleWordDelete}
                                    openErrorModal={openErrorModal}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>

                {isLoading && (
                    <div className="text-center py-4 text-gray-500">データを読み込み中...</div>
                )}
                {!isLoading && filteredAndSortedWords.length === 0 && !isErrorModalOpen && (
                    <p className="text-center py-10">該当する単語はありません。</p>
                )}
            </div>
        </div>
    );
};

export default AdminPage;