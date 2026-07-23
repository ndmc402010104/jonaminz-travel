/*
 * Client-side PDF intake for Jonaminz Travel.
 * Only compact, redacted page summaries are returned to the app. The original
 * PDF is never uploaded or written to localStorage.
 */
(function () {
  "use strict";

  var PDFJS_URL = "https://unpkg.com/pdfjs-dist@4.10.38/build/pdf.mjs";
  var PDFJS_WORKER_URL = "https://unpkg.com/pdfjs-dist@4.10.38/build/pdf.worker.mjs";

  var CATEGORIES = [
    { id: "flight", label: "航班", icon: "✈", pattern: /航班|機票|登機|boarding|departure|arrival|airport|terminal/i },
    { id: "stay", label: "住宿", icon: "▰", pattern: /住宿|飯店|旅館|hotel|check[\s-]?in|room|agoda/i },
    { id: "transport", label: "交通", icon: "↝", pattern: /交通|新幹線|電車|地鐵|巴士|火車|jr\s|skyliner|周遊券|乘車|取票|月台/i },
    { id: "shopping", label: "購物", icon: "◫", pattern: /購物|採買|代購|shopping|免稅|藥妝|價格|円|¥/i },
    { id: "packing", label: "出發準備", icon: "✓", pattern: /行李|打包|準備|sim|護照|保險|網路|注意事項/i },
    { id: "guide", label: "攻略", icon: "◇", pattern: /攻略|參觀路線|營業時間|票價|餐廳|美食|郵寄|郵局|日文|電話|地址/i },
    { id: "day", label: "每日行程", icon: "◷", pattern: /day\s*\d+|第\s*[一二三四五六七八九十\d]+\s*天|行程表|行程簡介|今日行程/i }
  ];

  function normalizeText(text) {
    return String(text || "").replace(/\s+/g, " ").trim();
  }

  function redact(text) {
    return normalizeText(text)
      .replace(/([A-Z0-9]{3})[A-Z0-9-]{5,}([A-Z0-9]{2})/gi, "$1••••$2")
      .replace(/\b\d{7,}\b/g, "••••••");
  }

  function titleFromText(text, fallback) {
    var clean = normalizeText(text);
    var chunks = clean.split(/\s{2,}|[。！？\n]/).filter(function (item) { return item.length >= 3; });
    var title = chunks[0] || clean.slice(0, 52) || fallback;
    return title.length > 58 ? title.slice(0, 58) + "…" : title;
  }

  function classifyText(text, pageNumber) {
    var clean = normalizeText(text);
    var category = CATEGORIES.filter(function (item) { return item.pattern.test(clean); })[0] ||
      { id: "reference", label: "參考資料", icon: "□" };
    var sensitive = /訂位|訂單|預約編號|booking|confirmation|電話|護照|qr\s*code/i.test(clean) ||
      /\b\d{8,}\b/.test(clean);
    var safeText = redact(clean).slice(0, 1400);
    return {
      page: pageNumber,
      category: category.id,
      categoryLabel: category.label,
      icon: category.icon,
      title: titleFromText(safeText, "第 " + pageNumber + " 頁"),
      preview: safeText.slice(0, 220),
      content: safeText,
      sensitive: sensitive
    };
  }

  async function parseFile(file, onProgress) {
    if (!file || !/pdf/i.test(file.type || file.name || "")) throw new Error("請選擇 PDF 檔案");
    var pdfjs = await import(PDFJS_URL);
    pdfjs.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
    var bytes = new Uint8Array(await file.arrayBuffer());
    var documentTask = pdfjs.getDocument({ data: bytes });
    var pdf = await documentTask.promise;
    var pages = [];
    for (var pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      var page = await pdf.getPage(pageNumber);
      var content = await page.getTextContent();
      var text = content.items.map(function (item) { return item.str || ""; }).join(" ");
      if (normalizeText(text).length > 12) pages.push(classifyText(text, pageNumber));
      if (onProgress) onProgress(pageNumber, pdf.numPages);
    }
    return { pageCount: pdf.numPages, pages: pages };
  }

  window.JonaminzTravelPdfImport = {
    classifyText: classifyText,
    parseFile: parseFile,
    redact: redact
  };
})();
