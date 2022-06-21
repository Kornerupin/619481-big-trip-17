import AbstractView from '../framework/view/abstract-view';
import FiltersModel from '../model/filters-model';

const createEmptyListTemplate = (text) => (
  `<p class="trip-events__msg">
    ${text}
  </p>`
);

export default class TripEventsListEmptyView extends AbstractView {
  #filterType = null;
  #filterTypeText = null;
  #filtersModel = new FiltersModel();

  constructor(filterType) {
    super();

    this.#filterType = filterType;
    this.#filterTypeText = this.#filtersModel.filters[this.#filterType].emptyText;
  }

  get template() {
    return createEmptyListTemplate(this.#filterTypeText);
  }
}
