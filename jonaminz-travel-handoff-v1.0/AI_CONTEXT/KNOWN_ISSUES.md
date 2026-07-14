# KNOWN ISSUES

## 停止 Patch 的主要原因

### 1. Monolithic Runtime

- `app.js` 約 79KB。
- 大量 domain、UI、mock backend 與 renderer 混在一起。
- 任何 render 都可能重建大量 DOM 與事件。

### 2. String-Patch History

多輪版本是以字串搜尋／替換修改完整 HTML 與 JavaScript。

已發生：

- HTML head 被切壞。
- 分檔版只能顯示、互動失效。
- standalone 過大。
- 新 localStorage key 與舊 state migration 混亂。

### 3. file:// Delivery

直接雙擊分檔 HTML 的行為受瀏覽器與企業安全策略影響。

正式開發必須使用 local dev server，不應以 file:// 作為驗收方式。

### 4. No End-to-End Tests

- 語法通過不代表事件綁定成功。
- 靜態畫面漂亮不代表互動正常。
- 缺少 click、drag/drop、reload、rollback 的 browser tests。

### 5. State and Migration

- Prototype localStorage schema 無正式版本。
- 過去 data URI 可能進入 state。
- migration 以臨時欄位判斷。
- 不適合直接搬入 production。

## 目前使用者實測問題

- 最後 runtime 畫面可以顯示，但按鈕無法操作。
- 這表示 visual shell 仍可作為參考，但 startup/event runtime 已不可信。

## 不應繼續做的事

- 不要在 0.5.x 上繼續補 event listener。
- 不要再輸出完整 standalone。
- 不要再以下載雙擊 HTML 取代 dev server。
- 不要把 prototype state 直接匯入正式 DB。
