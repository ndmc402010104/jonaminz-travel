# REBUILD PLAN

## 原則

保留成果，重建模型。

不要重寫產品方向；要重寫 runtime 與模組邊界。

## Phase 0 — Freeze

- 封存此交接包。
- 將 reference prototype 設為 read-only。
- 建新 repo，例如 `jonaminz-travel`。
- 不直接 copy app.js。

## Phase 1 — Foundation

完成：

- dev server / build。
- routing。
- theme tokens。
- component library。
- typed domain models。
- repository interfaces。
- state management。
- unit test + browser E2E。
- versioned local persistence。

驗收：

- 首頁、Journey Builder 空殼可正常切換。
- F5 狀態正確。
- Console 零 error。

## Phase 2 — 第一條垂直流程

只做：

```text
建立 Trip
→ 建立 Place
→ 建立 Day
→ Assign Place
→ Move Stop
→ Unassign
→ Reload
```

不要先做旅行書。

驗收全部通過後才往下。

## Phase 3 — Book Projection

- Day Page Master。
- Generate diff。
- create/update/preserve。
- manual protection。
- Book Page list。

## Phase 4 — Book Style

- Book Style schema。
- built-in styles。
- prompt builder。
- import validation。
- renderer adapter。
- exact version pin。

## Phase 5 — Book Studio

- A4 canvas。
- manual edits。
- free items。
- resize / rotate / layers。
- PDF renderer。

## Phase 6 — Backend

- Supabase tables。
- Storage。
- Worker actions。
- auth。
- optimistic queue。
- idempotency。
- realtime only where useful。

## Phase 7 — Live Trip

- Planned / Actual。
- map deeplink。
- tickets。
- memory capture。
- offline queue。

## 開發策略

每次只交付一條可完整驗收的 vertical slice。

不要一次重做九個 View。
