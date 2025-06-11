import axios, { AxiosError } from 'axios';
import { ApiErrorResponse } from '../types/api'; // ★ご提示の型をインポート

// グローバルなログアウト関数を保持
let globalLogout: (() => void) | null = null;
export const setGlobalLogout = (logoutFunc: () => void) => {
    globalLogout = logoutFunc;
};

const apiDomain = import.meta.env.VITE_APP_API_DOMAIN || 'http://localhost:8080';


const apiClient = axios.create({
    baseURL: `${apiDomain}/api/v1`,
});

// リクエストインターセプター (JWT付与)
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// レスポンスインターセプター (401エラーハンドリング)
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            if (globalLogout) {
                // alertはUIをブロックするので、ここではconsole.warnに留めるか、
                // Toast通知などのUIフィードバックを検討しても良い
                console.warn('Session expired. Logging out.');
                globalLogout();
            }
        }
        return Promise.reject(error);
    }
);

// 汎用的なエラーメッセージ抽出ヘルパー
export const getApiErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError<ApiErrorResponse>(error) && error.response?.data?.error?.message) {
        return error.response.data.error.message;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return '予期せぬエラーが発生しました。';
};

export default apiClient;