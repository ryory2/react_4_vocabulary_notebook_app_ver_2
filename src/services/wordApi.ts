// src/services/wordApi.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { Word } from '../types/word';

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

const WORDS_ENDPOINT = '/words'; // APIClientのbaseURLからの相対パス

// 単語を登録する
export const createWord = async (wordData: Omit<Word, 'word_id' | 'deletedAt' | 'level'> & { level?: number }): Promise<Word> => {
    const response = await apiClient.post<Word>(WORDS_ENDPOINT, wordData);
    return response.data;
};

export const getWords = async (): Promise<Word[]> => {
    const response = await apiClient.get<Word[]>(WORDS_ENDPOINT);
    // APIレスポンスに deletedAt がない場合を考慮し、デフォルトで null を設定
    return response.data.map(word => ({
        ...word,
        deletedAt: word.deletedAt || null,
    }));
};

// 単語の一部または全体を更新する関数
export const updateWord = async (id: string, wordData: Partial<Omit<Word, 'word_id' | 'deletedAt' | 'level'>>): Promise<Word> => {
    const response = await apiClient.patch<Word>(WORDS_ENDPOINT + `/${id}`, wordData);
    return response.data;
};

// 論理削除
export const softDeleteWord = async (id: string): Promise<void> => {
    await apiClient.delete<Word>(WORDS_ENDPOINT + `/${id}`);
};

// (物理削除が必要な場合)
// export const hardDeleteWord = async (id: number): Promise<void> => {
//   await axios.delete(`${API_BASE_URL}/${id}`);
// };