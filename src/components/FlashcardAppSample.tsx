import React, { useState, useEffect } from 'react';
import axios from 'axios';

// ====================
// ① 単語データ用のインターフェース定義
// ====================
interface Word {
    id: number;          // 単語の一意な識別子
    question: string;    // 問題文（例: 英単語）
    answer: string;      // 答え（例: 日本語訳）
    level: number;       // レベル（0: 未習得, 1: 部分習得, 2: 習得済み）
}

// ====================
// ② テスト用の単語データ(初期値)
//    ※ 万一API呼び出しが失敗したときの
//       フォールバックにも使えます
// ====================
const initialWords: Word[] = [
    { id: 1, question: 'apple', answer: 'りんご', level: 0 },
    { id: 2, question: 'banana', answer: 'バナナ', level: 0 },
    { id: 3, question: 'grape', answer: 'ぶどう', level: 0 },
];

// ====================
// ③ アプリ本体のコンポーネント
// ====================
const FlashcardAppSample: React.FC = () => {
    // ==========================
    // ③-1. Reactの状態管理設定
    // ==========================

    // 単語データを管理するステート
    const [words, setWords] = useState<Word[]>(initialWords);

    // 現在の問題が「何番目」かを管理するステート。
    // 例: currentIndex = 0 のときは一番最初の問題を出す。
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    // 答えを表示しているかどうかを管理するステート。
    // false = 答え非表示, true = 答え表示中。
    const [showAnswer, setShowAnswer] = useState<boolean>(false);

    // ローディング状態とエラー状態を管理
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    /**
     * APIのエンドポイントを環境変数から取得
     * - 環境変数例:
     *   - 開発環境: REACT_APP_API_DOMAIN=http://localhost:4000
     *   - 本番環境: REACT_APP_API_DOMAIN=https://api.example.com
     * - ドメインのみを変更可能にし、パスは固定
     */
    const API_DOMAIN = import.meta.env.VITE_APP_API_DOMAIN || 'http://localhost:4000';
    const API_ENDPOINT = `${API_DOMAIN}/api/v1/words`; // パスは固定

    // ==========================
    // ③-2. カード(問題)クリック時の処理
    // ==========================
    // カードクリックで答え表示
    const handleCardClick = () => {
        // まだ答えを表示していない場合のみ、答えを表示状態にする
        if (!showAnswer) {
            setShowAnswer(true);
        }
    };

    // ==========================
    // ③-3. APIから単語データ取得 (useEffect使用)
    // ==========================
    useEffect(() => {
        // 単語データを取得する非同期関数
        const fetchWords = async () => {
            try {
                const response = await axios.get<Word[]>(API_ENDPOINT);
                // サーバーからのレスポンス例:
                // {
                //   "status": "success",
                //   "data": {
                //     "words": [
                //       { "id": 1, "question": "apple", "answer": "りんご", "level": 0 },
                //       { "id": 2, "question": "banana", "answer": "バナナ", "level": 1 },
                //       { "id": 3, "question": "grape", "answer": "ぶどう", "level": 2 }
                //     ]
                //   },
                //   "meta": { "totalCount": 3 }
                // }

                // // レスポンスのステータスを確認
                // if (response.data.status !== 'success') {
                //     // ステータスが 'success' でなければエラーを投げる
                //     throw new Error('サーバーからのステータスが成功ではありません。');
                // }

                // words配列を取り出す
                const apiWords = response.data;

                // レベルがすでに数値で返ってくることを確認
                // もし文字列で返ってくる場合は parseInt で数値に変換
                const convertedWords: Word[] = apiWords.map((item: any) => ({
                    id: item.id,
                    question: item.question,
                    answer: item.answer,
                    level: typeof item.level === 'string' ? parseInt(item.level, 10) : item.level,
                }));

                // ステートに反映
                setWords(convertedWords);
                setIsLoading(false);
            } catch (err: any) {
                // エラー時にメッセージを設定
                console.error('単語データの取得に失敗しました:', err);
                setError('単語データの取得に失敗しました。しばらく待ってから再度お試しください。');
                setIsLoading(false);
            }
        };

        // コンポーネントマウント時にデータ取得
        fetchWords();
    }, [API_ENDPOINT]); // API_ENDPOINTが変更されたときに再実行

    // ==========================
    // ③-4. 「正解」「不正解」ボタン押下時の処理
    // ==========================
    // レベル更新関数を定義
    const updateLevel = (word: Word, correct: boolean): number => {
        if (correct) {
            // 正解の場合
            if (word.level < 2) {
                return word.level + 1; // 0→1, 1→2
            }
            return 2; // 2以上は上げない
        } else {
            // 不正解の場合
            if (word.level > 0) {
                return word.level - 1; // 2→1, 1→0
            }
            return 0; // 0以下は下げない
        }
    };

    /**
     * 正解 or 不正解 ボタンクリック時
     *
     * 正解の場合: レベルを上げる
     * 不正解の場合: レベルを下げる
     *
     * @param correct 正解かどうか
     */
    const handleAnswer = async (correct: boolean) => {
        const currentWord = words[currentIndex];
        const newLevel = updateLevel(currentWord, correct);

        // 更新データからidを除外
        const { id, ...updateData } = { ...currentWord, level: newLevel };

        try {
            // 単語のレベルを更新するAPIリクエスト (PUTメソッドを使用)
            await axios.put(`${API_ENDPOINT}/${currentWord.id}`, updateData);

            // ステートを更新
            setWords((prevWords) => {
                const updatedWords = [...prevWords];
                updatedWords[currentIndex] = {
                    ...updatedWords[currentIndex],
                    level: newLevel,
                };
                return updatedWords;
            });
        } catch (err) {
            console.error('レベルの更新に失敗しました:', err);
            setError('レベルの更新に失敗しました。再度お試しください。');
        }

        // 次の問題へ進む
        setShowAnswer(false);
        // 現在の問題番号を次に進める
        setCurrentIndex((prevIndex) => prevIndex + 1);
    };

    // ==========================
    // ③-5. ローディングとエラー、および全問題終了チェック
    // ==========================
    // 読み込み中なら「読み込み中...」を表示
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-lg">読み込み中...</p>
            </div>
        );
    }

    // エラーがあればメッセージ表示
    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-lg text-red-500">
                    {error}
                </p>
            </div>
        );
    }

    // 全ての問題が終わったかどうかの判定
    if (currentIndex >= words.length) {
        return (
            <div className="flex flex-col items-center justify-center my-10">
                <h1 className="text-2xl font-bold mb-4">学習完了です！</h1>
                <p className="text-lg">全ての単語を学習しました。お疲れ様です！</p>
            </div>
        );
    }

    // 現在の問題を取得
    const currentWord = words[currentIndex];

    // ==========================
    // ③-5. 画面表示
    // ==========================
    return (
        <div className="flex flex-col items-center justify-center bg-gray-100 p-4">

            {/* 
        インジケーター部分。回答済みの単語数と全単語数を表示。
        Tailwindでスタイリングを行っています。
      */}
            <div className="mb-6">
                <p className="text-lg">
                    質問 {currentIndex + 1} / {words.length} （レベル {currentWord.level}）
                </p>
            </div>

            {/* 
            カード部分。ここをクリックすると「答えを表示する」処理(handleCardClick)が動く。 
            ailwindでちょっとした装飾を加えています。
             */}
            <div
                className="w-80 h-40 bg-white border rounded shadow-md flex items-center justify-center cursor-pointer mb-4"
                onClick={handleCardClick}
            >
                {/* showAnswer が true なら answer（答え）を表示、false なら question（問題）を表示 */}
                <span className="text-xl">
                    {showAnswer ? currentWord.answer : currentWord.question}
                </span>
            </div>

            {/* 
        ボタン部分。答えが表示されている(showAnswer = true)場合のみ押せるように制御。
        Tailwindのクラスを条件分岐し、押せない時はグレー、押せる時は色付き。
      */}
            {/* 正解・不正解ボタン */}
            <div className="flex space-x-4">
                <button
                    className={`px-6 py-2 rounded ${showAnswer
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    onClick={() => showAnswer && handleAnswer(true)}
                    disabled={!showAnswer}
                >
                    正解
                </button>
                <button
                    className={`px-6 py-2 rounded ${showAnswer
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    onClick={() => showAnswer && handleAnswer(false)}
                    disabled={!showAnswer}
                >
                    不正解
                </button>
            </div>
        </div>
    );
};

export default FlashcardAppSample;
