"use strict";

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomDate = () => {
  const dateRangeEnd = new Date();
  const dateRangeStart = new Date().setMonth(dateRangeEnd.getMonth() - 3);
  const randomDate = new Date(getRandomInt(dateRangeStart, dateRangeEnd));
  const formatDate = randomDate.toLocaleDateString(`fr-ca`, {
    year: `numeric`,
    month: `2-digit`,
    day: `2-digit`,
  });
  const formatTime = randomDate.toLocaleTimeString(`ru-Ru`, {
    hour: `numeric`,
    minute: `numeric`,
    second: `numeric`,
  });
  return formatDate + ` ` + formatTime;
};

const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [
      someArray[randomPosition],
      someArray[i],
    ];
  }

  return someArray;
};

const getRandomSubarray = (items) => {
  items = items.slice();
  let count = getRandomInt(1, items.length - 1);
  const result = [];
  while (count--) {
    result.push(...items.splice(getRandomInt(0, items.length - 1), 1));
  }
  return result;
};

module.exports = {
  getRandomInt,
  getRandomDate,
  getRandomSubarray,
  shuffle,
};
