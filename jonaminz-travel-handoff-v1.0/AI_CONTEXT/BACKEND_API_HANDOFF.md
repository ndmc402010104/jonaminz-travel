# BACKEND API HANDOFF

## 建議資源

- trips
- places
- days
- stops
- book_pages
- page_masters
- book_styles
- trip_book_style_bindings
- memories
- files
- sync_actions

## 最低 API

### Trips

- listTrips
- createTrip
- updateTrip
- archiveTrip
- restoreTrip
- deleteTrip

### Places

- listPlaces
- createPlace
- updatePlace
- deletePlace

### Journey

- listDays
- createDay
- updateDay
- reorderDays
- assignPlaceToDay
- moveStop
- reorderStops
- unassignPlace
- createManualStop
- deleteManualStop

### Book

- previewGeneration
- executeGeneration
- listBookPages
- updateBookPage
- duplicateBookPage
- deleteBookPage

### Styles

- listBookStyles
- importBookStyle
- getBookStyleVersion
- bindTripBookStyle
- upgradeTripBookStyle

## 寫入要求

所有 mutation：

- 接受 action id 作 idempotency key。
- 回傳 canonical entity 與 revision。
- 支援 optimistic conflict detection。
- 保證 assign／move／unassign 的 transaction。
