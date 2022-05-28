import {getRandomFromArray, getAllArrayId, getFormatDayJs} from '../utils';
import {POINT_TYPES, POINT_PRICES} from '../const';
import daysjs from 'dayjs';

const cities = [
  {
    'description': 'Chamonix, is a beautiful city, a true asian pearl, with crowded streets.',
    'name': 'Chamonix',
    'pictures': [
      {
        'src': 'http://picsum.photos/300/200?r=0.0762563005163317',
        'description': 'Chamonix parliament building'
      }
    ]
  },
  {
    'description': 'Amsterdam is the capital and most populous city of the Netherlands.',
    'name': 'Amsterdam',
    'pictures': [
      {
        'src': 'http://picsum.photos/300/200?r=0.0762563005163317',
        'description': 'Amsterdam some picture'
      }
    ]
  },
  {
    'description': 'Geneva is the second-most populous city in Switzerland (after Zürich) and the most populous city of Romandy, the French-speaking part of Switzerland.',
    'name': 'Geneva',
    'pictures': [
      {
        'src': 'http://picsum.photos/300/200?r=0.0762563005163317',
        'description': 'Geneva some picture'
      }
    ]
  },
];
let counter = 0;
const getDestination = () => {
  if (counter++ < 3) {
    return cities[0];
  }
  if (counter < 8) {
    return cities[1];
  }
  return cities[2];
};

const offerOffers = [
  {
    'typesId': getAllArrayId(POINT_TYPES, ['taxi']),
    'title': 'Upgrade to a business class',
    'price': 120
  }, {
    'typesId': getAllArrayId(POINT_TYPES, ['drive']),
    'title': 'Order Uber',
    'price': 20
  }, {
    'typesId': getAllArrayId(POINT_TYPES, ['drive']),
    'title': 'Rent a car',
    'price': 200
  }, {
    'typesId': getAllArrayId(POINT_TYPES, ['taxi']),
    'title': 'Choose the radio station',
    'price': 60
  }, {
    'typesId': getAllArrayId(POINT_TYPES, ['flight']),
    'title': 'Add luggage',
    'price': 30
  }, {
    'typesId': getAllArrayId(POINT_TYPES, ['taxi', 'flight']),
    'title': 'Switch to comfort class',
    'price': 100
  }, {
    'typesId': getAllArrayId(POINT_TYPES, ['flight']),
    'title': 'Add meal',
    'price': 15
  }, {
    'typesId': getAllArrayId(POINT_TYPES, ['flight']),
    'title': 'Chose seats',
    'price': 5
  }, {
    'typesId': getAllArrayId(POINT_TYPES, ['flight']),
    'title': 'Travel by train',
    'price': 40
  }, {
    'typesId': getAllArrayId(POINT_TYPES, ['check-in']),
    'title': 'Add breakfast',
    'price': 50
  }, {
    'typesId': getAllArrayId(POINT_TYPES, ['sightseeing']),
    'title': 'Book tickets',
    'price': 40
  }, {
    'typesId': getAllArrayId(POINT_TYPES, ['sightseeing']),
    'title': 'Lunch in city',
    'price': 30
  },
];

// Стартовая дата - конец следующей рабочей недели
let dateFrom = daysjs()
  .startOf('week')
  .add(6, 'day');

const randomDateDelay = (from) => {
  let minutesDelay = Math.floor(Math.random() * 12) * 5;
  const hoursDelay = Math.floor(Math.random() * 5);

  if (!minutesDelay && !hoursDelay) {
    minutesDelay = 12;
  }

  return from
    .add(minutesDelay, 'minutes')
    .add(hoursDelay, 'hours');
};

const getOffer = (type) => ({
  'type': type,
  'data': offerOffers
    .map((current) => current.typesId.indexOf(POINT_TYPES.indexOf(type)) !== -1 ? current : -1)
    .filter((current) => current !== -1),
});


const getPoint = () => {
  const type = getRandomFromArray(POINT_TYPES);
  const destination = getDestination();
  const typeId = POINT_TYPES.indexOf(type);

  const dateTo = randomDateDelay(dateFrom);

  const result = {
    'basePrice': POINT_PRICES[typeId],
    'dateFrom': getFormatDayJs(dateFrom),
    'dateTo': getFormatDayJs(dateTo),
    'destination': destination,
    'isFavorite': Math.random() > 0.5,
    'type': type,
    'offers': getOffer(type),
  };

  dateFrom = dateTo;

  return result;
};

export {getPoint};
