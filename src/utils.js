import daysjs from 'dayjs';

const getFormatDayJs = (date, format = 'YYYY-MM-DDTHH:mm:ss.SSS[Z]') => daysjs.isDayjs(date) ? date.format(format) : false;

const getFormatTime = (time) => {
  const seconds = Math.floor(time / 1000);
  const minutes = Math.floor(seconds / 60) % 60;
  const hours = Math.floor(seconds / 60 / 60) % 60;
  const days = Math.floor(seconds / 60 / 60 / 24);

  const minutesText = `${minutes}M `;
  const hoursText = `${hours}H `;
  const daysText = `${days}D `;

  let result = '';

  if (days > 0) {
    result += daysText;
  }
  if (hours > 0) {
    result += hoursText;
  }
  if (minutes > 0 || hours === 0 && days === 0) {
    result += minutesText;
  }

  return result;
};

const getRandomFromArray = (arr) => arr[Math.floor(Math.random() * arr.length)];

const parseDayJs = (date) => daysjs.isDayjs(date) ? date : daysjs(date);

const isPointExpired = (point) => point && daysjs().isAfter(daysjs(point));

const getAllArrayId = (baseArr, searchArr) => searchArr
  .map((current) => baseArr.indexOf(current))
  .filter((current) => current !== -1)
  .sort();

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1)
  ];
};

export {
  getRandomFromArray,
  getAllArrayId,
  getFormatDayJs,
  getFormatTime,
  parseDayJs,
  isPointExpired,
  updateItem
};
