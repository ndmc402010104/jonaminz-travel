# Facts

- Repository：`ndmc402010104/jonaminz-travel`。
- GitHub Pages 部署分支：`master`。
- 產品身份：Jonaminz 的 first-party external app，不內嵌成 Core 頁面。
- 技術：純 HTML／CSS／JavaScript，無框架、無建置步驟。
- 目前資料層：`localStorage`，key 為 `jonaminz-travel.v1`。
- localStorage key 為相容性保留；內部 state schema 已升級為 version 2。
- 已實作資料關係：Trip、Place、Day、Stop。
- Place 擁有 title／category／address／lat／lng／note。
- Stop 擁有 dayId／sourcePlaceId／position／time／duration／transport／note。
- 地圖層：Leaflet 1.9.4、OpenStreetMap standard raster tiles；實作隔離在 `map-adapter.js`。
- 外部導航：Google Maps URLs（`api=1`，不需 API key）。
- 已實作垂直流程：Trip → Place → Day → Assign → Edit／Move／Cross-day → Map／Navigate → Unassign → Reload。
- `jonaminz.contract.json` 與 Jonaminz Platform SDK snippet 已存在。
- 2026-07-23 優化前的 `master` checkpoint：`4ef05d30cdf15cec1e6dc4b6ec51cbc84b47b3c4`。
- `templates.js` 目前提供 schemaVersion 2 的 `sapporo-2025-10` declarative historical trip pack，來源為使用者的 2025/10/24–10/26《北海道_札幌.pdf》；全新瀏覽器會將它建立為第一筆正式旅行。
