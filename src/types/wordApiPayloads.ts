// src/types/wordApiPayloads.ts
import { Word } from './word';

// 単語作成時のペイロード型
export type CreateWordPayload = Omit<Word, 'word_id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'level'> & { level?: number };
// createdAt, updatedAt は通常サーバー側で設定されるため Omit

// 単語更新時のペイロード型 (全てのフィールドがオプショナル)
export type UpdateWordPayload = Partial<Omit<Word, 'word_id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'level'>>;