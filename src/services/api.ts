import axios from 'axios';
import { Word } from '../types/word'; // Word型を共通の型定義ファイルからインポート
import { ApiErrorResponse } from '../types/api';

const API_DOMAIN = import.meta.env.VITE_APP_API_DOMAIN || 'http://localhost:4000';
const API_BASE_URL = `${API_DOMAIN}/api/v1`;

// テナントIDを取得
const getTenantId = (): string | null => {
    // return localStorage.getItem('currentTenantId');
    return "cf99663d-476e-4d71-b5af-06e282088a10";
};

// axiosのインスタンスを作成し、ベースURLやタイムアウトを設定
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    // timeout: 5000, // 5秒でタイムアウト
});

apiClient.interceptors.request.use(
    (config) => {
        // リクエストが送信される前に実行される処理

        // 1. テナントIDを取得
        const tenantId = getTenantId();

        // 2. テナントIDが存在すれば、ヘッダーに追加
        if (tenantId) {
            config.headers['X-Tenant-ID'] = tenantId;
        } else {
            console.warn('テナントIDが設定されていません。');
        }

        // 3. 設定を適用したconfigを返す
        return config;
    },
    (error) => {
        // リクエスト設定でエラーが発生した場合の処理
        return Promise.reject(error);
    }
);

const REVIEWS_ENDPOINT = '/reviews'; // APIClientのbaseURLからの相対パス

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

export const fetchWordsApi = async (): Promise<Word[]> => {
    try {
        const response = await apiClient.get<Word[]>('/words');
        // APIのレスポンス形式が異なる場合はここで整形する
        // 例: return response.data.data.words;
        return response.data;
    } catch (err) {
        throw handleApiError(err, '単語データの取得に失敗しました。');
    }
};

export const fetchReviewableWordsApi = async (): Promise<Word[]> => {
    try {
        const response = await apiClient.get<Word[]>('/reviews');
        // APIのレスポンス形式が異なる場合はここで整形する
        // 例: return response.data.data.words;
        return response.data;
    } catch (err) {
        throw handleApiError(err, '単語データの取得に失敗しました。');
    }
};

export const updateWordLevelApi = async (wordId: string, isCorrect: boolean): Promise<void> => {
    try {
        // PATCHメソッドでレベルだけを更新するのが効率的
        await apiClient.put(REVIEWS_ENDPOINT + `/${wordId}/result`, { is_correct: isCorrect });
    } catch (err) {
        throw handleApiError(err, '単語レベルの更新に失敗しました。');
    }
};