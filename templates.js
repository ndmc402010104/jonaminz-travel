/*
Jonaminz Travel declarative template packs.

Historical trip packs are source data for first-run seeding. app.js copies the
Sapporo pack into localStorage as a normal completed trip on a fresh install.
*/
(function () {
  "use strict";

  window.JonaminzTravelTemplates = [
    {
      schemaVersion: 1,
      templateId: "sapporo-2025-10",
      templateVersion: 1,
      label: "快閃日本 3 日遊｜札幌",
      summary: "2025.10.24–10.26 · 已完成旅行",
      sourceDocument: "北海道_札幌.pdf",
      trip: {
        title: "快閃日本 3 日遊｜札幌",
        startDate: "2025-10-24",
        endDate: "2025-10-26",
        status: "completed"
      },
      places: [
        { key: "new-chitose", title: "新千歲機場", category: "must", note: "FD242／FD243，T1" },
        { key: "sapporo-station", title: "札幌車站", category: "must", note: "Day 1 先寄放行李" },
        { key: "beer-museum", title: "札幌啤酒博物館", category: "must", note: "Day 1 主行程" },
        { key: "odori", title: "大通公園", category: "must", note: "Day 1 市區散步" },
        { key: "tv-tower", title: "さっぽろテレビ塔", category: "want", note: "大通公園景觀塔" },
        { key: "jungle", title: "ジャングル 札幌店", category: "shopping", note: "大通周邊" },
        { key: "majisand", title: "Majisand", category: "food", note: "三明治" },
        { key: "surugaya", title: "駿河屋 札幌ノルベサ店", category: "shopping", note: "大通周邊" },
        { key: "ebi-kani", title: "えびかに合戦札幌本店", category: "food", note: "熟凍三蟹放題" },
        { key: "hotel", title: "Swanky Hotel Otomo", category: "must", note: "10/24、10/25；15:00 check-in／10:00 check-out" },
        { key: "nijo", title: "二条市場", category: "must", note: "Day 2 早晨市場" },
        { key: "donbei", title: "丼兵衛", category: "food", note: "海鮮丼飯" },
        { key: "maruyama-zoo", title: "円山動物園", category: "must", note: "Day 2" },
        { key: "hokkaido-shrine", title: "北海道神宮", category: "must", note: "與円山動物園同區" },
        { key: "tanukikoji", title: "狸小路商店街", category: "shopping", note: "Day 2 市區購物" },
        { key: "clock-tower", title: "札幌市時計台", category: "want", note: "狸小路周邊" },
        { key: "soup-curry", title: "スープカレー奥芝商店 駅前創成寺", category: "food", note: "湯咖哩" },
        { key: "tokyu", title: "東急百貨店 さっぽろ店", category: "shopping", note: "B1 一番賞官方店" },
        { key: "daimaru-pokemon", title: "大丸札幌店 Pokémon Center", category: "shopping", note: "8F" },
        { key: "yodobashi", title: "Yodobashi Camera Sapporo", category: "shopping", note: "營業至 22:00" },
        { key: "snow-cheese", title: "SNOW CHEESE", category: "shopping", note: "新千歲機場；8:00 前排隊" },
        { key: "kinotoya", title: "KINOTOYA", category: "food", note: "新千歲機場甜點" },
        { key: "corn-bread", title: "美瑛選果 玉米麵包", category: "food", note: "新千歲機場" },
        { key: "gundam-base", title: "THE GUNDAM BASE ANNEX", category: "shopping", note: "新千歲機場 4F" },
        { key: "airport-pokemon", title: "Pokémon Store 新千歲機場店", category: "shopping", note: "新千歲機場 2F" },
        { key: "muji", title: "MUJI to GO 新千歲機場", category: "shopping", note: "代購清單" },
        { key: "beer-garden", title: "サッポロビール園", category: "food", note: "成吉思汗烤羊肉放題；保留作未安排素材" },
        { key: "moyuk", title: "moyuk SAPPORO", category: "backup", note: "水族館；保留作備選" },
        { key: "gyoza", title: "SAPPORO餃子製造所", category: "backup", note: "保留作備選" },
        { key: "niikuraya", title: "札幌新倉屋", category: "backup", note: "團子；保留作備選" }
      ],
      days: [
        {
          key: "day-1",
          index: 1,
          date: "2025-10-24",
          title: "啤酒博物館與大通公園",
          stops: [
            { placeKey: "new-chitose", time: "12:10" },
            { placeKey: "sapporo-station", time: "" },
            { placeKey: "beer-museum", time: "" },
            { placeKey: "odori", time: "" },
            { placeKey: "tv-tower", time: "" },
            { placeKey: "jungle", time: "" },
            { placeKey: "majisand", time: "" },
            { placeKey: "surugaya", time: "" },
            { placeKey: "ebi-kani", time: "" },
            { placeKey: "hotel", time: "" }
          ]
        },
        {
          key: "day-2",
          index: 2,
          date: "2025-10-25",
          title: "二条市場、円山與狸小路",
          stops: [
            { placeKey: "nijo", time: "07:00" },
            { placeKey: "donbei", time: "" },
            { placeKey: "maruyama-zoo", time: "" },
            { placeKey: "hokkaido-shrine", time: "" },
            { placeKey: "tanukikoji", time: "" },
            { placeKey: "clock-tower", time: "" },
            { placeKey: "soup-curry", time: "16:30" },
            { placeKey: "tokyu", time: "" },
            { placeKey: "daimaru-pokemon", time: "" },
            { placeKey: "yodobashi", time: "" }
          ]
        },
        {
          key: "day-3",
          index: 3,
          date: "2025-10-26",
          title: "新千歲機場購物與返程",
          stops: [
            { placeKey: "snow-cheese", time: "08:00" },
            { placeKey: "kinotoya", time: "" },
            { placeKey: "corn-bread", time: "" },
            { placeKey: "gundam-base", time: "" },
            { placeKey: "airport-pokemon", time: "" },
            { placeKey: "muji", time: "" }
          ]
        }
      ]
    }
  ];
})();
