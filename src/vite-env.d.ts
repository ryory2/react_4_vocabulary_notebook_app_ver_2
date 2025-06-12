/// <reference types="vite/client" />
// import.meta.env の型を拡張
interface ImportMetaEnv {
    readonly VITE_API_DOMAIN: string;
    readonly VITE_GOOGLE_CLIENT_ID: string;
    readonly VITE_GOOGLE_OAUTH_REDIRECT_URI: string;
    // 他の環境変数を追加する場合はここにも記述
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}