# Google Maps Platform 評估

更新：2026-07-23

## 結論

目前不接 Google Maps JavaScript API，也不把 Places Web Service 金鑰放進 GitHub Pages。

保留現有架構：

- 站內地圖：Leaflet + OpenStreetMap。
- 導航、單一地點與附近搜尋：Google Maps URL。
- 日本100名城：站內保存完整 1–100 靜態資料，每城直接開 Google Maps。

未來如果要把「評分、評價數、營業時間」直接顯示在 Travel 卡片內，再新增一個有金鑰保護、配額與快取策略的後端端點，使用 Places API (New)。

## 為什麼現在不接

1. Travel 目前是純靜態 GitHub Pages；Places Web Service 金鑰不應直接暴露在前端。
2. 目前真正缺少的是旅行決策流程與內容密度，不是更換地圖底圖。
3. 低使用量雖通常可落在每月免費額度內，但不同欄位會觸發不同 SKU，不能把「查一次店家」視為固定成本。
4. Google 要求用 FieldMask；索取越多欄位可能進入越高計價層級。

## 欄位與計價層級（2026-07-23 官方資料）

- `displayName`、`googleMapsUri`：Place Details Pro。
- `rating`、`userRatingCount`、`currentOpeningHours`、`regularOpeningHours`：Place Details Enterprise。
- `reviews`、`reviewSummary`：Place Details Enterprise + Atmosphere。
- Place Details Enterprise：每月 1,000 次免費，之後前 100,000 次每 1,000 次 USD 20。
- Place Details Enterprise + Atmosphere：每月 1,000 次免費，之後前 100,000 次每 1,000 次 USD 25。
- Text Search 若要求高階欄位，也會依最高欄位進入對應 SKU。

價格會變動，實作時必須重新查官方 pricing page。

## 建議的未來接法

只在使用者把地點加入行程或主動展開詳細資料時查詢，不在每次頁面載入時刷新全部地點。

最小欄位：

```text
id,displayName,googleMapsUri,rating,userRatingCount,currentOpeningHours
```

不要第一版就取 `reviews`。星等、評價數與是否營業已能支援多數旅行決策；評論全文成本更高，也增加顯示規範與資料更新負擔。

## 安全與配額

- Web Service 呼叫放在後端／Edge Function。
- 金鑰限制到 Places API (New)，並使用伺服器 IP 或適合部署平台的限制。
- 設定每日 quota 與 billing alert。
- Place ID 存入 Travel domain；動態內容依 Google 規則更新，不把評論當永久自有資料庫。
- UI 必須保留 Google attribution 與連回 Google Maps 的入口。

