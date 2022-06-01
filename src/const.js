const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const POINT_PRICES = [100, 20, 50, 200, 100, 500, 50, 80, 100];
const OFFER_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const FILTER_TYPES = {
  EVERYTHING: 'Everything',
  FUTURE: 'Future',
  PAST: 'Past',
};

const POINT_MODES = {
  DEFAULT: 'DEFAULT',
  EDIT: 'EDIT',
};

const SORT_MODES = {
  DAY: 'Day',
  EVENT: 'Event',
  TIME: 'Time',
  PRICE: 'Price',
  OFFERS: 'Offers',
};

export {POINT_TYPES, POINT_PRICES, OFFER_TYPES, FILTER_TYPES, POINT_MODES, SORT_MODES};
