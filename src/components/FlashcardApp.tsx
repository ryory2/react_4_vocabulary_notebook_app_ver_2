// src/pages/FlashcardApp.tsx

import React, { useEffect, useReducer, useCallback, useRef, useState, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import { Word } from '../types/word';
import { getReviewableWords, submitReviewResult } from '../api/endpoints';
import { getApiErrorMessage } from '../api/apiClient';
import { WordLevels } from '../constants';

// ... (State, Action, Reducerの定義は変更なし) ...
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
    | { type: 'START_SWIPE'; payload: 'left' | 'right' }
    | { type: 'ANSWER'; payload: { isCorrect: boolean } }
    | { type: 'RESET' }
    | { type: 'REVERT_STATE'; payload: { words: Word[], currentIndex: number } };

const initialState: FlashcardState = {
    words: [],
    currentIndex: 0,
    showAnswer: false,
    isLoading: true,
    error: null,
    cardAnimation: '',
};

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
        case 'ANSWER': {
            if (state.currentIndex >= state.words.length) {
                return state;
            }
            const currentWord = state.words[state.currentIndex];
            const { isCorrect } = action.payload;

            const newLevel = isCorrect
                ? (currentWord.level < WordLevels.MASTERED ? (currentWord.level + 1) as Word['level'] : WordLevels.MASTERED)
                : (currentWord.level > WordLevels.UNSEEN ? (currentWord.level - 1) as Word['level'] : WordLevels.UNSEEN);

            const newWords = state.words.map(w =>
                w.word_id === currentWord.word_id ? { ...w, level: newLevel } : w
            );

            return {
                ...state,
                words: newWords,
                currentIndex: state.currentIndex + 1,
                showAnswer: false,
                cardAnimation: '',
            };
        }
        case 'REVERT_STATE':
            return {
                ...state,
                words: action.payload.words,
                currentIndex: action.payload.currentIndex,
            };
        case 'RESET':
            return { ...initialState, isLoading: true };
        default:
            throw new Error('Unhandled action type');
    }
}
const ANIMATION_DURATION = 300;


// ====================
// 学習完了コンポーネント
// ====================
interface CompletionScreenProps {
    onRetry: () => void;
    sessionCompleted: boolean;
}

const CompletionScreen = ({ onRetry, sessionCompleted }: CompletionScreenProps) => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        if (countdown <= 0) {
            navigate('/');
            return;
        }
        const timerId = setTimeout(() => {
            setCountdown(countdown - 1);
        }, 1000);
        return () => clearTimeout(timerId);
    }, [countdown, navigate]);

    return (
        <div className="flex flex-col items-center justify-center text-center py-20 p-4">
            <h1 className="text-2xl font-bold mb-4">
                {sessionCompleted ? '学習完了！' : '学習完了！'}
            </h1>
            <p className="text-lg mb-6">
                {sessionCompleted ? '本日の復習はすべて完了しました。お疲れ様でした！' : '現在、復習する単語はありません。'}
            </p>
            <p className="text-gray-500 mb-6">{countdown}秒後にトップページに戻ります...</p>
            <div className="flex space-x-4">
                <button
                    onClick={() => navigate('/')}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700 transition-colors"
                >
                    トップに戻る
                </button>
                {sessionCompleted && (
                    <button
                        onClick={onRetry}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors"
                    >
                        もう一度挑戦する
                    </button>
                )}
            </div>
        </div>
    );
};

