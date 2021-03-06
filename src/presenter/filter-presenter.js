import {render, remove, replace, RenderPosition} from '../framework/render';
import {UPDATE_TYPE} from '../const';
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

    this.#filterComponent = new TripFiltersView(this.#filterModel.filter, this.#pointsModel, this.#filterModel);
    this.#filterComponent.setChangeHandler(this.#handleFilterChange);

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer, RenderPosition.AFTEREND);
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

    this.#filterModel.setFilter(UPDATE_TYPE.MAJOR, filterMode);
  };
}
