# Anti-Word Hunting <!-- omit in toc -->

- [技術要素](#技術要素)
- [開発環境構築](#開発環境構築)

## 技術要素

- [TypeScript](https://www.typescriptlang.org/)

## 開発環境構築

**WSL2** 上で作業する。[こちらの手順](https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl#install-nvm-nodejs-and-npm)にしたがって以下をインストールする。

- [Node Version Manager](https://github.com/nvm-sh/nvm)

    ```sh
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
    source ~/.bashrc
    ```

- [Node.js](https://nodejs.org/en)（現時点ではLTSのバージョンは`v20.11.1`）

    ```sh
    nvm install --lts
    ```

- ビルドおよびバンドルに必要な各種`node-modules`

    ```sh
    npm install --save-dev typescript ts-node
    npm install --save-dev esbuild
    npm install --save-dev @types/firefox-webext-browser
    ```
