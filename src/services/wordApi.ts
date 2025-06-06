// src/services/wordApi.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { Word } from '../types/word';
import { ApiErrorResponse } from '../types/api';
import { CreateWordPayload, UpdateWordPayload } from '../types/wordApiPayloads';

const API_DOMAIN = import.meta.env.VITE_APP_API_DOMAIN || 'http://localhost:3000'; // json-serverのポートに合わせる

// テナントIDを取得
const getTenantId = (): string | null => {
    // return localStorage.getItem('currentTenantId');
    return "cf99663d-476e-4d71-b5af-06e282088a10";
};

const apiClient: AxiosInstance = axios.create({
    baseURL: `${API_DOMAIN}/api/v1`,
    // headers: { // 静的な共通ヘッダーはここに書く
    //   'X-App-Version': '1.0.0',
    // }
});

// リクエストインターセプター（リクエスト前に処理を設定）
// 動的な共通ヘッダーはここに書く
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // テナントID
        const tenantId = getTenantId();
        if (tenantId) {
            config.headers['X-Tenant-ID'] = tenantId;
        } else {
            console.warn('テナントIDが設定されていません。');
        }
        // 認証ヘッダー
        // const token = localStorage.getItem('authToken'); // 例: ローカルストレージからトークンを取得
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        // リクエストエラーの処理
        return Promise.reject(error);
    }
);

const handleApiError = (error: unknown, defaultMessage: string): never => {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
        if (error.response && error.response.data && error.response.data.error) {
            // APIからの詳細なエラーメッセージをスロー
            // 必要であれば、ここでエラーをラップしてカスタムエラーオブジェクトをスローしても良い
            throw new Error(error.response.data.error.message || defaultMessage);
        } else if (error.request) {
            throw new Error('サーバーからの応答がありません。ネットワークを確認してください。');
        } else {
            throw new Error('リクエストのセットアップ中にエラーが発生しました。');
        }
    }
    // Axiosエラー以外、または予期しない構造の場合
    if (error instanceof Error) {
        throw new Error(error.message || defaultMessage);
    }
    throw new Error(defaultMessage); // 最悪の場合のフォールバック
};

const WORDS_ENDPOINT = '/words'; // APIClientのbaseURLからの相対パス

// 単語を登録する
export const createWord = async (wordData: CreateWordPayload): Promise<Word> => {
    try {
        const response = await apiClient.post<Word>(WORDS_ENDPOINT, wordData);
        return response.data;
    } catch (err) {
        // console.error('Error creating word:', err); // デバッグ用ログは残しても良い
        return handleApiError(err, '単語の登録に失敗しました。'); // ★共通エラーハンドラを利用
    }
};


export const getWords = async (): Promise<Word[]> => {
    try {
        const response = await apiClient.get<Word[]>(WORDS_ENDPOINT);
        return response.data.map(word => ({
            ...word,
            deletedAt: word.deletedAt || null,
        }));
    } catch (err) {
        return handleApiError(err, '単語の取得に失敗しました。'); // ★共通エラーハンドラを利用
    }
};


// 単語の一部または全体を更新する関数
export const updateWord = async (id: string, wordData: UpdateWordPayload): Promise<Word> => {
    try {
        const response = await apiClient.patch<Word>(WORDS_ENDPOINT + `/${id}`, wordData);
        return response.data;
    } catch (err) {
        return handleApiError(err, '単語の更新に失敗しました。'); // ★共通エラーハンドラを利用
    }
};


// 論理削除
export const softDeleteWord = async (id: string): Promise<void> => {
    try {
        // deleteメソッドのレスポンス型は通常 void か、何か特定のメッセージオブジェクト
        // バックエンドがWordオブジェクトを返す場合は apiClient.delete<Word> で良いが、
        // 通常は成功を示すステータスコードのみ（204 No Contentなど）
        await apiClient.delete<void>(WORDS_ENDPOINT + `/${id}`); // レスポンスボディを期待しない場合は void
    } catch (err) {
        return handleApiError(err, '単語の削除に失敗しました。'); // ★共通エラーハンドラを利用
    }
};

// (物理削除が必要な場合)
// export const hardDeleteWord = async (id: number): Promise<void> => {
//   await axios.delete(`${API_BASE_URL}/${id}`);
// };