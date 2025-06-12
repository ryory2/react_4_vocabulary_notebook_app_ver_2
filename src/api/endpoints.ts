import apiClient from './apiClient';
import { Word } from '../types/word';
import { CreateWordPayload, UpdateWordPayload } from '../types/wordApiPayloads';
import { ForgotPasswordPayload, LoginPayload, LoginResponse, RegisterPayload, RegisterResponse, ResetPasswordPayload } from '../types/auth.ts';
import { ReviewSummary } from '../types/review.ts';

// --- Auth関連 ---
// (必要であればここに /auth/me などのAPI呼び出し関数も定義)
export const createAccount = async (data: RegisterPayload): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>('/register', data);
    return response.data;
};

export const loginUser = async (data: LoginPayload): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/login', data);
    return response.data;
};

export const verifyAccount = async (token: string): Promise<{ message: string }> => {
    // GETリクエストでクエリパラメータとしてトークンを送信
    const response = await apiClient.get<{ message: string }>(`/verify-email?token=${token}`);
    return response.data;
};

export const requestPasswordReset = async (data: ForgotPasswordPayload): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/forgot-password', data);
    return response.data;
};

export const resetPassword = async (data: ResetPasswordPayload): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/reset-password', data);
    return response.data;
};

export const loginWithGoogleCode = async (code: string): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/google/callback', { code });
    return response.data;
};

// --- Word関連 ---
const WORDS_ENDPOINT = '/words';

export const getWords = async (): Promise<Word[]> => {
    const response = await apiClient.get<Word[]>(WORDS_ENDPOINT);
    return response.data;
};

export const createWord = async (data: CreateWordPayload): Promise<Word> => {
    const response = await apiClient.post<Word>(WORDS_ENDPOINT, data);
    return response.data;
};

export const updateWord = async (wordId: string, data: UpdateWordPayload): Promise<Word> => {
    const response = await apiClient.patch<Word>(`${WORDS_ENDPOINT}/${wordId}`, data);
    return response.data;
};

export const deleteWord = async (wordId: string): Promise<void> => {
    await apiClient.delete(`${WORDS_ENDPOINT}/${wordId}`);
};


// --- Review関連 ---
const REVIEWS_ENDPOINT = '/reviews';

export const getReviewableWords = async (): Promise<Word[]> => {
    const response = await apiClient.get<Word[]>(REVIEWS_ENDPOINT);
    return response.data;
};

export const submitReviewResult = async (wordId: string, isCorrect: boolean): Promise<void> => {
    await apiClient.put(`/reviews/words/${wordId}/result`, { is_correct: isCorrect });
};

export const getReviewSummary = async (): Promise<ReviewSummary> => {
    const response = await apiClient.get<ReviewSummary>('/reviews/summary');
    return response.data;
};
