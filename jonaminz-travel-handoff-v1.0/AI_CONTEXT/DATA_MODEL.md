# DATA MODEL

## Trip

```json
{
  "id": "uuid",
  "title": "阪兵岡百城之旅",
  "startDate": "2026-08-08",
  "endDate": "2026-08-17",
  "status": "planning",
  "bookStyleRef": {
    "styleId": "minz-premium-journal",
    "version": "1.0.0"
  }
}
```

Status：

- planning
- completed
- archived

封存旅行只出現在封存頁籤。

## Place

可重用素材，不等於已排入行程。

```json
{
  "id": "uuid",
  "title": "大原美術館",
  "category": "want",
  "kind": "place",
  "region": "倉敷",
  "address": "...",
  "durationMinutes": 100,
  "note": "...",
  "mediaRef": "..."
}
```

Category：

- must
- want
- food
- shopping
- backup

## Day

```json
{
  "id": "uuid",
  "tripId": "uuid",
  "index": 9,
  "date": "2026-08-16",
  "title": "倉敷",
  "pageMasterId": "master-day-photo",
  "bookSyncStatus": "dirty"
}
```

## Stop

Place 被安排到 Day 後的 trip-specific instance。

```json
{
  "id": "uuid",
  "dayId": "uuid",
  "sourcePlaceId": "uuid-or-null",
  "time": "11:30",
  "title": "大原美術館",
  "kind": "place",
  "durationMinutes": 100,
  "plannedStatus": "planned",
  "actualStatus": "not-started",
  "position": 3
}
```

## Book Page

```json
{
  "id": "uuid",
  "tripId": "uuid",
  "dayId": "uuid-or-null",
  "pageMasterId": "master-day-photo",
  "generatedFromDay": true,
  "syncStatus": "manual",
  "manualEdited": true
}
```

## Book Style Pack

```json
{
  "schemaVersion": "1.0",
  "styleId": "showa-railway-1980",
  "version": "1.0.0",
  "name": "昭和鐵道旅行誌",
  "tokens": {},
  "compatibility": {
    "pageTypes": ["cover", "journal", "map", "info"]
  },
  "assetRequests": []
}
```

## Memory

```json
{
  "id": "uuid",
  "tripId": "uuid",
  "dayId": "uuid",
  "stopId": "uuid-or-null",
  "text": "長廊比想像中更漂亮。",
  "photoRefs": [],
  "createdAt": "timestamp"
}
```
