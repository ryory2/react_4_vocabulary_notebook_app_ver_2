// src/components/Header.tsx

import { FC, useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import userIcon from '../assets/images/kkrn_icon_user_1.svg';

// 認証状態を管理するカスタムフック（これは仮の実装です）
// 実際には、Auth0, Firebase, Context APIなどを使って実装します。
const useAuth = () => {
    // ここではログイン状態を切り替えるためのダミーのStateを使います
    const [user, setUser] = useState<{ name: string; avatarUrl: string } | null>(null);

    const login = () => setUser({ name: '田中 太郎', avatarUrl: userIcon });
    const logout = () => setUser(null);

    return { user, login, logout };
};


const Header: FC = () => {
    const { user, login, logout } = useAuth(); // ログイン状態を取得

    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const userMenuRef = useRef<HTMLDivElement>(null);

    // --- メニュー開閉ロジック ---
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeAllMenus = () => {
        setIsUserMenuOpen(false);
        setIsMobileMenuOpen(false);
    };

    // 外側クリックでメニューを閉じる
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // --- スタイル定義 ---
    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'
        }`;

    const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
        `block ${navLinkClass({ isActive })}`;


    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 p-4 sticky top-0 z-40">
            <div className="container mx-auto flex items-center justify-between">
                {/* ロゴ */}
                <Link to="/" className="text-xl font-bold text-gray-800" onClick={closeAllMenus}>
                    VocabKeep
                </Link>

                {/* PC用ナビゲーション */}
                <nav className="hidden md:flex items-center gap-2">
                    <NavLink to="/vocablary-app" className={navLinkClass}>フラッシュカード</NavLink>
                    <NavLink to="/about" className={navLinkClass}>About</NavLink>
                </nav>

                {/* 右側のメニュー群 */}
                <div className="flex items-center gap-4">
                    {/* ★ ログイン状態に応じて表示を切り替え */}
                    {user ? (
                        // --- ログイン後の表示 ---
                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center gap-2 focus:outline-none"
                            >
                                <img src={user.avatarUrl} alt="ユーザーアバター" className="w-9 h-9 rounded-full object-cover border-2 border-gray-300" />
                                <span className="hidden sm:inline text-sm font-medium text-gray-700">{user.name}</span>
                            </button>

                            {/* ユーザーメニューのドロップダウン */}
                            <div className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-out ${isUserMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
                                <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={closeAllMenus}>管理画面</Link>
                                <button onClick={() => { logout(); closeAllMenus(); }} className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                                    ログアウト
                                </button>
                            </div>
                        </div>
                    ) : (
                        // --- ログイン前の表示 (PC) ---
                        <div className="hidden md:flex items-center gap-2">
                            <button onClick={login} className="text-sm font-medium text-gray-600 hover:text-blue-600">ログイン</button>
                            <button onClick={login} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">新規登録</button>
                        </div>
                    )}

                    {/* ハンバーガーボタン (スマホ用) */}
                    <div className="md:hidden">
                        <button onClick={toggleMobileMenu} className="p-2 rounded-md text-gray-500 hover:bg-gray-100">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* モバイル用ドロップダウンメニュー */}
            <div className={`md:hidden absolute top-full left-0 w-full bg-white shadow-md transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-96' : 'max-h-0'}`}>
                <div className="p-4">
                    <nav className="flex flex-col gap-2">
                        <NavLink to="/vocablary-app" className={mobileNavLinkClass} onClick={closeAllMenus}>フラッシュカード</NavLink>
                        <NavLink to="/about" className={mobileNavLinkClass} onClick={closeAllMenus}>About</NavLink>
                        <hr className="my-2" />
                        {/* ★ ログイン状態に応じて表示を切り替え (モバイル) */}
                        {!user && (
                            <>
                                <button onClick={() => { login(); closeAllMenus(); }} className="w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md">ログイン</button>
                                <button onClick={() => { login(); closeAllMenus(); }} className="w-full mt-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">新規登録</button>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;