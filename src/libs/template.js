/**
 * Gives a value of a property by a path in an object
 * @param {Object} obj - Object to get a value
 * @param {String} path - Path to a property
 * @returns {*} - Value of a property
 */
function getValue(obj, path) {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

/**
 * Render a template string with data
 * @param {String} template - Template string
 * @param {Object} data - Data object
 * @returns {String} - Rendered template
 */
export function renderTemplate(template, data) {
  // Process conditional blocks {{?var}}...{{/?}}
  const conditionalRegex = /{{\?\s*([\w\.]+)\s*}}([\s\S]*?){{\/\?}}/g;
  template = template.replace(conditionalRegex, (match, p1, p2) => {
    const value = getValue(data, p1);
    return value ? p2 : '';
  });
  console.log("=======!", template);

  // Replace variables {{var}} or {{object.property}}
  const variableRegex = /{{\s*([\w\.]+)\s*}}/g;
  template = template.replace(variableRegex, (match, p1) => {
    const value = getValue(data, p1);
    return value !== undefined && value !== null ? value : '';
  });
  console.log("=======!", template);

  return template;
}
