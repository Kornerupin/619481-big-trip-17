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

const SortModes = {
  DAY: 'Day',
  EVENT: 'Event',
  TIME: 'Time',
  PRICE: 'Price',
  OFFERS: 'Offers',
};

export {PointTypes, PointPrices, OfferTypes, FilterTypes, PointModes, SortModes};
