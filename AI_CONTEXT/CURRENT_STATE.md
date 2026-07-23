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
- state schema v2 與 template v2 migration；只填補舊札幌資料缺少的欄位。

## 尚未實作

- 登入與雙人同步。
- Supabase／正式後端與 Storage。
- Trip／Day 的重新命名。
- 拖拉排序（目前以按鈕調序；跨日移動已支援）。
- 旅行書生成、Book Studio、Page Master、Book Style。
- 完整 Live Trip、票券、住宿與 Memory（外部 Google Maps 導航已支援）。
