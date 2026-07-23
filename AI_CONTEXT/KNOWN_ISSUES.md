# Known Issues

- 資料只存在目前瀏覽器；換裝置或清除網站資料就會消失。
- 無登入、權限、多人同步與衝突解決。
- Stop 目前只能用上下按鈕排序，尚未支援拖拉；跨日移動可由編輯面板完成。
- Trip／Day 尚無重新命名；Place 已可編輯，Trip／Place／Day 均可刪除。
- GitHub Pages 與 Jonaminz SDK 的跨站整合仍須獨立驗收。
- 模板目前只保存行程資料與 PDF 中可辨識的文字；圖片、地圖、航班訂位代碼與住宿訂單編號不進 localStorage 測試資料。
- 札幌地址與座標為人工整理的近似點位；使用者可在 Place 編輯面板校正。
- 地圖需要網路；依 OpenStreetMap tile policy 不提供離線預抓。Leaflet 或圖磚載入失敗時，行程編輯與 Google Maps 連結仍可使用。
- 路線折線是依 Stop 順序直線連接，不是道路 travel-time routing；Google Maps 開啟後才計算實際路線。
- Google Maps 多站點 URL 仍受 Google Maps 各平台的 waypoint 數量與產品限制。
