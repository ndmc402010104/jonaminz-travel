# Decisions

- Travel 自己擁有 Trip、Place、Day、Stop、Book Page、Page Master、Book Style、Memory 與旅行 domain 資料。
- Jonaminz Core 只負責平台身份、session、registry、placement、visibility 與 capabilities。
- 第一階段只把垂直流程做穩，不用假的按鈕宣稱旅行書、Book Studio 或 Live Trip 已完成。
- 舊 v0.5.x prototype 是產品規格與視覺參考，不是 production code，也不能直接繼續堆 patch。
- Travel 可以有自己的 App Theme、Page Master 與 Book Style；Book Style 不得污染 Core 或其他 app。
- 保留沙丘紙張、深海藍綠、旅行書／編輯感的視覺語言。
- 空資料狀態必須能說明產品價值與下一步，不得只剩一個輸入框與大片空白。
- 先保留無建置、改檔即上線的部署方式。
- 2025 札幌舊旅行不是測試模式；全新瀏覽器直接將它建立為一般已完成旅行，作為正式第一筆 Journey Builder 畫面。
- 刪除旅行必須明確確認並級聯刪除該 Trip 的 Place／Day／Stop；刪除預載札幌旅行後記錄 dismissal，重新整理不得自動復活。
