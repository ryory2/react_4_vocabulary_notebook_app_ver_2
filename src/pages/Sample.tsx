// src/pages/Sample.tsx
import React from 'react';

const Sample: React.FC = () => {
    return (
        <>
            {/*  Card Example  */}
            <section
                className="
        bg-[var(--c-bg-neutral-lightest)]
        border
        border-[var(--c-neutral-border-lighter)]
        rounded
        p-4
      "
            >
                <h2 className="text-lg text-[var(--c-general-secondary)] font-semibold mb-2">
                    Tailwind + CSS Variables
                </h2>
                <p className="text-[var(--c-text-low-priority)]">
                    このカードの背景やテキスト色には、<strong>CSS 変数</strong>を利用しています。
                </p>
                {/*  Primary Button  */}
                <a
                    href="#"
                    className="
          inline-block
          mt-3
          px-4
          py-2
          text-white
          rounded
          bg-[var(--c-button-primary)]
          hover:bg-[var(--c-button-primary-hover)]
        "
                >
                    メインCTA
                </a>
            </section>

            {/*  Alert & Like Boxes  */}
            <section className="space-y-4">
                <div
                    className="
          bg-[var(--c-bg-alert)]
          border
          border-[var(--c-general-alert)]
          text-[var(--c-general-alert)]
          p-3
          rounded
        "
                >
                    これはアラート表示用のボックスです。
                </div>
                <div
                    className="
          bg-[var(--c-bg-like)]
          border
          border-[var(--c-general-like)]
          text-[var(--c-general-like)]
          p-3
          rounded
        "
                >
                    こちらは「いいね」や好意的なメッセージを強調するためのボックスです。
                </div>
            </section>

            {/*  Text Priority Example  */}
            <section
                className="
        bg-[var(--c-bg-neutral-lighter)]
        border
        border-[var(--c-neutral-border)]
        p-4
        rounded
      "
            >
                <p>
                    通常のテキスト (<code>var(--c-text-body)</code>) と、
                    <span className="text-[var(--c-text-lower-priority)]">
                        低優先度のテキスト
                    </span>
                    (<code>var(--c-text-lower-priority)</code>) を見比べてください。
                </p>
                <p className="mt-2">
                    <a href="#" className="text-[var(--c-text-link-primary)] hover:underline">
                        リンクカラーは var(--c-text-link-primary)
                    </a>
                </p>
            </section>
        </>

    );
};

export default Sample;
