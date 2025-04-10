// src/pages/NotFound.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
    return (
        <div>
            <h2>404 Not Found</h2>
            <p>The page you're looking for does not exist.</p>
            <Link to="/">Home</Link>
        </div>
    );
};

export default NotFound;
