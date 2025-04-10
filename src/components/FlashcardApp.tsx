import { useState, FC } from 'react';
import TinderCard from 'react-tinder-card';

// 単語の型
type Word = {
    id: number;
    term: string;       // 英単語
    definition: string; // 日本語訳
};

// テスト用のサンプルデータ
const words: Word[] = [
    { id: 1, term: 'apple', definition: 'リンゴ' },
    { id: 2, term: 'table', definition: 'テーブル' },
    { id: 3, term: 'book', definition: '本' },
];

// Swipe 方向を型定義しておくと便利
type SwipeDirection = 'left' | 'right' | 'up' | 'down';

export const FlashcardApp: FC = () => {
    // 現在のカード（インデックス）
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    // 答えを表示するかどうか
    const [showDefinition, setShowDefinition] = useState<boolean>(false);

    const handleSwipe = (direction: SwipeDirection) => {
        if (direction === 'left') {
            // 左スワイプ => 単語を知っていた => 次のカードへ
            setShowDefinition(false);
            setCurrentIndex((prev) => prev + 1);
        } else if (direction === 'right') {
            // 右スワイプ => 単語を知らなかった => 答えを表示
            setShowDefinition(true);
        } else if (direction === 'up') {
            // 上スワイプ => 答え表示中のみ次へ
            if (showDefinition) {
                setShowDefinition(false);
                setCurrentIndex((prev) => prev + 1);
            }
        }
        // 今回は down スワイプは特に処理をしない
    };

    // すべてのカードが終わった場合のメッセージ
    if (currentIndex >= words.length) {
        return (
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <h2>学習完了です！</h2>
            </div>
        );
    }

    const currentWord = words[currentIndex];

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
            <TinderCard
                key={currentWord.id}
                onSwipe={handleSwipe}
                preventSwipe={['down']} // 下スワイプは無効化
            >
                <div
                    style={{
                        width: '300px',
                        height: '400px',
                        padding: '20px',
                        backgroundColor: '#fefefe',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        textAlign: 'center',
                    }}
                >
                    {showDefinition ? currentWord.definition : currentWord.term}
                </div>
            </TinderCard>
        </div>
    );
};
