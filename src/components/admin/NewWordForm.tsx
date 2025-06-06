// src/components/admin/NewWordForm.tsx
import React, { useState, ChangeEvent, MouseEvent } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

interface NewWordFormProps {
    onWordCreate: (term: string, definition: string) => Promise<void>;
    isCreating: boolean;
    setIsCreating: (isCreating: boolean) => void;
}

const NewWordForm: React.FC<NewWordFormProps> = ({ onWordCreate, isCreating, setIsCreating }) => {
    const [newterm, setNewterm] = useState('');
    const [newdefinition, setNewdefinition] = useState('');

    // バリデーションエラーメッセージ用のState
    const [errors, setErrors] = useState({ term: '', definition: '' });

    // バリデーションを行うヘルパー関数
    const validateForm = (): boolean => {
        const newErrors = { term: '', definition: '' };
        let isValid = true;

        if (!newterm.trim()) {
            newErrors.term = '単語を入力してください。';
            isValid = false;
        }
        if (!newdefinition.trim()) {
            newErrors.definition = '意味を入力してください。';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        // バリデーションを実行
        if (!validateForm()) {
            return; // エラーがあれば中断
        }

        setIsCreating(true);
        try {
            await onWordCreate(newterm, newdefinition);
            setNewterm('');
            setNewdefinition('');
            setErrors({ term: '', definition: '' }); // 成功時にエラーをクリア
        } catch (error) {
            // APIからのエラーは親コンポーネントのモーダルで表示される
            console.error("NewWordForm: handleSubmit error", error);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <tr className={`
            bg-blue-50 border-b border-blue-200 md:border-b
            block p-4 mb-4 border rounded-lg shadow-sm
            md:table-row md:hover:bg-blue-100 md:p-0 md:mb-0 md:shadow-none md:rounded-none
        `}>
            <td className="block md:table-cell p-2 md:py-3 md:px-4" data-label="新しい単語">
                <span className="font-bold text-sm text-gray-600 md:hidden">新しい単語</span>
                <TextareaAutosize
                    placeholder="新しい単語を入力"
                    value={newterm}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewterm(e.target.value)}
                    className={`w-full mt-1 p-2 border rounded resize-none focus:ring-blue-500 focus:border-blue-500 ${errors.term ? 'border-red-500' : 'border-gray-300'}`}
                    disabled={isCreating}
                    minRows={1}
                />
                {errors.term && <p className="text-red-500 text-xs mt-1">{errors.term}</p>}
            </td>
            <td className="block md:table-cell p-2 md:py-3 md:px-4" data-label="意味">
                <span className="font-bold text-sm text-gray-600 md:hidden">意味</span>
                <TextareaAutosize
                    placeholder="意味を入力"
                    value={newdefinition}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewdefinition(e.target.value)}
                    className={`w-full mt-1 p-2 border rounded resize-none focus:ring-blue-500 focus:border-blue-500 ${errors.definition ? 'border-red-500' : 'border-gray-300'}`}
                    disabled={isCreating}
                    minRows={1}
                />
                {errors.definition && <p className="text-red-500 text-xs mt-1">{errors.definition}</p>}
            </td>
            <td className="block md:table-cell p-2 md:py-3 md:px-4 text-center">
                <div className="flex flex-col md:flex-row-reverse md:items-center md:justify-end gap-2">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className={`w-full md:w-auto px-6 py-2 text-sm rounded transition-colors ${isCreating ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
                            } text-white`}
                        disabled={isCreating}
                    >
                        {isCreating ? '登録中...' : '登録'}
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default NewWordForm;