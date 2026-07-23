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
- Merge commit：待 PR 合併後回填。
