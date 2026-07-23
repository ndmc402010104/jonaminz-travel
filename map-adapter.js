/*
 * Jonaminz Travel map adapter.
 *
 * Leaflet is deliberately isolated here so the Journey Builder data model does
 * not depend on a map vendor. The default browser tiles follow OpenStreetMap's
 * interactive-viewing policy; no tiles are prefetched or stored by this app.
 */
(function () {
  "use strict";

  var DEFAULTS = {
    tileUrl: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
    fallbackCenter: [43.0618, 141.3545],
    fallbackZoom: 12
  };

  function config() {
    var supplied = window.JonaminzTravelMapConfig || {};
    return Object.assign({}, DEFAULTS, supplied);
  }

  function numberIcon(number, color, active) {
    return window.L.divIcon({
      className: "travel-marker-wrap",
      html: '<span class="travel-marker' + (active ? " is-active" : "") + '" style="--marker-color:' + color + '"><b>' + number + "</b></span>",
      iconSize: [34, 42],
      iconAnchor: [17, 40],
      popupAnchor: [0, -38]
    });
  }

  function TravelMap(element, options) {
    this.element = element;
    this.options = options || {};
    this.map = null;
    this.layers = [];
    this.markers = {};
    this.pickMode = false;
    this.init();
  }

  TravelMap.prototype.init = function () {
    var self = this;
    if (!this.element) return;
    if (!window.L || typeof window.L.map !== "function") {
      this.element.innerHTML =
        '<div class="map-fallback"><b>地圖暫時無法載入</b><span>行程資料仍可正常編輯；可使用每個景點的 Google Maps 按鈕。</span></div>';
      return;
    }
    var cfg = config();
    this.map = window.L.map(this.element, { zoomControl: true, attributionControl: true })
      .setView(cfg.fallbackCenter, cfg.fallbackZoom);
    window.L.tileLayer(cfg.tileUrl, {
      attribution: cfg.attribution,
      maxZoom: cfg.maxZoom
    }).addTo(this.map);
    this.map.on("click", function (event) {
      if (self.pickMode && typeof self.options.onPick === "function") {
        self.options.onPick(event.latlng.lat, event.latlng.lng);
      }
    });
  };

  TravelMap.prototype.clear = function () {
    var self = this;
    if (!this.map) return;
    this.layers.forEach(function (layer) { self.map.removeLayer(layer); });
    this.layers = [];
    this.markers = {};
  };

  TravelMap.prototype.render = function (model) {
    if (!this.map) return;
    this.clear();
    var self = this;
    var bounds = [];
    (model.days || []).forEach(function (day) {
      var line = [];
      day.stops.forEach(function (stop) {
        if (!Number.isFinite(stop.lat) || !Number.isFinite(stop.lng)) return;
        var point = [stop.lat, stop.lng];
        bounds.push(point);
        line.push(point);
        var marker = window.L.marker(point, {
          icon: numberIcon(stop.number, day.color, stop.placeId === model.focusedPlaceId),
          title: stop.title
        }).addTo(self.map);
        marker.bindTooltip(stop.number + ". " + stop.title, { direction: "top", offset: [0, -34] });
        marker.on("click", function () {
          if (typeof self.options.onFocus === "function") self.options.onFocus(stop.placeId);
        });
        self.layers.push(marker);
        self.markers[stop.placeId] = marker;
      });
      if (line.length > 1) {
        var polyline = window.L.polyline(line, { color: day.color, weight: 4, opacity: 0.72 }).addTo(self.map);
        self.layers.push(polyline);
      }
    });
    if (bounds.length) this.map.fitBounds(bounds, { padding: [34, 34], maxZoom: 15 });
    else {
      var cfg = config();
      this.map.setView(cfg.fallbackCenter, cfg.fallbackZoom);
    }
    setTimeout(function () { if (self.map) self.map.invalidateSize(); }, 0);
  };

  TravelMap.prototype.focusPlace = function (placeId) {
    var marker = this.markers[placeId];
    if (!marker || !this.map) return;
    this.map.setView(marker.getLatLng(), Math.max(this.map.getZoom(), 15), { animate: true });
    marker.openTooltip();
  };

  TravelMap.prototype.setPickMode = function (enabled) {
    this.pickMode = Boolean(enabled);
    if (this.element) this.element.classList.toggle("is-picking", this.pickMode);
  };

  TravelMap.prototype.locate = function () {
    if (this.map) this.map.locate({ setView: true, maxZoom: 16 });
  };

  TravelMap.prototype.destroy = function () {
    if (this.map) this.map.remove();
    this.map = null;
    this.layers = [];
    this.markers = {};
  };

  window.JonaminzTravelMap = {
    mount: function (element, options) { return new TravelMap(element, options); }
  };
})();
