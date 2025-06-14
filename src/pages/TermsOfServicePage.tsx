import React from 'react';
import { usePageMeta } from '../hooks/usePageMeta';

const TermsOfServicePage: React.FC = () => {
    const pageMeta = usePageMeta('termsOfService');
    return (
        <>
            {pageMeta}
            <div className="prose max-w-4xl mx-auto p-4 sm:p-6">
                <h1>利用規約</h1>
                <p>最終更新日: 2025年06月01日</p>

                <h2>第1条 (適用)</h2>
                <p>
                    本利用規約は、Kioku（以下、「当サービス」といいます）の利用に関する全ての事項に適用されます。ユーザーの皆様は、本規約に同意の上、当サービスをご利用いただくものとします。
                </p>

                <h2>第2条 (禁止事項)</h2>
                <p>
                    ユーザーは、当サービスの利用にあたり、以下の行為をしてはなりません。
                </p>
                <ul>
                    <li>法令または公序良俗に違反する行為</li>
                    <li>犯罪行為に関連する行為</li>
                    <li>当サービスのサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
                    <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
                    <li>他のユーザーに成りすます行為</li>
                </ul>
            </div>
        </>
    );
};

export default TermsOfServicePage;