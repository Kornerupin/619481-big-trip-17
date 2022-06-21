import Observable from '../framework/observable';
import {FilterTypes} from '../const';
import {isPointExpired} from '../utils';

export default class FiltersModel extends Observable {
  #currentFilter = FilterTypes.EVERYTHING;

  get filter() {
    return this.#currentFilter;
  }

  get filters() {
    return {
      [FilterTypes.EVERYTHING]:
        {
          filterFunc: (points) => points,
          emptyText: 'Click New Event to create your first point',
        },
      [FilterTypes.FUTURE]:
        {
          filterFunc: (points) => points.filter((current) => !isPointExpired(current)),
          emptyText: 'There are no future events now',
        },
      [FilterTypes.PAST]:
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
