// src/components/Header.tsx
import { FC } from 'react';
import { Link } from 'react-router-dom';

const Header: FC = () => {
    return (
        // <header style={{ background: '#eee', padding: '1rem' }}>
        <header className="bg-c-bg-base  p-4 shadow">
            <div className="container mx-auto flex items-center justify-between">
                <h1 className="text-lg font-bold">
                    <Link to="/">My App</Link>
                </h1>
                <nav className="flex gap-4">
                    <Link to="/">Home</Link>
                    <Link to="/about">About</Link>
                    <Link to="/sample">Sample</Link>
                    <Link to="/testpage">Testpage</Link>
                    <Link to="/vocablary-app">VocablaryApp</Link>
                    <Link to="/vocablary-app-sample">VocablaryAppSample</Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;
