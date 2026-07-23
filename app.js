/*
Jonaminz Travel — 獨立站台版本。邏輯移植自 jonaminz 主 repo 曾經做的
pages/travel/assets/js/app.js（第一條垂直流程：建立Trip→建立Place→
建立Day→Assign Place→Move Stop→Unassign→Reload），拿掉 requireLogin／
JonaminzLoading 相依，資料存這個網域自己的 localStorage。

2026-07-14：畫面改版，照交接包 REFERENCE/v0.5.1-visual-prototype-
standalone.html 的「Journey Builder」畫面重做呈現層（hero／toolbar／
place card／day column／book generation 靜態說明卡），資料模型與
CRUD 邏輯不變。搜尋/分類篩選是新增的（原本只有純表單新增），book
generation 面板目前是純靜態說明（旅行書生成本身是 Phase 3，還沒做，
不假裝有這個功能，只是視覺上把畫面補完整）。
*/
(function () {
  "use strict";

  var STORAGE_KEY = "jonaminz-travel.v1";
  var CATEGORY_LABEL = { must: "必去", want: "想去", food: "美食", shopping: "購物", backup: "備選" };
  var CATEGORY_BADGE = { must: "必", want: "想", food: "食", shopping: "購", backup: "備" };

  var state = null;
  // 搜尋字串/分類篩選是純畫面狀態，不需要持久化——跟 Trip/Place/Day/Stop
  // 不一樣，離開頁面就重置也不影響資料本身。
  var uiState = { searchQuery: "", categoryFilter: "all", showAddPlace: false, showAddDay: false };

  function uid() {
    return "id-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
  }

  function emptyState() {
    return { version: 1, trips: [], places: [], days: [], stops: [], activeTripId: null };
  }

  function normalizeState(value) {
    if (!value || value.version !== 1) return emptyState();
    value.trips = Array.isArray(value.trips) ? value.trips : [];
    value.places = Array.isArray(value.places) ? value.places : [];
    value.days = Array.isArray(value.days) ? value.days : [];
    value.stops = Array.isArray(value.stops) ? value.stops : [];
    if (value.activeTripId && !value.trips.some(function (trip) { return trip.id === value.activeTripId; })) {
      value.activeTripId = value.trips.length ? value.trips[0].id : null;
    }
    return value;
  }

  function loadState() {
    var raw = null;
    try { raw = window.localStorage.getItem(STORAGE_KEY); } catch (error) { raw = null; }
    if (!raw) return emptyState();
    try {
      var parsed = JSON.parse(raw);
      return normalizeState(parsed);
    } catch (error) {
      return emptyState();
    }
  }

  function saveState() {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (error) { /* ignore */ }
  }

  function tripDays(tripId) {
    return state.days.filter(function (d) { return d.tripId === tripId; }).sort(function (a, b) { return a.index - b.index; });
  }

  function tripPlaces(tripId) {
    return state.places.filter(function (p) { return p.tripId === tripId; });
  }

  function dayStops(dayId) {
    return state.stops.filter(function (s) { return s.dayId === dayId; }).sort(function (a, b) { return a.position - b.position; });
  }

  function assignedPlaceIds(tripId) {
    var dayIds = {};
    tripDays(tripId).forEach(function (d) { dayIds[d.id] = true; });
    var set = {};
    state.stops.forEach(function (s) { if (dayIds[s.dayId] && s.sourcePlaceId) set[s.sourcePlaceId] = true; });
    return set;
  }

  function createTrip(title) {
    var trip = { id: uid(), title: title, startDate: null, endDate: null, status: "planning" };
    state.trips.push(trip);
    state.activeTripId = trip.id;
    saveState();
  }

  function selectTrip(id) { state.activeTripId = id; saveState(); }

  function createPlace(tripId, title, category) {
    state.places.push({ id: uid(), tripId: tripId, title: title, category: category || "want", note: "" });
    saveState();
  }

  function createDay(tripId, date, title) {
    var nextIndex = tripDays(tripId).length + 1;
    state.days.push({ id: uid(), tripId: tripId, index: nextIndex, date: date || "", title: title || ("Day " + nextIndex) });
    saveState();
  }

  function assignPlaceToDay(placeId, dayId) {
    var place = state.places.filter(function (p) { return p.id === placeId; })[0];
    if (!place) return;
    var existing = dayStops(dayId);
    var nextPosition = existing.length ? existing[existing.length - 1].position + 1 : 1;
    state.stops.push({ id: uid(), dayId: dayId, sourcePlaceId: placeId, title: place.title, category: place.category, time: "", position: nextPosition });
    saveState();
  }

  function moveStop(stopId, direction) {
    var stop = state.stops.filter(function (s) { return s.id === stopId; })[0];
    if (!stop) return;
    var siblings = dayStops(stop.dayId);
    var index = siblings.findIndex(function (s) { return s.id === stopId; });
    var swapIndex = index + (direction === "up" ? -1 : 1);
    if (swapIndex < 0 || swapIndex >= siblings.length) return;
    var other = siblings[swapIndex];
    var tmp = stop.position;
    stop.position = other.position;
    other.position = tmp;
    saveState();
  }

  function unassignStop(stopId) {
    state.stops = state.stops.filter(function (s) { return s.id !== stopId; });
    saveState();
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  /* ---------- render ---------- */

  function renderTripBar(root) {
    if (!state.trips.length) {
      root.querySelector("[data-trip-bar]").innerHTML = "";
      return;
    }
    var html = state.trips.map(function (t) {
      return '<button type="button" class="trip-chip" data-select-trip="' + t.id + '" data-active="' + (t.id === state.activeTripId) + '">' + escapeHtml(t.title) + "</button>";
    }).join("");
    html += '<form class="new-trip-form trip-bar-create" data-new-trip-form><label class="sr-only" for="trip-bar-title">新旅行名稱</label><input id="trip-bar-title" type="text" name="title" placeholder="新增另一趟旅行" required><button type="submit" class="btn" data-variant="ghost">＋ 新旅行</button></form>';
    root.querySelector("[data-trip-bar]").innerHTML = html;
  }

  function renderWelcome() {
    return (
      '<section class="welcome-shell">' +
        '<div class="welcome-copy">' +
          '<small>JONAMINZ SHARED TRAVEL LIBRARY</small>' +
          '<h1>把散落的想去，<br>排成一趟真的旅程。</h1>' +
          '<p>先建立一趟旅行，再把景點、餐廳與購物清單收進素材箱，安排到每天。現在專注把這條流程做穩，之後再長成旅行書與旅途中模式。</p>' +
          '<form class="welcome-form" data-new-trip-form>' +
            '<label for="welcome-trip-title">第一趟旅行</label>' +
            '<div><input id="welcome-trip-title" type="text" name="title" placeholder="例如：關西夏日旅行" autocomplete="off" required><button type="submit" class="btn">開始規劃 <span aria-hidden="true">→</span></button></div>' +
          '</form>' +
          '<p class="local-note"><span aria-hidden="true">●</span> 目前資料只儲存在這台裝置；重新整理不會消失。</p>' +
        '</div>' +
        '<div class="welcome-visual" aria-label="Jonaminz Travel 規劃流程預覽">' +
          '<div class="welcome-book">' +
            '<div class="book-meta"><span>TRAVEL BOOK · 01</span><b>PLANNING</b></div>' +
            '<div class="book-title"><small>FROM IDEAS TO MEMORIES</small><h2>Journey<br>Builder</h2></div>' +
            '<div class="route-preview">' +
              '<article><i>01</i><div><b>收集素材</b><span>景點・餐廳・購物</span></div></article>' +
              '<article><i>02</i><div><b>排進每天</b><span>指派・移動・取消</span></div></article>' +
              '<article class="future"><i>03</i><div><b>長成旅行書</b><span>下一階段</span></div></article>' +
            '</div>' +
            '<div class="book-foot"><span>JONATHAN × MINZ</span><span>LOCAL FIRST</span></div>' +
          '</div>' +
          '<div class="postcard postcard-a"><span>COLLECT</span><b>想去的地方</b><em>先保存一次</em></div>' +
          '<div class="postcard postcard-b"><span>ARRANGE</span><b>每天的路線</b><em>隨時調整順序</em></div>' +
        '</div>' +
      '</section>' +
      '<section class="welcome-steps" aria-label="目前開發範圍">' +
        '<article class="active"><b>01</b><div><strong>建立旅行</strong><span>先給旅程一個名字</span></div></article>' +
        '<article><b>02</b><div><strong>收集與編排</strong><span>Place → Day → Stop</span></div></article>' +
        '<article class="muted"><b>03</b><div><strong>旅行書工作室</strong><span>保留於下一階段</span></div></article>' +
        '<article class="muted"><b>04</b><div><strong>旅途中模式</strong><span>保留於下一階段</span></div></article>' +
      '</section>'
    );
  }

  function renderHero(trip, unassignedCount, assignedCount, dayCount) {
    return (
      '<div class="builder-hero">' +
        '<div>' +
          '<small>JOURNEY BUILDER</small>' +
          '<h1>先把旅程排好，<br>旅行書會自己長出來。</h1>' +
          '<p>景點素材只保存一次；把它安排到某一天，就能反覆調整順序，也能隨時取消指派回到素材箱。</p>' +
          '<span class="phase-chip">PHASE 1 · 行程編排可用</span>' +
          '<div class="builder-flow">' +
            '<span><b>1</b> 收集素材</span><i>→</i>' +
            '<span><b>2</b> 排入每天</span><i>→</i>' +
            '<span><b>3</b> 生成旅行書</span><i>→</i>' +
            '<span><b>4</b> 旅途中更新</span>' +
          "</div>" +
        "</div>" +
        '<div class="builder-summary">' +
          '<small>CURRENT TRIP</small>' +
          "<h3>" + escapeHtml(trip.title) + "</h3>" +
          "<div><span>已安排景點</span><b>" + assignedCount + "</b></div>" +
          "<div><span>未安排素材</span><b>" + unassignedCount + "</b></div>" +
          "<div><span>行程天數</span><b>" + dayCount + "</b></div>" +
        "</div>" +
      "</div>"
    );
  }

  function renderToolbar() {
    var filters = ["all", "must", "want", "food", "shopping", "backup"].map(function (key) {
      var label = key === "all" ? "全部" : CATEGORY_LABEL[key];
      var active = uiState.categoryFilter === key;
      return '<button type="button" data-place-filter="' + key + '" class="' + (active ? "active" : "") + '">' + label + "</button>";
    }).join("");

    return (
      '<div class="builder-toolbar">' +
        '<div class="search">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>' +
          '<input type="text" data-search-input placeholder="搜尋景點、餐廳、購物或備選" value="' + escapeHtml(uiState.searchQuery) + '">' +
        "</div>" +
        '<div class="builder-filters">' + filters + "</div>" +
        '<button type="button" class="btn" data-toggle-add-place>＋ 新增素材</button>' +
      "</div>"
    );
  }

  function renderAddPlaceForm() {
    if (!uiState.showAddPlace) return "";
    return (
      '<form class="new-trip-form inline-create-form" data-new-place-form>' +
      '<input type="text" name="title" placeholder="景點/餐廳名稱" required>' +
      '<select name="category">' + Object.keys(CATEGORY_LABEL).map(function (k) { return '<option value="' + k + '">' + CATEGORY_LABEL[k] + "</option>"; }).join("") + "</select>" +
      '<button type="submit" class="btn" data-variant="ghost">加入素材箱</button>' +
      "</form>"
    );
  }

  function renderPlacePool(tripId, days) {
    var assigned = assignedPlaceIds(tripId);
    var all = tripPlaces(tripId).filter(function (p) { return !assigned[p.id]; });
    var q = uiState.searchQuery.trim().toLowerCase();
    var filtered = all.filter(function (p) {
      if (uiState.categoryFilter !== "all" && p.category !== uiState.categoryFilter) return false;
      if (q && p.title.toLowerCase().indexOf(q) === -1) return false;
      return true;
    });

    var cardsHtml = filtered.length
      ? filtered.map(function (p) {
          var dayOptions = days.map(function (d) { return '<option value="' + d.id + '">' + escapeHtml(d.title) + "</option>"; }).join("");
          return (
            '<div class="builder-place-card">' +
              '<div class="place-icon">' + (CATEGORY_BADGE[p.category] || "?") + "</div>" +
              "<div><b>" + escapeHtml(p.title) + "</b><em>" + escapeHtml(CATEGORY_LABEL[p.category] || p.category) + "</em></div>" +
              (days.length
                ? '<select class="assign-select" data-assign-select data-place-id="' + p.id + '"><option value="">排到...</option>' + dayOptions + "</select>"
                : "") +
            "</div>"
          );
        }).join("")
      : '<p class="builder-day-empty">' + (all.length ? "沒有符合搜尋/篩選的素材。" : "還沒有素材，點上面「＋ 新增素材」加一個。") + "</p>";

    return (
      '<aside class="place-pool-panel">' +
        "<header><div><small>UNASSIGNED PLACE POOL</small><h3>未安排素材</h3></div><span>" + all.length + " 個</span></header>" +
        renderAddPlaceForm() +
        '<div class="builder-place-pool">' + cardsHtml + "</div>" +
      "</aside>"
    );
  }

  function renderAddDayForm() {
    if (!uiState.showAddDay) return "";
    return (
      '<form class="new-trip-form inline-create-form" data-new-day-form>' +
      '<input type="date" name="date"><input type="text" name="title" placeholder="這天的標題（選填）">' +
      '<button type="submit" class="btn" data-variant="ghost">加入行程</button>' +
      "</form>"
    );
  }

  function renderDayBoard(days) {
    var columnsHtml = days.length
      ? days.map(function (d) {
          var stops = dayStops(d.id);
          var stopsHtml = stops.length
            ? stops.map(function (s, i) {
                return (
                  '<div class="builder-stop"><div><b>' + escapeHtml(s.title) + "</b></div>" +
                  '<div class="builder-stop-actions">' +
                  '<button type="button" class="icon-btn" data-move="up" data-stop-id="' + s.id + '"' + (i === 0 ? " disabled" : "") + ' title="往上移" aria-label="' + escapeHtml(s.title) + '往上移">↑</button>' +
                  '<button type="button" class="icon-btn" data-move="down" data-stop-id="' + s.id + '"' + (i === stops.length - 1 ? " disabled" : "") + ' title="往下移" aria-label="' + escapeHtml(s.title) + '往下移">↓</button>' +
                  '<button type="button" class="icon-btn" data-unassign="' + s.id + '" title="取消指派" aria-label="取消指派' + escapeHtml(s.title) + '">✕</button>' +
                  "</div></div>"
                );
              }).join("")
            : '<p class="builder-day-empty">還沒有排任何行程，從左側素材指派過來。</p>';
          return (
            '<div class="builder-day-column">' +
              '<header><div><small>DAY ' + d.index + (d.date ? " · " + escapeHtml(d.date) : "") + '</small><h4>' + escapeHtml(d.title) + "</h4></div></header>" +
              '<div class="builder-stop-list">' + stopsHtml + "</div>" +
            "</div>"
          );
        }).join("")
      : '<p class="builder-day-empty">還沒有天數，點上面「＋ 新增一天」開始排行程。</p>';

    return (
      '<section class="journey-board-panel">' +
        '<div class="journey-board-head"><div><small>ASSIGNED DAY BOARD</small><h3>已安排到每日行程</h3></div>' +
        '<div><button type="button" class="btn" data-variant="ghost" data-toggle-add-day>＋ 新增一天</button></div></div>' +
        renderAddDayForm() +
        '<div class="builder-day-board">' + columnsHtml + "</div>" +
      "</section>"
    );
  }

  function renderGenerationPanel() {
    return (
      '<aside class="generation-panel">' +
        '<header><div><small>NEXT PHASE</small><h3>旅行書會從這裡長出來</h3></div></header>' +
        '<div class="generation-rule"><span class="rule-icon">◱</span><div><b>Page Master</b><p>每一天可以選自己的頁面母版。</p></div></div>' +
        '<div class="generation-rule"><span class="rule-icon">◈</span><div><b>Book Style</b><p>整本沿用目前旅行的書籍風格。</p></div></div>' +
        '<div class="generation-rule"><span class="rule-icon">⚿</span><div><b>保護手動排版</b><p>已手動調整的頁面不會被偷偷覆蓋。</p></div></div>' +
        '<p class="generation-note"><b>尚未開放</b><br>目前先把 Trip → Place → Day → Assign → Move → Unassign → Reload 做穩；這一區只呈現已裁決的下一階段，不假裝功能已完成。</p>' +
      "</aside>"
    );
  }

  function renderBoard(root) {
    var boardEl = root.querySelector("[data-board]");
    if (!state.activeTripId) {
      boardEl.innerHTML = renderWelcome();
      return;
    }

    var tripId = state.activeTripId;
    var trip = state.trips.filter(function (t) { return t.id === tripId; })[0];
    var days = tripDays(tripId);
    var assigned = assignedPlaceIds(tripId);
    var unassignedCount = tripPlaces(tripId).filter(function (p) { return !assigned[p.id]; }).length;
    var assignedCount = Object.keys(assigned).length;

    boardEl.innerHTML =
      renderHero(trip, unassignedCount, assignedCount, days.length) +
      renderToolbar() +
      '<div class="builder-layout">' +
        renderPlacePool(tripId, days) +
        renderDayBoard(days) +
        renderGenerationPanel() +
      "</div>";
  }

  // 重新 render 會用 innerHTML 整塊換掉，搜尋框打字打到一半若整個換掉
  // DOM 節點，焦點跟游標位置會不見——所以每次 render 前先記住「搜尋框
  // 是不是目前的 focus」跟游標位置，render 完再還原，避免打字打到一半
  // 突然跳出輸入框的體驗問題。
  function render(root) {
    var searchInput = root.querySelector("[data-search-input]");
    var hadFocus = searchInput && document.activeElement === searchInput;
    var selectionStart = hadFocus ? searchInput.selectionStart : null;

    renderTripBar(root);
    renderBoard(root);

    if (hadFocus) {
      var newSearchInput = root.querySelector("[data-search-input]");
      if (newSearchInput) {
        newSearchInput.focus();
        try { newSearchInput.setSelectionRange(selectionStart, selectionStart); } catch (error) { /* ignore */ }
      }
    }
  }

  function bindEvents(root) {
    root.addEventListener("click", function (event) {
      var selectTripBtn = event.target.closest("[data-select-trip]");
      if (selectTripBtn) { selectTrip(selectTripBtn.getAttribute("data-select-trip")); render(root); return; }

      var moveBtn = event.target.closest("[data-move]");
      if (moveBtn) { moveStop(moveBtn.getAttribute("data-stop-id"), moveBtn.getAttribute("data-move")); render(root); return; }

      var unassignBtn = event.target.closest("[data-unassign]");
      if (unassignBtn) { unassignStop(unassignBtn.getAttribute("data-unassign")); render(root); return; }

      var filterBtn = event.target.closest("[data-place-filter]");
      if (filterBtn) { uiState.categoryFilter = filterBtn.getAttribute("data-place-filter"); render(root); return; }

      var toggleAddPlace = event.target.closest("[data-toggle-add-place]");
      if (toggleAddPlace) { uiState.showAddPlace = !uiState.showAddPlace; render(root); return; }

      var toggleAddDay = event.target.closest("[data-toggle-add-day]");
      if (toggleAddDay) { uiState.showAddDay = !uiState.showAddDay; render(root); return; }
    });

    root.addEventListener("input", function (event) {
      var searchInput = event.target.closest("[data-search-input]");
      if (searchInput) { uiState.searchQuery = searchInput.value; render(root); }
    });

    root.addEventListener("change", function (event) {
      var select = event.target.closest("[data-assign-select]");
      if (select && select.value) { assignPlaceToDay(select.getAttribute("data-place-id"), select.value); render(root); }
    });

    root.addEventListener("submit", function (event) {
      var newTripForm = event.target.closest("[data-new-trip-form]");
      if (newTripForm) {
        event.preventDefault();
        var title = newTripForm.title.value.trim();
        if (title) createTrip(title);
        render(root);
        return;
      }
      var newPlaceForm = event.target.closest("[data-new-place-form]");
      if (newPlaceForm) {
        event.preventDefault();
        var placeTitle = newPlaceForm.title.value.trim();
        if (placeTitle && state.activeTripId) createPlace(state.activeTripId, placeTitle, newPlaceForm.category.value);
        uiState.showAddPlace = false;
        render(root);
        return;
      }
      var newDayForm = event.target.closest("[data-new-day-form]");
      if (newDayForm) {
        event.preventDefault();
        if (state.activeTripId) createDay(state.activeTripId, newDayForm.date.value, newDayForm.title.value.trim());
        uiState.showAddDay = false;
        render(root);
        return;
      }
    });
  }

  function init() {
    state = loadState();
    var root = document.getElementById("app-root");
    root.innerHTML = '<div class="trip-bar" data-trip-bar></div><div data-board></div>';
    bindEvents(root);
    render(root);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
