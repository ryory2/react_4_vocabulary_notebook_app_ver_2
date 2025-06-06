// src/types/api.ts (例)

// 成功時のレスポンスデータの型 (Word型は既にありそうなので、ここではエラーレスポンスに集中)

// APIから返される標準的なエラーオブジェクトの構造
export interface ApiErrorDetail {
    message: string;
    code?: string; // アプリケーション固有のエラーコード
    field?: string; // バリデーションエラー時のフィールド名
    // 他のカスタムフィールド (例: validationErrors)
}

// APIエラーレスポンス全体の型
export interface ApiErrorResponse {
    error: ApiErrorDetail; // 単一エラーの場合
    // または errors: ApiErrorDetail[]; // 複数エラーを返す場合
}

// AxiosError のレスポンスデータとして上記の型を指定できるようにするためのユーティリティ型 (オプション)
// import { AxiosError } from 'axios';
// export type MyCustomAxiosError = AxiosError<ApiErrorResponse>;