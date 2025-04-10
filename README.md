# 環境構築
## プロジェクトDLから見るまで
npm create vite@latest VocabMaster_Frontend -- --template react-ts
cd VocabMaster_Frontend
npm install
npm run dev
→ここまでエラーは出ない

## ポート番号を80に変更
vite.config.tsを修正（以下を追加）
```
export default defineConfig({
  plugins: [react()],
  server: {
    port: 80, // 使用するポート番号
  },
})
```

## ホットモジュールリプレイスメントをON
vite.config.tsを修正（以下を追加）
```
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
      interval: 1000
    },
  },
})
```

## gitで管理
```
git init
```
git frowを開始

## ディレクトリを作成
```
mkdir -p src/{assets/{images,styles},components/{UI,common},pages,hooks,context,services,utils,types,api,routes}
```

## TailwindCSSを導入
ブランチ作成：feature/install_TailWindCSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init --ts -p
CSSをすべて削除（App.css、index.css）
（index.css）以下追加
@tailwind base;
@tailwind components;
@tailwind utilities;
（tailwind.config.ts）以下追加
  content: ["./src/**/*.{js,jsx,ts,tsx}",],

## フォントを導入
（tailwind.config.ts）
  theme: {
    fontFamily: {
      NotoSansJP: ['Noto Sans JP', 'sans-serif'],
    },
    extend: {},
  },
（index.css）
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap');
（App.tsx）
```
<>
<div className="App font-NotoSansJP">
```

## react-router-domを導入
npm install react-router-dom
mkdir -p src/{assets/{images,styles},components/{UI,common},pages,hooks,context,services,utils,types,api,routes}

## コードスニペット（プログラミング言語でよく使用するコードを登録しておき、再利用できるソースコードやマシンコード）、インテリセンス（コード補完機能）
VSCode 入ってるプラグイン2024
https://zenn.dev/ryotarohomma/articles/7bd1772bcd12d4
- JavaScript and TypeScript Nightly(何やってるか謎)
- Pretty TypeScript Errors(エラーを表示してくれる)
- Prettier

## axiosを導入（-Dは--save-devの略で、devDependenciesに入れられる。おそらくコンパイルされないので開発用以外は使わない）
npm install axios
### 以下ファイルを作成(root直下、viteを考慮)
.env.development.local
.env.production.local

## モックインストール
### モックインストール（プロジェクトローカルインストール：npm install -g json-server、グローバルにインストールすると、どのディレクトリからでも json-server コマンドを使用できます。）
npm install --save-dev json-server
## レスポンス定義ファイル（第1階層がエンドポイント名）
/json-server/db.jsonを作成
## ルーティングファイル
/json-server/routes.jsonを作成
## 起動(--watch：ポーリング)
npx json-server --watch json-server/db.json --routes json-server/routes.json --port 80
curl localhost:8080/words
## 確認
### 読み込み
curl -H "Content-Type: application/json" -X GET localhost:8080/api/v1/words
curl -H "Content-Type: application/json" -X GET localhost:8080/api/v1/words/1
### 作成
curl -H "Content-Type: application/json; charset=UTF-8" -X POST -d '{"question": "banana","answer": "バナナ","level":1}' localhost:8080/api/v1/words
### 置き換え
curl -H "Content-Type: application/json" -X PUT -d '{"question": "banana", "answer": "banana", "level":2}' localhost:8080/api/v1/words/5
### 削除
curl -H "Content-Type: application/json" -X DELETE http://localhost:8080/api/v1/words/1
### 参考
https://qiita.com/ryome/items/36da51f0f5973eab8720

# 事象
## ①npm install --verbose でエラー発生
### 状況
npm install時にエラー
### 原因
@eslint/eslintrcがリネームできない
パッケージリストが古い？
### アクション
npm install -g npm@latest
rm -rf node_modules package-lock.json
npm cache clean --force
npm install --verbose
### 結果
行けることを確認

# やりたいこと
- ヘッダーをハンバーガメニューに(今はスマホ表示にするとヘッダーの幅が固定で邪魔)
- ログイン機能実装
- SCVから単語挿入機能実装
- Goとの連携機能実装（単語帳提供機能、ログイン機能）
- 毎日用、3日用、7日用を実装
　トップ画面、項目は、問題ごと「問題名、編集、1日用、3日用、7日用（最後いつ実施、カードがどれくらいあるか）」、新しく問題を追加ボタン　
　問題詳細画面、この問題を削除、問題をすべて削除、csvから一括読み込み、問題一覧（問題名、削除、編集）
　問題編集画面（問題名、回答、保存、戻る）
- 残りの単語数、現在の単語数(すべての質問と、回答済みの単語を表示するインジケーターをつけたいです。単語カードの上に付けてください。)→済
- 学習完了後の導線
- モックを入れる(json-server)→済
- dev_containerを導入