// src/types/auth.ts (例)
export interface LoginPayload {
    email: string;
    password: string;
}
export interface LoginResponse {
    access_token: string;
}

export interface ForgotPasswordPayload {
    email: string;
}

export interface ResetPasswordPayload {
    token: string;
    password: string;
}

// 新規登録API (`/register`) に送信するデータ(ペイロード)の型
export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
}

// 新規登録APIからの成功レスポンスの型
// バックエンドの model.TenantResponse に対応
export interface RegisterResponse {
    tenant_id: string; // uuidはstringとして扱う
    name: string;
    email: string;
    is_active: boolean;
    created_at: string; // ISO 8601形式の文字列として扱う
}