import AbstractView from '../framework/view/abstract-view';
import {FilterTypes} from '../const';

const createFilterTemplate = (type, activeType) => {
  const textChecked = type.toLowerCase() === activeType.toLowerCase() ? 'checked' : '';

  return `
    <div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type.toLowerCase()}" ${textChecked}>
      <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
    </div>`;
};

const createFiltersFormTemplate = (filters, activeType) => {
  let filtersTemplate = '';

  for (const current in filters) {
    filtersTemplate += createFilterTemplate(current, activeType);
  }

  return `
    <form class="trip-filters" action="#" method="get">
      ${filtersTemplate}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
};

export default class TripFiltersView extends AbstractView {
  #filters = null;
  #currentFilterType = null;

  constructor(currentFilterType) {
    super();
    this.#filters = FilterTypes;
    this.#currentFilterType = currentFilterType;
  }

  get template() {
    return createFiltersFormTemplate(this.#filters, this.#currentFilterType);
  }

  setChangeHandler = (callback) => {
    this._callback.change = callback;

    this.element.addEventListener('change', this.#changeHandler);
  };

  #changeHandler = (evt) => {
    evt.preventDefault();

    let val = evt.target.value.toLowerCase();
    val = val[0].toUpperCase() + val.slice(1);

    this._callback.change(val);
  };
}
