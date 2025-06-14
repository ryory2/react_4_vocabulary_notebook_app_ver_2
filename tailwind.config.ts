import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    fontFamily: {
      NotoSansJP: ['Noto Sans JP', 'sans-serif'],
    },
    extend: {
      /** --------------------------------
       *  1) Colors
       * -------------------------------- */
      colors: {
        // blue系
        "c-blue-100": "var(--c-blue-100)",
        "c-blue-200": "var(--c-blue-200)",
        "c-blue-300": "var(--c-blue-300)",
        "c-blue-400": "var(--c-blue-400)",
        "c-blue-500": "var(--c-blue-500)",
        "c-blue-600": "var(--c-blue-600)",
        "c-blue-700": "var(--c-blue-700)",
        // gray系
        "c-gray-100": "var(--c-gray-100)",
        "c-gray-200": "var(--c-gray-200)",
        "c-gray-300": "var(--c-gray-300)",
        "c-gray-400": "var(--c-gray-400)",
        "c-gray-500": "var(--c-gray-500)",
        "c-gray-600": "var(--c-gray-600)",
        "c-gray-700": "var(--c-gray-700)",
        "c-gray-800": "var(--c-gray-800)",

        // general
        "c-general-primary": "var(--c-general-primary)",
        "c-general-secondary": "var(--c-general-secondary)",
        "c-general-alert": "var(--c-general-alert)",
        "c-general-like": "var(--c-general-like)",

        // button
        "c-button-primary": "var(--c-button-primary)",
        "c-button-primary-hover": "var(--c-button-primary-hover)",

        // text
        "c-text-body": "var(--c-text-body)", // 通常のテキスト
        "c-text-low-priority": "var(--c-text-low-priority)",
        "c-text-lower-priority": "var(--c-text-lower-priority)",
        "c-text-link-primary": "var(--c-text-link-primary)",

        // bg
        "c-bg-base": "var(--c-bg-base)", // メインコンテンツのBG
        "c-bg-neutral": "var(--c-bg-neutral)", // アプリ全体のBG
        "c-bg-neutral-lighter": "var(--c-bg-neutral-lighter)",
        "c-bg-neutral-lightest": "var(--c-bg-neutral-lightest)",
        "c-bg-primary": "var(--c-bg-primary)",
        "c-bg-primary-lighter": "var(--c-bg-primary-lighter)",
        "c-bg-secondary": "var(--c-bg-secondary)",
        "c-bg-alert": "var(--c-bg-alert)",
        "c-bg-like": "var(--c-bg-like)",

        // border / shadow
        "c-neutral-border": "var(--c-neutral-border)",
        "c-neutral-border-lighter": "var(--c-neutral-border-lighter)",
        "c-focus-shadow": "var(--c-focus-shadow)",
        "c-selection-highlight": "var(--c-selection-highlight)",
      },

      /** --------------------------------
       *  2) Spacing
       * -------------------------------- */
      spacing: {
        "3xs": "var(--spacing-3xs)", // 0.25rem
        "xxs": "var(--spacing-xxs)", // 0.5rem
        "xs": "var(--spacing-xs)",   // 1rem
        "sm": "var(--spacing-sm)",   // 1.5rem
        "md": "var(--spacing-md)",   // 2rem
        "lg": "var(--spacing-lg)",   // 2.5rem
        "xl": "var(--spacing-xl)",   // 3rem
        "xxl": "var(--spacing-xxl)", // 4rem
      },

      /** --------------------------------
       *  3) Border Radius
       * -------------------------------- */
      borderRadius: {
        "xxs": "var(--rounded-xxs)",     // 2px
        "xs": "var(--rounded-xs)",       // 4px
        "sm": "var(--rounded-sm)",       // 7px
        "md": "var(--rounded-md)",       // 10px
        "lg": "var(--rounded-lg)",       // 14px
        "xl": "var(--rounded-xl)",       // 20px
        "full": "var(--rounded-full)",   // 99rem
        "publication": "var(--rounded-publication)", // 25%
      },

      /** --------------------------------
       *  4) Font Family
       * -------------------------------- */
      fontFamily: {
        // Tailwind は fontFamily を配列で書く慣習ですが、
        // ここでは CSS変数を文字列として渡す例を示します。
        // 実際には var(--font-base) 内にカンマ区切りでフォントスタックを定義しているのでOK。
        base: ["var(--font-base)"],
        code: ["var(--font-code)"],
        "latin-hero": ["var(--font-latin-hero)"],
      },
    },
  },
  plugins: [typography],
} satisfies Config

