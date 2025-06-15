// src/components/admin/WordListItem.tsx

import React, { useState, ChangeEvent } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { Word } from '../../types/word';
import { UpdateWordPayload } from '../../types/wordApiPayloads';
import { updateWord, deleteWord } from '../../api/endpoints';
import { getApiErrorMessage } from '../../api/apiClient';
import ConfirmationModal from '../common/ConfirmationModal';

interface WordListItemProps {
    word: Word;
    onWordUpdate: (updatedWord: Word, successMessage: string) => void;
    onWordDelete: (deletedWordId: string, successMessage: string) => void;
    openErrorModal: (title: string, message: string) => void;
}

const WordListItem: React.FC<WordListItemProps> = ({ word, onWordUpdate, onWordDelete, openErrorModal }) => {
    // --- State管理 ---
    const [editingTerm, setEditingTerm] = useState(word.term);
    const [editingDefinition, setEditingDefinition] = useState(word.definition);

    // 更新処理中かどうかのフラグ
    const [isUpdating, setIsUpdating] = useState(false);
    // 削除処理中かどうかのフラグ
    const [isDeleting, setIsDeleting] = useState(false);

    // 確認モーダルの表示状態
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    // モーダルが「削除用」か「更新用」かを判定するフラグ
    const [isDeleteMode, setIsDeleteMode] = useState(false);

    const [isTermExpanded, setIsTermExpanded] = useState(false);
    const [isDefinitionExpanded, setIsDefinitionExpanded] = useState(false);

    // 変更があったかどうか
    const hasChanges = word.term !== editingTerm || word.definition !== editingDefinition;

    // --- ハンドラ関数 ---

    // 「更新」ボタンが押されたとき
    const handleUpdateClick = () => {
        if (!hasChanges) return;
        setIsDeleteMode(false); // 更新モードに設定
        setIsConfirmOpen(true);
    };

    // 「削除」ボタンが押されたとき
    const handleDeleteClick = () => {
        setIsDeleteMode(true); // 削除モードに設定
        setIsConfirmOpen(true);
    };

    // モーダルで「更新する」が押されたとき
    const handleConfirmUpdate = async () => {
        if (!hasChanges) return;

        setIsUpdating(true); // 更新処理中フラグを立てる
        const payload: UpdateWordPayload = {};
        if (word.term !== editingTerm) {
            payload.term = editingTerm;
        }
        if (word.definition !== editingDefinition) {
            payload.definition = editingDefinition;
        }

        try {
            const updatedWord = await updateWord(word.word_id, payload);
            onWordUpdate(updatedWord, `「${updatedWord.term}」を更新しました。`);
        } catch (error) {
            setEditingTerm(word.term); // エラー時は元の値に戻す
            setEditingDefinition(word.definition);
            const errorMessage = getApiErrorMessage(error);
            openErrorModal('更新エラー', errorMessage);
        } finally {
            // 処理が成功しても失敗しても、必ず実行
            setIsConfirmOpen(false);
            setIsUpdating(false); // 更新処理中フラグを解除
        }
    };

    // モーダルで「削除する」が押されたとき
    const handleConfirmDelete = async () => {
        setIsDeleting(true); // 削除処理中フラグを立てる
        try {
            await deleteWord(word.word_id);
            onWordDelete(word.word_id, `「${word.term}」を削除しました。`);
        } catch (error) {
            const errorMessage = getApiErrorMessage(error);
            openErrorModal('削除エラー', errorMessage);
        } finally {
            // 処理が成功しても失敗しても、必ず実行
            setIsConfirmOpen(false);
            setIsDeleting(false); // 削除処理中フラグを解除
        }
    };

    // モーダルが閉じられたとき
    const handleModalClose = () => {
        setIsConfirmOpen(false);
    }

    return (
        <>
            <ConfirmationModal
                isOpen={isConfirmOpen}
                onClose={handleModalClose}
                onConfirm={isDeleteMode ? handleConfirmDelete : handleConfirmUpdate}
                title={isDeleteMode ? "削除の確認" : "更新の確認"}
                message={
                    isDeleteMode ? (
                        <p>本当に「<span className="font-bold">{word.term}</span>」を削除しますか？</p>
                    ) : (
                        <p>内容を更新してもよろしいですか？</p>
                    )
                }
                confirmButtonText={isDeleteMode ? "削除する" : "更新する"}
                isConfirming={isUpdating || isDeleting}
            />

            <tr className={`
                border-b md:border-b-0
                ${word.deletedAt ? 'bg-gray-200 text-gray-500' : ''}
                block p-4 mb-4 border rounded-lg shadow-sm
                md:table-row md:p-0 md:mb-0 md:border-b md:shadow-none md:rounded-none
                ${!word.deletedAt && 'md:hover:bg-gray-50'}
            `}>
                <td className="block md:table-cell p-2 md:py-3 md:px-4" data-label="単語">
                    <span className="font-bold text-sm text-gray-600 md:hidden">単語</span>
                    <div>
                        <TextareaAutosize
                            value={editingTerm}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setEditingTerm(e.target.value)}
                            className={`w-full mt-1 p-2 border rounded resize-none focus:ring-blue-500 focus:border-blue-500`}
                            disabled={!!word.deletedAt || isUpdating || isDeleting}
                            minRows={1}
                            maxRows={isTermExpanded ? 10 : 1}
                        />
                        {editingTerm.length > 50 && (
                            <button
                                onClick={() => setIsTermExpanded(!isTermExpanded)}
                                className="text-xs px-2 py-1 mt-1 rounded-md transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                            >
                                {isTermExpanded ? '折りたたむ' : 'すべて表示'}
                            </button>
                        )}
                    </div>
                </td>
                <td className="block md:table-cell p-2 md:py-3 md:px-4" data-label="意味">
                    <span className="font-bold text-sm text-gray-600 md:hidden">意味</span>
                    <div>
                        <TextareaAutosize
                            value={editingDefinition}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setEditingDefinition(e.target.value)}
                            className={`w-full mt-1 p-2 border rounded resize-none focus:ring-blue-500 focus:border-blue-500`}
                            disabled={!!word.deletedAt || isUpdating || isDeleting}
                            minRows={1}
                            maxRows={isDefinitionExpanded ? 10 : 1}
                        />
                        {editingDefinition.length > 50 && (
                            <button
                                onClick={() => setIsDefinitionExpanded(!isDefinitionExpanded)}
                                className="text-xs px-2 py-1 mt-1 rounded-md transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                            >
                                {isDefinitionExpanded ? '折りたたむ' : 'すべて表示'}
                            </button>
                        )}
                    </div>
                </td>
                <td className="block md:table-cell p-2 md:py-3 md:px-4 text-center">
                    <div className="flex flex-col md:flex-row md:items-center justify-center gap-2">
                        <button
                            onClick={handleUpdateClick}
                            className={`w-full md:w-auto px-4 py-2 text-sm rounded transition-colors ${hasChanges && !word.deletedAt
                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            disabled={!hasChanges || !!word.deletedAt || isUpdating || isDeleting}
                        >
                            更新
                        </button>
                        <button
                            onClick={handleDeleteClick}
                            className={`w-full md:w-auto px-4 py-2 text-sm rounded transition-colors ${word.deletedAt
                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                : 'bg-red-500 text-white hover:bg-red-600'
                                }`}
                            disabled={!!word.deletedAt || isUpdating || isDeleting}
                        >
                            削除
                        </button>
                    </div>
                </td>
            </tr>
        </>
    );
};

export default WordListItem;