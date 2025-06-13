import React, { useEffect, useReducer, useCallback } from 'react';
import { usePageMeta } from '../hooks/usePageMeta';
import { Word } from '../types/word';
import { getReviewableWords, submitReviewResult } from '../api/endpoints';
import { getApiErrorMessage } from '../api/apiClient';
import { WordLevels } from '../constants';


// --- StateとActionの型定義 ---
interface FlashcardState {
    words: Word[];
    currentIndex: number;
    showAnswer: boolean;
    isLoading: boolean;
    error: string | null;
    cardAnimation: 'left' | 'right' | '';
}

type FlashcardAction =
    | { type: 'FETCH_START' }
    | { type: 'FETCH_SUCCESS'; payload: Word[] }
    | { type: 'FETCH_ERROR'; payload: string }
    | { type: 'FLIP_CARD' }
    | { type: 'ANSWER'; payload: { isCorrect: boolean } }
    | { type: 'START_SWIPE'; payload: 'left' | 'right' }
    | { type: 'END_SWIPE'; payload: { newWords: Word[] } }
    | { type: 'RESET' }
    | { type: 'REVERT_STATE'; payload: { words: Word[], currentIndex: number } };

// --- 初期状態 ---
const initialState: FlashcardState = {
    words: [],
    currentIndex: 0,
    showAnswer: false,
    isLoading: true,
    error: null,
    cardAnimation: '',
};

// --- Reducer関数: 状態遷移のロジックをここに集約 ---
function flashcardReducer(state: FlashcardState, action: FlashcardAction): FlashcardState {
    switch (action.type) {
        case 'FETCH_START':
            return { ...initialState, isLoading: true };
        case 'FETCH_SUCCESS':
            return { ...initialState, isLoading: false, words: action.payload };
        case 'FETCH_ERROR':
            return { ...state, isLoading: false, error: action.payload };
        case 'FLIP_CARD':
            return { ...state, showAnswer: !state.showAnswer };
        case 'START_SWIPE':
            return { ...state, cardAnimation: action.payload };
        case 'END_SWIPE':
            return {
                ...state,
                cardAnimation: '',
                showAnswer: false,
                currentIndex: state.currentIndex + 1,
                words: action.payload.newWords,
            };
        case 'REVERT_STATE':
            return {
                ...state,
                words: action.payload.words,
                currentIndex: action.payload.currentIndex,
            };
        case 'RESET':
            return { ...state, currentIndex: 0 };
        default:
            throw new Error('Unhandled action type');
    }
}

