import React from 'react';
import { usePageMeta } from '../hooks/usePageMeta';

const PrivacyPolicyPage: React.FC = () => {
    const pageMeta = usePageMeta('privacyPolicy');
    return (
        <>
            {pageMeta}
            <div className="prose max-w-4xl mx-auto p-4 sm:p-6">
                <h1>プライバシーポリシー</h1>
                <p>最終更新日: 2025年06月01日</p>

                <h2>1. はじめに</h2>
                <p>
                    Kioku（以下、「当サービス」といいます）は、ユーザーの皆様のプライバシーを尊重し、個人情報を保護するために細心の注意を払っています。このプライバシーポリシーは、当サービスが収集する情報、その利用方法、およびユーザーの皆様の権利について説明するものです。
                </p>

                <h2>2. 収集する情報</h2>
                <p>
                    当サービスは、以下の情報を収集することがあります。
                </p>
                <ul>
                    <li><strong>アカウント登録情報:</strong> ユーザー名、メールアドレス、ハッシュ化されたパスワードなど。</li>
                    <li><strong>ソーシャルログイン情報:</strong> Googleアカウントでログインする場合、Googleから提供される名前、メールアドレス、プロフィール写真など。</li>
                    <li><strong>学習データ:</strong> 登録された単語、学習進捗レベル、復習日時など。</li>
                    <li><strong>Cookieおよび利用状況データ:</strong> サービスの利用状況を分析し、改善するためにCookieやアクセスログを収集します。</li>
                </ul>

                <h2>3. 情報の利用目的</h2>
                <p>
                    収集した情報は、以下の目的で利用します。
                </p>
                <ul>
                    <li>サービスの提供、維持、改善のため。</li>
                    <li>ユーザー認証およびアカウント管理のため。</li>
                    <li>お問い合わせへの対応のため。</li>
                    <li>利用規約に違反する行為への対応のため。</li>
                </ul>

                <h2>お問い合わせ</h2>
                <p>
                    このプライバシーポリシーに関するご質問は、お問い合わせフォームよりご連絡ください。
                </p>
            </div>
        </>
    );
};

export default PrivacyPolicyPage;