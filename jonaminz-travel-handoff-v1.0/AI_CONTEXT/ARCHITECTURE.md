# ARCHITECTURE

## 建議正式架構

```text
src/
├─ app/
│  ├─ shell/
│  ├─ router/
│  └─ bootstrap/
├─ domain/
│  ├─ trips/
│  ├─ places/
│  ├─ itinerary/
│  ├─ book/
│  ├─ styles/
│  └─ memories/
├─ features/
│  ├─ trip-library/
│  ├─ journey-builder/
│  ├─ itinerary-editor/
│  ├─ book-studio/
│  ├─ page-master-library/
│  ├─ book-style-lab/
│  ├─ live-trip/
│  └─ diagnostics/
├─ services/
│  ├─ optimistic-actions/
│  ├─ sync-queue/
│  ├─ persistence/
│  ├─ files/
│  └─ export/
├─ repositories/
│  ├─ interfaces/
│  ├─ local/
│  └─ supabase/
├─ ui/
│  ├─ components/
│  ├─ tokens/
│  └─ themes/
└─ tests/
```

## 狀態邊界

不得再用一個 global object 加大量 `renderX()` 同時管理全部功能。

應拆成：

- Domain state：Trip、Place、Day、Stop、BookPage、BookStyle。
- UI state：目前 View、篩選、選取項目、面板狀態。
- Sync state：pending、failed、retrying。
- Editor state：選取頁面、拖曳、未儲存修改。

## Repository Boundary

UI 與 feature 不可直接呼叫 Supabase。

```ts
interface TravelRepository {
  createTrip(input): Promise<Trip>
  updateTrip(id, patch): Promise<Trip>
  assignPlace(placeId, dayId): Promise<AssignmentResult>
  moveStop(stopId, dayId, position): Promise<Stop>
  generateBookPages(input): Promise<GenerationResult>
}
```

Local demo、mock backend 與 Supabase adapter 都實作同一接口。

## Render Strategy

建議使用具狀態管理與 component boundary 的框架，或至少原生 Web Components／模組化 ES modules。

不要再用：

- 大型 template string 反覆重畫整頁。
- 每次 render 後重新綁全部事件。
- 以字串替換方式修改大型 HTML。
- 讓 data URI 進入 domain state。
