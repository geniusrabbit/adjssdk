export * from './libs/polyfills';
import { prepareURL } from './libs/urlutils';
import { Render } from './render';

const defaultConfig = {
  JSONPLink: process.env.ADSERVER_AD_JSONP_REQUEST_URL,
  element: null,
  zone_id: null,
  render: new Render(),
}

export class EmbeddedAd {
  constructor(settings) {
    this.settings = {...defaultConfig, ...settings};
    if (this.settings.JSONPLink.indexOf("?") < 0) {
      this.settings.JSONPLink += "?";
    } else if (!this.settings.JSONPLink.endsWith("&")) {
      this.settings.JSONPLink += "&";
    }
    if (!this.settings.render) {
      this.settings.render = defaultConfig.render;
    }
    this.callbacks = {
      onLoading: null,
      onRender: null,
      onError: null
    };
  }

  on(event, callback) {
    if (event === 'loading') {
      this.callbacks.onLoading = callback;
    }
    if (event === 'render') {
      this.callbacks.onRender = callback;
    }
    if (event === 'error') {
      this.callbacks.onError = callback;
    }
    return this;
  }

  render() {
    if (typeof this.settings.element === 'string') {
      this.settings.element = document.getElementById(this.settings.element);
    }
    this._load();
  }

  _renderResponse(response) {
    if (response.groups && response.groups.length > 0) {
      for (var i in response.groups) {
        var group = response.groups[i];
        for (var j in group.items) {
          this._renderItem(group.items[j]);
        }
      }
    } else {
      let custom = this.settings.element.querySelector('script[type="html/template"][data-type=default]').innerHTML;
      if (custom)
        this.settings.render.html(custom, this.settings.element);
    }
  }

  _renderItem(it) {
    if (!it.format) {
      it.format = {};
    }
    if (it.type === "proxy") {
      this.settings.render.proxy(it, this.settings.element);
    } else if (it.type === "native") {
      this.settings.render.native(it, this.settings.element);
    } else if (it.type === "banner") {
      this.settings.render.banner(it, this.settings.element);
    } else {
      throw "invalid advertisement type " + it.type + " " + (it.type == "proxy");
    }
    this._tracking(it);
  }

  _tracking(it) {
    if (!it || !it.tracker) {
      return;
    }
    var arrs = [it.tracker.impressions, it.tracker.views];
    for (var i in arrs) {
      var arr = arrs[i];
      if (!arr) continue;
      for (var j in arr) {
        var img = new Image();
        // img.onload = function() {document.body.removeChild(this)};
        img.src = prepareURL(arr[j]);
        // img.style.position = 'absolute';
        // img.style.width = '1px';
        // img.style.height = '1px';
        // img.style.top = '-100px';
        // img.style.left = '-100px';
        // document.body.appendChild(img);
      }
    }
  }

  _load() {
    this.JSONPCallbackName = '_cbf_' + this._randomString(7);
    window[this.JSONPCallbackName] = this._JSONPCallback.bind(this);
    var sc = this.JSONPScript = document.createElement('script');
    sc.src = this.settings.JSONPLink.
      replace('{<id>}', this.settings.zone_id + '') + this._collectionParams();
    document.body.appendChild(sc);
  }

  _assertByName(name, assets) {
    for (var i in assets) {
      var assert = assets[i];
      if (assert.name == name) {
        return assert;
      }
    }
    return null;
  }

  _collectionParams() {
    var params = [];
    var ws = this.winSize();
    params.push('callback=' + this.JSONPCallbackName);
    params.push('t=' + (new Date()).getUTCDate());
    params.push('w=' + ws[0]);
    params.push('h=' + ws[1]);
    return params.join('&');
  }

  _JSONPCallback(data) {
    try {
      if (typeof this.callbacks.onLoading === 'function') {
        this.callbacks.onLoading(data);
      }
      this._renderResponse(data);
      if (typeof this.callbacks.onRender === 'function') {
        this.callbacks.onRender(!!data);
      }
      this.JSONPScript.parentNode.removeChild(this.JSONPScript);
      window[this.JSONPCallbackName] = undefined;
    } catch (err) {
      console.debug("jsonp-callback", err);
      if (typeof this.callbacks.onError === 'function') {
        this.callbacks.onError(err);
      } else {
        throw err;
      }
    }
  }

  _randomString(num) {
    var text = '';
    var abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_';
    var length = num || 5;

    for (var i = 0; i < length; i++) {
      text += abc.charAt(Math.floor(Math.random() * abc.length));
    }

    return text;
  }

  winSize() {
    var w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0],
      x = w.innerWidth || e.clientWidth || g.clientWidth,
      y = w.innerHeight|| e.clientHeight|| g.clientHeight;
    return [x, y];
  }
};