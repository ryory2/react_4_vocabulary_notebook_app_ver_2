import React from 'react';

interface SuccessToastProps {
    message: string | null;
    onClose: () => void;
}

const SuccessToast: React.FC<SuccessToastProps> = ({ message, onClose }) => {
    if (!message) {
        return null;
    }

    return (
        // 画面上部中央に固定で表示
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow-lg" role="alert">
            <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg">
                {/* チェックマークのSVGアイコン */}
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
            </div>
            <div className="ml-3 text-sm font-normal">{message}</div>
            <button
                type="button"
                className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8"
                onClick={onClose}
                aria-label="Close"
            >
                <span className="sr-only">Close</span>
                {/* 閉じるボタンのSVGアイコン */}
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
            </button>
        </div>
    );
};

export default SuccessToast;