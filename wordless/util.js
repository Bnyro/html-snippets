Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)];
};

function isLetter(c) {
  return c.toLowerCase() != c.toUpperCase();
}
