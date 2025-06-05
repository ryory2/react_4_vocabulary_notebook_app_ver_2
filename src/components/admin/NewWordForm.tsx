// src/components/admin/NewWordForm.tsx
import React, { useState, ChangeEvent, FormEvent } from 'react';

interface NewWordFormProps {
    onWordCreate: (term: string, definition: string) => Promise<void>; // 登録成功後にフォームをリセットするためPromiseを返す
    isCreating: boolean;
    setIsCreating: (isCreating: boolean) => void;
}

const NewWordForm: React.FC<NewWordFormProps> = ({ onWordCreate, isCreating, setIsCreating }) => {
    const [newterm, setNewterm] = useState('');
    const [newdefinition, setNewdefinition] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!newterm.trim() || !newdefinition.trim()) {
            alert('単語と意味を入力してください。');
            return;
        }
        setIsCreating(true);
        try {
            await onWordCreate(newterm, newdefinition);
            setNewterm(''); // 登録成功後フォームをクリア
            setNewdefinition('');
        } catch (error) {
            // エラー処理は呼び出し元で行うか、ここで alert など
            console.error("NewWordForm: handleSubmit error", error);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <tr className="bg-blue-50 hover:bg-blue-100 border-b border-blue-200">
            <td className="py-3 px-4">
                <input
                    type="text"
                    placeholder="新しい単語"
                    value={newterm}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNewterm(e.target.value)}
                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                    disabled={isCreating}
                />
            </td>
            <td className="py-3 px-4">
                <input
                    type="text"
                    placeholder="意味"
                    value={newdefinition}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNewdefinition(e.target.value)}
                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                    disabled={isCreating}
                />
            </td>
            {/* <td className="py-3 px-4 text-sm text-gray-500">-</td> */}
            <td className="py-3 px-4 text-center">
                <button
                    type="button" // formのsubmitと区別するため type="button"
                    onClick={handleSubmit}
                    className={`px-20 py-1 text-sm rounded transition-colors
                      ${isCreating
                            ? 'bg-gray-400 text-white cursor-not-allowed'
                            : 'bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2'
                        }`}
                    disabled={isCreating || !newterm.trim() || !newdefinition.trim()}
                >
                    {isCreating ? '登録中...' : '登録'}
                </button>
            </td>
        </tr>
    );
};

export default NewWordForm;