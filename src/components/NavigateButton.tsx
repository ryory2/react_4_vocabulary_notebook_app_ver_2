import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * ナビゲートボタンコンポーネントのプロパティを定義します。
 */
interface NavigateButtonProps {
    /**
     * ボタンに表示するテキスト
     */
    label: string;
    /**
     * `react-router-dom` の useNavigate で利用する移動先のパス
     */
    to: string;
}

/**
 * ナビゲートボタン
 * @param string label(例: "ホームへ")
 * @param string to(例: "/home")
 * @returns ナビゲートボタンUI
 */
const NavigateButton: React.FC<NavigateButtonProps> = ({ label, to }) => {
    const navigate = useNavigate();

    /**
     * ボタンがクリックされた際に呼び出されるハンドラーです。
     */
    const handleClick = () => {
        navigate(to);
    }

    return (
        <div className="inline-block // テキストが本体
          mt-3 // マージントップ
          px-4 // 横のパディング
          py-2 // 縦のパディング
          text-white
          rounded-full // 角丸
          bg-[var(--c-button-primary)] // 背景色
          hover:bg-[var(--c-button-primary-hover)] // ホバー時の背景色
          ">
            <button onClick={handleClick} className="navigate-button">
                {label}
            </button>
        </div>
    )

}

export default NavigateButton;