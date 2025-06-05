// src/components/Header.tsx
import { FC, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import userIcon from '../assets/images/kkrn_icon_user_1.svg'; // 画像をインポート

const Header: FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    return (
        <header className="bg-c-bg-base p-4 shadow">
            <div className="container mx-auto flex items-center justify-between">
                <h1 className="text-lg font-bold">
                    <Link to="/">VocabKeep</Link>
                </h1>
                <div className="flex items-center">
                    <nav className="flex gap-4 mr-4">
                        <Link to="/">Home</Link>
                        <Link to="/about">About</Link>
                        <Link to="/sample">Sample</Link>
                        <Link to="/testpage">Testpage</Link>
                        <Link to="/vocablary-app">VocablaryApp</Link>
                    </nav>

                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={toggleMenu}
                            className="w-10 h-10 rounded-full bg-gray-200 text-white flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 hover:bg-gray-300 transition-colors" // 背景色を調整 (画像が見えるように)
                            aria-label="ユーザーメニューを開く"
                            aria-expanded={isMenuOpen}
                            aria-haspopup="true"
                        >
                            {/* 文字の代わりに画像を表示 */}
                            <img
                                src={userIcon}
                                alt="ユーザーアイコン"
                                className="w-full h-full rounded-full object-cover" // 画像がボタンに合わせて表示されるように調整
                            />
                        </button>

                        {isMenuOpen && (
                            <div
                                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5"
                                role="menu"
                                aria-orientation="vertical"
                                aria-labelledby="user-menu-button"
                            >
                                <Link
                                    to="/admin"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                    role="menuitem"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    管理画面
                                </Link>
                                {/* 他のメニューアイテム */}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;