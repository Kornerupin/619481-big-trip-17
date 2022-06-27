import AbstractView from '../framework/view/abstract-view';
import {FILTER_TYPES} from '../const';

const createFilterTemplate = (type, activeType, pointsModel, filterModel) => {
  const textChecked = type.toLowerCase() === activeType.toLowerCase() ? 'checked' : '';
  let textDisabled = filterModel.filters[FILTER_TYPES[type]].filterFunc(pointsModel.points).length > 0 ? '' : ' disabled ';
  if (FILTER_TYPES[type] === FILTER_TYPES.EVERYTHING) {
    textDisabled = '';
  }

  return `
    <div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type.toLowerCase()}" ${textChecked} ${textDisabled}>
      <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
    </div>`;
};

const createFiltersFormTemplate = (filters, activeType, pointsModel, filterModel) => {
  let filtersTemplate = '';

  for (const current in filters) {
    filtersTemplate += createFilterTemplate(current, activeType, pointsModel, filterModel);
  }

  return `
    <form class="trip-filters" action="#" method="get">
      ${filtersTemplate}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
};

export default class TripFiltersView extends AbstractView {
  #pointsModel = null;
  #filterModel = null;
  #filters = null;
  #currentFilterType = null;

  constructor(currentFilterType, pointsModel, filterModel) {
    super();
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#filters = FILTER_TYPES;
    this.#currentFilterType = currentFilterType;
  }

  get template() {
    return createFiltersFormTemplate(this.#filters, this.#currentFilterType, this.#pointsModel, this.#filterModel);
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
