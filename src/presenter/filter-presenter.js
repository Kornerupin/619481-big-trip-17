import {render, remove, replace} from '../framework/render';
import {UpdateType} from '../const';
import TripFiltersView from '../view/trip-filters-view';

export default class FilterPresenter {
  #filterContainer = null;
  #filterComponent = null;

  #pointsModel = null;
  #filterModel = null;

  constructor(filterContainer, filterModel, pointsModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new TripFiltersView(this.#filterModel.filter);
    this.#filterComponent.setChangeHandler(this.#handleFilterChange);

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return true;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterChange = (filterMode) => {
    if (this.#filterModel.filter === filterMode) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterMode);
  };
}
