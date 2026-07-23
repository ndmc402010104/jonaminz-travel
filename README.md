# Jonaminz Travel

Jonathan 與 Minz 的旅行規劃、旅途中工具與旅行出版編輯器：從出發準備、預訂、每日路線，到現場導航與旅行書都收在同一趟旅行。

不需要任何建置工具的純 HTML／CSS／JS（跟 jonaminz-movies 同一個原則）：

- `index.html` 骨架。
- `app.js` 全部邏輯（Trip／Place／Day／Stop 的建立、編輯、指派與排序），
  資料存瀏覽器 localStorage。
- `map-adapter.js` 隔離地圖供應商；目前使用 Leaflet + OpenStreetMap 圖磚。
- `styles.css` 外觀樣式，自己一套視覺語言（沙丘＋深海），跟 jonaminz 主站
  或 jonaminz-movies 都不同。

## 本機開發

**不需要安裝任何東西**，直接用瀏覽器打開 `index.html` 就能看。改
`app.js`／`styles.css` 後存檔，重新整理瀏覽器就會看到最新結果。

## 內含

- 建立旅行（Trip）
- 旅行首頁：正式封面、旅程統計、每日摘要、預訂錢包與出發準備清單
- 收集景點／餐廳（Place），標記類別（必去/想去/美食/購物/備選）
- 建立每天（Day），把景點指派進某一天（Stop）
- 同一天內上下移動順序、取消指派回到景點清單
- 編輯景點的地址、座標與備註；點地圖可帶入新景點座標
- 編輯 Stop 的抵達時間、停留時間、移動方式與當天備註
- Stop 可直接改到另一個 Day
- 全程／單日互動地圖、編號標記、日別路線與卡片同步
- 每個景點與每日路線都能交給 Google Maps 開啟導航
- 單獨刪除 Place／Day，並安全清理相關 Stop
- Reload 不掉資料
- 第一次進站不是空白表單，而是可理解產品方向的 Travel Library 起始畫面
- 桌機、平板與手機響應式版面
- 全新瀏覽器會以「快閃日本 3 日遊｜札幌」舊旅行作為第一筆正式資料，直接顯示有內容的 Journey Builder
- 可刪除整趟旅行；Trip、Place、Day 與 Stop 會一起移除
- 旅途中模式：每日切換、下一站、進度、完成打卡、快速導航與預訂入口
- 旅行書工作室：依行程自動生成封面與每日書頁，支援手帳／雜誌／地圖冊風格與列印 PDF
- 探索工具：附近餐飲／景點／購物、百大名城等主題地圖與交通比較
- 每趟旅行的購物清單、完成狀態與目的地推薦品
- 手機地圖預設鎖定，按「操作地圖」才允許拖曳與縮放

## 測試模板

`templates.js` 保存 declarative historical trip pack，目前內建依照
2025/10/24–10/26《北海道_札幌.pdf》整理的舊旅行。全新瀏覽器第一次開啟時，
它會被複製成一般已完成旅行，作為正式的第一筆畫面資料。使用者刪除後會留下
本機 dismissal 紀錄，重新整理不會再次自動建立。

目前已完成旅行首頁、Journey Builder、Live Trip、Book Studio 與探索工具五個正式模式。
裁決與實作狀態由 repo 內的 [`AI_CONTEXT/`](AI_CONTEXT/) 維護；登入、雙人同步、
照片 Memory 與正式後端仍待後續接入。

地圖只做瀏覽器互動顯示，不預抓或離線儲存 OpenStreetMap 圖磚。地圖設定集中在
`map-adapter.js`，未來可更換 tile URL 或地圖供應商而不改 Trip 資料模型。

## Platform Integration

這是 [jonaminz](https://github.com/ndmc402010104/jonaminz) Platform
Integration（圖書館模型）的外部專案，跟 jonaminz-movies 同一個模式。
根目錄的 `jonaminz.contract.json` 依照
[Contract JSON Schema](https://github.com/ndmc402010104/jonaminz/tree/main/docs/contract-schema)
撰寫；jonaminz 端在 `backend/cloudflare-worker/integration-settings.json`
登記本專案在各 environment 的 origin。

## 部署

`master` 分支 push 後 GitHub Pages 直接從分支內容部署（沒有建置步驟），
網址：`https://ndmc402010104.github.io/jonaminz-travel/`。

## 後續

本機資料之後要漸進接上真實身分／後端，並加入照片 Memory、票券附件、
自由書頁排版與離線同步，保留現有的視覺語言與五模式資訊架構。
