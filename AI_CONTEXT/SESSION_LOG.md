# Session Log

## 2026-07-23 — Claude 移植後介面修復

- 比對目前 repo、既有 v0.5.0 Journey Builder prototype 與先前產品裁決。
- 確認根因不是 CRUD 壞掉，而是交接規格未進 repo，且空資料畫面只剩表單與大片空白。
- 保留現有 Trip／Place／Day／Stop 邏輯與 storage key。
- 新增有產品語言的首次進站畫面、流程預覽與階段說明。
- 改善 Journey Builder 說明、日期呈現、可及性與響應式版面。
- 加入 v1 state 正規化，降低 localStorage 不完整造成的崩潰。
- 建立 repo 內正式 AI_CONTEXT 紀錄。
- 透過 PR #1 squash merge 至 `master`，合併 commit：`6e33a89f6d20331d51e89f1d144b4a5e96d1bbd3`。

## 2026-07-23 — 北海道／札幌舊旅行測試模板

- 讀取 19 頁《北海道_札幌.pdf》，整理 2025/10/24–10/26 三天動線、景點、餐廳、購物與住宿。
- 新增獨立 `templates.js` declarative historical trip pack，不把行程資料硬寫進 renderer。
- 依使用者裁決，札幌資料直接成為全新瀏覽器的第一筆正式旅行，不呈現測試／模板模式。
- 新增整趟旅行刪除與級聯清理；刪除預載旅行後不會在 reload 自動復活。
- 敏感訂位代碼、住宿訂單編號與 SIM 開通電話不納入模板。
- 透過 PR #2 squash merge 至 `master`，合併 commit：`3d8c3056861d20ab93b1b1e37c7b2c503018dc9a`。

## 2026-07-23 — Map-centered Journey Builder

- state schema 與札幌 template 升級至 v2，加入 Place 地址／座標與 Stop 時間／停留／移動欄位。
- 舊札幌資料 migration 只補缺少欄位，不覆蓋使用者已修改內容。
- 以 Leaflet + OpenStreetMap 實作可替換的地圖 adapter；全程／單日標記、日別折線與卡片同步。
- 加入 Google Maps 景點與多站路線 URL。
- Place、Stop 編輯面板；Stop 跨日移動；Place／Day 級聯安全刪除。
- 手機版優先顯示地圖，接著是每日行程與未安排素材。
- DOM 驗證涵蓋 first-run、reload、防重複、刪除不復活、schema migration、跨日編輯、地圖 fallback 與路線 URL。
- 透過 PR #3 squash merge 至 `master`：`d014a3e77d0809efdf4da0063620cd4592fa3ea7`。
- 正式頁驗收發現 GitHub Pages/CDN 短暫混用舊靜態資源；PR #4 加入版本參數並合併：`61b5ee0c0879c145b3a68d8ba3bd0cadab7f639b`。
- 公開頁驗收：26 markers、29 Leaflet interactive layers、OSM 256px tiles、attribution 與三欄版面均成功載入。

## 2026-07-23 — Travel 四模式產品化

- 使用者驗收指出地圖版仍像「Google Map 戳標籤」，不足以視為完成網站。
- 回到既有正式定位：結構化旅行資料＋旅行中手機工具＋旅行出版編輯器。
- 預設入口改為旅行首頁；加入高級手帳拼貼封面、行程統計、每日摘要、預訂錢包與準備清單。
- 加入 Live Trip：日別切換、下一站、行程進度、完成打卡、導航與預訂快速入口。
- 加入 Book Studio：由 Trip／Day／Stop 生成 A4 封面與每日頁，支援手帳／雜誌／地圖冊三種風格與列印 PDF。
- state/template 升級 v3，加入 Booking、Checklist、Memory 容器與 Stop completed。
- DOM 測試新增四模式、Checklist persistence、Live completion、Book generation 與 Book Style persistence。
- 透過 PR #6 squash merge 至 `master`：`3366fb7e0b58bbb67bcd06fb26df45ad3a35f658`。
- 正式頁驗收：Home 3 日／3 bookings／7 checklist、Live 10 stops／OSM tiles、Book 4 pages／3 styles，且無網站 console error。

## 2026-07-23 — Mobile Journey Builder rebuild

- 使用者手機截圖確認首頁方向正確，但 Plan 仍是桌機後台縮小版：三天全展開、Stop 工具列過量、進入後保留首頁 scroll、Chat launcher 覆蓋旅行書導覽。
- 保留旅行首頁；手機 Plan 改為地圖＋單日行程 sheet，一次只顯示 map day 對應日期。
- Stop 常駐操作縮減為導航與編輯；素材箱改成含搜尋／新增的獨立抽屜。
- 模式切換與首頁「查看這天」會回到頁首。
- 以已確認的 SDK class 將 Chat launcher／panel 移至底部 Travel navigation 上方。
- DOM flow 新增單日 selection、map/day sync 與 mobile pool toggle 驗證。
- 透過 PR #8 squash merge 至 `master`：`450c4f29843013adab85dfed2613fa3579727d47`。
- 正式頁載入 product2 assets；Plan 結構驗收為 1 selected day／3 total days／26 markers／mobile pool toggle，無網站 console error。

## 2026-07-23 — Explore tools and touch-safe map

- 依手機實測移除「素材箱」命名與阻塞式抽屜，改為規劃頁內可展開的「景點清單」。
- 地圖預設鎖定拖曳、縮放與鍵盤操作；按「操作地圖」才解鎖，避免手機上下滑動被地圖攔截。
- 新增第五個「探索」模式：附近餐飲／景點／購物／休息、百大名城等六種主題地圖。
- 新增大眾運輸、步行、自駕的 Google Maps 路線入口與 NAVITIME 轉乘入口。
- 新增每趟旅行獨立購物清單、數量、分類、完成狀態與目的地推薦品。
- 附近與主題搜尋採 Google Maps URLs，無需 API key；即時內嵌店家結果留待 Places API 計費方案確認後再做。
- DOM 驗證擴充至景點清單開關、地圖鎖定切換、探索捷徑及購物清單 persistence。

## 2026-07-23 — Complete Japan 100 Castles atlas

- 修正規劃頁三點按鈕直接刪除旅行的錯誤語意，改為明確顯示「刪除旅行」。
- 移除以「附近搜尋」代表百大名城的做法。
- 新增 `castles.js`，內建日本城郭協會編號 1–100 的完整日本100名城、所在地與代表座標。
- 探索頁新增全國 100 城 Leaflet 總覽、地區篩選、文字搜尋、到訪進度與每城 Google Maps 直達連結。
- 名城地圖沿用手機安全設計，預設鎖定拖曳／縮放。
- DOM 驗證新增完整 100 筆、編號邊界、Google Maps URL 與 CastleVisit persistence。
