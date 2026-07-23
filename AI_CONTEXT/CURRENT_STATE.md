# Current State

更新：2026-07-23

## 可用

- 建立與切換旅行。
- 新增並依類別篩選 Place。
- 新增 Day。
- 將 Place 指派為某一天的 Stop。
- Stop 上下移動、取消指派並回到素材箱。
- Reload 後從 localStorage 恢復資料。
- 首次進站會顯示 Travel Library 起始畫面與第一趟旅行表單。
- Journey Builder 桌機、平板與手機版面。
- 損壞或不完整的 v1 localStorage 會正規化，避免畫面直接崩潰。
- 全新瀏覽器直接顯示「快閃日本 3 日遊｜札幌」正式旅行資料。
- 可刪除整趟旅行，並級聯移除該 Trip 的 Place／Day／Stop。
- Place 可編輯名稱、分類、地址、座標與備註，也可單獨刪除。
- Stop 可編輯抵達時間、停留分鐘、移動方式與當天備註，並可移到另一個 Day。
- Day 可單獨刪除；相關 Stop 回到未安排素材狀態，Place 本體保留。
- Leaflet 互動地圖可切換全程／單日、顯示編號標記與日別折線，標記與 Stop 卡片同步。
- 新增 Place 時可點地圖帶入座標。
- 景點與每日／全程路線可用 Google Maps URL 開啟。
- 旅行首頁顯示正式封面、每日摘要、預訂錢包、統計與可勾選的出發準備。
- Live Trip 可切換每日、顯示下一站、完成進度、打卡完成與快速導航。
- Book Studio 依 Trip／Day／Stop 自動生成 A4 書頁，提供三種 Book Style 與列印／存 PDF。
- state schema v3 與 template v3 migration；Booking／Checklist 自動補入既有札幌旅行且不覆蓋手動資料。

## 尚未實作

- 登入與雙人同步。
- Supabase／正式後端與 Storage。
- Trip／Day 的重新命名。
- 拖拉排序（目前以按鈕調序；跨日移動已支援）。
- Book Studio 自由拖拉排版與逐頁 Page Master。
- 正式票券附件、Booking 編輯、照片 Memory 與跨裝置同步。
