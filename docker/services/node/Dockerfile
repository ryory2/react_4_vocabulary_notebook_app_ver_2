# --- ビルドステージ (builder) ---
# Reactアプリのビルドに必要なNode.js環境
ARG NODE_VERSION=18
FROM node:${NODE_VERSION}-alpine as builder
# Debianベースのイメージに変更 (bullseye は Debian 11)
# FROM mcr.microsoft.com/devcontainers/typescript-node:${NODE_VERSION}-bullseye as builder

# ビルド時に外部から受け取る引数を宣言
ARG VITE_API_DOMAIN
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_GOOGLE_OAUTH_REDIRECT_URI

# これらの引数を環境変数として設定
ENV VITE_API_DOMAIN=${VITE_API_DOMAIN}
ENV VITE_GOOGLE_CLIENT_ID=${VITE_GOOGLE_CLIENT_ID}
ENV VITE_GOOGLE_OAUTH_REDIRECT_URI=${VITE_GOOGLE_OAUTH_REDIRECT_URI}

# curl をインストール
RUN apk update && apk add --no-cache curl

# モジュールファイルとソースコードのコピー
WORKDIR /app
COPY package.json package-lock.json ./

# 依存関係のインストール
RUN npm config set registry https://registry.npmmirror.com
RUN npm install

COPY . .
# Reactアプリをビルド (静的ファイルを生成)
# 環境変数 NODE_ENV=production が設定されていると最適化されることが多い
RUN npm run build
# RUN NODE_ENV=production npm run build


# --- 本番ステージ (production) ---
# 軽量なNginxイメージをベースにする
FROM nginx:1.27-alpine as production

# カスタムNginx設定ファイルをコピー
# プロジェクトルートの nginx/nginx.conf を想定
COPY ./docker/services/node/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# ビルドステージ (builder) からビルド済み静的ファイルをコピー
# CRAなら build/、Viteなら dist/ など、プロジェクトに合わせてパスを調整
COPY --from=builder /app/dist /usr/share/nginx/html
# COPY ./html/top.html /usr/share/nginx/html

# Nginxが使用するポート (デフォルトは80)
EXPOSE 80

# コンテナ起動時にNginxをフォアグラウンドで実行
CMD ["nginx", "-g", "daemon off;"]

# --- 開発ステージ (development) ---
# Dev Containersが使用するステージ
# ビルドステージをベースにするか、より開発ツールが含まれたイメージを使う
# ここでは、ビルドステージをベースに、CMDだけ上書きする例
FROM builder as development

# 作業ディレクトリ (builderステージから継承される)
WORKDIR /app

# 開発サーバー用にポートを開放 (CRA/Viteのデフォルト 3000)
EXPOSE 3000

# 開発時はソースをマウントするため、ここでは何もしないか、
# コンテナ起動時に待機するコマンドを設定 (VSCode Dev Containersと相性が良い)
CMD ["npm", "run", "dev"]