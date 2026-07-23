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
- Commit：完成 push 後補入。
