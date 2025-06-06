import React from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string | React.ReactNode; // メッセージにJSXも許容
    confirmButtonText?: string;
    cancelButtonText?: string;
    isConfirming?: boolean; // 確認処理中のフラグ
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmButtonText = '実行',
    cancelButtonText = 'キャンセル',
    isConfirming = false,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md m-4">
                <div className="flex items-start justify-between">
                    <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                    {/* 閉じるボタンはキャンセルと同じなので非表示でも良い */}
                    <button onClick={onClose} disabled={isConfirming} className="text-gray-400 hover:text-gray-600">×</button>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                    {message}
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        disabled={isConfirming}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                        {cancelButtonText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isConfirming}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isConfirming ? '処理中...' : confirmButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;