# DECISIONS

## 核心分層

### App Theme

控制 Travel 操作介面：

- 導覽
- 按鈕
- 彈窗
- 編輯器外框
- 圖書館
- Journey Builder
- 手機功能介面

它不應隨每本旅行書大幅改變。

### Page Master

控制頁面結構與資料插槽：

- 封面
- 當日手帳
- 景點特寫
- 路線地圖
- 票券資訊
- 照片故事頁
- 自由頁

它回答「資料放在哪裡」。

### Book Style

控制整本書的美術語言：

- 色彩
- 字體 preset
- 紙張
- 照片形狀與處理
- 線條
- 裝飾
- 頁碼
- 資訊密度

它回答「這本書看起來像什麼」。

## Journey Builder 單一卡片原則

一個 Place 在 Journey Builder 畫面只能出現一次：

- 未安排：左側 Place Pool。
- 已安排：右側 Day Board。
- 移動：拖動右側同一張卡片。
- 取消安排：回到左側。

不得做成左側保留原卡、右側再複製一張。

## 旅行書同步狀態

- `clean`：Day 資料與生成頁一致。
- `dirty`：Day 或 Stop 改變，需要重新生成。
- `manual`：頁面已手動調整，預設保護。

系統不得偷偷覆蓋 `manual` 頁面。

## Planned 與 Actual

- Planned 保存原始規劃。
- Actual 保存旅行中真實發生的結果。
- 完成、跳過、延誤或改點，不得破壞 Planned。

## Typography

正式基準：

- xs：12px，只用於 eyebrow、技術 metadata、版本。
- sm：14px，用於標籤、按鈕、次要描述。
- md：16px，用於正文。
- lg：20px，用於卡片與區塊標題。
- xl：32px，用於頁面標題。
- 2xl：40–64px，用於 Hero。

功能性文字不得小於 12px。

## AI 風格包

AI 不直接改產品程式。

正確流程：

```text
填主題
→ 系統產生正式 Prompt
→ AI 輸出 declarative JSON
→ 驗證
→ 預覽
→ 匯入
→ 套用
```

禁止任意 CSS、JavaScript、HTML、URL、base64 與字型檔。