// ====================
// アプリ本体のコンポーネント
// ====================
const FlashcardApp: React.FC = () => {
    const pageMeta = usePageMeta('flashcards');
    const [state, dispatch] = useReducer(flashcardReducer, initialState);
    const { words, currentIndex, showAnswer, isLoading, error, cardAnimation } = state;

    const frontCardRef = useRef<HTMLDivElement>(null);
    const [cardHeight, setCardHeight] = useState<number | null>(null);
    const mountedRef = useRef(true);

    useEffect(() => {
        return () => {
            mountedRef.current = false;
        };
    }, []);

    useLayoutEffect(() => {
        if (frontCardRef.current) {
            setCardHeight(frontCardRef.current.offsetHeight);
        }
    }, [currentIndex]);

    const fetchWords = useCallback(async () => {
        dispatch({ type: 'FETCH_START' });
        try {
            const apiWords = await getReviewableWords();
            if (mountedRef.current) {
                dispatch({ type: 'FETCH_SUCCESS', payload: apiWords });
            }
        } catch (err) {
            if (mountedRef.current) {
                const errorMessage = getApiErrorMessage(err);
                dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
            }
        }
    }, []);

    useEffect(() => {
        fetchWords();
    }, [fetchWords]);

    const handleAnswer = (isCorrect: boolean) => {
        if (cardAnimation !== '' || currentIndex >= words.length) return;

        const currentWord = words[currentIndex];
        const originalWords = words;
        const originalIndex = currentIndex;

        dispatch({ type: 'START_SWIPE', payload: isCorrect ? 'right' : 'left' });

        setTimeout(() => {
            if (!mountedRef.current) return;
            dispatch({ type: 'ANSWER', payload: { isCorrect } });
            setCardHeight(null);
            submitReviewResult(currentWord.word_id, isCorrect)
                .catch((err) => {
                    if (!mountedRef.current) return;
                    const errorMessage = getApiErrorMessage(err);
                    dispatch({ type: 'FETCH_ERROR', payload: `保存に失敗しました: ${errorMessage}` });
                    dispatch({
                        type: 'REVERT_STATE',
                        payload: { words: originalWords, currentIndex: originalIndex }
                    });
                });
        }, ANIMATION_DURATION);
    };

    if (isLoading) {
        return <div className="flex items-center justify-center h-full py-20"><p className="text-lg animate-pulse">復習単語を読み込んでいます...</p></div>;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center p-4">
                <p className="text-lg text-red-500 mb-4">{error}</p>
                <button onClick={fetchWords} className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors">再試行</button>
            </div>
        );
    }

    if (words.length === 0) {
        // 最初から復習単語が0件の場合
        return <CompletionScreen onRetry={fetchWords} sessionCompleted={false} />;
    }

    if (currentIndex >= words.length) {
        // 全ての単語を学習し終えた場合
        return <CompletionScreen onRetry={fetchWords} sessionCompleted={true} />;
    }

    const currentWord = words[currentIndex];

    return (
        <>
            {pageMeta}
            <div className="flex flex-col items-center w-full pt-8 md:pt-12">
                <div className="w-full max-w-md p-4">
                    <div className="mb-6 text-center">
                        <p className="text-lg text-gray-600">
                            質問 {currentIndex + 1} / {words.length}
                            <span className="ml-2 px-2 py-1 bg-gray-200 text-gray-700 text-xs font-bold rounded-full">
                                レベル {currentWord.level}
                            </span>
                        </p>
                    </div>

                    <div className="relative w-full mb-4 [perspective:1000px]" style={{ height: cardHeight ? `${cardHeight}px` : '10rem' }}>
                        {words.slice(currentIndex, currentIndex + 3).reverse().map((word, index) => {
                            const totalSliced = words.slice(currentIndex, currentIndex + 3).length;
                            const isTopCard = index === totalSliced - 1;

                            const termWithNewlines = word.term.replace(/\\n/g, '\n');
                            const definitionWithNewlines = word.definition.replace(/\\n/g, '\n');

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
                                    <div
                                        className={`relative w-full h-full text-center transition-transform duration-700 [transform-style:preserve-3d] ${isTopCard && showAnswer ? '[transform:rotateY(180deg)]' : ''}`}
                                        onClick={isTopCard ? () => dispatch({ type: 'FLIP_CARD' }) : undefined}
                                        style={{ cursor: isTopCard ? 'pointer' : 'default' }}
                                    >
                                        <div
                                            ref={isTopCard ? frontCardRef : null}
                                            className="w-full min-h-40 bg-white border rounded-lg shadow-lg flex items-center justify-center p-6 [backface-visibility:hidden]"
                                        >
                                            <span className="text-2xl font-semibold break-words whitespace-pre-wrap">
                                                {termWithNewlines}
                                            </span>
                                        </div>

                                        <div className="absolute top-0 left-0 w-full h-full bg-blue-100 border border-blue-300 rounded-lg shadow-lg p-6 [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-y-auto">
                                            <div className="flex items-center justify-center min-h-full">
                                                <span className="text-lg font-semibold text-blue-800 break-words whitespace-pre-wrap">
                                                    {definitionWithNewlines}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex space-x-4 w-full">
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