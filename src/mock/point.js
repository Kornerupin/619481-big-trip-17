import {getRandomFromArray, getAllArrayId, getFormatDayJs} from '../utils';
import {PointTypes, PointPrices, OfferTypes} from '../const';
import daysjs from 'dayjs';
import {nanoid} from 'nanoid';

const cities = [
  {
    'description': 'Chamonix, is a beautiful city, a true asian pearl, with crowded streets.',
    'name': 'Chamonix',
    'pictures': [
      {
        'src': 'https://www.touristsecrets.com/wp-content/uploads/2019/11/Hotel-Mont-Blanc-French-Alps.jpg',
        'description': 'Chamonix parliament building'
      },
      {
        'src': 'https://i09.fotocdn.net/s110/b69618d84d63079e/gallery_m/2443063586.jpg',
        'description': 'Chamonix parliament building'
      },
      {
        'src': 'https://images.musement.com/cover/0001/55/chamonix-mont-blanc-day-trip-from-geneva_header-54010.jpeg?w=1200&amp;h=630&amp;q=95&amp;fit=crop',
        'description': 'Chamonix parliament building'
      }
    ]
  },
  {
    'description': 'Amsterdam is the capital and most populous city of the Netherlands.',
    'name': 'Amsterdam',
    'pictures': [
      {
        'src': 'https://www.mondestay.com/jp/media/wp-content/uploads/2017/10/amsterdam-2203076_640-iloveimg-resized.jpg',
        'description': 'Amsterdam some picture'
      },
      {
        'src': 'https://www.istmira.com/uploads/posts/2020-01/1579566669_peshehodnye-ekskursii-po-kanalam-amsterdama-na-russkom-yazyke.jpg',
        'description': 'Amsterdam some picture'
      },
      {
        'src': 'https://img4.goodfon.ru/original/800x480/1/76/gorod-amsterdam-noch-ogni.jpg',
        'description': 'Amsterdam some picture'
      },
    ]
  },
  {
    'description': 'Geneva is the second-most populous city in Switzerland (after Zürich) and the most populous city of Romandy, the French-speaking part of Switzerland.',
    'name': 'Geneva',
    'pictures': [
      {
        'src': 'https://cache.erashop.net/1726/img/13/30/milan-geneva.jpg',
        'description': 'Geneva some picture'
      },
      {
        'src': 'https://kartami.ru/img/city/geneva.jpg',
        'description': 'Geneva some picture'
      },
      {
        'src': 'http://www.strumabroker.eu/StrumaBroker/uploadsT/703_0.jpg',
        'description': 'Geneva some picture'
      },
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
    'typesId': getAllArrayId(PointTypes, ['taxi']),
    'title': 'Upgrade to a business class',
    'price': 120
  }, {
    'typesId': getAllArrayId(PointTypes, ['drive']),
    'title': 'Order Uber',
    'price': 20
  }, {
    'typesId': getAllArrayId(PointTypes, ['drive']),
    'title': 'Rent a car',
    'price': 200
  }, {
    'typesId': getAllArrayId(PointTypes, ['taxi']),
    'title': 'Choose the radio station',
    'price': 60
  }, {
    'typesId': getAllArrayId(PointTypes, ['flight']),
    'title': 'Add luggage',
    'price': 30
  }, {
    'typesId': getAllArrayId(PointTypes, ['taxi', 'flight']),
    'title': 'Switch to comfort class',
    'price': 100
  }, {
    'typesId': getAllArrayId(PointTypes, ['flight']),
    'title': 'Add meal',
    'price': 15
  }, {
    'typesId': getAllArrayId(PointTypes, ['flight']),
    'title': 'Chose seats',
    'price': 5
  }, {
    'typesId': getAllArrayId(PointTypes, ['flight']),
    'title': 'Travel by train',
    'price': 40
  }, {
    'typesId': getAllArrayId(PointTypes, ['check-in']),
    'title': 'Add breakfast',
    'price': 50
  }, {
    'typesId': getAllArrayId(PointTypes, ['sightseeing']),
    'title': 'Book tickets',
    'price': 40
  }, {
    'typesId': getAllArrayId(PointTypes, ['sightseeing']),
    'title': 'Lunch in city',
    'price': 30
  },
];

// Стартовая дата - конец следующей рабочей недели
let dateFrom = daysjs()
  .startOf('week')
  .add(1, 'day');

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

const getOffer = (type, random = false) => {
  const data = {
    'type': type,
    'data': offerOffers
      .map((current) => current.typesId.indexOf(OfferTypes.indexOf(type)) !== -1 ? current : -1)
      .filter((current) => current !== -1),
  };

  data.data.map((current) => {
    current.offerId = nanoid();
  });

  if (random) {
    data.data.map((current) => {
      current.isChecked = Math.random() > 0.5;
    });
  } else {
    data.data.map((current) => {
      current.isChecked = false;
    });
  }

  return data;
};


const getPoint = () => {
  const type = getRandomFromArray(PointTypes);
  const destination = getDestination();
  const typeId = PointTypes.indexOf(type);

  const dateTo = randomDateDelay(dateFrom);

  const result = {
    'id': nanoid(),
    'basePrice': PointPrices[typeId],
    'dateFrom': getFormatDayJs(dateFrom),
    'dateTo': getFormatDayJs(dateTo),
    'destination': destination,
    'isFavorite': Math.random() > 0.5,
    'type': type,
    'offers': getOffer(type, true),
  };

  dateFrom = dateTo;

  return result;
};

const getRandomPseudoCurrentDatetime = (points) => (getRandomFromArray(points).dateFrom);

export {getPoint, getOffer, getRandomPseudoCurrentDatetime, cities};
