# 天機閣 · 液態玻璃登入頁（React 版）

同一個「glass liquid UI」登入介面的 React 技術棧實作，與[原生三件套版本](https://github.com/BlancoChiuTW/liquid-glass-login)對照。

線上展示：https://blancochiutw.github.io/liquid-glass-login-react/

## 技術棧

| 套件 | 用途 |
|---|---|
| React 19 + TypeScript + Vite | 框架與建置 |
| [`liquid-glass-react`](https://github.com/rdev/liquid-glass-react) | Apple 風液態玻璃卡片：SVG displacement 折射、色散（chromatic aberration）、滑鼠彈性跟隨，一個元件搞定 |
| [`motion`](https://motion.dev)（framer-motion） | 進場動畫、按鈕 hover/tap 微互動 |
| Tailwind CSS v4 | 樣式（utility-first，僅少量自訂 keyframes） |

## 與原生版的差異

- 原生版手刻 `feTurbulence` + `feDisplacementMap` + `backdrop-filter: url()`；React 版交給 `liquid-glass-react`，還多了色散與彈性跟隨兩個手刻版沒有的效果
- 動畫從 CSS keyframes + 手寫 JS 指標追蹤，換成 `motion` 的宣告式 API
- 樣式從 460 行手寫 CSS 變成 utility class + ~80 行自訂 CSS

## 踩雷筆記（用 liquid-glass-react 必讀）

1. **Tailwind v4 要加 `@source "../node_modules/liquid-glass-react/dist"`**：套件內部 DOM 用 Tailwind class 命名（`opacity-0`、`pointer-events-none`…），但 Tailwind 預設不掃 node_modules，class 沒生成時特效層會變成佔版面的黑色方塊
2. **要傳 `style={{ position: 'absolute', top: '50%', left: '50%' }}`**：元件內部用 `translate(-50%,-50%)` 自我置中，預設 `position: relative` 會讓三層特效 div 把內容往下推出畫面
3. 完整折射效果 Chromium 限定，Safari/Firefox 自動退化成一般玻璃模糊

## 開發

```bash
npm install
npm run dev      # 開發
npm run build    # 建置到 dist/
npm run deploy   # 部署到 GitHub Pages（gh-pages 分支）
```

## License

MIT
