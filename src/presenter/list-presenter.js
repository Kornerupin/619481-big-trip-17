import {render} from '../framework/render';
import TripSortView from '../view/trip-sort-view';
import TripEventsListView from '../view/trip-events-list-view';
import TripEventsListEmpty from '../view/trip-events-list-empty';
import TripInfoView from '../view/trip-info-view';
import TripFiltersView from '../view/trip-filters-view';
import PointPresenter from './point-presenter';
import {sorts, updateItem} from '../utils';
import {sortData} from '../mock/sort';

export default class ListPresenter {
  #tripEventsContainer = null;
  #tripMainContainer = null;
  #tripFilterContainer = null;

  #pointsModel = null;

  #infoComponent = null;
  #filterComponent = null;
  #sortComponent = null;
  #listComponent = null;
  #listEmptyComponent = null;

  #sortItems = sortData;
  #listItems = [];
  #itemsPresenters = new Map();

  constructor(tripEventsContainer, tripMainContainer, tripFilterContainer, pointsModel) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#tripFilterContainer = tripFilterContainer;
    this.#tripMainContainer = tripMainContainer;
    this.#pointsModel = pointsModel;
  }

  init = () => {
    this.#listItems = [...this.#pointsModel.points];
    this.#infoComponent = new TripInfoView(this.#listItems);
    this.#filterComponent = new TripFiltersView(this.#listItems);

    this.#renderApp();
  };

  #handleItemChange = (updatedItem) => {
    this.#listItems = updateItem(this.#listItems, updatedItem);
    this.#itemsPresenters.get(updatedItem.id).init(updatedItem);
  };

  #handleModeChange = () => {
    this.#itemsPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderItem = (point) => {
    const pointPresenter = new PointPresenter(this.#listComponent.element, this.#handleItemChange, this.#handleModeChange);
    pointPresenter.init(point);
    this.#itemsPresenters.set(point.id, pointPresenter);
  };

  #renderSort = () => {
    if (this.#sortComponent === null) {
      this.#sortComponent = new TripSortView(this.#sortItems);
      this.#sortComponent.setSortModeChangeHandler(this.#handlerSortChange);
    }

    render(this.#sortComponent, this.#tripEventsContainer);
  };

  #handlerSortChange = (sortMode) => {
    sorts[sortMode](this.#listItems);
    this.#clearList();
    this.#renderApp();
  };

  #renderInfo = () => {
    if (this.#infoComponent === null) {
      this.#infoComponent = new TripInfoView();
    }
    render(this.#infoComponent, this.#tripMainContainer);
  };

  #renderFilter = () => {
    render(this.#filterComponent, this.#tripFilterContainer);
  };

  #renderList = () => {
    if (this.#listComponent === null) {
      this.#listComponent = new TripEventsListView();
    }
    render(this.#listComponent, this.#tripEventsContainer);

    for (const current of this.#listItems) {
      this.#renderItem(current);
    }
  };

  #renderListEmpty = () => {
    if (this.#listEmptyComponent === null) {
      this.#listEmptyComponent = new TripEventsListEmpty();
    }
    render(this.#listEmptyComponent, this.#tripEventsContainer);
  };

  #clearList = () => {
    this.#itemsPresenters.forEach((presenter) => presenter.destroy());
    this.#itemsPresenters.clear();
  };

  #renderApp = () => {
    if (this.#listItems.length === 0) {
      this.#renderListEmpty();
    }
    else {
      this.#renderInfo();
      this.#renderFilter();
      this.#renderSort();

      this.#renderList();
    }
  };
}
