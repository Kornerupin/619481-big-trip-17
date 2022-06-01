import daysjs from 'dayjs';
import {OfferTypes, SortModes} from './const';

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

const sorts = {
  [SortModes.DAY]: (items) => items.sort((a, b) => (parseDayJs(a.dateFrom).diff(parseDayJs(b.dateFrom)))),
  [SortModes.TIME]: (items) => items.sort((a, b) => {
    const aTime = Math.abs(parseDayJs(b.dateFrom).diff(parseDayJs(b.dateTo)));
    const bTime = Math.abs(parseDayJs(a.dateFrom).diff(a.dateTo));

    return (aTime - bTime);
  }),
  [SortModes.OFFERS]: (items) => items.sort((a, b) => {
    const aOffersCount = a.offers.data.reduce((count, currentOffer) => (count += currentOffer.isChecked ? 1 : 0), 0);
    const bOffersCount = (b.offers.data.reduce((count, currentOffer) => (count += currentOffer.isChecked ? 1 : 0), 0));

    return -(aOffersCount - bOffersCount);
  }),
  [SortModes.PRICE]: (items) => items.sort((a, b) => {
    const aTotalPrice = a.basePrice + a.offers.data.reduce((sum, currentOffer) => (sum += currentOffer.isChecked ? currentOffer.price : 0), 0);
    const bTotalPrice = b.basePrice + b.offers.data.reduce((sum, currentOffer) => (sum += currentOffer.isChecked ? currentOffer.price : 0), 0);

    return (bTotalPrice - aTotalPrice);
  }),
  [SortModes.EVENT]: (items) => items.sort((a, b) => (OfferTypes.indexOf(a.type) - OfferTypes.indexOf(b.type))),
};

export {
  getRandomFromArray,
  getAllArrayId,
  getFormatDayJs,
  getFormatTime,
  parseDayJs,
  isPointExpired,
  updateItem,
  sorts
};
