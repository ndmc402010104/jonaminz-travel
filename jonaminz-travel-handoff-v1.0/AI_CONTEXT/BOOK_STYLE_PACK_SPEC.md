# BOOK STYLE PACK SPEC

## 目的

讓每一本旅行書都有獨立風格，但不破壞 App Theme 與 Page Master。

## Prompt Builder

輸入：

- 主題
- 氣氛
- 偏好色彩與材質
- 不希望出現的內容

系統自動產生完整 Prompt，內容包含：

- 三層責任邊界
- Schema
- enum
- 數值範圍
- 可讀性規則
- 禁止欄位
- 只輸出 JSON

## Importer Pipeline

```text
paste
→ strip markdown fence
→ JSON parse
→ envelope validation
→ forbidden-field scan
→ enum/range validation
→ compatibility validation
→ preview
→ user apply
```

## 安全限制

拒絕：

- css
- style
- selector
- className
- script
- javascript
- html
- url
- base64
- fontFile

## Version

Trip 必須 pin：

- styleId
- exact version

Style 更新時：

- 保持舊版
- 預覽新版
- 手動升級

不得自動讓歷史旅行書變樣。

## Renderer

風格包只能透過固定 adapter 轉成：

- CSS variables
- allowlisted enum classes
- approved assets

不得直接注入原始程式。
