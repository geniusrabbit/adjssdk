// Thanks to Yoshi for the hint!
// Polyfill for IE < 9
if (!Node) {
  var Node = {};
}

if (!Node.COMMENT_NODE) {
  // numeric value according to the DOM spec
  Node.COMMENT_NODE = 8;
}

export function getComments(elem) {
  var children = elem.childNodes;
  var comments = [];

  for (var i=0, len=children.length; i<len; i++) {
    if (children[i].nodeType == Node.COMMENT_NODE) {
      comments.push(children[i].data || '');
    }
  }
  return comments.join('');
}
