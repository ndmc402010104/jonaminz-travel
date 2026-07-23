# Checkpoints

## C0 — Claude 移植後基準

- Commit：`4ef05d30cdf15cec1e6dc4b6ec51cbc84b47b3c4`
- 狀態：垂直流程存在，但首次進站幾乎空白；正式交接與 AI_CONTEXT 未進 repo。

## C1 — 2026-07-23 UI recovery

- 驗收目標：
  - 無資料時看得到 Travel 產品定位、規劃流程與唯一主要動作。
  - 建立 Trip 後進入 Journey Builder。
  - Place → Day → Assign → Move → Unassign → Reload 不回歸。
  - 360 px、768 px、桌機寬度不產生水平溢位。
  - 尚未實作功能均明確標示為下一階段。
- Merge commit：`6e33a89f6d20331d51e89f1d144b4a5e96d1bbd3`（PR #1）。
- 驗證：JavaScript 語法、contract JSON、CSS 大括號平衡與 GitHub 遠端差異檢查通過。

## C2 — 2026-07-23 Sapporo test template

- 來源：2025/10/24–10/26《北海道_札幌.pdf》（19 頁）。
- 驗收目標：全新瀏覽器直接顯示三天正式行程、Stop 順序可操作、重新整理保留、刪除旅行級聯清理且不自動復活。
- Merge commit：`3d8c3056861d20ab93b1b1e37c7b2c503018dc9a`（PR #2）。
- 驗證：data pack 關聯完整性、DOM first-run、reload 防重複、級聯刪除與刪除後 reload 不復活均通過。

## C3 — 2026-07-23 Map-centered Journey Builder

- 驗收目標：
  - 全程與單日地圖顯示編號 Stop、日別顏色與順序折線。
  - Place／Stop 欄位分離，既有 v1 資料能非破壞升級。
  - Place、Stop 可編輯，Stop 可跨日；Place／Day 可安全刪除。
  - 手機版操作順序為地圖 → 每日行程 → 素材箱。
  - 外部 Google Maps 導航不需 API key。
- 驗證：JavaScript syntax、30 Place／3 Day／26 Stop 關聯、DOM reload／migration／edit／cross-day／fallback／route URL。
- Feature merge：`d014a3e77d0809efdf4da0063620cd4592fa3ea7`（PR #3）。
- Static asset versioning：`61b5ee0c0879c145b3a68d8ba3bd0cadab7f639b`（PR #4）。
- 正式頁驗收：26 markers、29 route/marker layers、OSM tiles 與 attribution 載入成功；桌機三欄比例為 280 / 439 / 515 px（1363 px viewport）。

## C4 — 2026-07-23 Travel product shell

- 驗收目標：
  - 預設畫面是能理解整趟旅行的首頁，不是地圖 CRUD。
  - 四模式導覽可進入 Home／Plan／Live／Book。
  - Checklist、Stop completion、Book Style 可持久化。
  - 舊 v2 札幌資料非破壞升級為 v3 並補入 Booking／Checklist。
  - Book Studio 生成 1 個封面＋3 個日頁並可列印。
- 驗證：syntax、舊 CRUD flow、map migration/edit flow、四模式產品 flow。
- Merge commit：`3366fb7e0b58bbb67bcd06fb26df45ad3a35f658`（PR #6）。
- 正式頁驗收：Home 3 日／3 bookings／7 checklist；Live 10 stops／8 visible tiles；Book 4 pages／3 styles；無網站 console error。

## C5 — 2026-07-23 Mobile planner rebuild

- 驗收目標：
  - 手機 Plan 首屏看到地圖與單日行程，不是 26 張後台卡片。
  - Day tab 同步控制地圖與唯一展開的 day sheet。
  - Place Pool 可獨立開關、搜尋、新增與指派。
  - Stop 常駐動作只留導航／編輯。
  - 四模式底部導覽不被 Jonaminz Chat launcher 覆蓋。
  - 從首頁日卡進入 Plan 回到頁首。
- 驗證：existing CRUD／map／product flows；focused mobile planner selection、sync、pool toggle。
- Merge commit：`450c4f29843013adab85dfed2613fa3579727d47`（PR #8）。
- 正式頁驗收：product2 assets；Plan 有 1 selected day／3 total days／26 markers／mobile pool toggle；無網站 console error。
