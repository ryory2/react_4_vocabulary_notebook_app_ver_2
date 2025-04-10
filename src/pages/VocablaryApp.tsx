// src/pages/VocablaryApp.tsx
import React from 'react';
import { FlashcardApp } from '../components/FlashcardApp';

const VocablaryApp: React.FC = () => {
    return (
        <>
            <div>
                <h1>単語帳アプリSample</h1>
                <FlashcardApp />
            </div>
        </>
    );
};

export default VocablaryApp;
