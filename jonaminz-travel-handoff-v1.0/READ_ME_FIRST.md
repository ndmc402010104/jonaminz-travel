# READ ME FIRST — Jonaminz Travel 交接入口

## 結論

目前原型已經完成大量產品方向、畫面語言、資料關係與互動想法，但已到達「對話內手工疊加原生 HTML／CSS／JavaScript」的維護極限。

這不是產品方向失敗，也不是功能上限。

真正到極限的是：

- 單一 `app.js` 同時負責資料、渲染、事件、樂觀更新、同步模擬與畫面狀態。
- 多輪以字串 patch 修改既有原型，容易造成新功能破壞舊功能。
- runtime 曾經以 standalone HTML、file:// 分檔形式交付，測試環境與瀏覽器安全限制不穩定。
- 缺乏正式模組邊界、自動測試與可追蹤 migration。
- 目前畫面可作為高價值設計與 UX 參考，但不應再在這份原型上繼續 patch。

## Agent 的任務

請把此交接包視為「產品規格＋參考原型」，不是待修補的 production code。

正確做法：

1. 先讀完 `AI_CONTEXT/`。
2. 保留已裁決的產品方向與 UX。
3. 重新建立乾淨、模組化、可測試的前端。
4. 先完成 V1 核心垂直流程，再接 Supabase／Worker。
5. 每次修改同步更新交接文件。
6. 不要把 `REFERENCE_SOURCE/` 直接複製成正式系統。

## 優先閱讀順序

1. `AI_CONTEXT/PRODUCT_VISION.md`
2. `AI_CONTEXT/DECISIONS.md`
3. `AI_CONTEXT/ARCHITECTURE.md`
4. `AI_CONTEXT/DATA_MODEL.md`
5. `AI_CONTEXT/JOURNEY_BUILDER_SPEC.md`
6. `AI_CONTEXT/BOOK_STYLE_PACK_SPEC.md`
7. `AI_CONTEXT/OPTIMISTIC_UI_SPEC.md`
8. `AI_CONTEXT/KNOWN_ISSUES.md`
9. `AI_CONTEXT/REBUILD_PLAN.md`
10. `AI_CONTEXT/AGENT_BOOT_PROMPT.md`

## 參考檔案

- `REFERENCE/journey-builder-user-test.png`：使用者實際測試截圖。
- `REFERENCE/v0.5.1-visual-prototype-standalone.html`：最後可看到完整視覺方向的單檔原型。
- `REFERENCE_SOURCE/`：最後分檔嘗試，只供研究，不保證互動可用。

## 不可違反

- 不准因為 prototype 壞掉就退回普通後台風格。
- 不准把 App Theme、Page Master、Book Style 混成一個「模板」。
- 不准讓 AI 直接輸入任意 CSS／JavaScript。
- 不准 silently overwrite 手動排版頁面。
- 不准讓同一個 Place 在 Journey Builder 左右各出現一張。
- 不准用 7–10px 功能文字製造「高級感」。
