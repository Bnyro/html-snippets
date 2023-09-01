Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)];
};

function isLetter(char) {
  return /[a-zA-Z]/.test(char);
}

function currentEl() {
  return $$("#text span")[currentIndex];
}

function groupBy(list, keyGetter) {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

const range = (size) => {
  return [...Array(size).keys()];
};
