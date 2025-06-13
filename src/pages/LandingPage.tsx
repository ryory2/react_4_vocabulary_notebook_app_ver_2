import React from 'react';
import { usePageMeta } from '../hooks/usePageMeta';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
    const pageMeta = usePageMeta('landing');
    return (
        <>
            {pageMeta}
            <div className="flex flex-col items-center justify-center text-center min-h-[70vh] p-4 sm:p-8">
                {/* ★ h1: スマホでは text-3xl、mdサイズ以上で text-4xl に */}
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
                    Kioku
                </h1>
                {/* ★ p: スマホでは text-base (標準)、mdサイズ以上で text-lg に */}
                <p className="text-base md:text-lg text-gray-600 mb-8 max-w-2xl">
                    効率的な単語学習を、今すぐ始めましょう。
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

                {/* 機能紹介セクションの例 (任意) */}
                <div className="mt-20 w-full max-w-4xl">
                    <h2 className="text-2xl font-bold mb-6 text-gray-700">主な機能</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 bg-white rounded-lg shadow">
                            <h3 className="text-xl font-semibold mb-2">スマートな復習</h3>
                            <p className="text-gray-600">忘却曲線に基づいた最適なタイミングで復習を促します。</p>
                        </div>
                        <div className="p-6 bg-white rounded-lg shadow">
                            <h3 className="text-xl font-semibold mb-2">シンプルな単語管理</h3>
                            <p className="text-gray-600">登録・編集・削除が簡単に行え、学習に集中できます。</p>
                        </div>
                        <div className="p-6 bg-white rounded-lg shadow">
                            <h3 className="text-xl font-semibold mb-2">どこでも学習</h3>
                            <p className="text-gray-600">PCでもスマホでも、いつでもどこでも学習を続けられます。</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LandingPage;