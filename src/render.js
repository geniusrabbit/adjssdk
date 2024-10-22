// Import necessary functions from utility libraries
import { prepareURL } from "./libs/urlutils";

/**
 * Generates a srcset string for <img> tags based on the provided thumbnails.
 * @param {Array} thumbs - Array of thumbnail objects containing 'path' and 'width'.
 * @returns {string} - A comma-separated srcset string.
 */
function srcSetThumbs(thumbs) {
  if (!thumbs || thumbs.length <= 0) {
    return "";
  }
  var sset = [];
  for (var i in thumbs) {
    var thumb = thumbs[i];
    if (thumb.width > 0) {
      sset.push(thumb.path + " " + thumb.width + "w");
    }
  }
  return sset.join(",");
}

/**
 * Generates a srcset string for CSS background images based on the provided thumbnails.
 * @param {Array} thumbs - Array of thumbnail objects containing 'path' and 'width'.
 * @returns {string} - A comma-separated srcset string formatted for CSS.
 */
function srcSetCSSThumbs(thumbs) {
  if (!thumbs || thumbs.length <= 0) {
    return "";
  }
  var sset = [];
  for (var i in thumbs) {
    var thumb = thumbs[i];
    if (thumb.width > 0) {
      sset.push("url('" + thumb.path + "') " + thumb.width + "w");
    }
  }
  return sset.join(",");
}

/**
 * Retrieves an asset by its name from the provided assets array.
 * @param {string} name - The name of the asset to retrieve.
 * @param {Array} assets - Array of asset objects.
 * @returns {Object|null} - The asset object if found; otherwise, null.
 */
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

/**
 * Render class handles the rendering of different types of advertisements
 * (proxy, native, banner) into specified target elements.
 */
export class Render {
  /**
   * Renders a proxy advertisement.
   * @param {Object} data - The ad data containing content or URLs.
   * @param {HTMLElement} target - The DOM element where the ad will be rendered.
   */
  proxy(data, target) {
    if (data.content && typeof data.content === 'string') {
      // If ad content is a string, render it as HTML
      this.renderHTML(data.content, target);
    } else if (data.fields && (data.fields.url || data.content_url)) {
      // If ad data contains a URL, render it within an iframe
      this.renderHTML(
        '<iframe width="' + (data.format?.w || '100%') + '"' +
        ' height="' + (data.format?.h || '100%') + '"' +
        ' frameborder="0" marginwidth="0" marginheight="0" vspace="0" hspace="0"' +
        ' allowtransparency="true" scrolling="no" allowfullscreen="true"' +
        ' style="width:' + (data.format?.w || '100%') +
        ';height:' + (data.format?.h || '100%') +
        ';" src="' + (data.fields.url || data.content_url) + '"></iframe>',
        target
      );
    } else {
      // Throw an error if the ad format is invalid
      throw "invalid format response type: proxy";
    }
  }

  /**
   * Renders a native advertisement.
   * @param {Object} data - The ad data containing fields and assets.
   * @param {HTMLElement} target - The DOM element where the ad will be rendered.
   */
  native(data, target) {
    var fields = data.fields;
    var asset = assertByName("main", data.assets);
    var tmpset = srcSetCSSThumbs(asset?.thumbs || []);
    
    // Construct the native ad HTML template with dynamic data
    var template = '<div class="banner">' +
      '  <a target="_blank" href="' + prepareURL(data.url) + '" class="image">' +
      '    <img alt="main" style="object-fit:cover;width:100%;height:100%;" src="' + asset.path + '" srcset="' + srcSetThumbs(asset.thumbs) + '" />' +
      '  </a>' +
      '  <div class="label">' +
      (fields.title ? '<a target="_blank" href="' + prepareURL(data.url) + '" class="title">' + fields.title + '</a>' : '') +
      (fields.description ? '<a target="_blank" href="' + prepareURL(data.url) + '" class="description">' + fields.description + '</a>' : '') +
      (fields.brandname ? '<a target="_blank" href="' + prepareURL(data.url) + '" class="brand">' + fields.brandname + '</a>' : '') +
      (fields.phone ? '<a target="_blank" href="' + prepareURL(data.url) + '" class="phone">' + fields.phone + '</a>' : '') +
      (fields.url ? '<a target="_blank" href="' + prepareURL(data.url) + '" class="url">' + fields.url + '</a>' : '') +
      '  </div>' +
      '</div>';
    
    // Inject the constructed HTML into the target element
    target.innerHTML = template;
  }

  /**
   * Renders a banner advertisement.
   * @param {Object} data - The ad data containing assets.
   * @param {HTMLElement} target - The DOM element where the ad will be rendered.
   */
  banner(data, target) {
    var asset = assertByName("main", data.assets);
    target.innerHTML =
      '<center>' +
        '<a target="_blank" href="' + prepareURL(data.url) + '" class="banner" style="font-size:0">' +
          '<img alt="main" src="' + asset.path + '" srcset="' + srcSetThumbs(asset.thumbs) + '" />' +
        '</a>' +
      '</center>';
  }

  /**
   * Injects raw HTML into the target element. If the HTML contains <script> tags,
   * it safely injects the content within an iframe to prevent script execution in the main DOM.
   * @param {string} html - The HTML string to render.
   * @param {HTMLElement} target - The DOM element where the HTML will be injected.
   */
  html(html, target) {
    var elm = target;

    if (/<script[^>]*>/gi.test(html)) {
      // If HTML contains <script> tags, inject it into an iframe
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

      // Construct the complete HTML document for the iframe
      html = '<!DOCTYPE html><html><head>' +
        '<meta name="viewport" content="width=device-width, initial-scale=1">' +
        '<meta charset="utf-8" />' +
        '<style>*,body,html{margin:0;padding:0;border:none;}' +
        'body,html{width:100%;height:100%;}</style>' +
        '</head><body><center>' + html + '</center></body></html>';

      // Append the iframe to the target element
      elm.appendChild(iframe);

      // Write the HTML content into the iframe's document
      iframe.contentWindow.document.open();
      iframe.contentWindow.document.write(html);
      iframe.contentWindow.document.close();
    } else {
      // If no <script> tags, inject the HTML directly
      elm.innerHTML = html;

      // Re-execute any inline <script> tags by replacing them with new script elements
      Array.from(elm.querySelectorAll("script")).forEach(function(el) {
        let newEl = document.createElement("script");
        Array.from(el.attributes).forEach(function(attr) {
          newEl.setAttribute(attr.name, attr.value);
        });
        if (el.innerHTML) {
          newEl.appendChild(document.createTextNode(el.innerHTML));
        }
        el.parentNode.replaceChild(newEl, el);
      });
    }
  }

  /**
   * Helper method to render HTML content into the target element.
   * @param {string} htmlContent - The HTML content to render.
   * @param {HTMLElement} targetElement - The DOM element where the HTML will be injected.
   */
  renderHTML(htmlContent, targetElement) {
    targetElement.innerHTML = htmlContent;
  }
}