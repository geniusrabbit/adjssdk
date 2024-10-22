import { prepareURL } from "./libs/urlutils";

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

export function assertByName(name, assets) {
  if (!assets) {
    return null;
  }
  for (var i in assets) {
    var assert = assets[i];
    if (assert.name == name) {
      return assert;
    }
  }
  return null;
}

export class Render {
  proxy(data, target) {
    if (data.content && typeof data.content === 'string') {
      this.renderHTML(data.content, this.settings.element);
    } else if (data.fields && (data.fields.url || data.content_url)) {
      this.renderHTML('<iframe width="' + (it.format.w || '100%') + '"' +
        ' height="' + (data.format.h || '100%') + '"' +
        ' frameborder="0" marginwidth="0" marginheight="0" vspace="0" hspace="0"'+
        ' allowtransparency="true" scrolling="no" allowfullscreen="true"' +
        ' style="width:' + (data.format.w || '100%') +
        ';height:' + (data.format.h || '100%') +
        ';" src="' + (data.fields.url || data.content_url) + '"></iframe>',
        target);
    } else {
      throw "invalid format response type: proxy";
    }
  }

  native(data, target) {
    var fields = data.fields;
    var asset = assertByName("main", data.assets);
    var tmpset = srcSetCSSThumbs(asset.thumbs);
    var template = '<div class="banner">'+
    '  <a target="_blank" href="'+prepareURL(data.url)+'" class="image">'+
        '<img alt="main" style="object-fit:cover;width:100%;height:100%;" src="'+asset.path+'" srcset="'+srcSetThumbs(asset.thumbs)+'" />'+
      '</a>'+
    '  <div class="label">'+
    (fields.title       ? '<a target="_blank" href="'+prepareURL(data.url)+'" class="title">'+fields.title+'</a>' : '')+
    (fields.description ? '<a target="_blank" href="'+prepareURL(data.url)+'" class="description">'+fields.description+'</a>' : '')+
    (fields.brandname   ? '<a target="_blank" href="'+prepareURL(data.url)+'" class="brand">'+fields.brandname+'</a>' : '')+
    (fields.phone       ? '<a target="_blank" href="'+prepareURL(data.url)+'" class="phone">'+fields.phone+'</a>' : '')+
    (fields.url         ? '<a target="_blank" href="'+prepareURL(data.url)+'" class="url">'+fields.url+'</a>' : '')+
    '  </div>'+
    '</div>'
    target.innerHTML = template;
  }

  banner(data, target) {
    var asset = assertByName("main", data.assets);
    target.innerHTML =
      '<center>'+
        '<a target="_blank" href="'+this.prepareURL(data.url)+'" class="banner" style="font-size:0">'+
          '<img alt="main" src="'+asset.path+'" srcset="'+srcSetThumbs(asset.thumbs)+'" />'+
        '</a>'+
      '</center>';
  }

  html(html, target) {
    var elm = target;

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
}