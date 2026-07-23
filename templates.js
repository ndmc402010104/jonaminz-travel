/*
Jonaminz Travel declarative template packs.

Historical trip packs are source data for first-run seeding. app.js copies the
Sapporo pack into localStorage as a normal completed trip on a fresh install.
*/
(function () {
  "use strict";

  window.JonaminzTravelTemplates = [
    {
      schemaVersion: 2,
      templateId: "sapporo-2025-10",
      templateVersion: 2,
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
        { key: "new-chitose", title: "新千歲機場", category: "must", address: "北海道千歲市美々", lat: 42.7752, lng: 141.6923, note: "FD242／FD243，T1" },
        { key: "sapporo-station", title: "札幌車站", category: "must", address: "札幌市北區北6條西4丁目", lat: 43.0687, lng: 141.3508, note: "Day 1 先寄放行李" },
        { key: "beer-museum", title: "札幌啤酒博物館", category: "must", address: "札幌市東區北7條東9丁目1-1", lat: 43.0714, lng: 141.3686, note: "Day 1 主行程" },
        { key: "odori", title: "大通公園", category: "must", address: "札幌市中央區大通西", lat: 43.0605, lng: 141.3474, note: "Day 1 市區散步" },
        { key: "tv-tower", title: "さっぽろテレビ塔", category: "want", address: "札幌市中央區大通西1丁目", lat: 43.0611, lng: 141.3564, note: "大通公園景觀塔" },
        { key: "jungle", title: "ジャングル 札幌店", category: "shopping", address: "札幌市中央區南3條西5丁目 NORBESA周邊", lat: 43.0553, lng: 141.3522, note: "大通周邊" },
        { key: "majisand", title: "Majisand", category: "food", address: "札幌市中央區", lat: 43.0562, lng: 141.3510, note: "三明治" },
        { key: "surugaya", title: "駿河屋 札幌ノルベサ店", category: "shopping", address: "札幌市中央區南3條西5丁目1-1 NORBESA", lat: 43.0552, lng: 141.3523, note: "大通周邊" },
        { key: "ebi-kani", title: "えびかに合戦札幌本店", category: "food", address: "札幌市中央區南4條西5丁目", lat: 43.0543, lng: 141.3512, note: "熟凍三蟹放題" },
        { key: "hotel", title: "Swanky Hotel Otomo", category: "must", address: "札幌市中央區南6條西6丁目6-14", lat: 43.0513, lng: 141.3492, note: "10/24、10/25；15:00 check-in／10:00 check-out" },
        { key: "nijo", title: "二条市場", category: "must", address: "札幌市中央區南3條東1丁目", lat: 43.0573, lng: 141.3594, note: "Day 2 早晨市場" },
        { key: "donbei", title: "丼兵衛", category: "food", address: "札幌市中央區南3條東2丁目 二条市場", lat: 43.0572, lng: 141.3600, note: "海鮮丼飯" },
        { key: "maruyama-zoo", title: "円山動物園", category: "must", address: "札幌市中央區宮丘3-1", lat: 43.0518, lng: 141.3058, note: "Day 2" },
        { key: "hokkaido-shrine", title: "北海道神宮", category: "must", address: "札幌市中央區宮丘474", lat: 43.0548, lng: 141.3074, note: "與円山動物園同區" },
        { key: "tanukikoji", title: "狸小路商店街", category: "shopping", address: "札幌市中央區南2條西", lat: 43.0570, lng: 141.3516, note: "Day 2 市區購物" },
        { key: "clock-tower", title: "札幌市時計台", category: "want", address: "札幌市中央區北1條西2丁目", lat: 43.0626, lng: 141.3537, note: "狸小路周邊" },
        { key: "soup-curry", title: "スープカレー奥芝商店 駅前創成寺", category: "food", address: "札幌市中央區北4條西1丁目", lat: 43.0660, lng: 141.3563, note: "湯咖哩" },
        { key: "tokyu", title: "東急百貨店 さっぽろ店", category: "shopping", address: "札幌市中央區北4條西2丁目", lat: 43.0669, lng: 141.3530, note: "B1 一番賞官方店" },
        { key: "daimaru-pokemon", title: "大丸札幌店 Pokémon Center", category: "shopping", address: "札幌市中央區北5條西4丁目7 大丸札幌店8F", lat: 43.0684, lng: 141.3475, note: "8F" },
        { key: "yodobashi", title: "Yodobashi Camera Sapporo", category: "shopping", address: "札幌市北區北6條西5丁目", lat: 43.0680, lng: 141.3455, note: "營業至 22:00" },
        { key: "snow-cheese", title: "SNOW CHEESE", category: "shopping", address: "新千歲機場國內線航廈", lat: 42.77545, lng: 141.69210, note: "8:00 前排隊" },
        { key: "kinotoya", title: "KINOTOYA", category: "food", address: "新千歲機場國內線航廈", lat: 42.77540, lng: 141.69230, note: "新千歲機場甜點" },
        { key: "corn-bread", title: "美瑛選果 玉米麵包", category: "food", address: "新千歲機場國內線航廈", lat: 42.77535, lng: 141.69250, note: "新千歲機場" },
        { key: "gundam-base", title: "THE GUNDAM BASE ANNEX", category: "shopping", address: "新千歲機場 4F", lat: 42.77530, lng: 141.69270, note: "新千歲機場 4F" },
        { key: "airport-pokemon", title: "Pokémon Store 新千歲機場店", category: "shopping", address: "新千歲機場 2F", lat: 42.77525, lng: 141.69290, note: "新千歲機場 2F" },
        { key: "muji", title: "MUJI to GO 新千歲機場", category: "shopping", address: "新千歲機場 2F", lat: 42.77520, lng: 141.69310, note: "代購清單" },
        { key: "beer-garden", title: "サッポロビール園", category: "food", address: "札幌市東區北7條東9丁目2-10", lat: 43.0719, lng: 141.3711, note: "成吉思汗烤羊肉放題；未安排" },
        { key: "moyuk", title: "moyuk SAPPORO", category: "backup", address: "札幌市中央區南2條西3丁目20", lat: 43.0571, lng: 141.3536, note: "水族館；備選" },
        { key: "gyoza", title: "SAPPORO餃子製造所", category: "backup", address: "札幌市中央區", lat: 43.0560, lng: 141.3562, note: "備選" },
        { key: "niikuraya", title: "札幌新倉屋", category: "backup", address: "札幌市中央區", lat: 43.0607, lng: 141.3571, note: "團子；備選" }
      ],
      days: [
        {
          key: "day-1",
          index: 1,
          date: "2025-10-24",
          title: "啤酒博物館與大通公園",
          stops: [
            { placeKey: "new-chitose", time: "12:10", duration: 45, transport: "flight" },
            { placeKey: "sapporo-station", time: "13:30", duration: 30, transport: "train" },
            { placeKey: "beer-museum", time: "15:00", duration: 90, transport: "bus" },
            { placeKey: "odori", time: "17:00", duration: 45, transport: "bus" },
            { placeKey: "tv-tower", time: "17:45", duration: 45, transport: "walk" },
            { placeKey: "jungle", time: "" },
            { placeKey: "majisand", time: "" },
            { placeKey: "surugaya", time: "" },
            { placeKey: "ebi-kani", time: "20:00", duration: 90, transport: "walk" },
            { placeKey: "hotel", time: "22:00", duration: 0, transport: "walk" }
          ]
        },
        {
          key: "day-2",
          index: 2,
          date: "2025-10-25",
          title: "二条市場、円山與狸小路",
          stops: [
            { placeKey: "nijo", time: "07:00", duration: 45, transport: "taxi" },
            { placeKey: "donbei", time: "07:45", duration: 45, transport: "walk" },
            { placeKey: "maruyama-zoo", time: "10:00", duration: 150, transport: "metro" },
            { placeKey: "hokkaido-shrine", time: "13:00", duration: 75, transport: "walk" },
            { placeKey: "tanukikoji", time: "" },
            { placeKey: "clock-tower", time: "" },
            { placeKey: "soup-curry", time: "16:30", duration: 75, transport: "walk" },
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
            { placeKey: "snow-cheese", time: "08:00", duration: 30, transport: "train" },
            { placeKey: "kinotoya", time: "" },
            { placeKey: "corn-bread", time: "" },
            { placeKey: "gundam-base", time: "" },
            { placeKey: "airport-pokemon", time: "" },
            { placeKey: "muji", time: "11:00", duration: 30, transport: "walk" }
          ]
        }
      ]
    }
  ];
})();
