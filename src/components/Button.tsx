// components/Button.tsx
import React from 'react';

/**
 *interface インターフェース名 {
 *    変数名: 型;
 *    関数名: (変数名: 型) => 戻り値; //関数名はキャメルケース
 *    関数名: (変数名: 型) => 戻り値; //引数がない場合は()で省略可。戻り値がない場合はvoid
 *}
 */
interface ButtonProps {
    label: string;
    onClick: () => void;
}

/**
 * ボタン表示時のラベルとクリック時の処理を設定する
 * ドキュメンテーションコメント（）
 * 書式）関数の項目 型 変数名
 * @param string label
 * @param function onClick
 * @returns ボタンUI
 */
const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
    // React.FC<ButtonProps>：引数の型。「 label: string; onClick: () => void」のように記載も可能。
    // ({ label, onClick })：コンポーネント内で利用する変数名。ここに引数の値が入る。利用する際は、{変数名}として記載

    return (
        <div className=''>
            <button onClick={onClick} className="btn">
                {label}
            </button>
        </div>
    );
};

export default Button;
