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

const getAllArrayId = (baseArr, searchArr) => searchArr
  .map((current) => baseArr.indexOf(current))
  .filter((current) => current !== -1)
  .sort();

export {getRandomFromArray, getAllArrayId, getFormatDayJs, getFormatTime};
