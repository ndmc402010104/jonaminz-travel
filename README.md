# Jonaminz Travel

Jonathan 與 Minz 的旅行規劃：把想去的景點、餐廳與購物素材收進同一趟旅行，排進每天並反覆調整，之後再長成旅行書與旅途中模式。

不需要任何建置工具的純 HTML／CSS／JS（跟 jonaminz-movies 同一個原則）：

- `index.html` 骨架。
- `app.js` 全部邏輯（Trip／Place／Day／Stop 的建立、指派、排序、取消指派），
  資料存瀏覽器 localStorage。
- `styles.css` 外觀樣式，自己一套視覺語言（沙丘＋深海），跟 jonaminz 主站
  或 jonaminz-movies 都不同。

## 本機開發

**不需要安裝任何東西**，直接用瀏覽器打開 `index.html` 就能看。改
`app.js`／`styles.css` 後存檔，重新整理瀏覽器就會看到最新結果。

## 內含

- 建立旅行（Trip）
- 收集景點／餐廳素材（Place），標記類別（必去/想去/美食/購物/備選）
- 建立每天（Day），把素材指派進某一天（Stop）
- 同一天內上下移動順序、取消指派回到素材池
- Reload 不掉資料
- 第一次進站不是空白表單，而是可理解產品方向的 Travel Library 起始畫面
- 桌機、平板與手機響應式版面
- 全新瀏覽器會以「快閃日本 3 日遊｜札幌」舊旅行作為第一筆正式資料，直接顯示有內容的 Journey Builder
- 可刪除整趟旅行；Trip、Place、Day 與 Stop 會一起移除

## 測試模板

`templates.js` 保存 declarative historical trip pack，目前內建依照
2025/10/24–10/26《北海道_札幌.pdf》整理的舊旅行。全新瀏覽器第一次開啟時，
它會被複製成一般已完成旅行，作為正式的第一筆畫面資料。使用者刪除後會留下
本機 dismissal 紀錄，重新整理不會再次自動建立。

目前只做「第一條垂直流程」，正式裁決與實作狀態改由 repo 內的
[`AI_CONTEXT/`](AI_CONTEXT/) 維護。旅行書生成、Book Style、Book Studio、
旅途中 Live Trip 模式都還沒做，也還沒接 jonaminz 平台身分／後端。

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

demo 資料之後要漸進接上真實身分／後端，並往後續階段（旅行書生成、
Book Style、Book Studio、Live Trip）推進，
保留現有的視覺語言與互動方式。
