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

const BLANK_POINT = {
  basePrice: 0,
  dateFrom: false,
  dateTo: false,
  destination: {
    'description': '',
    'name': '',
    'pictures': []
  },
  type: POINT_TYPES[0],
  offers: [],
  isFavorite: false,
};

const SORT_MODES = {
  DAY: 'Day',
  EVENT: 'Event',
  TIME: 'Time',
  PRICE: 'Price',
  OFFERS: 'Offers',
};

const SORT_DATA = [
  {'name': SORT_MODES.DAY, 'isChecked': false, 'isDisabled': false},
  {'name': SORT_MODES.EVENT, 'isChecked': false, 'isDisabled': true},
  {'name': SORT_MODES.TIME, 'isChecked': false, 'isDisabled': false},
  {'name': SORT_MODES.PRICE, 'isChecked': false, 'isDisabled': false},
  {'name': SORT_MODES.OFFERS, 'isChecked': false, 'isDisabled': true},
];

const USER_ACTION = {
  UPDATE_POINT: 'UPDATE_POINT',
  DELETE_POINT: 'DELETE_POINT',
  CREATE_POINT: 'CREATE_POINT',
};

const UPDATE_TYPE = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export {POINT_TYPES, POINT_PRICES, OFFER_TYPES, FILTER_TYPES, POINT_MODES, SORT_MODES, SORT_DATA, USER_ACTION, UPDATE_TYPE, BLANK_POINT};
