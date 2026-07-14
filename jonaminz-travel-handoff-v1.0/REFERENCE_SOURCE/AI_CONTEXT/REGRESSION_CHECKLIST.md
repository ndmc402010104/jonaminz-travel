# REGRESSION_CHECKLIST

每次產生分檔 Runtime 必須驗證：

- [ ] `<head>` 中 title、stylesheet link、closing head 均完整。
- [ ] `styles.css`、`app.js` 與 assets 均存在於 ZIP。
- [ ] `node --check app.js` 通過。
- [ ] Chromium 可實際載入本機 `index.html`。
- [ ] 頁面 title 正確。
- [ ] `.app`、側邊欄與旅行圖書館內容有渲染。
- [ ] 不得只依據檔案大小或 JavaScript 語法宣稱可使用。
