import dayjs from 'dayjs';
import {OFFER_TYPES, SORT_MODES} from './const';

const getFormatDayJs = (date, format = 'YYYY-MM-DDTHH:mm:ss.SSS[Z]') => dayjs.isDayjs(date) ? date.format(format) : false;

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

const parseDayJs = (date) => dayjs.isDayjs(date) ? date : dayjs(date);

const isPointExpired = (point) => point && dayjs().isAfter(dayjs(point));

const getAllArrayId = (baseArr, searchArr) => searchArr
  .map((current) => baseArr.indexOf(current))
  .filter((current) => current !== -1)
  .sort();

const sorts = {
  [SORT_MODES.DAY]: (items) => items.sort((a, b) => (parseDayJs(a.dateFrom).diff(parseDayJs(b.dateFrom)))),
  [SORT_MODES.TIME]: (items) => items.sort((a, b) => {
    const aTime = Math.abs(parseDayJs(b.dateFrom).diff(parseDayJs(b.dateTo)));
    const bTime = Math.abs(parseDayJs(a.dateFrom).diff(a.dateTo));

    return (aTime - bTime);
  }),
  [SORT_MODES.OFFERS]: (items) => items.sort((a, b) => {
    const aOffersCount = a.offers.data.reduce((count, currentOffer) => (count += currentOffer.isChecked ? 1 : 0), 0);
    const bOffersCount = (b.offers.data.reduce((count, currentOffer) => (count += currentOffer.isChecked ? 1 : 0), 0));

    return -(aOffersCount - bOffersCount);
  }),
  [SORT_MODES.PRICE]: (items) => items.sort((a, b) => b.totalPrice - a.totalPrice),
  [SORT_MODES.EVENT]: (items) => items.sort((a, b) => (OFFER_TYPES.indexOf(a.type) - OFFER_TYPES.indexOf(b.type))),
};

export {
  getRandomFromArray,
  getAllArrayId,
  getFormatDayJs,
  getFormatTime,
  parseDayJs,
  isPointExpired,
  sorts
};
