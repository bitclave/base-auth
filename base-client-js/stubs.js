var noop = function () {};
setTimeout = noop;
clearTimeout = noop;
console = {};
console.log = noop;
console.warn = noop;
console.error = noop;
