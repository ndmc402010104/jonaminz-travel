/*
 * Jonaminz Travel — journey planning, live trip and travel book.
 * Domain records are persisted independently in localStorage.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "jonaminz-travel.v1";
  var CATEGORY_LABEL = { must: "必去", want: "想去", food: "美食", shopping: "購物", backup: "備選" };
  var CATEGORY_BADGE = { must: "必", want: "想", food: "食", shopping: "購", backup: "備" };
  var TRANSPORT_LABEL = { walk: "步行", train: "火車", metro: "地鐵", bus: "巴士", taxi: "計程車", car: "開車", flight: "飛行", other: "其他" };
  var DAY_COLORS = ["#a55f45", "#466f75", "#8b7a46", "#705d83", "#4f7a5d", "#a06478"];
  var TEMPLATES = Array.isArray(window.JonaminzTravelTemplates) ? window.JonaminzTravelTemplates : [];

  var state = null;
  var mapController = null;
  var uiState = {
    activeView: "overview",
    searchQuery: "",
    categoryFilter: "all",
    showAddPlace: false,
    showAddDay: false,
    mapDayId: "all",
    focusedPlaceId: null,
    editingPlaceId: null,
    editingStopId: null,
    pickCoordinates: false,
    liveDayId: null,
    showMobilePool: false
  };

  function uid() {
    return "id-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
  }

  function emptyState() {
    return { version: 3, trips: [], places: [], days: [], stops: [], bookings: [], checklist: [], memories: [], activeTripId: null, dismissedTemplateIds: [] };
  }

  function finiteOrNull(value) {
    if (value === "" || value == null) return null;
    var parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function field(form, name) {
    return form.elements.namedItem(name);
  }

  function normalizeState(value) {
    if (!value || [1, 2, 3].indexOf(value.version) === -1) return emptyState();
    value.trips = Array.isArray(value.trips) ? value.trips : [];
    value.places = Array.isArray(value.places) ? value.places : [];
    value.days = Array.isArray(value.days) ? value.days : [];
    value.stops = Array.isArray(value.stops) ? value.stops : [];
    value.bookings = Array.isArray(value.bookings) ? value.bookings : [];
    value.checklist = Array.isArray(value.checklist) ? value.checklist : [];
    value.memories = Array.isArray(value.memories) ? value.memories : [];
    value.dismissedTemplateIds = Array.isArray(value.dismissedTemplateIds) ? value.dismissedTemplateIds : [];
    value.places.forEach(function (place) {
      place.category = place.category || "want";
      place.address = place.address || "";
      place.note = place.note || "";
      place.lat = finiteOrNull(place.lat);
      place.lng = finiteOrNull(place.lng);
    });
    value.stops.forEach(function (stop) {
      stop.time = stop.time || "";
      stop.duration = Math.max(0, Number(stop.duration) || 0);
      stop.transport = stop.transport || "";
      stop.note = stop.note || "";
      stop.completed = Boolean(stop.completed);
    });
    value.checklist.forEach(function (item) { item.done = Boolean(item.done); });
    value.version = 3;
    if (value.activeTripId && !value.trips.some(function (trip) { return trip.id === value.activeTripId; })) {
      value.activeTripId = value.trips.length ? value.trips[0].id : null;
    }
    return value;
  }

  function loadState() {
    var raw = null;
    try { raw = window.localStorage.getItem(STORAGE_KEY); } catch (error) { raw = null; }
    if (!raw) return emptyState();
    try { return normalizeState(JSON.parse(raw)); } catch (error) { return emptyState(); }
  }

  function saveState() {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (error) { /* localStorage may be unavailable */ }
  }

  function tripDays(tripId) {
    return state.days.filter(function (day) { return day.tripId === tripId; }).sort(function (a, b) { return a.index - b.index; });
  }

  function tripPlaces(tripId) {
    return state.places.filter(function (place) { return place.tripId === tripId; });
  }

  function tripBookings(tripId) {
    return state.bookings.filter(function (booking) { return booking.tripId === tripId; });
  }

  function tripChecklist(tripId) {
    return state.checklist.filter(function (item) { return item.tripId === tripId; });
  }

  function dayStops(dayId) {
    return state.stops.filter(function (stop) { return stop.dayId === dayId; }).sort(function (a, b) { return a.position - b.position; });
  }

  function placeById(placeId) {
    return state.places.filter(function (place) { return place.id === placeId; })[0] || null;
  }

  function stopById(stopId) {
    return state.stops.filter(function (stop) { return stop.id === stopId; })[0] || null;
  }

  function assignedPlaceIds(tripId) {
    var dayIds = {};
    var result = {};
    tripDays(tripId).forEach(function (day) { dayIds[day.id] = true; });
    state.stops.forEach(function (stop) { if (dayIds[stop.dayId] && stop.sourcePlaceId) result[stop.sourcePlaceId] = true; });
    return result;
  }

  function createTrip(title) {
    var trip = { id: uid(), title: title, subtitle: "", destination: "", startDate: null, endDate: null, status: "planning", bookStyle: "scrapbook" };
    state.trips.push(trip);
    state.activeTripId = trip.id;
    uiState.mapDayId = "all";
    uiState.activeView = "overview";
    saveState();
  }

  function getTemplate(templateId) {
    return TEMPLATES.filter(function (template) { return template.templateId === templateId; })[0] || null;
  }

  function getTemplateTrip(templateId) {
    return state.trips.filter(function (trip) { return trip.templateId === templateId; })[0] || null;
  }

  function upgradeTemplateTrip(trip, template) {
    if (!trip || !template || Number(trip.templateVersion || 0) >= Number(template.templateVersion || 0)) return;
    var placesByKey = {};
    var daysByKey = {};
    tripPlaces(trip.id).forEach(function (place) { if (place.templateKey) placesByKey[place.templateKey] = place; });
    tripDays(trip.id).forEach(function (day) { if (day.templateKey) daysByKey[day.templateKey] = day; });
    template.places.forEach(function (source) {
      var place = placesByKey[source.key];
      if (!place) return;
      if (!place.address) place.address = source.address || "";
      if (!Number.isFinite(place.lat)) place.lat = finiteOrNull(source.lat);
      if (!Number.isFinite(place.lng)) place.lng = finiteOrNull(source.lng);
      if (!place.note) place.note = source.note || "";
    });
    template.days.forEach(function (sourceDay) {
      var day = daysByKey[sourceDay.key];
      if (!day) return;
      sourceDay.stops.forEach(function (sourceStop) {
        var place = placesByKey[sourceStop.placeKey];
        if (!place) return;
        var stop = dayStops(day.id).filter(function (candidate) { return candidate.sourcePlaceId === place.id; })[0];
        if (!stop) return;
        if (!stop.time) stop.time = sourceStop.time || "";
        if (!stop.duration) stop.duration = Number(sourceStop.duration) || 0;
        if (!stop.transport) stop.transport = sourceStop.transport || "";
        if (!stop.note) stop.note = sourceStop.note || "";
      });
    });
    trip.subtitle = trip.subtitle || template.trip.subtitle || "";
    trip.destination = trip.destination || template.trip.destination || "";
    trip.bookStyle = trip.bookStyle || template.trip.bookStyle || "scrapbook";
    (template.bookings || []).forEach(function (source) {
      if (state.bookings.some(function (item) { return item.tripId === trip.id && item.templateKey === source.key; })) return;
      state.bookings.push({
        id: uid(), tripId: trip.id, type: source.type || "other", title: source.title,
        date: source.date || "", endDate: source.endDate || "", meta: source.meta || "",
        note: source.note || "", templateKey: source.key
      });
    });
    (template.checklist || []).forEach(function (source) {
      if (state.checklist.some(function (item) { return item.tripId === trip.id && item.templateKey === source.key; })) return;
      state.checklist.push({ id: uid(), tripId: trip.id, title: source.title, group: source.group || "其他", done: false, templateKey: source.key });
    });
    trip.templateVersion = template.templateVersion;
    saveState();
  }

  function importTemplate(templateId) {
    var template = getTemplate(templateId);
    if (!template || [1, 2, 3].indexOf(template.schemaVersion) === -1) return null;
    var existing = getTemplateTrip(templateId);
    if (existing) {
      upgradeTemplateTrip(existing, template);
      state.activeTripId = existing.id;
      saveState();
      return existing;
    }
    var tripId = uid();
    var placeIds = {};
    var dayIds = {};
    var trip = {
      id: tripId,
      title: template.trip.title,
      subtitle: template.trip.subtitle || "",
      destination: template.trip.destination || "",
      startDate: template.trip.startDate,
      endDate: template.trip.endDate,
      status: template.trip.status || "template",
      templateId: template.templateId,
      templateVersion: template.templateVersion,
      sourceDocument: template.sourceDocument,
      bookStyle: template.trip.bookStyle || "scrapbook"
    };
    state.trips.push(trip);
    template.places.forEach(function (source) {
      var placeId = uid();
      placeIds[source.key] = placeId;
      state.places.push({
        id: placeId,
        tripId: tripId,
        title: source.title,
        category: source.category || "want",
        address: source.address || "",
        lat: finiteOrNull(source.lat),
        lng: finiteOrNull(source.lng),
        note: source.note || "",
        templateKey: source.key
      });
    });
    template.days.forEach(function (source) {
      var dayId = uid();
      dayIds[source.key] = dayId;
      state.days.push({ id: dayId, tripId: tripId, index: source.index, date: source.date || "", title: source.title || ("Day " + source.index), templateKey: source.key });
    });
    (template.bookings || []).forEach(function (source) {
      state.bookings.push({
        id: uid(), tripId: tripId, type: source.type || "other", title: source.title,
        date: source.date || "", endDate: source.endDate || "", meta: source.meta || "",
        note: source.note || "", templateKey: source.key
      });
    });
    (template.checklist || []).forEach(function (source) {
      state.checklist.push({ id: uid(), tripId: tripId, title: source.title, group: source.group || "其他", done: false, templateKey: source.key });
    });
    template.days.forEach(function (source) {
      source.stops.forEach(function (item, index) {
        var sourcePlace = template.places.filter(function (candidate) { return candidate.key === item.placeKey; })[0];
        if (!sourcePlace || !placeIds[item.placeKey] || !dayIds[source.key]) return;
        state.stops.push({
          id: uid(),
          dayId: dayIds[source.key],
          sourcePlaceId: placeIds[item.placeKey],
          title: sourcePlace.title,
          category: sourcePlace.category,
          time: item.time || "",
          duration: Number(item.duration) || 0,
          transport: item.transport || "",
          note: item.note || "",
          position: index + 1
        });
      });
    });
    state.activeTripId = tripId;
    saveState();
    return trip;
  }

  function deleteTrip(tripId) {
    var existing = state.trips.filter(function (trip) { return trip.id === tripId; })[0];
    if (!existing) return;
    var dayIds = {};
    state.days.forEach(function (day) { if (day.tripId === tripId) dayIds[day.id] = true; });
    state.stops = state.stops.filter(function (stop) { return !dayIds[stop.dayId]; });
    state.days = state.days.filter(function (day) { return day.tripId !== tripId; });
    state.places = state.places.filter(function (place) { return place.tripId !== tripId; });
    state.bookings = state.bookings.filter(function (booking) { return booking.tripId !== tripId; });
    state.checklist = state.checklist.filter(function (item) { return item.tripId !== tripId; });
    state.memories = state.memories.filter(function (memory) { return memory.tripId !== tripId; });
    state.trips = state.trips.filter(function (trip) { return trip.id !== tripId; });
    if (existing.templateId && state.dismissedTemplateIds.indexOf(existing.templateId) === -1) state.dismissedTemplateIds.push(existing.templateId);
    state.activeTripId = state.trips.length ? state.trips[0].id : null;
    uiState.mapDayId = "all";
    uiState.activeView = "overview";
    saveState();
  }

  function createPlace(tripId, values) {
    state.places.push({
      id: uid(), tripId: tripId, title: values.title, category: values.category || "want",
      address: values.address || "", lat: finiteOrNull(values.lat), lng: finiteOrNull(values.lng), note: values.note || ""
    });
    saveState();
  }

  function updatePlace(placeId, values) {
    var place = placeById(placeId);
    if (!place) return;
    place.title = values.title;
    place.category = values.category;
    place.address = values.address || "";
    place.lat = finiteOrNull(values.lat);
    place.lng = finiteOrNull(values.lng);
    place.note = values.note || "";
    state.stops.forEach(function (stop) {
      if (stop.sourcePlaceId === placeId) { stop.title = place.title; stop.category = place.category; }
    });
    saveState();
  }

  function deletePlace(placeId) {
    state.stops = state.stops.filter(function (stop) { return stop.sourcePlaceId !== placeId; });
    state.places = state.places.filter(function (place) { return place.id !== placeId; });
    saveState();
  }

  function createDay(tripId, date, title) {
    var nextIndex = tripDays(tripId).length + 1;
    state.days.push({ id: uid(), tripId: tripId, index: nextIndex, date: date || "", title: title || ("Day " + nextIndex) });
    saveState();
  }

  function deleteDay(dayId) {
    var day = state.days.filter(function (item) { return item.id === dayId; })[0];
    if (!day) return;
    state.stops = state.stops.filter(function (stop) { return stop.dayId !== dayId; });
    state.days = state.days.filter(function (item) { return item.id !== dayId; });
    tripDays(day.tripId).forEach(function (item, index) { item.index = index + 1; });
    if (uiState.mapDayId === dayId) uiState.mapDayId = "all";
    saveState();
  }

  function assignPlaceToDay(placeId, dayId) {
    var place = placeById(placeId);
    if (!place) return;
    var siblings = dayStops(dayId);
    state.stops.push({
      id: uid(), dayId: dayId, sourcePlaceId: placeId, title: place.title, category: place.category,
      time: "", duration: 0, transport: "", note: "", position: siblings.length + 1
    });
    saveState();
  }

  function moveStop(stopId, direction) {
    var stop = stopById(stopId);
    if (!stop) return;
    var siblings = dayStops(stop.dayId);
    var index = siblings.findIndex(function (item) { return item.id === stopId; });
    var swapIndex = index + (direction === "up" ? -1 : 1);
    if (swapIndex < 0 || swapIndex >= siblings.length) return;
    var other = siblings[swapIndex];
    var oldPosition = stop.position;
    stop.position = other.position;
    other.position = oldPosition;
    saveState();
  }

  function updateStop(stopId, values) {
    var stop = stopById(stopId);
    if (!stop) return;
    var oldDayId = stop.dayId;
    stop.dayId = values.dayId;
    stop.time = values.time || "";
    stop.duration = Math.max(0, Number(values.duration) || 0);
    stop.transport = values.transport || "";
    stop.note = values.note || "";
    if (oldDayId !== stop.dayId) {
      stop.position = dayStops(stop.dayId).filter(function (item) { return item.id !== stop.id; }).length + 1;
      dayStops(oldDayId).forEach(function (item, index) { item.position = index + 1; });
    }
    saveState();
  }

  function unassignStop(stopId) {
    state.stops = state.stops.filter(function (stop) { return stop.id !== stopId; });
    saveState();
  }

  function toggleStopComplete(stopId) {
    var stop = stopById(stopId);
    if (!stop) return;
    stop.completed = !stop.completed;
    saveState();
  }

  function toggleChecklistItem(itemId) {
    var item = state.checklist.filter(function (candidate) { return candidate.id === itemId; })[0];
    if (!item) return;
    item.done = !item.done;
    saveState();
  }

  function formatDate(date) {
    if (!date) return "日期未定";
    var parts = date.split("-");
    return parts.length === 3 ? Number(parts[1]) + " 月 " + Number(parts[2]) + " 日" : date;
  }

  function tripDateRange(trip) {
    if (!trip.startDate) return "日期未定";
    return formatDate(trip.startDate) + (trip.endDate && trip.endDate !== trip.startDate ? " — " + formatDate(trip.endDate) : "");
  }

  function scrollPageTop() {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    if (window.navigator && window.navigator.userAgent.indexOf("jsdom") === -1 && typeof window.scrollTo === "function") {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character];
    });
  }

  function categoryOptions(selected) {
    return Object.keys(CATEGORY_LABEL).map(function (key) {
      return '<option value="' + key + '"' + (selected === key ? " selected" : "") + ">" + CATEGORY_LABEL[key] + "</option>";
    }).join("");
  }

  function transportOptions(selected) {
    return '<option value="">未指定</option>' + Object.keys(TRANSPORT_LABEL).map(function (key) {
      return '<option value="' + key + '"' + (selected === key ? " selected" : "") + ">" + TRANSPORT_LABEL[key] + "</option>";
    }).join("");
  }

  function googleSearchUrl(place) {
    var query = Number.isFinite(place.lat) && Number.isFinite(place.lng) ? place.lat + "," + place.lng : [place.title, place.address].filter(Boolean).join(" ");
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(query);
  }

  function googleRouteUrl(stops) {
    var points = stops.map(function (stop) { return placeById(stop.sourcePlaceId); }).filter(Boolean);
    if (!points.length) return "https://www.google.com/maps";
    function point(place) {
      return Number.isFinite(place.lat) && Number.isFinite(place.lng) ? place.lat + "," + place.lng : [place.title, place.address].filter(Boolean).join(" ");
    }
    if (points.length === 1) return googleSearchUrl(points[0]);
    var params = ["api=1", "origin=" + encodeURIComponent(point(points[0])), "destination=" + encodeURIComponent(point(points[points.length - 1])), "travelmode=walking"];
    if (points.length > 2) params.push("waypoints=" + encodeURIComponent(points.slice(1, -1).map(point).join("|")));
    return "https://www.google.com/maps/dir/?" + params.join("&");
  }

  function renderTripBar(root) {
    if (!state.trips.length) { root.querySelector("[data-trip-bar]").innerHTML = ""; return; }
    var html = state.trips.map(function (trip) {
      return '<button type="button" class="trip-chip" data-select-trip="' + trip.id + '" data-active="' + (trip.id === state.activeTripId) + '">' + escapeHtml(trip.title) + "</button>";
    }).join("");
    html += '<form class="new-trip-form trip-bar-create" data-new-trip-form><label class="sr-only" for="trip-bar-title">新旅行名稱</label><input id="trip-bar-title" type="text" name="title" placeholder="新增另一趟旅行" required><button type="submit" class="btn" data-variant="ghost">＋ 新旅行</button></form>';
    root.querySelector("[data-trip-bar]").innerHTML = html;
  }

  function renderWelcome() {
    return '<section class="welcome-shell"><div class="welcome-copy"><small>JONAMINZ SHARED TRAVEL LIBRARY</small><h1>把散落的想去，<br>排成一趟真的旅程。</h1><p>景點只存一次，安排進每日行程後，就能在地圖上看路線並直接開始導航。</p><form class="welcome-form" data-new-trip-form><label for="welcome-trip-title">第一趟旅行</label><div><input id="welcome-trip-title" type="text" name="title" placeholder="例如：關西夏日旅行" required><button type="submit" class="btn">開始規劃 →</button></div></form><p class="local-note"><span>●</span>資料目前儲存在這台裝置。</p></div><div class="welcome-visual"><div class="welcome-book"><div class="book-meta"><span>TRAVEL BOOK · 01</span><b>PLANNING</b></div><div class="book-title"><small>FROM IDEAS TO MEMORIES</small><h2>Journey<br>Builder</h2></div><div class="route-preview"><article><i>01</i><div><b>收集素材</b><span>景點・餐廳・購物</span></div></article><article><i>02</i><div><b>排進每天</b><span>時間・移動・地圖</span></div></article><article class="future"><i>03</i><div><b>帶著走</b><span>手機導航</span></div></article></div><div class="book-foot"><span>JONATHAN × MINZ</span><span>LOCAL FIRST</span></div></div></div></section>';
  }

  function renderHero(trip, unassignedCount, assignedCount, dayCount) {
    return '<div class="builder-hero"><div><small>MAP-CENTERED JOURNEY BUILDER</small><h1>今天去哪裡，<br>一眼就知道。</h1><p>從素材箱安排景點，補上時間與移動方式；地圖會跟著每日順序畫出路線。</p><span class="phase-chip">' + (trip.templateId ? "PAST TRIP · 2025.10.24–10.26" : "PLANNING · 可隨時調整") + '</span></div><div class="builder-summary"><small>CURRENT TRIP</small><h3>' + escapeHtml(trip.title) + "</h3><div><span>已安排景點</span><b>" + assignedCount + "</b></div><div><span>未安排素材</span><b>" + unassignedCount + "</b></div><div><span>行程天數</span><b>" + dayCount + '</b></div><button type="button" class="trip-delete" data-delete-trip="' + trip.id + '">刪除這趟旅行</button></div></div>';
  }

  function renderToolbar() {
    var filters = ["all", "must", "want", "food", "shopping", "backup"].map(function (key) {
      return '<button type="button" data-place-filter="' + key + '" class="' + (uiState.categoryFilter === key ? "active" : "") + '">' + (key === "all" ? "全部" : CATEGORY_LABEL[key]) + "</button>";
    }).join("");
    return '<div class="builder-toolbar"><div class="search"><span>⌕</span><input type="text" data-search-input placeholder="搜尋景點、地址或備註" value="' + escapeHtml(uiState.searchQuery) + '"></div><div class="builder-filters">' + filters + '</div><button type="button" class="btn" data-toggle-add-place>＋ 新增景點</button></div>';
  }

  function renderAddPlaceForm() {
    if (!uiState.showAddPlace) return "";
    return '<form class="inline-create-form place-create" data-new-place-form><input type="text" name="title" placeholder="景點／餐廳名稱" required><select name="category">' + categoryOptions("want") + '</select><input type="text" name="address" placeholder="地址（選填）"><div class="coordinate-row"><input type="number" step="any" name="lat" placeholder="緯度"><input type="number" step="any" name="lng" placeholder="經度"></div><textarea name="note" placeholder="營業時間、訂位或提醒"></textarea><button type="button" class="btn" data-variant="ghost" data-pick-new-place>⌖ 點地圖取座標</button><button type="submit" class="btn">加入素材箱</button></form>';
  }

  function renderPlacePool(tripId, days) {
    var assigned = assignedPlaceIds(tripId);
    var all = tripPlaces(tripId).filter(function (place) { return !assigned[place.id]; });
    var query = uiState.searchQuery.trim().toLowerCase();
    var filtered = all.filter(function (place) {
      if (uiState.categoryFilter !== "all" && place.category !== uiState.categoryFilter) return false;
      var haystack = [place.title, place.address, place.note].join(" ").toLowerCase();
      return !query || haystack.indexOf(query) !== -1;
    });
    var cards = filtered.length ? filtered.map(function (place) {
      var options = days.map(function (day) { return '<option value="' + day.id + '">Day ' + day.index + " · " + escapeHtml(day.title) + "</option>"; }).join("");
      return '<article class="builder-place-card" data-focus-place="' + place.id + '"><div class="place-icon">' + (CATEGORY_BADGE[place.category] || "?") + '</div><div class="place-copy"><b>' + escapeHtml(place.title) + "</b><em>" + escapeHtml(place.address || CATEGORY_LABEL[place.category]) + '</em></div><div class="place-card-actions"><button type="button" class="icon-btn" data-edit-place="' + place.id + '" title="編輯">✎</button><a class="icon-link" href="' + googleSearchUrl(place) + '" target="_blank" rel="noopener" title="Google Maps">↗</a></div>' + (days.length ? '<select class="assign-select" data-assign-select data-place-id="' + place.id + '"><option value="">排到…</option>' + options + "</select>" : "") + "</article>";
    }).join("") : '<p class="builder-day-empty">' + (all.length ? "沒有符合篩選的景點。" : "所有景點都已排入行程。") + "</p>";
    return '<aside class="place-pool-panel"><header><div><small>PLACE POOL</small><h3>未安排素材</h3></div><span>' + all.length + ' 個</span><div class="mobile-pool-actions"><button type="button" data-toggle-add-place>＋ 新增</button><button type="button" data-toggle-mobile-pool>完成</button></div></header><div class="mobile-pool-search"><span>⌕</span><input type="text" data-search-input placeholder="搜尋素材" value="' + escapeHtml(uiState.searchQuery) + '"></div>' + renderAddPlaceForm() + '<div class="builder-place-pool">' + cards + "</div></aside>";
  }

  function renderAddDayForm() {
    if (!uiState.showAddDay) return "";
    return '<form class="inline-create-form day-create" data-new-day-form><input type="date" name="date"><input type="text" name="title" placeholder="這天的主題（選填）"><button type="submit" class="btn">加入行程</button></form>';
  }

  function stopMeta(stop) {
    var items = [];
    if (stop.time) items.push("◷ " + stop.time);
    if (stop.duration) items.push(stop.duration + " 分");
    if (stop.transport) items.push(TRANSPORT_LABEL[stop.transport] || stop.transport);
    return items.length ? '<span class="stop-meta">' + items.map(escapeHtml).join(" · ") + "</span>" : '<span class="stop-meta is-empty">尚未設定時間</span>';
  }

  function renderDayBoard(days) {
    var columns = days.length ? days.map(function (day, dayIndex) {
      var stops = dayStops(day.id);
      var stopsHtml = stops.length ? stops.map(function (stop, index) {
        var place = placeById(stop.sourcePlaceId);
        return '<article class="builder-stop' + (uiState.focusedPlaceId === stop.sourcePlaceId ? " is-focused" : "") + '" data-focus-place="' + stop.sourcePlaceId + '" style="--day-color:' + DAY_COLORS[dayIndex % DAY_COLORS.length] + '"><span class="stop-number">' + (index + 1) + '</span><div class="stop-copy"><b>' + escapeHtml(stop.title) + "</b>" + stopMeta(stop) + (stop.note ? '<small>' + escapeHtml(stop.note) + "</small>" : "") + '</div><div class="builder-stop-actions"><a class="icon-link" href="' + (place ? googleSearchUrl(place) : "#") + '" target="_blank" rel="noopener" title="導航">↗</a><button type="button" class="icon-btn" data-edit-place="' + stop.sourcePlaceId + '" title="編輯景點資料">⌖</button><button type="button" class="icon-btn" data-edit-stop="' + stop.id + '" title="編輯當日安排">✎</button><button type="button" class="icon-btn" data-move="up" data-stop-id="' + stop.id + '"' + (index === 0 ? " disabled" : "") + '>↑</button><button type="button" class="icon-btn" data-move="down" data-stop-id="' + stop.id + '"' + (index === stops.length - 1 ? " disabled" : "") + '>↓</button><button type="button" class="icon-btn" data-unassign="' + stop.id + '" title="移回素材箱">×</button></div></article>';
      }).join("") : '<p class="builder-day-empty">從左側把景點排進這一天。</p>';
      var selected = uiState.mapDayId === day.id || (uiState.mapDayId === "all" && dayIndex === 0);
      return '<section class="builder-day-column' + (selected ? " is-selected" : "") + '" data-day-id="' + day.id + '"><header><div><small style="color:' + DAY_COLORS[dayIndex % DAY_COLORS.length] + '">DAY ' + day.index + (day.date ? " · " + escapeHtml(day.date) : "") + '</small><h4>' + escapeHtml(day.title) + '</h4></div><div class="day-actions"><a href="' + googleRouteUrl(stops) + '" target="_blank" rel="noopener" class="day-route">導航</a><button type="button" class="icon-btn" data-delete-day="' + day.id + '" title="刪除這一天">×</button></div></header><div class="builder-stop-list">' + stopsHtml + "</div></section>";
    }).join("") : '<p class="builder-day-empty">還沒有天數，先新增一天。</p>';
    return '<section class="journey-board-panel"><div class="journey-board-head"><div><small>DAY TIMELINE</small><h3>每日行程</h3></div><button type="button" class="btn" data-variant="ghost" data-toggle-add-day>＋ 新增一天</button></div>' + renderAddDayForm() + '<div class="builder-day-board">' + columns + "</div></section>";
  }

  function mapDaysModel(days) {
    return days.filter(function (day) { return uiState.mapDayId === "all" || uiState.mapDayId === day.id; }).map(function (day) {
      var dayIndex = days.findIndex(function (item) { return item.id === day.id; });
      return {
        id: day.id,
        color: DAY_COLORS[dayIndex % DAY_COLORS.length],
        stops: dayStops(day.id).map(function (stop, index) {
          var place = placeById(stop.sourcePlaceId);
          return {
            placeId: stop.sourcePlaceId,
            title: stop.title,
            number: index + 1,
            lat: place ? place.lat : null,
            lng: place ? place.lng : null
          };
        })
      };
    });
  }

  function renderMapPanel(days) {
    var visibleStops = [];
    mapDaysModel(days).forEach(function (day) { day.stops.forEach(function (stop) { if (Number.isFinite(stop.lat) && Number.isFinite(stop.lng)) visibleStops.push(stop); }); });
    var routeStops = [];
    days.filter(function (day) { return uiState.mapDayId === "all" || uiState.mapDayId === day.id; }).forEach(function (day) { routeStops = routeStops.concat(dayStops(day.id)); });
    var tabs = '<button type="button" data-map-day="all" class="' + (uiState.mapDayId === "all" ? "active" : "") + '">全程</button>' + days.map(function (day) {
      return '<button type="button" data-map-day="' + day.id + '" class="' + (uiState.mapDayId === day.id ? "active" : "") + '">D' + day.index + "</button>";
    }).join("");
    return '<aside class="map-panel"><header><div><small>LIVE ROUTE MAP</small><h3>行程地圖</h3></div><span>' + visibleStops.length + " 個座標</span></header><div class=\"map-day-tabs\">" + tabs + '</div><div id="journey-map" class="journey-map" aria-label="行程互動地圖"></div><div class="map-actions"><button type="button" class="btn" data-variant="ghost" data-locate-me>⌖ 我的位置</button><a class="btn map-google" href="' + googleRouteUrl(routeStops) + '" target="_blank" rel="noopener">Google Maps 開始導航 ↗</a></div><p class="map-hint">' + (uiState.pickCoordinates ? "請直接點地圖，座標會帶入正在新增的景點。" : "點標記會同步醒目顯示行程卡片。") + "</p></aside>";
  }

  function renderPlaceEditor() {
    var place = placeById(uiState.editingPlaceId);
    if (!place) return "";
    return '<div class="editor-backdrop" data-close-editor><section class="editor-sheet" role="dialog" aria-modal="true" aria-labelledby="place-editor-title" data-editor-sheet><header><div><small>PLACE</small><h3 id="place-editor-title">編輯景點</h3></div><button type="button" class="editor-close" data-close-editor>×</button></header><form data-edit-place-form data-place-id="' + place.id + '"><label>名稱<input name="title" value="' + escapeHtml(place.title) + '" required></label><label>分類<select name="category">' + categoryOptions(place.category) + '</select></label><label>地址<input name="address" value="' + escapeHtml(place.address) + '"></label><div class="coordinate-row"><label>緯度<input type="number" step="any" name="lat" value="' + (place.lat == null ? "" : place.lat) + '"></label><label>經度<input type="number" step="any" name="lng" value="' + (place.lng == null ? "" : place.lng) + '"></label></div><label>備註<textarea name="note">' + escapeHtml(place.note) + '</textarea></label><div class="editor-actions"><button type="button" class="danger-link" data-delete-place="' + place.id + '">刪除景點</button><a class="btn" data-variant="ghost" href="' + googleSearchUrl(place) + '" target="_blank" rel="noopener">在地圖查看</a><button type="submit" class="btn">儲存</button></div></form></section></div>';
  }

  function renderStopEditor() {
    var stop = stopById(uiState.editingStopId);
    if (!stop) return "";
    var place = placeById(stop.sourcePlaceId);
    var tripId = place ? place.tripId : state.activeTripId;
    var dayOptions = tripDays(tripId).map(function (day) { return '<option value="' + day.id + '"' + (day.id === stop.dayId ? " selected" : "") + '>Day ' + day.index + " · " + escapeHtml(day.title) + "</option>"; }).join("");
    return '<div class="editor-backdrop" data-close-editor><section class="editor-sheet" role="dialog" aria-modal="true" aria-labelledby="stop-editor-title" data-editor-sheet><header><div><small>STOP</small><h3 id="stop-editor-title">' + escapeHtml(stop.title) + '</h3></div><button type="button" class="editor-close" data-close-editor>×</button></header><form data-edit-stop-form data-stop-id="' + stop.id + '"><label>安排日期<select name="dayId">' + dayOptions + '</select></label><div class="coordinate-row"><label>抵達時間<input type="time" name="time" value="' + escapeHtml(stop.time) + '"></label><label>停留分鐘<input type="number" min="0" step="5" name="duration" value="' + stop.duration + '"></label></div><label>移動方式<select name="transport">' + transportOptions(stop.transport) + '</select></label><label>這次行程的備註<textarea name="note">' + escapeHtml(stop.note) + '</textarea></label><div class="editor-actions"><button type="button" class="danger-link" data-unassign="' + stop.id + '">移回素材箱</button><button type="submit" class="btn">儲存安排</button></div></form></section></div>';
  }

  function renderAppNav() {
    var views = [
      { id: "overview", icon: "⌂", label: "旅行首頁" },
      { id: "plan", icon: "⌘", label: "規劃" },
      { id: "live", icon: "◎", label: "旅途中" },
      { id: "book", icon: "▤", label: "旅行書" }
    ];
    return '<nav class="travel-mode-nav" aria-label="旅行功能">' + views.map(function (view) {
      return '<button type="button" data-view="' + view.id + '" class="' + (uiState.activeView === view.id ? "active" : "") + '"><i>' + view.icon + "</i><span>" + view.label + "</span></button>";
    }).join("") + "</nav>";
  }

  function renderBookingCard(booking) {
    var icon = booking.type === "flight" ? "✈" : booking.type === "hotel" ? "▰" : "◇";
    return '<article class="booking-card"><span class="booking-icon">' + icon + '</span><div><small>' + escapeHtml(booking.type === "flight" ? "FLIGHT" : booking.type === "hotel" ? "STAY" : "BOOKING") + '</small><b>' + escapeHtml(booking.title) + '</b><em>' + escapeHtml(booking.meta) + '</em><p>' + escapeHtml(formatDate(booking.date)) + (booking.endDate ? " — " + escapeHtml(formatDate(booking.endDate)) : "") + '</p></div></article>';
  }

  function renderOverview(trip, days) {
    var bookings = tripBookings(trip.id);
    var checklist = tripChecklist(trip.id);
    var doneCount = checklist.filter(function (item) { return item.done; }).length;
    var stopCount = days.reduce(function (count, day) { return count + dayStops(day.id).length; }, 0);
    var dayCards = days.map(function (day, dayIndex) {
      var stops = dayStops(day.id);
      return '<article class="overview-day-card" style="--day-color:' + DAY_COLORS[dayIndex % DAY_COLORS.length] + '"><header><span>0' + day.index + '</span><div><small>' + escapeHtml(formatDate(day.date)) + '</small><h3>' + escapeHtml(day.title) + '</h3></div></header><div class="overview-route">' + stops.slice(0, 5).map(function (stop, index) {
        return '<span><i>' + (index + 1) + '</i>' + escapeHtml(stop.title) + "</span>";
      }).join("") + (stops.length > 5 ? '<em>＋' + (stops.length - 5) + " 個停留</em>" : "") + '</div><button type="button" data-open-day="' + day.id + '">查看這天 →</button></article>';
    }).join("");
    var checklistHtml = checklist.map(function (item) {
      return '<label class="check-item' + (item.done ? " is-done" : "") + '"><input type="checkbox" data-checklist="' + item.id + '"' + (item.done ? " checked" : "") + '><span></span><div><small>' + escapeHtml(item.group) + "</small><b>" + escapeHtml(item.title) + "</b></div></label>";
    }).join("");
    return '<section class="trip-overview">' +
      '<div class="travel-cover-card"><div class="cover-stamp">TRAVEL BOOK · ' + (trip.status === "completed" ? "ARCHIVE" : "PLANNING") + '</div><div class="cover-copy"><small>' + escapeHtml(trip.destination || "YOUR NEXT JOURNEY") + '</small><h1>' + escapeHtml(trip.title) + '</h1><p>' + escapeHtml(trip.subtitle || "把路線、預訂與回憶收進同一本旅行書。") + '</p><div class="cover-date">' + escapeHtml(tripDateRange(trip)) + '</div><button type="button" class="cover-action" data-view="plan">打開行程規劃 <span>→</span></button></div><div class="cover-collage"><div class="cover-photo cover-photo-a"><b>SAPPORO</b><span>43.0618° N</span></div><div class="cover-photo cover-photo-b"><i>03</i><b>DAYS</b></div><div class="cover-ticket"><small>JONATHAN × MINZ</small><b>CTS</b><span>WEEKEND JOURNEY</span></div></div></div>' +
      '<div class="overview-stats"><article><small>DAYS</small><b>' + days.length + '</b><span>天旅程</span></article><article><small>STOPS</small><b>' + stopCount + '</b><span>個停留</span></article><article><small>READY</small><b>' + doneCount + '/' + checklist.length + '</b><span>準備完成</span></article><article><small>BOOKINGS</small><b>' + bookings.length + '</b><span>筆預訂</span></article></div>' +
      '<div class="overview-section-head"><div><small>THE JOURNEY</small><h2>三天，一條完整的北國路線</h2></div><button type="button" data-view="plan">編輯行程</button></div><div class="overview-days">' + dayCards + '</div>' +
      '<div class="overview-grid"><section class="overview-panel"><header><div><small>TRAVEL WALLET</small><h2>預訂與住宿</h2></div><span>' + bookings.length + " 筆</span></header><div class=\"booking-list\">" + (bookings.length ? bookings.map(renderBookingCard).join("") : '<p class="panel-empty">還沒有預訂資料。</p>') + '</div></section><section class="overview-panel checklist-panel"><header><div><small>BEFORE YOU GO</small><h2>出發準備</h2></div><span>' + doneCount + "/" + checklist.length + '</span></header><div class="check-list">' + (checklistHtml || '<p class="panel-empty">目前沒有準備項目。</p>') + "</div></section></div></section>";
  }

  function renderPlanner(trip, days) {
    var assigned = assignedPlaceIds(trip.id);
    var unassignedCount = tripPlaces(trip.id).filter(function (place) { return !assigned[place.id]; }).length;
    var selected = days.filter(function (day) { return day.id === uiState.mapDayId; })[0] || days[0];
    var mobileHead = '<div class="mobile-plan-head"><div><small>JOURNEY BUILDER</small><h2>' + escapeHtml(selected ? "Day " + selected.index + " · " + selected.title : "開始規劃") + '</h2></div><button type="button" data-toggle-mobile-pool>素材箱 <b>' + unassignedCount + '</b></button></div>';
    return mobileHead + renderHero(trip, unassignedCount, Object.keys(assigned).length, days.length) + renderToolbar() + '<div class="builder-layout' + (uiState.showMobilePool ? " show-mobile-pool" : "") + '">' + renderPlacePool(trip.id, days) + renderDayBoard(days) + renderMapPanel(days) + "</div>";
  }

  function renderLiveTrip(trip, days) {
    if (!days.length) return '<section class="live-empty"><h1>先在「規劃」建立一天行程</h1><button class="btn" data-view="plan">開始規劃</button></section>';
    var selected = days.filter(function (day) { return day.id === uiState.liveDayId; })[0] || days[0];
    var stops = dayStops(selected.id);
    var done = stops.filter(function (stop) { return stop.completed; }).length;
    var current = stops.filter(function (stop) { return !stop.completed; })[0] || stops[stops.length - 1] || null;
    var currentPlace = current ? placeById(current.sourcePlaceId) : null;
    var tabs = days.map(function (day) {
      return '<button type="button" data-live-day="' + day.id + '" class="' + (day.id === selected.id ? "active" : "") + '"><b>D' + day.index + '</b><span>' + escapeHtml(formatDate(day.date)) + "</span></button>";
    }).join("");
    var timeline = stops.map(function (stop, index) {
      var place = placeById(stop.sourcePlaceId);
      return '<article class="live-stop' + (stop.completed ? " is-complete" : "") + (current && current.id === stop.id ? " is-current" : "") + '"><button type="button" class="live-check" data-toggle-stop="' + stop.id + '" aria-label="切換完成狀態">' + (stop.completed ? "✓" : index + 1) + '</button><div><small>' + escapeHtml(stop.time || "時間未定") + '</small><b>' + escapeHtml(stop.title) + "</b><span>" + escapeHtml([stop.duration ? stop.duration + " 分" : "", stop.transport ? TRANSPORT_LABEL[stop.transport] : ""].filter(Boolean).join(" · ") || "點開可補上時間與交通") + '</span></div><div class="live-stop-actions"><button type="button" data-edit-stop="' + stop.id + '">調整</button>' + (place ? '<a href="' + googleSearchUrl(place) + '" target="_blank" rel="noopener">導航 ↗</a>' : "") + "</div></article>";
    }).join("");
    uiState.mapDayId = selected.id;
    return '<section class="live-trip"><header class="live-header"><div><small>LIVE TRIP · ' + escapeHtml(trip.destination || "") + '</small><h1>今天的旅程</h1><p>' + escapeHtml(selected.title) + '</p></div><div class="live-progress"><b>' + done + '/' + stops.length + '</b><span>已完成</span></div></header><div class="live-day-tabs">' + tabs + '</div>' +
      (current ? '<section class="next-stop-card"><div class="next-label">NEXT STOP</div><div class="next-main"><div><small>' + escapeHtml(current.time || "接下來") + '</small><h2>' + escapeHtml(current.title) + '</h2><p>' + escapeHtml((currentPlace && currentPlace.address) || current.note || "點導航直接前往下一站") + '</p></div><span class="next-number">' + (stops.indexOf(current) + 1) + '</span></div><div class="next-actions"><button type="button" data-toggle-stop="' + current.id + '">✓ 完成這一站</button>' + (currentPlace ? '<a href="' + googleSearchUrl(currentPlace) + '" target="_blank" rel="noopener">Google Maps 導航 ↗</a>' : "") + "</div></section>" : "") +
      '<div class="live-layout"><section class="live-timeline"><div class="section-kicker">TODAY · ' + escapeHtml(formatDate(selected.date)) + '</div>' + (timeline || '<p class="panel-empty">這一天還沒有景點。</p>') + '</section><div class="live-side">' + renderMapPanel(days) + '<section class="live-wallet"><header><small>QUICK ACCESS</small><h3>旅途錢包</h3></header>' + tripBookings(trip.id).map(renderBookingCard).join("") + "</section></div></div></section>";
  }

  function renderTravelBook(trip, days) {
    var pages = days.map(function (day, dayIndex) {
      var stops = dayStops(day.id);
      return '<article class="book-page day-page"><div class="page-number">0' + (dayIndex + 2) + '</div><header><small>' + escapeHtml(formatDate(day.date)) + " · DAY " + day.index + '</small><h2>' + escapeHtml(day.title) + '</h2></header><div class="book-photo-grid"><div class="book-photo-main"><span>' + escapeHtml((stops[0] && stops[0].title) || "JOURNEY") + '</span></div><div class="book-photo-note">SAPPORO<br><b>' + String(stops.length).padStart(2, "0") + " STOPS</b></div></div><ol>" + stops.map(function (stop) {
        return '<li><time>' + escapeHtml(stop.time || "—") + '</time><div><b>' + escapeHtml(stop.title) + "</b><span>" + escapeHtml(stop.note || (stop.transport ? TRANSPORT_LABEL[stop.transport] : "旅程中的一站")) + "</span></div></li>";
      }).join("") + '</ol><footer>JONAMINZ TRAVEL · ' + escapeHtml(trip.destination || trip.title) + "</footer></article>";
    }).join("");
    return '<section class="book-studio"><header class="book-studio-head"><div><small>BOOK STUDIO</small><h1>把走過的路，排成一本書。</h1><p>行程資料會自動長成可列印的旅行書；更改行程，書頁也會一起更新。</p></div><div class="book-tools"><div class="book-style-switch"><button data-book-style="scrapbook" class="' + (trip.bookStyle === "scrapbook" ? "active" : "") + '">手帳</button><button data-book-style="editorial" class="' + (trip.bookStyle === "editorial" ? "active" : "") + '">雜誌</button><button data-book-style="atlas" class="' + (trip.bookStyle === "atlas" ? "active" : "") + '">地圖冊</button></div><button type="button" class="btn" data-print-book>列印／存成 PDF</button></div></header><div class="book-pages book-style-' + escapeHtml(trip.bookStyle || "scrapbook") + '"><article class="book-page book-cover"><div class="page-number">01</div><small>TRAVEL ARCHIVE · ' + escapeHtml(trip.destination || "") + '</small><h2>' + escapeHtml(trip.title) + '</h2><p>' + escapeHtml(trip.subtitle || "OUR JOURNEY") + '</p><div class="book-cover-art"><span>J</span><span>×</span><span>M</span></div><footer>' + escapeHtml(tripDateRange(trip)) + "</footer></article>" + pages + "</div></section>";
  }

  function renderBoard(root) {
    var board = root.querySelector("[data-board]");
    if (!state.activeTripId) { board.innerHTML = renderWelcome(); return; }
    var trip = state.trips.filter(function (item) { return item.id === state.activeTripId; })[0];
    var days = tripDays(trip.id);
    var content = uiState.activeView === "plan" ? renderPlanner(trip, days)
      : uiState.activeView === "live" ? renderLiveTrip(trip, days)
      : uiState.activeView === "book" ? renderTravelBook(trip, days)
      : renderOverview(trip, days);
    board.innerHTML = renderAppNav() + content + renderPlaceEditor() + renderStopEditor();
  }

  function mountMap(root) {
    if (mapController) { mapController.destroy(); mapController = null; }
    var element = root.querySelector("#journey-map");
    if (!element || !window.JonaminzTravelMap || !state.activeTripId) return;
    var days = tripDays(state.activeTripId);
    mapController = window.JonaminzTravelMap.mount(element, {
      onFocus: function (placeId) {
        uiState.focusedPlaceId = placeId;
        render(root);
        var card = root.querySelector('[data-focus-place="' + placeId + '"]');
        if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
      },
      onPick: function (lat, lng) {
        var form = root.querySelector("[data-new-place-form]");
        if (!form) return;
        field(form, "lat").value = lat.toFixed(6);
        field(form, "lng").value = lng.toFixed(6);
        uiState.pickCoordinates = false;
        mapController.setPickMode(false);
        var hint = root.querySelector(".map-hint");
        if (hint) hint.textContent = "座標已帶入，補完名稱後即可加入素材箱。";
      }
    });
    mapController.render({ days: mapDaysModel(days), focusedPlaceId: uiState.focusedPlaceId });
    mapController.setPickMode(uiState.pickCoordinates);
  }

  function render(root) {
    var searchInput = document.activeElement && document.activeElement.matches && document.activeElement.matches("[data-search-input]") ? document.activeElement : null;
    var hadFocus = Boolean(searchInput);
    var selectionStart = hadFocus ? searchInput.selectionStart : null;
    var searchWasMobile = hadFocus && searchInput.closest(".mobile-pool-search");
    if (mapController) { mapController.destroy(); mapController = null; }
    renderTripBar(root);
    renderBoard(root);
    mountMap(root);
    if (hadFocus) {
      var nextSearch = root.querySelector(searchWasMobile ? ".mobile-pool-search [data-search-input]" : ".builder-toolbar [data-search-input]");
      if (nextSearch) { nextSearch.focus(); try { nextSearch.setSelectionRange(selectionStart, selectionStart); } catch (error) { /* ignore */ } }
    }
  }

  function closeEditors() {
    uiState.editingPlaceId = null;
    uiState.editingStopId = null;
  }

  function bindEvents(root) {
    root.addEventListener("click", function (event) {
      var target = event.target;
      var viewButton = target.closest("[data-view]");
      if (viewButton) {
        uiState.activeView = viewButton.getAttribute("data-view");
        if (uiState.activeView === "live" && !uiState.liveDayId) {
          var firstDay = tripDays(state.activeTripId)[0];
          uiState.liveDayId = firstDay ? firstDay.id : null;
        }
        render(root);
        scrollPageTop();
        return;
      }
      var openDayButton = target.closest("[data-open-day]");
      if (openDayButton) {
        uiState.activeView = "plan";
        uiState.mapDayId = openDayButton.getAttribute("data-open-day");
        render(root);
        scrollPageTop();
        return;
      }
      if (target.closest("[data-toggle-mobile-pool]")) {
        uiState.showMobilePool = !uiState.showMobilePool;
        render(root);
        return;
      }
      var liveDayButton = target.closest("[data-live-day]");
      if (liveDayButton) {
        uiState.liveDayId = liveDayButton.getAttribute("data-live-day");
        uiState.mapDayId = uiState.liveDayId;
        render(root);
        return;
      }
      var toggleStopButton = target.closest("[data-toggle-stop]");
      if (toggleStopButton) { toggleStopComplete(toggleStopButton.getAttribute("data-toggle-stop")); render(root); return; }
      var bookStyleButton = target.closest("[data-book-style]");
      if (bookStyleButton) {
        var activeTrip = state.trips.filter(function (trip) { return trip.id === state.activeTripId; })[0];
        if (activeTrip) { activeTrip.bookStyle = bookStyleButton.getAttribute("data-book-style"); saveState(); }
        render(root);
        return;
      }
      if (target.closest("[data-print-book]")) { window.print(); return; }
      var selectTrip = target.closest("[data-select-trip]");
      if (selectTrip) { state.activeTripId = selectTrip.getAttribute("data-select-trip"); uiState.mapDayId = "all"; uiState.activeView = "overview"; saveState(); render(root); return; }
      var deleteTripButton = target.closest("[data-delete-trip]");
      if (deleteTripButton) {
        if (window.confirm("確定刪除整趟旅行？景點、日期與安排會一起刪除。")) { deleteTrip(deleteTripButton.getAttribute("data-delete-trip")); render(root); }
        return;
      }
      var deleteDayButton = target.closest("[data-delete-day]");
      if (deleteDayButton) {
        if (window.confirm("刪除這一天？當天景點會回到未安排素材箱。")) { deleteDay(deleteDayButton.getAttribute("data-delete-day")); render(root); }
        return;
      }
      var deletePlaceButton = target.closest("[data-delete-place]");
      if (deletePlaceButton) {
        if (window.confirm("刪除這個景點？所有日期中的安排也會一併移除。")) { deletePlace(deletePlaceButton.getAttribute("data-delete-place")); closeEditors(); render(root); }
        return;
      }
      var moveButton = target.closest("[data-move]");
      if (moveButton) { moveStop(moveButton.getAttribute("data-stop-id"), moveButton.getAttribute("data-move")); render(root); return; }
      var unassignButton = target.closest("[data-unassign]");
      if (unassignButton) { unassignStop(unassignButton.getAttribute("data-unassign")); closeEditors(); render(root); return; }
      var filterButton = target.closest("[data-place-filter]");
      if (filterButton) { uiState.categoryFilter = filterButton.getAttribute("data-place-filter"); render(root); return; }
      if (target.closest("[data-toggle-add-place]")) { uiState.showAddPlace = !uiState.showAddPlace; uiState.pickCoordinates = false; render(root); return; }
      if (target.closest("[data-toggle-add-day]")) { uiState.showAddDay = !uiState.showAddDay; render(root); return; }
      var editPlace = target.closest("[data-edit-place]");
      if (editPlace) { uiState.editingPlaceId = editPlace.getAttribute("data-edit-place"); render(root); return; }
      var editStop = target.closest("[data-edit-stop]");
      if (editStop) { uiState.editingStopId = editStop.getAttribute("data-edit-stop"); render(root); return; }
      var mapDay = target.closest("[data-map-day]");
      if (mapDay) { uiState.mapDayId = mapDay.getAttribute("data-map-day"); render(root); return; }
      if (target.closest("[data-locate-me]")) { if (mapController) mapController.locate(); return; }
      if (target.closest("[data-pick-new-place]")) {
        uiState.pickCoordinates = !uiState.pickCoordinates;
        if (mapController) mapController.setPickMode(uiState.pickCoordinates);
        var hint = root.querySelector(".map-hint");
        if (hint) hint.textContent = uiState.pickCoordinates ? "現在請點地圖上的景點位置。" : "已取消選取座標。";
        return;
      }
      var close = target.closest("[data-close-editor]");
      if (close && !target.closest("[data-editor-sheet]")) { closeEditors(); render(root); return; }
      if (target.matches(".editor-close")) { closeEditors(); render(root); return; }
      var focus = target.closest("[data-focus-place]");
      if (focus && !target.closest("button,a,select")) {
        uiState.focusedPlaceId = focus.getAttribute("data-focus-place");
        if (mapController) mapController.focusPlace(uiState.focusedPlaceId);
        root.querySelectorAll("[data-focus-place]").forEach(function (element) { element.classList.toggle("is-focused", element.getAttribute("data-focus-place") === uiState.focusedPlaceId); });
      }
    });

    root.addEventListener("input", function (event) {
      if (event.target.matches("[data-search-input]")) { uiState.searchQuery = event.target.value; render(root); }
    });

    root.addEventListener("change", function (event) {
      var checklist = event.target.closest("[data-checklist]");
      if (checklist) { toggleChecklistItem(checklist.getAttribute("data-checklist")); render(root); return; }
      var select = event.target.closest("[data-assign-select]");
      if (select && select.value) { assignPlaceToDay(select.getAttribute("data-place-id"), select.value); render(root); }
    });

    root.addEventListener("submit", function (event) {
      event.preventDefault();
      var form = event.target;
      if (form.matches("[data-new-trip-form]")) {
        var tripTitle = field(form, "title").value.trim();
        if (tripTitle) createTrip(tripTitle);
      } else if (form.matches("[data-new-place-form]")) {
        var placeTitle = field(form, "title").value.trim();
        if (placeTitle && state.activeTripId) createPlace(state.activeTripId, {
          title: placeTitle, category: field(form, "category").value, address: field(form, "address").value.trim(),
          lat: field(form, "lat").value, lng: field(form, "lng").value, note: field(form, "note").value.trim()
        });
        uiState.showAddPlace = false;
        uiState.pickCoordinates = false;
      } else if (form.matches("[data-new-day-form]")) {
        if (state.activeTripId) createDay(state.activeTripId, field(form, "date").value, field(form, "title").value.trim());
        uiState.showAddDay = false;
      } else if (form.matches("[data-edit-place-form]")) {
        updatePlace(form.getAttribute("data-place-id"), {
          title: field(form, "title").value.trim(), category: field(form, "category").value, address: field(form, "address").value.trim(),
          lat: field(form, "lat").value, lng: field(form, "lng").value, note: field(form, "note").value.trim()
        });
        closeEditors();
      } else if (form.matches("[data-edit-stop-form]")) {
        updateStop(form.getAttribute("data-stop-id"), {
          dayId: field(form, "dayId").value, time: field(form, "time").value, duration: field(form, "duration").value,
          transport: field(form, "transport").value, note: field(form, "note").value.trim()
        });
        closeEditors();
      }
      render(root);
    });
  }

  function init() {
    state = loadState();
    TEMPLATES.forEach(function (template) {
      var existing = getTemplateTrip(template.templateId);
      if (existing) upgradeTemplateTrip(existing, template);
    });
    if (!state.trips.length && TEMPLATES.length && state.dismissedTemplateIds.indexOf(TEMPLATES[0].templateId) === -1) importTemplate(TEMPLATES[0].templateId);
    saveState();
    var root = document.getElementById("app-root");
    root.innerHTML = '<div class="trip-bar" data-trip-bar></div><div data-board></div>';
    bindEvents(root);
    render(root);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
