// src/components/admin/WordListItem.tsx

import React, { useState, ChangeEvent, KeyboardEvent, FocusEvent } from 'react';
import { Word } from '../../types/word';
import { updateWord, softDeleteWord } from '../../services/wordApi';
// TextareaAutosizeを使う場合はインポート
// import TextareaAutosize from 'react-textarea-autosize';
import TextareaAutosize from 'react-textarea-autosize';
import ConfirmationModal from '../common/ConfirmationModal';

interface WordListItemProps {
    word: Word;
    onWordUpdate: (updatedWord: Word) => void;
    onWordDelete: (deletedWordId: string, successMessage: string) => void;
    openErrorModal: (title: string, message: string) => void;
}

const WordListItem: React.FC<WordListItemProps> = ({ word, onWordUpdate, onWordDelete, openErrorModal }) => {
    // ... (useStateやhandleUpdateなどのロジック部分は変更なし)
    const [editingterm, setEditingterm] = useState(word.term);
    const [editingdefinition, setEditingdefinition] = useState(word.definition);
    const [isSaving, setIsSaving] = useState(false);
    // 確認モーダルの表示状態
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    // 削除APIを叩いている最中のフラグ
    const [isDeleting, setIsDeleting] = useState(false);

    const handleUpdate = async (field: 'term' | 'definition', value: string) => {
        if (isSaving) return;
        if ((field === 'term' && value === word.term) || (field === 'definition' && value === word.definition)) {
            return;
        }
        setIsSaving(true);
        try {
            const updatedWord = await updateWord(word.word_id, { [field]: value });
            onWordUpdate(updatedWord);
        } catch (error) {
            console.error(`Failed to update ${field}:`, error);
            if (field === 'term') setEditingterm(word.term);
            if (field === 'definition') setEditingdefinition(word.definition);
            let errorMessage = `単語の${field === 'term' ? '問題' : '答え'}の更新に失敗しました。`;
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            openErrorModal(`${field === 'term' ? '単語' : '意味'}の更新エラー`, errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    const handleBlur = (e: FocusEvent<HTMLTextAreaElement>, field: 'term' | 'definition') => {
        handleUpdate(field, e.target.value);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>, field: 'term' | 'definition') => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            handleUpdate(field, e.currentTarget.value);
            e.currentTarget.blur();
        }
    };

    // 削除ボタンが押されたら、モーダルを開くだけ
    const handleDeleteClick = () => {
        setIsConfirmModalOpen(true);
    };

    // モーダルで「実行」が押された時の処理
    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            await softDeleteWord(word.word_id);
            onWordDelete(word.word_id, `「${word.term}」を削除しました。`);
            // 削除成功時はモーダルを閉じる
            setIsConfirmModalOpen(false);
        } catch (error) {
            console.error('Failed to delete word:', error);
            // エラーが発生した場合、確認モーダルは閉じ、エラーモーダルを開く
            setIsConfirmModalOpen(false);
            let errorMessage = '単語の削除に失敗しました。';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            openErrorModal('削除エラー', errorMessage);
        } finally {
            setIsDeleting(false);
        }
    };

    // ★★★ ここからがレスポンシブ対応のJSX ★★★
    // スマホでは <li>、PCでは <tr> として振る舞う
    // Reactでは <li> と <tr> を動的に切り替えるのは少し複雑なので、
    // ここでは div で囲み、CSSで見た目を調整するアプローチを取ります。
    // 親コンポーネントが <table> や <ul> を使っている場合、それに合わせて調整が必要です。
    // ここでは親が <tbody> の中にこのコンポーネントを配置していると仮定し、
    // スマホではテーブルの構造をCSSで破壊してカード型に見せる方法を採ります。

    return (
        <>
            {/* ★ フラグメントで囲む */}
            <tr className={`
            border-b
            ${word.deletedAt ? 'bg-gray-200 text-gray-500' : ''}
            
            // スマホ用のスタイル (デフォルト)
            flex flex-col p-4 mb-4 border rounded-lg shadow-sm
            
            // PC用のスタイル (md:プレフィックス)
            md:table-row md:p-0 md:mb-0 md:border-none md:shadow-none
            ${!word.deletedAt && 'md:hover:bg-gray-50'}
        `}>
                {/* PCでは<td>, スマホでは<div>のように振る舞う */}
                <td className="p-2 md:py-3 md:px-4" data-label="問題">
                    {/* スマホ用のラベル */}
                    <span className="font-bold md:hidden">問題: </span>
                    <TextareaAutosize
                        value={editingterm}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setEditingterm(e.target.value)}
                        onBlur={(e) => handleBlur(e, 'term')}
                        onKeyDown={(e) => handleKeyDown(e, 'term')}
                        className={`w-full mt-1 p-2 border rounded resize-y ${word.deletedAt ? 'bg-gray-200 cursor-not-allowed' : 'focus:ring-blue-500 focus:border-blue-500'}`}
                        disabled={!!word.deletedAt || isSaving}
                        rows={2}
                    />
                </td>
                <td className="p-2 md:py-3 md:px-4" data-label="答え">
                    {/* スマホ用のラベル */}
                    <span className="font-bold md:hidden">答え: </span>
                    <TextareaAutosize
                        value={editingdefinition}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setEditingdefinition(e.target.value)}
                        onBlur={(e) => handleBlur(e, 'definition')}
                        onKeyDown={(e) => handleKeyDown(e, 'definition')}
                        className={`w-full mt-1 p-2 border rounded resize-y ${word.deletedAt ? 'bg-gray-200 cursor-not-allowed' : 'focus:ring-blue-500 focus:border-blue-500'}`}
                        disabled={!!word.deletedAt || isSaving}
                        rows={2}
                    />
                </td>
                <td className="p-2 md:py-3 md:px-4 text-center">
                    <button
                        onClick={handleDeleteClick}
                        className={`
                        w-full mt-4 md:w-auto md:mt-0 px-4 py-2 text-sm rounded transition-colors
                        ${word.deletedAt
                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                : 'bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2'
                            }`}
                        disabled={!!word.deletedAt || isSaving}
                    >
                        削除
                    </button>
                </td>
            </tr>
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="削除の確認"
                message={
                    <p>本当に「<span className="font-bold">{word.term}</span>」を削除しますか？<br />この操作は元に戻せません。</p>
                }
                confirmButtonText="削除する"
                isConfirming={isDeleting}
            />
        </>
    );
};

export default WordListItem;