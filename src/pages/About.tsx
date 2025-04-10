// src/pages/About.tsx
import React from 'react';

const About: React.FC = () => {
    return (
        <>
            <div className="container mx-auto my-10 p-6 bg-white shadow-md">
                <h1 className="text-3xl font-bold mb-4">このサイトについて</h1>
                <p className="mb-4">
                    このサイトのコンテンツは以下のライセンスの下で提供されています。
                </p>
                <div className="mx-auto">
                    <ol className="text-xs list-decimal list-inside bg-white rounded">
                        <li className="text-gray-800 mb-2">
                            thumbs by Isnaini from <a href="https://thenounproject.com/browse/icons/term/thumbs/" target="_blank" title="thumbs Icons">Noun Project</a> (CC BY 3.0)
                        </li>
                        <li className="text-gray-800 mb-2">

                        </li>
                    </ol>
                </div>
                <div>

                </div>
            </div>
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

export default About;
