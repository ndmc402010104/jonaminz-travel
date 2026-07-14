# JOURNEY BUILDER SPEC

## 目標

把 Place 素材安排成 Day／Stop，並驅動旅行書生成。

## 畫面

### 左側

只顯示未安排 Place。

- 搜尋
- 分類篩選
- 新增與編輯素材
- 拖進 Day

### 中央

Day Board。

- Day 標題、日期
- Page Master 選擇
- 已安排 Stop
- Stop 跨 Day 拖曳
- 同 Day 排序
- 取消安排
- 手動新增 Stop
- 同步狀態

### 右側

Book Generation。

- 顯示 Page Master
- 顯示 Book Style
- 顯示 clean／dirty／manual
- 預覽生成差異
- 執行生成
- 保護手動頁面

## 原子操作

### Assign Place

必須在同一 transaction／mutation 中：

1. 建立 Stop。
2. 將 Stop 指向 Place。
3. 放入 Day。
4. 更新 position。
5. 標記 Day dirty。

### Move Stop

1. Stop 改 dayId／position。
2. Place 不複製。
3. 舊 Day 與新 Day 都 dirty。
4. UI 只保留一張卡片。

### Unassign

1. 刪除或解除 Stop。
2. Place 回到未安排池。
3. Day dirty。
4. 不建立幽靈 Place。

## 生成旅行書

先產生 diff：

- create
- update
- preserve
- unchanged
- conflict

使用者確認後才執行。

## 尚未完成但必須實作

- 同一 Day 內排序。
- 新旅行建立後的 Day scaffold。
- 多日批次選取與生成。
- 生成 conflict UI。
- Place 與 Stop 的真正 DB transaction。
