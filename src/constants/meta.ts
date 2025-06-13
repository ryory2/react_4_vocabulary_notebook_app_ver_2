// 各ページのメタ情報を定義
interface PageMetaInfo {
    title: string;
    description?: string; // `?` を付けてオプショナルなプロパティにする
}

// アプリケーション全体のベースタイトル
const BASE_TITLE = 'Kioku';
const SEPARATOR = '-';

// 各ページのメタ情報を定義
export const PAGE_META: Record<string, PageMetaInfo> = {
    // --- Public Pages ---
    landing: {
        title: 'kioku - 単語学習プラットフォーム',
        description: 'Kiokuは、忘却曲線に基づいた最適なタイミングで復習を促す、新しい単語学習プラットフォームです。',
    },
    login: {
        title: 'ログイン',
    },
    register: {
        title: '新規登録',
    },
    verifyEmail: {
        title: 'アカウント有効化',
    },
    forgotPassword: {
        title: 'パスワード再設定',
    },
    resetPassword: {
        title: '新しいパスワードの設定',
    },
    privacyPolicy: {
        title: 'プライバシーポリシー',
    },
    termsOfService: {
        title: '利用規約',
    },

    // --- Protected Pages ---
    dashboard: {
        title: 'ダッシュボード',
    },
    flashcards: {
        title: 'フラッシュカード学習',
    },
    admin: {
        title: '単語管理',
    },

    // --- Error Page ---
    notFound: {
        title: 'ページが見つかりません',
    },
};

// ページのキーの型を生成 ( 'login' | 'register' | ... )
export type PageKey = keyof typeof PAGE_META;

/**
 * ページキーに基づいて完全なページタイトルを生成するヘルパー関数
 * @param pageKey - ページの識別子 (PAGE_METAのキー)
 * @returns "ページタイトル - VocabKeep" のような形式の文字列
 */
export const getFullPageTitle = (pageKey: PageKey): string => {
    const pageTitle = PAGE_META[pageKey]?.title;
    if (!pageTitle) {
        return BASE_TITLE;
    }
    // Landingページはアプリ名を付けずにそのまま返す
    if (pageKey === 'landing') {
        return `${pageTitle} | ${BASE_TITLE}`;
    }
    return `${pageTitle} ${SEPARATOR} ${BASE_TITLE}`;
};