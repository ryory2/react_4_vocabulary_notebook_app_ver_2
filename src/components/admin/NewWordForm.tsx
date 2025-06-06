// src/components/admin/NewWordForm.tsx
import React, { useState, ChangeEvent, MouseEvent } from 'react'; // FormEventからMouseEventに変更
import TextareaAutosize from 'react-textarea-autosize';

interface NewWordFormProps {
    onWordCreate: (term: string, definition: string) => Promise<void>;
    isCreating: boolean;
    setIsCreating: (isCreating: boolean) => void;
    onClose: () => void;
}

const NewWordForm: React.FC<NewWordFormProps> = ({ onWordCreate, isCreating, setIsCreating, onClose }) => {
    const [newterm, setNewterm] = useState('');
    const [newdefinition, setNewdefinition] = useState('');

    // ★ FormEvent ではなく MouseEvent を使う（formタグは使わないため）
    const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!newterm.trim() || !newdefinition.trim()) {
            alert('単語と意味を入力してください。');
            return;
        }
        setIsCreating(true);
        try {
            await onWordCreate(newterm, newdefinition);
            setNewterm('');
            setNewdefinition('');
        } catch (error) {
            console.error("NewWordForm: handleSubmit error", error);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        // `tr` 要素に WordListItem と同様のレスポンシブスタイルを適用
        <tr className={`
            bg-blue-50 border-b border-blue-200 md:border-b
            
            // ★スマホ用のスタイル
            block p-4 mb-4 border rounded-lg shadow-sm
            
            // ★PC用のスタイル
            md:table-row md:hover:bg-blue-100 md:p-0 md:mb-0 md:shadow-none md:rounded-none
        `}>
            <td className="block md:table-cell p-2 md:py-3 md:px-4" data-label="新しい単語">
                {/* スマホ用のラベル */}
                <span className="font-bold text-sm text-gray-600 md:hidden">新しい単語</span>
                {/* ★ input を textarea に変更 */}
                <TextareaAutosize
                    placeholder="新しい単語を入力"
                    value={newterm}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewterm(e.target.value)}
                    className="w-full mt-1 p-2 border rounded resize-y focus:ring-blue-500 focus:border-blue-500"
                    disabled={isCreating}
                    rows={2} // 初期表示の行数を指定
                />
            </td>
            <td className="block md:table-cell p-2 md:py-3 md:px-4" data-label="意味">
                {/* スマホ用のラベル */}
                <span className="font-bold text-sm text-gray-600 md:hidden">意味</span>
                {/* ★ input を textarea に変更 */}
                <TextareaAutosize
                    placeholder="意味を入力"
                    value={newdefinition}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewdefinition(e.target.value)}
                    className="w-full mt-1 p-2 border rounded resize-y focus:ring-blue-500 focus:border-blue-500"
                    disabled={isCreating}
                    rows={2} // 初期表示の行数を指定
                />
            </td>
            <td className="block md:table-cell p-2 md:py-3 md:px-4 text-center">
                {/* ★ ボタンをflexboxで囲み、レスポンシブ対応 */}
                <div className="flex flex-col md:flex-row-reverse md:items-center md:justify-end gap-2">
                    {/* 登録ボタン */}
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className={`w-full md:w-auto px-6 py-2 text-sm rounded transition-colors ${isCreating ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
                            } text-white`}
                        disabled={isCreating || !newterm.trim() || !newdefinition.trim()}
                    >
                        {isCreating ? '登録中...' : '登録'}
                    </button>
                    {/* ★ 閉じるボタンを追加 */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full md:w-auto px-6 py-2 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                        disabled={isCreating}
                    >
                        閉じる
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default NewWordForm;