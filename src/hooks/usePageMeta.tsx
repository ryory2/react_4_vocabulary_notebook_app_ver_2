import { Helmet } from 'react-helmet-async';
import { PAGE_META, getFullPageTitle, PageKey } from '../constants/meta';

/**
 * ページの<head>内のメタ情報（title, descriptionなど）を動的に設定するカスタムフック
 * @param pageKey - ページの識別子 (constants/meta.tsで定義)
 */
export const usePageMeta = (pageKey: PageKey) => {
    const pageInfo = PAGE_META[pageKey] || PAGE_META.notFound;
    const title = getFullPageTitle(pageKey);

    return (
        <Helmet>
            <title>{title}</title>
            {pageInfo.description && <meta name="description" content={pageInfo.description} />}
            {/* 他に必要なOGPタグなどもここに追加できる */}
        </Helmet>
    );
};