// src/components/Layout.tsx
// アプリ全体の枠組み（ヘッダー、メインコンテンツ、フッター）を定義
import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout: FC = () => {
    return (
        // <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        // <div className="flex flex-col min-h-screen bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100">
        // <div className='flex flex-col min-h-screen bg-chromeDark-bg text-chromeDark-text'>
        <div className='flex flex-col min-h-screen bg-c-bg-neutral text-c-text-body'>
            {/* ヘッダー */}
            <Header />
            {/* Main content (Outlet) */}
            {/* <main style={{ flex: '1', padding: '1rem' }}> */}
            {/* ※高さ残りの余白をすべてメインコンテンツに割り当てる */}
            {/* ※レスポンシブに最大幅を制限しつつ中央寄せ (mx-auto)  */}
            <main className="flex-1 container mx-auto p-4">
                <div className="bg-c-bg-base p-4 shadow">
                    {/* 「<Outlet />」その配下にあるルートに応じて切り替わるページコンテンツが差し込まれる場所 */}
                    <Outlet />
                </div>
            </main>
            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Layout;
