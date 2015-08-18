1.
    slice             = [].slice,
    splice            = [].splice,
    push              = [].push,
    toString          = Object.prototype.toString,

2. 
var angular           = window.angular || (window.angular = {}),

function isUndefined(value) {return typeof value === 'undefined';}

function isObject(value) {
  // http://jsperf.com/isobject4
  return value !== null && typeof value === 'object';
}

3
    if (isString(attr = element.attr(attr))) {
      return attr;
    }