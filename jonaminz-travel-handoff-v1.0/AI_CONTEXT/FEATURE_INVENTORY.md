# FEATURE INVENTORY

## 已建立產品方向

### 旅行圖書館

- Hero 顯示目前旅行。
- 搜尋與狀態篩選。
- 新增、編輯、複製、封存、刪除。
- 封存應只存在封存頁籤。
- 素材 Inbox。

### Journey Builder

- Place Pool。
- Day Board。
- 拖曳安排。
- Page Master per Day。
- Book generation preview。
- clean／dirty／manual。
- 手動頁面保護。

### 行程細節

- Day 切換。
- Stop CRUD。
- 完成狀態。
- 時間與停留計算。
- 路線摘要。

### 旅行本工作室

- A4 畫布。
- 頁面 outline。
- 頁面 CRUD。
- 素材加入。
- 自由拼貼拖動。
- 紙張與裝飾設定。
- 列印／PDF 基礎。

### Page Master

- 封面。
- 當日手帳。
- 景點介紹。
- 地圖。
- 票券。
- 自由頁。

### Book Style Pack Lab

- 內建風格庫。
- Live preview。
- 每本旅行指定 style。
- Prompt Builder。
- JSON 驗證與匯入。
- 匯出 style JSON。
- 套用到真正 Studio 畫布。

### Live Trip

- 下一站。
- 今日時間軸。
- 完成切換。
- 地圖、票券、住宿、回憶入口。

### Diagnostics

- queue。
- action log。
- mock latency。
- mock failure。
- retry。
- offline 模擬。
- JSON import/export。

## 原型偵測資訊

Views：

- builder
- diagnostics
- itinerary
- library
- live
- studio
- styles
- templates

Action types：

- `book.generate`
- `bookStyle.import`
- `day.create`
- `day.master.update`
- `day.optimize`
- `day.update`
- `journey.assignPlace`
- `journey.moveStop`
- `journey.unassignPlace`
- `material.create`
- `memory.create`
- `page.create`
- `page.delete`
- `page.duplicate`
- `page.freeItem.create`
- `page.freeItem.delete`
- `page.freeItem.move`
- `page.update`
- `place.create`
- `place.update`
- `stop.create`
- `stop.delete`
- `stop.status`
- `stop.update`
- `template.update`
- `trip.archive`
- `trip.bookStyle.apply`
- `trip.create`
- `trip.delete`
- `trip.duplicate`
- `trip.update`
