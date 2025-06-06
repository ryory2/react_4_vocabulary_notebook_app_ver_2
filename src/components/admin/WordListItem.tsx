import React, { useState, ChangeEvent } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { Word } from '../../types/word';
import { updateWord, softDeleteWord } from '../../services/wordApi';
import ConfirmationModal from '../common/ConfirmationModal';

interface WordListItemProps {
    word: Word;
    onWordUpdate: (updatedWord: Word, successMessage: string) => void;
    onWordDelete: (deletedWordId: string, successMessage: string) => void;
    openErrorModal: (title: string, message: string) => void;
}

const WordListItem: React.FC<WordListItemProps> = ({ word, onWordUpdate, onWordDelete, openErrorModal }) => {
    // --- State管理 ---
    const [editingterm, setEditingterm] = useState(word.term);
    const [editingdefinition, setEditingdefinition] = useState(word.definition);

    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [isUpdateConfirmOpen, setIsUpdateConfirmOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    const [updatePayload, setUpdatePayload] = useState<{ field: 'term' | 'definition'; value: string } | null>(null);

    const [isTermExpanded, setIsTermExpanded] = useState(false);
    const [isDefinitionExpanded, setIsDefinitionExpanded] = useState(false);

    const hasChanges = word.term !== editingterm || word.definition !== editingdefinition;

    // --- ハンドラ関数 ---

    const handleUpdateClick = () => {
        if (!hasChanges) return;

        let payload: { field: 'term' | 'definition'; value: string } | null = null;
        if (word.term !== editingterm) {
            payload = { field: 'term', value: editingterm };
        } else if (word.definition !== editingdefinition) {
            payload = { field: 'definition', value: editingdefinition };
        }

        if (payload) {
            setUpdatePayload(payload);
            setIsUpdateConfirmOpen(true);
        }
    };

    const handleConfirmUpdate = async () => {
        if (!updatePayload) return;

        setIsUpdating(true);
        try {
            const updatedWord = await updateWord(word.word_id, { [updatePayload.field]: updatePayload.value });
            onWordUpdate(updatedWord, `「${updatedWord.term}」を更新しました。`);
            setIsUpdateConfirmOpen(false);
            setUpdatePayload(null);
        } catch (error) {
            setIsUpdateConfirmOpen(false);
            console.error(`Failed to update ${updatePayload.field}:`, error);
            if (updatePayload.field === 'term') setEditingterm(word.term);
            if (updatePayload.field === 'definition') setEditingdefinition(word.definition);

            let errorMessage = `更新に失敗しました。`;
            if (error instanceof Error) errorMessage = error.message;
            openErrorModal(`更新エラー`, errorMessage);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteClick = () => {
        setIsDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            await softDeleteWord(word.word_id);
            onWordDelete(word.word_id, `「${word.term}」を削除しました。`);
            setIsDeleteConfirmOpen(false);
        } catch (error) {
            setIsDeleteConfirmOpen(false);
            console.error('Failed to delete word:', error);
            let errorMessage = '単語の削除に失敗しました。';
            if (error instanceof Error) errorMessage = error.message;
            openErrorModal('削除エラー', errorMessage);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
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
                            value={editingterm}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setEditingterm(e.target.value)}
                            className={`w-full mt-1 p-2 border rounded resize-none focus:ring-blue-500 focus:border-blue-500`}
                            disabled={!!word.deletedAt || isUpdating || isDeleting}
                            minRows={1}
                            maxRows={isTermExpanded ? 10 : 1}
                        />
                        {editingterm.includes('\n') && (
                            <button
                                onClick={() => setIsTermExpanded(!isTermExpanded)}
                                className="text-xs px-2 py-1 mt-1 rounded-md transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                            >
                                {isTermExpanded ? '閉じる' : 'すべて表示'}
                            </button>
                        )}
                    </div>
                </td>
                <td className="block md:table-cell p-2 md:py-3 md:px-4" data-label="意味">
                    <span className="font-bold text-sm text-gray-600 md:hidden">意味</span>
                    <div>
                        <TextareaAutosize
                            value={editingdefinition}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setEditingdefinition(e.target.value)}
                            className={`w-full mt-1 p-2 border rounded resize-none focus:ring-blue-500 focus:border-blue-500`}
                            disabled={!!word.deletedAt || isUpdating || isDeleting}
                            minRows={1}
                            maxRows={isDefinitionExpanded ? 10 : 1}
                        />
                        {editingdefinition.includes('\n') && (
                            <button
                                onClick={() => setIsDefinitionExpanded(!isDefinitionExpanded)}
                                className="text-xs px-2 py-1 mt-1 rounded-md transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                            >
                                {isDefinitionExpanded ? '閉じる' : 'すべて表示'}
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

            <ConfirmationModal
                isOpen={isUpdateConfirmOpen}
                onClose={() => setIsUpdateConfirmOpen(false)}
                onConfirm={handleConfirmUpdate}
                title="更新の確認"
                message={<p>内容を更新してもよろしいですか？</p>}
                confirmButtonText="更新する"
                isConfirming={isUpdating}
            />

            <ConfirmationModal
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="削除の確認"
                message={<p>本当に「<span className="font-bold">{word.term}</span>」を削除しますか？</p>}
                confirmButtonText="削除する"
                isConfirming={isDeleting}
            />
        </>
    );
};

export default WordListItem;