# umi-plugin-hint

[![NPM version](https://img.shields.io/npm/v/umi-plugin-hint.svg?style=flat)](https://npmjs.org/package/umi-plugin-hint) [![NPM downloads](http://img.shields.io/npm/dm/umi-plugin-hint.svg?style=flat)](https://npmjs.org/package/umi-plugin-hint)

umi 插件，提示有更新的依赖

## 启用方式

配置开启

## Install

```bash
$ yarn add umi-plugin-hint
```

## Usage

Configure in `.umirc.js` or `config/config.ts`,

```js
export default {
  hint: ['react', 'yourPkgName'],
};
```

## Show

```
   ╭──────────────────────────────────────╮
   │                                      │
   │   Update available 1.19.1 → 2.1.1    │
   │   Run yarn add prettier to update    │
   │                                      │
   ╰──────────────────────────────────────╯
```

## LICENSE

MIT
