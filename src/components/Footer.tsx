// src/components/Footer.tsx
import { FC } from 'react';
import { Link } from 'react-router-dom';

const Footer: FC = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="bg-gray-100 border-t border-gray-200">
            <div className="container mx-auto px-4 py-6 text-sm text-gray-500">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                    <p>© {currentYear} Kioku. All Rights Reserved.</p>
                    <nav className="flex gap-4 mt-4 sm:mt-0">
                        <Link to="/terms-of-service" className="hover:text-gray-800 hover:underline">
                            利用規約
                        </Link>
                        <Link to="/privacy-policy" className="hover:text-gray-800 hover:underline">
                            プライバシーポリシー
                        </Link>
                    </nav>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
