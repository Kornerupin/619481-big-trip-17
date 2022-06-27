import Observable from '../framework/observable';
import {FILTER_TYPES} from '../const';
import {isPointExpired} from '../utils';

export default class FiltersModel extends Observable {
  #currentFilter = FILTER_TYPES.EVERYTHING;

  get filter() {
    return this.#currentFilter;
  }

  get filters() {
    return {
      [FILTER_TYPES.EVERYTHING]:
        {
          filterFunc: (points) => points,
          emptyText: 'Click New Event to create your first point',
        },
      [FILTER_TYPES.FUTURE]:
        {
          filterFunc: (points) => points.filter((current) => !isPointExpired(current)),
          emptyText: 'There are no future events now',
        },
      [FILTER_TYPES.PAST]:
        {
          filterFunc: (points) => points.filter((current) => isPointExpired(current)),
          emptyText: 'There are no past events now',
        },
    };
  }

  setFilter(updateType, newFilter) {
    this.#currentFilter = newFilter;

    this._notify(updateType, newFilter);
  }
}