// ====================
// アプリ本体のコンポーネント
// ====================
const FlashcardApp: React.FC = () => {
    const pageMeta = usePageMeta('privacyPolicy');
    const [state, dispatch] = useReducer(flashcardReducer, initialState);
    const { words, currentIndex, showAnswer, isLoading, error, cardAnimation } = state;

    // --- データ取得 ---
    const fetchWords = useCallback(async () => {
        dispatch({ type: 'FETCH_START' });
        try {
            const apiWords = await getReviewableWords();
            dispatch({ type: 'FETCH_SUCCESS', payload: apiWords });
        } catch (err) {
            // ★ 共通エラーハンドラを使用
            const errorMessage = getApiErrorMessage(err);
            dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
        }
    }, []);

    useEffect(() => {
        fetchWords();
    }, [fetchWords]);

    // --- 解答ボタン押下時の処理 ---
    const handleAnswer = (isCorrect: boolean) => {
        if (cardAnimation !== '' || currentIndex >= words.length) return;

        dispatch({ type: 'START_SWIPE', payload: isCorrect ? 'right' : 'left' });

        setTimeout(() => {
            const currentWord = words[currentIndex];
            const originalWords = words;
            const originalIndex = currentIndex; // 現在のインデックスを保存

            const newLevel = isCorrect
                ? (currentWord.level < WordLevels.MASTERED ? (currentWord.level + 1) as Word['level'] : WordLevels.MASTERED)
                : (currentWord.level > WordLevels.UNSEEN ? (currentWord.level - 1) as Word['level'] : WordLevels.UNSEEN);

            const newWords = words.map(w => w.word_id === currentWord.word_id ? { ...w, level: newLevel } : w);

            // オプティミスティックUI更新
            dispatch({ type: 'END_SWIPE', payload: { newWords } });

            // 裏でAPI通信
            submitReviewResult(currentWord.word_id, isCorrect)
                .catch((err) => {
                    // 認証エラー(401)はapiClientのインターセプターが自動処理
                    const errorMessage = getApiErrorMessage(err);
                    dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
                    // エラー時はUIを元の状態に戻す
                    dispatch({
                        type: 'REVERT_STATE',
                        payload: { words: originalWords, currentIndex: originalIndex }
                    });
                });
        }, 300);
    };

    // --- レンダリングロジック ---

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen"><p className="text-lg animate-pulse">読み込み中...</p></div>;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-center p-4">
                <p className="text-lg text-red-500 mb-4">{error}</p>
                <button onClick={fetchWords} className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors">再試行</button>
            </div>
        );
    }

    if (!words || words.length === 0 || currentIndex >= words.length) {
        return (
            <div className="flex flex-col items-center justify-center my-10 text-center p-4">
                <h1 className="text-2xl font-bold mb-4">学習完了！</h1>
                <p className="text-lg mb-6">お疲れ様でした！</p>
                <button onClick={fetchWords} className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors">もう一度挑戦する</button>
            </div>
        );
    }

    const currentWord = words[currentIndex];

    return (
        <>
            {pageMeta}
            <div className="flex flex-col items-center justify-center bg-gray-100 p-4 min-h-screen font-sans">
                <div className="w-full max-w-md">
                    <div className="mb-6 text-center">
                        <p className="text-lg text-gray-600">
                            質問 {currentIndex + 1} / {words.length}
                            <span className="ml-2 px-2 py-1 bg-gray-200 text-gray-700 text-xs font-bold rounded-full">
                                レベル {currentWord.level}
                            </span>
                        </p>
                    </div>

                    {/* カードデッキのUI */}
                    <div className="relative w-full h-40 mb-4 [perspective:1000px]">
                        {words.slice(currentIndex, currentIndex + 3).reverse().map((word, index) => {
                            const totalSliced = words.slice(currentIndex, currentIndex + 3).length;
                            const isTopCard = index === totalSliced - 1;

                            const cardStyle = {
                                zIndex: index,
                                transform: `scale(${1 - (totalSliced - 1 - index) * 0.05}) translateY(${(totalSliced - 1 - index) * -10}px)`,
                            };

                            let animationClass = '';
                            if (isTopCard && cardAnimation !== '') {
                                animationClass = {
                                    'left': '-translate-x-[120%] rotate-[-15deg]',
                                    'right': 'translate-x-[120%] rotate-[15deg]',
                                }[cardAnimation];
                            }

                            return (
                                <div
                                    key={word.word_id}
                                    className={`absolute w-full h-full transition-all duration-300 ease-in-out ${animationClass}`}
                                    style={cardStyle}
                                >
                                    {/* カード本体 */}
                                    <div
                                        className={`relative w-full h-full text-center transition-transform duration-700 [transform-style:preserve-3d] ${isTopCard && showAnswer ? '[transform:rotateY(180deg)]' : ''}`}
                                        onClick={isTopCard ? () => dispatch({ type: 'FLIP_CARD' }) : undefined}
                                        style={{ cursor: isTopCard ? 'pointer' : 'default' }}
                                    >
                                        <div className="absolute w-full h-full bg-white border rounded-lg shadow-lg flex items-center justify-center p-4 [backface-visibility:hidden]">
                                            <span className="text-2xl font-semibold">{word.term}</span>
                                        </div>
                                        <div className="absolute w-full h-full bg-blue-100 border border-blue-300 rounded-lg shadow-lg flex items-center justify-center p-4 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                                            <span className="text-2xl font-bold text-blue-800">{word.definition}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* ボタンエリア */}
                    <div className="flex space-x-4 w-full max-w-md">
                        <button
                            className={`w-1/2 py-3 rounded-lg text-white font-bold transition-all duration-200 ${showAnswer && !cardAnimation ? 'bg-red-500 hover:bg-red-600 shadow-lg' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                            onClick={() => handleAnswer(false)}
                            disabled={!showAnswer || cardAnimation !== ''}
                        >
                            不正解
                        </button>
                        <button
                            className={`w-1/2 py-3 rounded-lg text-white font-bold transition-all duration-200 ${showAnswer && !cardAnimation ? 'bg-green-500 hover:bg-green-600 shadow-lg' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                            onClick={() => handleAnswer(true)}
                            disabled={!showAnswer || cardAnimation !== ''}
                        >
                            正解
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FlashcardApp;