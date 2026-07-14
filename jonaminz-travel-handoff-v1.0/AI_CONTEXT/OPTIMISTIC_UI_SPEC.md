# OPTIMISTIC UI SPEC

## 目標

操作立即反映，後端在背景同步；失敗時可理解、可回復、可重試。

## 正確流程

```text
user intent
→ optimistic patch
→ action envelope
→ enqueue
→ repository mutation
→ success commit
or
→ failure state / rollback / retry
```

## Action Envelope

```json
{
  "id": "uuid",
  "type": "journey.moveStop",
  "entityRefs": ["stop-id", "old-day-id", "new-day-id"],
  "payload": {},
  "baseRevision": 12,
  "createdAt": "timestamp",
  "attempts": 0,
  "status": "pending"
}
```

## 必要能力

- idempotency key
- dependency ordering
- retry replay
- rollback patch
- conflict handling
- offline persistence
- user-visible queue
- undo 與 server sync 分離

## Prototype 已知錯誤

目前 prototype 的 retry 可能只重送 mock action，沒有完整 replay optimistic patch。

正式版不得沿用此做法。

## 離線

正式版應：

- 保留本地變更。
- queue 持久化。
- 恢復連線後依序 replay。
- 衝突時停止並要求使用者選擇。

不得把 offline 一律當失敗後 rollback。
