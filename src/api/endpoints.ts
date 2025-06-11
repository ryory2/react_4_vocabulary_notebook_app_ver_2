import apiClient from './apiClient';
import { Word } from '../types/word';
import { CreateWordPayload, UpdateWordPayload } from '../types/wordApiPayloads';
import { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse } from '../types/auth.ts';

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