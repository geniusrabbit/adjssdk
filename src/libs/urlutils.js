
export function prepareURL(url) {
  if (url.startsWith("//")) {
    if (window.location.protocol !== "http:" && window.location.protocol !== "https:") {
      return "http:" + url;
    }
    return window.location.protocol + url;
  }
  return url;
}

export function queryParam(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}
