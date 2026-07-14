# USER_FEEDBACK_LOG

## 2026-07-13 — v0.5.2 無法閱讀

使用者回報分檔 Runtime 無法閱讀。

### 查證結果

`index.html` 的 head 被錯誤拆成：

```html
<title>...</title<link rel="stylesheet" ...>yle>
```

因此 CSS 無法載入，HTML 結構也不合法。

### 根因

拆分腳本先記錄 `<style>` 的字串位置，之後又修改 title 長度，
最後使用過期的位置切割原始字串。

### 修正

v0.5.3 不再依賴舊字串位置，而是用完整 `<style>...</style>` 與
`<script>...</script>` 標籤進行取代。

### 新規則

分檔後不能只檢查 app.js；必須用瀏覽器實際載入 index.html。
