import React from 'react';
import { usePageMeta } from '../hooks/usePageMeta';
import { Link } from 'react-router-dom';
import flashcardDemoWebm from '../assets/videos/flashcard.webm';
import wordManageDemoWebm from '../assets/videos/word_manage.webm';

const LandingPage: React.FC = () => {
    const pageMeta = usePageMeta('landing');
    return (
        <>
            {pageMeta}
            <div className="flex flex-col items-center justify-center text-center p-4 sm:p-8">
                {/* ★ h1: スマホでは text-3xl、mdサイズ以上で text-4xl に */}
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
                    Kioku
                </h1>
                {/* ★ p: スマホでは text-base (標準)、mdサイズ以上で text-lg に */}
                <p className="text-base md:text-lg text-gray-600 mb-8 max-w-2xl">
                    効率的な単語学習を、今すぐ始めましょう。
                    <br className="hidden sm:block" />
                    あなたの語彙力を、次のレベルへ。
                </p>
                {/* ★ ボタンコンテナ: スマホでは縦積み(flex-col)、smサイズ以上で横並び(flex-row) に */}
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <Link
                        to="/register"
                        // ★ ボタンのサイズや文字サイズも調整
                        className="w-full sm:w-auto bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                    >
                        無料で新規登録
                    </Link>
                    <Link
                        to="/login"
                        // ★ ボタンのサイズや文字サイズも調整
                        className="w-full sm:w-auto bg-gray-200 text-gray-800 font-bold py-3 px-8 rounded-lg hover:bg-gray-300 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                    >
                        ログイン
                    </Link>
                </div>

                {/* --- 機能紹介セクション --- */}
                <div className="mt-12 md:mt-24 w-full max-w-6xl space-y-24"> {/* ★ max-w を少し広げました */}

                    {/* 機能1: スマートな復習 */}
                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16"> {/* ★ gapを広げました */}
                        <div className="w-full md:w-5/12 text-center md:text-left"> {/* ★ テキスト幅を調整 */}
                            <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-gray-800">スマートな復習</h2>
                            <p className="text-gray-600 leading-relaxed lg:text-lg">
                                忘却曲線に基づいた最適なタイミングで復習を促し、記憶の定着を強力にサポートします。
                                シンプルな操作で、学習だけに集中できます。
                            </p>
                        </div>
                        <div className="w-full md:w-7/12"> {/* ★ 動画の幅を調整 */}
                            {/* ▼▼▼▼▼ 修正箇所 ▼▼▼▼▼ */}
                            <div className="aspect-video w-full overflow-hidden rounded-lg shadow-xl">
                                <video
                                    className="w-full h-full object-cover" // ★ object-cover を追加
                                    autoPlay loop muted playsInline
                                >
                                    <source src={flashcardDemoWebm} type="video/webm" />
                                    {/* <source src={flashcardDemoMp4} type="video/mp4" /> */}
                                    お使いのブラウザは動画の表示に対応していません。
                                </video>
                            </div>
                            {/* ▲▲▲▲▲ 修正箇所 ▲▲▲▲▲ */}
                        </div>
                    </div>

                    {/* 機能2: シンプルな単語管理 */}
                    <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16">
                        <div className="w-full md:w-5/12 text-center md:text-left">
                            <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-gray-800">シンプルな単語管理</h2>
                            <p className="text-gray-600 leading-relaxed lg:text-lg">
                                登録、編集、検索がストレスなく簡単に行えます。
                                自分だけのオリジナル単語帳を育てましょう。
                            </p>
                        </div>
                        <div className="w-full md:w-7/12">
                            {/* ▼▼▼▼▼ 修正箇所 ▼▼▼▼▼ */}
                            <div className="aspect-video w-full overflow-hidden rounded-lg shadow-xl">
                                <video
                                    className="w-full h-full object-cover" // ★ object-cover を追加
                                    autoPlay loop muted playsInline
                                >
                                    <source src={wordManageDemoWebm} type="video/webm" />
                                    {/* <source src={wordManageDemoMp4} type="video/mp4" /> */}
                                    お使いのブラウザは動画の表示に対応していません。
                                </video>
                            </div>
                            {/* ▲▲▲▲▲ 修正箇所 ▲▲▲▲▲ */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LandingPage;