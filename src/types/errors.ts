// src/types/errors.ts (例)

// ネットワークエラーなど、UIで特別に扱いたいエラーの型 (これは例であり、必ずしも必要ではない)
export class NetworkConnectionError extends Error {
    constructor(message: string = "ネットワーク接続に問題があります。") {
        super(message);
        this.name = "NetworkConnectionError";
    }
}