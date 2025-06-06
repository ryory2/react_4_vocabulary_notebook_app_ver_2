// src/pages/AdminPage.tsx
import React, { useEffect, useState } from 'react';
import { Word } from '../types/word';
import { getWords, createWord } from '../services/wordApi';
import WordListItem from '../components/admin/WordListItem';
import NewWordForm from '../components/admin/NewWordForm';
import ErrorModal from '../components/common/ErrorModal';
import SuccessToast from '../components/common/SuccessToast';

const AdminPage: React.FC = () => {
    const [words, setWords] = useState<Word[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    // const [error, setError] = useState<string | null>(null);
    // const [filterDeleted, setFilterDeleted] = useState<boolean>(false);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
    const [modalErrorTitle, setModalErrorTitle] = useState<string>('');
    const [modalErrorMessage, setModalErrorMessage] = useState<string | null>(null);
    // 成功時のトースト
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    // フォームの表示状態を管理するState
    const [isFormVisible, setIsFormVisible] = useState<boolean>(false);

    const openErrorModal = (title: string, message: string) => {
        setModalErrorTitle(title);
        setModalErrorMessage(message);
        setIsErrorModalOpen(true);
    };

    const closeErrorModal = () => {
        setIsErrorModalOpen(false);
        // オプション: モーダルを閉じたらメッセージもクリア
        // setModalErrorMessage(null);
        // setModalErrorTitle('');
    };
    // レンダリング完了後、一度だけ呼び出される
    useEffect(() => {
        fetchWords();
    }, []);

    // ★ successMessageが変更されたらタイマーをセットするuseEffectを追加
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null); // 3秒後にメッセージをクリア
            }, 3000); // 3000ミリ秒 = 3秒

            // コンポーネントがアンマウントされる時にタイマーをクリアするクリーンアップ関数
            return () => clearTimeout(timer);
        }
    }, [successMessage]); // 依存配列にsuccessMessageを指定

    const fetchWords = async () => {
        setIsLoading(true);
        // setError(null); // ★コメントアウトまたは削除検討
        try {
            const data = await getWords();
            setWords(data);
            if (isErrorModalOpen) closeErrorModal(); // ★成功したら既存のエラーモーダルを閉じる
        } catch (err) { // any型または適切なエラー型を指定
            console.error('Failed to fetch words:', err);
            let errorMessage = '単語の読み込みに失敗しました。';
            if (err instanceof Error) { // ★ Error 型か確認
                errorMessage = err.message; // wordApiからスローされたメッセージを利用
            }
            openErrorModal('読込エラー', errorMessage);
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
    const handleWordDelete = (deletedWordId: string, successMessage: string) => {
        // 1. 画面上のリストから削除された単語を即座に取り除く
        setWords(prevWords => prevWords.filter(w => w.word_id !== deletedWordId));

        // 2. 成功メッセージのトーストを表示する
        setSuccessMessage(successMessage);
    };


    const handleCreateWord = async (term: string, definition: string) => {
        try {
            const newWordData = { term, definition };
            const createdWord = await createWord(newWordData);
            setWords(prevWords => [createdWord, ...prevWords]);
            // if (error) setError(null); // ★コメントアウトまたは削除検討
            if (isErrorModalOpen) closeErrorModal(); // ★成功したら既存のエラーモーダルを閉じる
            setSuccessMessage(`「${term}」を登録しました。`);
            setIsFormVisible(false);
        } catch (err) { // ★型指定を削除 (unknownとして扱われる)
            console.error('Failed to create word:', err);
            let errorMessage = '新しい単語の登録に失敗しました。';
            if (err instanceof Error) { // ★ Error 型か確認
                errorMessage = err.message; // wordApiからスローされたメッセージを利用
            }
            openErrorModal('登録エラー', errorMessage);

            // NewWordForm側で isCreating をリセットするなどのためにエラーを再スローする場合
            if (err instanceof Error) { // ★ Errorインスタンスならそのままスロー
                throw err;
            } else {
                // もし Error インスタンスでなければ、メッセージを元に新しいErrorとしてスロー
                throw new Error(errorMessage);
            }
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
            <SuccessToast
                message={successMessage}
                onClose={() => setSuccessMessage(null)} // 閉じるボタンで即座に消せるように
            />
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
                {!isFormVisible && (
                    <button
                        onClick={() => setIsFormVisible(true)}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    >
                        新しい単語を登録する
                    </button>
                )}
            </div>

            {/* ▼▼▼ 変更点2: エラーメッセージの表示位置 ▼▼▼ */}
            {/* 既存のテキストエラー表示はモーダルで代替するためコメントアウトまたは削除 */}
            {/* {error && !isErrorModalOpen && <div className="mb-4 text-red-500 bg-red-100 border border-red-400 p-3 rounded text-center">{error}</div>} */}

            {/* ... (テーブルなどの他のJSX) ... */}

            {/* ★エラーモーダルコンポーネントをレンダリング (returnの最後の方、メインコンテンツの後が良い) */}
            <ErrorModal
                isOpen={isErrorModalOpen}
                onClose={closeErrorModal}
                title={modalErrorTitle}
                message={modalErrorMessage}
            />
            {/* ▲▲▲ 変更点2 ▲▲▲ */}

            {/* ▼▼▼ 変更点3: テーブル表示の構造と条件分岐 ▼▼▼ */}
            <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        {/* ★ 変更点: スマホでは非表示にする */}
                        <tr className="hidden md:table-row">
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">単語</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">意味</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                        </tr>
                    </thead>
                    {/* ★ 変更点: スマホでのレイアウトを考慮したスタイルを追加 */}
                    <tbody className="divide-y divide-gray-200 md:divide-y-0">
                        {isFormVisible && (
                            <NewWordForm
                                onWordCreate={handleCreateWord}
                                isCreating={isCreating}
                                setIsCreating={setIsCreating}
                                onClose={() => setIsFormVisible(false)} // ★ onCloseプロパティを渡す
                            />
                        )}
                        {!isLoading && words.map((word) => (
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
            {/* ▲▲▲ 変更点3 ▲▲▲ */}

            {/* ▼▼▼ 変更点4: ローディング中やデータなしのメッセージ表示位置 ▼▼▼ */}
            {isLoading && (
                <div className="text-center py-4 text-gray-500">データを読み込み中...</div>
            )}
            {/* エラーはモーダルで表示されるので、ここではisLoadingとwords.lengthのみで判断 */}
            {!isLoading && words.length === 0 && !isErrorModalOpen && ( // ★モーダルが開いていない時のみ表示
                <p className="text-center py-10">登録されている単語はありません。新規登録フォームから追加してください。</p>
            )}
            {/* ▲▲▲ 変更点4 ▲▲▲ */}
        </div>
    );
};

export default AdminPage;