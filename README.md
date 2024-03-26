# Anti-Word Hunting <!-- omit in toc -->

- [本拡張機能に関して](#本拡張機能に関して)
  - [対応ブラウザ](#対応ブラウザ)
- [開発環境](#開発環境)
  - [セットアップ手順](#セットアップ手順)
- [リンク](#リンク)

## 本拡張機能に関して

クレカ会社が原因と思われる、[DLsite.com](https://www.dlsite.com/index.html)に対する表現規制（言葉狩り）への対策を行うためのものになります。

### 対応ブラウザ

- Firefox

## 開発環境

開発にあたっては[TypeScript](https://www.typescriptlang.org/)を使用しています。また、以下の利用を前提としています。

- [VSCode](https://code.visualstudio.com/)
- [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install)

### セットアップ手順

**WSL2** 上で、以下をインストールします。

- [Node Version Manager](https://github.com/nvm-sh/nvm)

    ```sh
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
    source ~/.bashrc
    ```

- [Node.js](https://nodejs.org/en)（現時点ではLTSのバージョンは`v20.11.1`）

    ```sh
    nvm install --lts
    ```

- ビルドやバンドルに必要な`node_modules`

    ```sh
    npm install --save-dev typescript ts-node
    npm install --save-dev esbuild
    npm install --save-dev @types/firefox-webext-browser
    ```

- [Gnu Make](https://www.gnu.org/software/make/)

    ```sh
    apt install -y make
    ```

## リンク

- [TypeScript](https://www.typescriptlang.org/)
- [esbuild](https://esbuild.github.io/)
