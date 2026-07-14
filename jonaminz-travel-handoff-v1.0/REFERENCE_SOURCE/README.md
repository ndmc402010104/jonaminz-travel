# Jonaminz Travel Journey Builder Runtime v0.5.3

## 開啟方式

1. 將 ZIP 完整解壓縮。
2. 進入 `jonaminz-travel-journey-builder-runtime-v0.5.3` 資料夾。
3. 雙擊 `index.html`。
4. 使用 Chrome 或 Edge，瀏覽器縮放維持 100%。

請勿只把 `index.html` 單獨移出資料夾，因為它需要同層的：

- `styles.css`
- `app.js`
- `assets/`

## v0.5.3 修正

v0.5.2 在拆分 standalone HTML 時，因為使用了已失效的字串位置，
導致 `<head>` 被切壞，瀏覽器無法正常解析。

v0.5.3 改以完整標籤取代方式拆分，並加入：

- HTML 結構檢查
- JavaScript 語法檢查
- 真實 Chromium 啟動測試
