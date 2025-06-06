// src/components/Header.tsx
import { FC, useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom'; // NavLinkを追加
import userIcon from '../assets/images/kkrn_icon_user_1.svg';

const Header: FC = () => {
    // ユーザーメニュー用のState
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    // ★ ハンバーガーメニュー用のStateを追加
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const userMenuRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null); // ★ モバイルメニュー用のref

    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    // ★ ハンバーガーメニューの切り替え
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // ドロップダウンメニューの外側をクリックしたときに閉じるロジック
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
                // ハンバーガーボタン自体は除外する
                const hamburgerButton = document.getElementById('hamburger-button');
                if (hamburgerButton && hamburgerButton.contains(event.target as Node)) {
                    return;
                }
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []); // 依存配列を空にして初回のみ実行

    // NavLink用のスタイル関数
    const navLinkStyle = ({ isActive }: { isActive: boolean }) =>
        `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`;


    return (
        <header className="bg-white p-4 shadow-md sticky top-0 z-30">
            <div className="container mx-auto flex items-center justify-between">
                {/* ロゴ */}
                <h1 className="text-xl font-bold text-gray-800">
                    <Link to="/">VocabKeep</Link>
                </h1>

                {/* 右側のメニュー群 */}
                <div className="flex items-center">

                    {/* PC用のナビゲーション (md以上で表示) */}
                    <nav className="hidden md:flex md:gap-2 md:mr-4">
                        <NavLink to="/" className={navLinkStyle}>Home</NavLink>
                        <NavLink to="/about" className={navLinkStyle}>About</NavLink>
                        <NavLink to="/sample" className={navLinkStyle}>Sample</NavLink>
                        <NavLink to="/testpage" className={navLinkStyle}>Testpage</NavLink>
                        <NavLink to="/vocablary-app" className={navLinkStyle}>VocablaryApp</NavLink>
                    </nav>

                    {/* ユーザーメニュー (PC/スマホ共通) */}
                    <div className="relative" ref={userMenuRef}>
                        <button
                            onClick={toggleUserMenu}
                            className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:bg-gray-300 transition-colors"
                        >
                            <img src={userIcon} alt="ユーザーアイコン" className="w-full h-full rounded-full object-cover" />
                        </button>
                        {isUserMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                                <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsUserMenuOpen(false)}>
                                    管理画面
                                </Link>
                                {/* 他のメニュー */}
                            </div>
                        )}
                    </div>

                    {/* ハンバーガーボタン (md未満で表示) */}
                    <div className="ml-2 md:hidden" ref={mobileMenuRef}>
                        <button
                            id="hamburger-button"
                            onClick={toggleMobileMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            aria-controls="mobile-menu"
                            aria-expanded={isMobileMenuOpen}
                        >
                            <span className="sr-only">メインメニューを開く</span>
                            {isMobileMenuOpen ? (
                                // 閉じるアイコン (X)
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                // ハンバーガーアイコン (三)
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* モバイル用メニュー (スライドイン) */}
            <div
                className={`md:hidden absolute top-full left-0 w-full bg-white shadow-lg transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'transform translate-x-0' : 'transform -translate-x-full'
                    }`}
                id="mobile-menu"
            >
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <NavLink to="/" className={`block ${navLinkStyle({ isActive: location.pathname === '/' })}`} onClick={() => setIsMobileMenuOpen(false)}>Home</NavLink>
                    <NavLink to="/about" className={`block ${navLinkStyle({ isActive: location.pathname === '/about' })}`} onClick={() => setIsMobileMenuOpen(false)}>About</NavLink>
                    <NavLink to="/sample" className={`block ${navLinkStyle({ isActive: location.pathname === '/sample' })}`} onClick={() => setIsMobileMenuOpen(false)}>Sample</NavLink>
                    <NavLink to="/testpage" className={`block ${navLinkStyle({ isActive: location.pathname === '/testpage' })}`} onClick={() => setIsMobileMenuOpen(false)}>Testpage</NavLink>
                    <NavLink to="/vocablary-app" className={`block ${navLinkStyle({ isActive: location.pathname === '/vocablary-app' })}`} onClick={() => setIsMobileMenuOpen(false)}>VocablaryApp</NavLink>
                </div>
            </div>
        </header>
    );
};

export default Header;