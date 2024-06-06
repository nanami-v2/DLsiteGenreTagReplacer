# DLsite GenreTag Replacer <!-- omit in toc -->

- [本拡張機能に関して](#本拡張機能に関して)
  - [機能](#機能)
  - [対応ブラウザ](#対応ブラウザ)
  - [対応ページ](#対応ページ)
  - [変換用語一覧](#変換用語一覧)
- [開発環境](#開発環境)
  - [セットアップ方法](#セットアップ方法)
  - [ビルド方法](#ビルド方法)
- [設計資料](#設計資料)
  - [概念図](#概念図)
  - [シーケンス図](#シーケンス図)
- [リンク](#リンク)

## 本拡張機能に関して

[DLsite.com](https://www.dlsite.com/index.html)において 2024年3月 に行われた、ジャンルタグの表記置き換えに対処するための拡張機能です。

### 機能

- ジャンルタグを旧版（例：メスガキ）で表示
- 検索結果ページに限って、タブタイトルに表示されるジャンルタグの名称を旧版で表示
- コンテキストメニューからの新版・旧版切り替え（複数タブに反映）

### 対応ブラウザ

- Chrome
- Firefox
- Edge

### 対応ページ

- [検索結果ページ](https://www.dlsite.com/maniax/fsr/=/order/trend/genre[0]/525/options[0]/JPN/options[1]/NM/from/work.genre)
- [商品ページ](https://www.dlsite.com/books/work/=/product_id/BJ01328905.html)
- [こだわり検索ページ](https://www.dlsite.com/books/fs)

### 変換用語一覧

[jsonファイル](./assets/genre-word-conversion-map-ja.json)をご参照ください。

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
    npm ci
    ```

- [Gnu Make](https://www.gnu.org/software/make/)

    ```sh
    apt install -y make
    ```

- zip

  ```sh
  apt install -y zip
  ```

### ビルド方法

プロジェクトディレクトリ――`Makefile`が存在するディレクトリ――で以下を実行します。

```sh
make
```

## 設計資料

### 概念図

```mermaid
%%{
    init: {
        'theme': 'dark'
    }
}%%

graph LR
  BackgroundScript -- 読み書き --> Storage[(Storage)]

  subgraph Tabs
    subgraph Tab1
      ContentScript1
      DLsitePage1
    end
    subgraph Tab2
      ContentScript2
      DLsitePage2
    end
    subgraph Tab3
      ContentScript3
      DLsitePage3
    end
  end

  BackgroundScript <-- 通信 --> ContentScript1
  BackgroundScript <-- 通信 --> ContentScript2
  BackgroundScript <-- 通信 --> ContentScript3

  ContentScript1 -- 置換処理 --> DLsitePage1
  ContentScript2 -- 置換処理 --> DLsitePage2
  ContentScript3 -- 置換処理 --> DLsitePage3
```

### シーケンス図

```mermaid
%%{
    init: {
        'theme': 'dark'
    }
}%%

sequenceDiagram
  actor User

  User    ->> Browser: タブを開く
  Browser ->> ContentScript: 呼び出し
  activate ContentScript
  ContentScript ->> BackgroundScript: 初期化完了を通知
  activate BackgroundScript
  BackgroundScript ->> Storage: タブIDを保存
  deactivate BackgroundScript
  ContentScript ->> BackgroundScript: 置換処理に必要なデータをリクエスト
  activate BackgroundScript
  BackgroundScript  ->> Storage: 変換表を読み出し
  BackgroundScript  ->> Storage: 変換モードを読み出し
  BackgroundScript -->> ContentScript: データ返却
  deactivate BackgroundScript
  ContentScript ->> DLsitePage: 置換処理を実行
  deactivate ContentScript


  User    ->> Browser: コンテキストメニューをクリック
  Browser ->> BackgroundScript: 呼び出し
  activate BackgroundScript
  BackgroundScript ->> Storage: 変換モードをスイッチングして保存
  BackgroundScript ->> Storage: 保存していた全てのタブIDを読み出し
  loop タブIDごと
  BackgroundScript ->> ContentScript: 通知
  deactivate BackgroundScript
  activate   ContentScript
  ContentScript ->> BackgroundScript: 置換処理に必要なデータをリクエスト
  activate BackgroundScript
  BackgroundScript  ->> Storage: 変換表を読み出し
  BackgroundScript  ->> Storage: 変換モードを読み出し
  BackgroundScript -->> ContentScript: データ返却
  deactivate BackgroundScript
  ContentScript ->> DLsitePage: 置換処理を実行
  deactivate ContentScript
  end


  User    ->> Browser: タブを閉じる
  Browser ->> BackgroundScript: 呼び出し
  activate BackgroundScript
  BackgroundScript ->> Storage: タブIDを削除
  deactivate BackgroundScript
```

## リンク

- [TypeScript](https://www.typescriptlang.org/)
- [esbuild](https://esbuild.github.io/)
- [Web Extensions Reference (Firefox)](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
- [Web Extensions Reference (Chrome)](https://developer.chrome.com/docs/extensions/reference)
