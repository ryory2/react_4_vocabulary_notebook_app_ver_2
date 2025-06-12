/**
 * 環境変数を安全に取得するためのヘルパー関数
 * @param key - 環境変数のキー (例: "VITE_API_DOMAIN")
 * @param defaultValue - 環境変数が未定義の場合に使われるデフォルト値
 * @returns 環境変数の値、またはデフォルト値
 * @throws 必須の環境変数（デフォルト値なし）が未定義の場合にエラーをスロー
 */
const getEnvVar = (key: keyof ImportMetaEnv, defaultValue?: string): string => {
    const value = import.meta.env[key] || defaultValue;
    if (value === undefined) {
        throw new Error(`環境変数 ${key} が設定されていません。 .env ファイルを確認してください。`);
    }
    return value;
};

/**
 * アプリケーション全体で使う設定値をまとめたオブジェクト
 * 各コンポーネントは、ここから設定値を参照する
 */
export const config = {
    // API関連の設定
    api: {
        // VITE_API_DOMAIN は必須。未設定ならエラーにする
        domain: getEnvVar('VITE_API_DOMAIN'),
        // APIのベースURLを組み立てる
        baseUrl: `${getEnvVar('VITE_API_DOMAIN')}/api/v1`,
    },

    // 認証関連の設定
    auth: {
        google: {
            // GoogleのクライアントIDも必須
            clientId: getEnvVar('VITE_GOOGLE_CLIENT_ID'),
            // コールバックURLも必須
            redirectUri: getEnvVar('VITE_GOOGLE_OAUTH_REDIRECT_URI'),
        },
    },
};

// 型安全性を確保するために config オブジェクトに型を付ける (オプション)
type AppConfig = typeof config;
export const appConfig: AppConfig = config;