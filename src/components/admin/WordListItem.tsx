// src/components/admin/WordListItem.tsx
import React, { useState, ChangeEvent, KeyboardEvent, FocusEvent } from 'react';
import { Word } from '../../types/word';
import { updateWord, softDeleteWord } from '../../services/wordApi';

interface WordListItemProps {
    word: Word;
    onWordUpdate: (updatedWord: Word) => void; // 親コンポーネントに更新を通知
    onWordDelete: (deletedWordId: string) => void; // 親コンポーネントに削除を通知
}

const WordListItem: React.FC<WordListItemProps> = ({ word, onWordUpdate, onWordDelete }) => {
    const [editingterm, setEditingterm] = useState(word.term);
    const [editingdefinition, setEditingdefinition] = useState(word.definition);
    const [isSaving, setIsSaving] = useState(false); // 保存中フラグ

    const handleUpdate = async (field: 'term' | 'definition', value: string) => {
        if (isSaving) return; // 保存中は多重送信を防ぐ
        if ((field === 'term' && value === word.term) || (field === 'definition' && value === word.definition)) {
            return; // 値に変更がなければ何もしない
        }

        setIsSaving(true);
        try {
            const updatedWord = await updateWord(word.word_id, { [field]: value });
            onWordUpdate(updatedWord); // 親コンポーネントのリストを更新
        } catch (error) {
            console.error(`Failed to update ${field}:`, error);
            // エラー発生時は元の値に戻す (任意)
            if (field === 'term') setEditingterm(word.term);
            if (field === 'definition') setEditingdefinition(word.definition);
            // TODO: ユーザーにエラーを通知
            alert(`単語の${field === 'term' ? '問題' : '答え'}の更新に失敗しました。`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>, field: 'term' | 'definition') => {
        handleUpdate(field, e.target.value);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, field: 'term' | 'definition') => {
        if (e.key === 'Enter') {
            handleUpdate(field, (e.target as HTMLInputElement).value);
            (e.target as HTMLInputElement).blur(); // Enter後フォーカスを外す
        }
    };

    const handleDelete = async () => {
        if (window.confirm(`「${word.term}」を削除してもよろしいですか？`)) {
            try {
                await softDeleteWord(word.word_id);
                onWordDelete(word.word_id); // 親コンポーネントのリストを更新
            } catch (error) {
                console.error('Failed to delete word:', error);
                alert('単語の削除に失敗しました。');
            }
        }
    };

    // const formatDate = (dateString: string | null) => {
    //     if (!dateString) return '-';
    //     try {
    //         return new Date(dateString).toLocaleString('ja-JP');
    //     } catch {
    //         return dateString; // パース失敗時は元の文字列
    //     }
    // };

    return (
        <tr className={`border-b ${word.deletedAt ? 'bg-gray-200 line-through text-gray-500' : 'hover:bg-gray-50'}`}>
            <td className="py-3 px-4">
                <input
                    type="text"
                    value={editingterm}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEditingterm(e.target.value)}
                    onBlur={(e) => handleBlur(e, 'term')}
                    onKeyDown={(e) => handleKeyDown(e, 'term')}
                    className={`w-full p-2 border rounded ${word.deletedAt ? 'bg-gray-200 cursor-not-allowed' : 'focus:ring-blue-500 focus:border-blue-500'}`}
                    disabled={!!word.deletedAt || isSaving}
                />
            </td>
            <td className="py-3 px-4">
                <input
                    type="text"
                    value={editingdefinition}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEditingdefinition(e.target.value)}
                    onBlur={(e) => handleBlur(e, 'definition')}
                    onKeyDown={(e) => handleKeyDown(e, 'definition')}
                    className={`w-full p-2 border rounded ${word.deletedAt ? 'bg-gray-200 cursor-not-allowed' : 'focus:ring-blue-500 focus:border-blue-500'}`}
                    disabled={!!word.deletedAt || isSaving}
                />
            </td>
            {/* <td className="py-3 px-4 text-sm whitespace-nowrap">
                {formatDate(word.deletedAt)}
            </td> */}
            <td className="py-3 px-4 text-center">
                <button
                    onClick={handleDelete}
                    className={`px-20 py-1 text-sm rounded transition-colors
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
    );
};

export default WordListItem;