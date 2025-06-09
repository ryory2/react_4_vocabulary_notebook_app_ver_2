import { WordLevels } from '../constants';

// WordLevelsオブジェクトの値（0, 1, 2）を型として取り出す
type WordLevel = typeof WordLevels[keyof typeof WordLevels];

// src/types/word.ts
export interface Word {
    word_id: string;
    term: string;
    definition: string;
    level: WordLevel; // FlashcardApp で使われているので残しておきます
    deletedAt: string | null; // 削除日 (ISO文字列形式を想定)
}