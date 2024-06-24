if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(search, pos) {
    return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
  };
}

// Thanks to Yoshi for the hint!
// Polyfill for IE < 9
if (!Node) {
  var Node = {};
}

if (!Node.COMMENT_NODE) {
  // numeric value according to the DOM spec
  Node.COMMENT_NODE = 8;
}

function getComments(elem) {
  var children = elem.childNodes;
  var comments = [];

  for (var i=0, len=children.length; i<len; i++) {
    if (children[i].nodeType == Node.COMMENT_NODE) {
      comments.push(children[i].data || '');
    }
  }
  return comments.join('');
}

function srcSetThumbs(thumbs) {
  if (!thumbs || thumbs.length <= 0) {
    return ""
  }
  var sset = [];
  for (var i in thumbs) {
    var thumb = thumbs[i];
    if (thumb.width > 0) {
      sset.push(thumb.path + " " + thumb.width + "w");
    }
  }
  return sset.join(",")
}

function srcSetCSSThumbs(thumbs) {
  if (!thumbs || thumbs.length <= 0) {
    return ""
  }
  var sset = [];
  for (var i in thumbs) {
    var thumb = thumbs[i];
    if (thumb.width > 0) {
      sset.push("url('"+thumb.path + "') " + thumb.width + "w");
    }
  }
  return sset.join(",")
}

export class EmbeddedAd {
  constructor(settings) {
    this.settings = settings || {
      element: null,
      zone_id: null,
      JSONPLink: null
    };
    this.callbacks = {
      onLoading: null,
      onRender: null,
      onError: null
    };
    if (!this.settings.JSONPLink)
      this.settings.JSONPLink = process.env.ADSERVER_AD_JSONP_REQUEST_URL;
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

  renderHTML(html, target) {
    var elm = target || this.settings.element;

    if (/<script[^>]*>/gi.test(html)) {
      var iframe = document.createElement('iframe');
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.setAttribute('width', '100%');
      iframe.setAttribute('height', '100%');
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('marginwidth', '0');
      iframe.setAttribute('marginheight', '0');
      iframe.setAttribute('vspace', '0');
      iframe.setAttribute('hspace', '0');
      iframe.setAttribute('allowtransparency', 'true');
      iframe.setAttribute('scrolling', 'no');
      iframe.setAttribute('allowfullscreen', 'true');
      html = '<!DOCTYPE html><html><head>'+
        '<meta name="viewport" content="width=device-width, initial-scale=1">'+
        '<meta charset="utf-8" />'+
        '<style>*,body,html{margin:0;padding:0;border:none;}'+
        'body,html{width:100%;height:100%;}</style>'+
        '</head><body><center>' + html + '</center></body></html>';
      // iframe.src = 'data:text/html;charset=utf-8,' + encodeURI(html);

      elm.appendChild(iframe);

      iframe.contentWindow.document.open();
      iframe.contentWindow.document.write(html);
      iframe.contentWindow.document.close();
    } else {
      elm.innerHTML = html;
      Array.from(elm.querySelectorAll("script")).forEach(function(el) {
        let newEl = document.createElement("script");
        Array.from(el.attributes).forEach(function(el) {
          newEl.setAttribute(el.name, el.value);
        });
        if (el.innerHTML) {
          newEl.appendChild(document.createTextNode(el.innerHTML));
        }
        el.parentNode.replaceChild(newEl, el);
      });
    }
  }

  renderNative(item, target) {
    var fields = item.fields;
    var asset = this._assertByName("main", item.assets);
    var tmpset = srcSetCSSThumbs(asset.thumbs);
    var template = '<div class="banner">'+
    '  <a target="_blank" href="'+this.prepareURL(item.url)+'" class="image">'+
        '<img alt="main" style="object-fit:cover;width:100%;height:100%;" src="'+asset.path+'" srcset="'+srcSetThumbs(asset.thumbs)+'" />'+
      '</a>'+
    '  <div class="label">'+
    (fields.title       ? '<a target="_blank" href="'+this.prepareURL(item.url)+'" class="title">'+fields.title+'</a>' : '')+
    (fields.description ? '<a target="_blank" href="'+this.prepareURL(item.url)+'" class="description">'+fields.description+'</a>' : '')+
    (fields.brandname   ? '<a target="_blank" href="'+this.prepareURL(item.url)+'" class="brand">'+fields.brandname+'</a>' : '')+
    (fields.phone       ? '<a target="_blank" href="'+this.prepareURL(item.url)+'" class="phone">'+fields.phone+'</a>' : '')+
    (fields.url         ? '<a target="_blank" href="'+this.prepareURL(item.url)+'" class="url">'+fields.url+'</a>' : '')+
    '  </div>'+
    '</div>'
    target.innerHTML = template;
  }

  renderBanner(banner, target) {
    var asset = this._assertByName("main", banner.assets);
    target.innerHTML =
      '<center>'+
        '<a target="_blank" href="'+this.prepareURL(banner.url)+'" class="banner" style="font-size:0">'+
          '<img alt="main" src="'+asset.path+'" srcset="'+srcSetThumbs(asset.thumbs)+'" />'+
        '</a>'+
      '</center>';
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
      this.renderHTML(getComments(this.settings.element), this.settings.element);
    }
  }

  _renderItem(it) {
    if (!it.format) {
      it.format = {};
    }
    if (it.type === "proxy") {
      if (it.content && typeof it.content === 'string') {
        this.renderHTML(it.content, this.settings.element);
      } else if (it.fields && (it.fields.url || it.content_url)) {
        this.renderHTML('<iframe width="' + (it.format.w || '100%') + '"' +
          ' height="' + (it.format.h || '100%') + '"' +
          ' frameborder="0" marginwidth="0" marginheight="0" vspace="0" hspace="0"'+
          ' allowtransparency="true" scrolling="no" allowfullscreen="true"' +
          ' style="width:' + (it.format.w || '100%') +
          ';height:' + (it.format.h || '100%') +
          ';" src="' + (it.fields.url || it.content_url) + '"></iframe>',
          this.settings.element);
      } else {
        throw "invalid format response type: proxy";
      }
      this._tracking(it);
    } else if (it.type === "native") {
      this.renderNative(it, this.settings.element);
      this._tracking(it);
    } else if (it.type === "banner") {
      this.renderBanner(it, this.settings.element);
      this._tracking(it);
    } else {
      throw "invalid advertisement type " + it.type + " " + (it.type == "proxy");
    }
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
        img.src = this.prepareURL(arr[j]);
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

  queryParam(name, url) {
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  prepareURL(url) {
    if (url.startsWith("//")) {
      if (window.location.protocol !== "http:" && window.location.protocol !== "https:") {
        return "http:" + url;
      }
      return window.location.protocol + url;
    }
    return url;
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