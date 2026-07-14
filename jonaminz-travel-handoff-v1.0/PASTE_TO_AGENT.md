# AGENT BOOT PROMPT

你正在接手 Jonaminz Travel。

先不要修改任何程式。

## 第一步

完整閱讀：

- READ_ME_FIRST.md
- AI_CONTEXT/PRODUCT_VISION.md
- AI_CONTEXT/DECISIONS.md
- AI_CONTEXT/ARCHITECTURE.md
- AI_CONTEXT/DATA_MODEL.md
- AI_CONTEXT/KNOWN_ISSUES.md
- AI_CONTEXT/REBUILD_PLAN.md

## 專案現況

目前只有高完成度的視覺／產品 prototype。

`REFERENCE_SOURCE/` 與 `REFERENCE/`：

- 不是 production。
- 互動不可靠。
- 不可繼續 patch。
- 只能作為 UI、文案、流程與資料模型參考。

## 你的任務

1. 先提出乾淨重建計畫。
2. 將 FACTS、DECISIONS、CURRENT_STATE、KNOWN_ISSUES、CHECKPOINTS 建立在新 repo。
3. 建立可執行 dev server。
4. 先只做 Phase 1 Foundation。
5. 再做第一條垂直流程：
   Trip → Place → Day → Assign → Move → Unassign → Reload。
6. 每一階段都要有 browser E2E。
7. 不得自行縮減成普通 CRUD 後台。
8. 不得讓 AI 直接輸入 CSS／JS。
9. 不得破壞 App Theme／Page Master／Book Style 分層。
10. 不得 silently overwrite manual book pages。

## 回覆使用者前

請清楚說明：

- 你讀了哪些文件。
- 哪些是已裁決。
- 哪些只是 prototype。
- 你準備建立的第一個 checkpoint。
- 哪些檔案會修改。
- 如何驗收。
