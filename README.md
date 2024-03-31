# DLsite GenreTag Replacer <!-- omit in toc -->

- [本拡張機能に関して](#本拡張機能に関して)
  - [対応ブラウザ](#対応ブラウザ)
  - [対応状況](#対応状況)
  - [変換用語一覧](#変換用語一覧)
- [開発環境](#開発環境)
  - [セットアップ方法](#セットアップ方法)
  - [ビルド方法](#ビルド方法)
- [リンク](#リンク)

## 本拡張機能に関して

[DLsite.com](https://www.dlsite.com/index.html)において 2024年3月 に行われた、ジャンルタグの表記置き換えに対処するための拡張機能です。

具体的には、**ジャンルタグを「置き換え前のもの」で表示** します。

### 対応ブラウザ

- Chrome
- Firefox
- Edge

### 対応状況

| ページ名 | 対応状況 | 備考 |
| --- | :---: | --- |
| [検索結果ページ](https://www.dlsite.com/maniax/fsr/=/order/trend/genre[0]/525/options[0]/JPN/options[1]/NM/from/work.genre) | :white_check_mark: | ジャンル選択ダイアログは対応済。 |
| [商品ページ](https://www.dlsite.com/books/work/=/product_id/BJ01328905.html) | :white_check_mark: | |
| [ジャンル一覧ページ](https://www.dlsite.com/maniax/genre/list) | :white_check_mark: | |
| [こだわり検索ページ](https://www.dlsite.com/books/fs) | | ジャンル選択ダイアログが未対応 |

なお、**入力ワードの変換は現在未対応** です。

### 変換用語一覧

[jsonファイル](./assets/genre-word-conversion-map.json)をご参照ください。

## 開発環境

開発にあたっては[TypeScript](https://www.typescriptlang.org/)を使用しています。また、以下の利用を前提としています。

- [VSCode](https://code.visualstudio.com/)
- [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install)

### セットアップ方法

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
    npm install --save-dev @types/chrome
    ```

- [Gnu Make](https://www.gnu.org/software/make/)

    ```sh
    apt install -y make
    ```

### ビルド方法

プロジェクトディレクトリ――`Makefile`が存在するディレクトリ――で以下を実行します。

```sh
make
```

## リンク

- [TypeScript](https://www.typescriptlang.org/)
- [esbuild](https://esbuild.github.io/)
- [Web Extensions Reference (Firefox)](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
- [Web Extensions Reference (Chrome)](https://developer.chrome.com/docs/extensions/reference)
