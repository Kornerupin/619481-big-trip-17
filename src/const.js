const PointTypes = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const PointPrices = [100, 20, 50, 200, 100, 500, 50, 80, 100];
const OfferTypes = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const FilterTypes = {
  EVERYTHING: 'Everything',
  FUTURE: 'Future',
  PAST: 'Past',
};

const PointModes = {
  DEFAULT: 'DEFAULT',
  EDIT: 'EDIT',
};

const BlankPoint = {
  basePrice: 0,
  dateFrom: true,
  dateTo: false,
  destination: {
    'description': '',
    'name': '',
    'pictures': []
  },
  type: PointTypes[0],
  offers: [],
};

const SortModes = {
  DAY: 'Day',
  EVENT: 'Event',
  TIME: 'Time',
  PRICE: 'Price',
  OFFERS: 'Offers',
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  DELETE_POINT: 'DELETE_POINT',
  CREATE_POINT: 'CREATE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export {PointTypes, PointPrices, OfferTypes, FilterTypes, PointModes, SortModes, UserAction, UpdateType, BlankPoint};
