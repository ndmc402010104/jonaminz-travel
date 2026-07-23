# Current State

更新：2026-07-23

## LayoutMetrics capability

- Travel 已改由 window.Jonaminz.layout 的 layout.metrics@1 決定地圖觸控守衛，不含自己的 matchMedia／桌機斷點。
- 桌機滑鼠可預設直接操作地圖；手機與任何含 coarse pointer 的混合裝置維持預設鎖定。
- SDK 未載入、未授權、degraded 或逾時時安全退回鎖定，頁面仍可正常滑動。
- 「操作地圖／完成操作」固定在地圖右上同一位置；桌機不需要顯示操作按鈕。
- 程式與模擬測試已通過；正式 grant 仍待 Core Worker 部署 revision 6。



## 可用

- 建立與切換旅行。
- 新增並依類別篩選 Place。
- 新增 Day。
- 將 Place 指派為某一天的 Stop。
- Stop 上下移動、取消指派並回到景點清單。
- Reload 後從 localStorage 恢復資料。
- 首次進站會顯示 Travel Library 起始畫面與第一趟旅行表單。
- Journey Builder 桌機、平板與手機版面。
- 損壞或不完整的 v1 localStorage 會正規化，避免畫面直接崩潰。
- 全新瀏覽器直接顯示「快閃日本 3 日遊｜札幌」正式旅行資料。
- 可刪除整趟旅行，並級聯移除該 Trip 的 Place／Day／Stop。
- Place 可編輯名稱、分類、地址、座標與備註，也可單獨刪除。
- Stop 可編輯抵達時間、停留分鐘、移動方式與當天備註，並可移到另一個 Day。
- Day 可單獨刪除；相關 Stop 回到待安排景點狀態，Place 本體保留。
- Leaflet 互動地圖可切換全程／單日、顯示編號標記與日別折線，標記與 Stop 卡片同步。
- 新增 Place 時可點地圖帶入座標。
- 景點與每日／全程路線可用 Google Maps URL 開啟。
- 旅行首頁顯示正式封面、每日摘要、預訂錢包、統計與可勾選的出發準備。
- Live Trip 可切換每日、顯示下一站、完成進度、打卡完成與快速導航。
- Book Studio 依 Trip／Day／Stop 自動生成 A4 書頁，提供三種 Book Style 與列印／存 PDF。
- state schema v3 與 template v3 migration；Booking／Checklist 自動補入既有札幌旅行且不覆蓋手動資料。
- 手機 Journey Builder 採 map-first 單日 sheet：地圖日別與時間軸同步，只顯示選中的一天。
- 景點清單是規劃頁內的展開區塊，含搜尋、新增與排入日期，不使用會阻塞畫面的 modal 抽屜。
- 行程地圖預設鎖定拖曳／縮放；需按「操作地圖」才會接管觸控，避免手機滑頁被攔住。
- 探索模式提供附近餐飲／景點／購物、百大名城等主題地圖、Google Maps／NAVITIME 交通入口。
- 探索模式內建日本城郭協會「日本100名城」1–100 完整名單、全國總覽地圖、地區／文字篩選與每趟旅行的到訪勾選；每座城直接開啟 Google Maps。
- 每趟旅行有獨立購物清單、完成狀態與目的地推薦品。
- 手機 Stop 卡只保留主要導航／編輯入口；Jonaminz Chat launcher 已避開五模式底部導覽。

## 尚未實作

- 登入與雙人同步。
- Supabase／正式後端與 Storage。
- Trip／Day 的重新命名。
- 拖拉排序（目前以按鈕調序；跨日移動已支援）。
- Book Studio 自由拖拉排版與逐頁 Page Master。
- 正式票券附件、Booking 編輯、照片 Memory 與跨裝置同步。
- 內嵌即時附近店家結果（目前以不需 API key 的 Google Maps URL 開啟）。
- 「續日本100名城」101–200 的完整資料庫（原始日本100名城 1–100 已完成）。
