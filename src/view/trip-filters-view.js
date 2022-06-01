import AbstractView from '../framework/view/abstract-view';
import {FilterTypes} from '../const';

const createFilterTemplate = (type) => {
  const textChecked = type === 'EVERYTHING' ? 'checked' : '';

  return `
    <div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type.toLowerCase()}" ${textChecked}>
      <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
    </div>`;
};

const createFiltersFormTemplate = () => {
  let filters = '';

  for (const current in FilterTypes) {
    filters += createFilterTemplate(current);
  }

  return `
    <form class="trip-filters" action="#" method="get">
      ${filters}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
};

export default class TripFiltersView extends AbstractView {
  #points = null;

  constructor(points) {
    super();
    this.#points = points;
  }

  get template() {
    return createFiltersFormTemplate(this.#points);
  }
}
