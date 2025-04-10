// src/pages/About.tsx
import React from 'react';
import Button from '../components/Button';
import NavigateButton from '../components/NavigateButton';

const Testpage: React.FC = () => {

    /**
     * クリック時にアラートを表示
     */
    const handleClick = () => {
        alert('Button clicked!');
    };

    return (
        <div className=''>
            <Button label="これはボタンです。" onClick={handleClick} ></Button>
            <NavigateButton label="ナビゲートボタン" to="/" ></NavigateButton>
        </div>
    )
};

export default Testpage;