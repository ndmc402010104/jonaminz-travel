# ACCEPTANCE TESTS

## 全域

- Browser zoom 100% 可讀。
- Console 零 error。
- Page reload 狀態正確。
- 不使用 file:// 作正式驗收。
- Desktop 與 mobile 都測。

## Trip Library

- 搜尋中新增旅行後，新旅行可立即看見。
- 目前旅行不顯示 archived。
- 封存目前 Hero 旅行後，自動切換。

## Journey Builder

- Place 未安排時只出現在左側。
- Assign 後只出現在目標 Day。
- Move 後只存在新 Day。
- Unassign 後回到左側。
- 同 Day 排序可持久化。
- 舊、新 Day dirty 正確。

## Book Generation

- Missing page → create。
- Dirty page → update。
- Clean page → unchanged。
- Manual page → preserve。
- Preview 與 execute 結果一致。

## Book Style

- 合法 JSON 可預覽與匯入。
- forbidden field 被拒絕。
- Trip pin exact style version。
- 套用 style 不改 Page Master。
- 改 Page Master 不改 style。

## Optimistic UI

- 2 秒 latency 下立即更新。
- server success 後 canonical data 正確。
- failure 可 rollback。
- retry 會 replay 真正 mutation。
- offline queue 重開瀏覽器仍存在。
