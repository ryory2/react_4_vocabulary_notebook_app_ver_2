// src/types/word.ts
export interface Word {
    word_id: string;
    term: string;
    definition: string;
    level: number; // FlashcardApp で使われているので残しておきます
    deletedAt: string | null; // 削除日 (ISO文字列形式を想定)
}