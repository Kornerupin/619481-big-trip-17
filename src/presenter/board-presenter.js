import {render, remove} from '../framework/render';
import TripSortView from '../view/trip-sort-view';
import TripEventsListView from '../view/trip-events-list-view';
import TripEventsListEmpty from '../view/trip-events-list-empty';
import TripInfoView from '../view/trip-info-view';
import TripFiltersView from '../view/trip-filters-view';
import PointPresenter from './point-presenter';
import {sorts} from '../utils';
import {sortData} from '../mock/sort';
import {SortModes, UpdateType, UserAction} from '../const';

export default class BoardPresenter {
  #tripEventsContainer = null;
  #tripMainContainer = null;
  #tripFilterContainer = null;

  #pointsModel = null;
  #pointPresenter = new Map();

  #infoComponent = null;
  #filterComponent = null;
  #sortComponent = null;
  #sortType = null;
  #currentSortType = null;
  #listComponent = null;
  #listEmptyComponent = null;

  #sortItems = sortData;
  #listItems = [];

  constructor(tripEventsContainer, tripMainContainer, tripFilterContainer, pointsModel) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#tripFilterContainer = tripFilterContainer;
    this.#tripMainContainer = tripMainContainer;
    this.#pointsModel = pointsModel;
    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    switch(this.#sortType) {
      case SortModes.DAY:
        return [this.#pointsModel.points].sort(sorts[SortModes.DAY]);
      case SortModes.EVENT:
        return [this.#pointsModel.points].sort(sorts[SortModes.EVENT]);
      case SortModes.TIME:
        return [this.#pointsModel.points].sort(sorts[SortModes.TIME]);
      case SortModes.OFFERS:
        return [this.#pointsModel.points].sort(sorts[SortModes.OFFERS]);
      case SortModes.PRICE:
        return [this.#pointsModel.points].sort(sorts[SortModes.PRICE]);
    }

    return this.#pointsModel.points;
  }

  init = () => {
    this.#renderBoard();
  };

  #handleViewAction = (actionType, updateData, updateType = UpdateType.PATCH) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateData, updateType);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateData, updateType);
        break;
      case UserAction.CREATE_POINT:
        this.#pointsModel.createPoint(updateData, updateType);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      // Меняем точку
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      // Меняем список
      case UpdateType.MINOR:
        this.#clearList();
        this.#renderList(true);
        break;
      // Меняем всё
      case UpdateType.MAJOR:
        this.#renderBoard();
        break;
    }
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderItem = (point) => {
    const pointPresenter = new PointPresenter(this.#listComponent.element, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderSort = () => {
    if (this.#sortComponent === null) {
      this.#sortComponent = new TripSortView(this.#sortItems);
      this.#sortComponent.setSortModeChangeHandler(this.#handlerSortChange);
    }

    render(this.#sortComponent, this.#tripEventsContainer);
  };

  #handlerSortChange = (sortMode) => {
    if (sortMode === this.#currentSortType) {
      return;
    }

    this.#currentSortType = sortMode;
    this.#clearList();
    this.#renderBoard();
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

  #renderList = (isRerender = false) => {
    if (isRerender) {
      this.#listItems = [...this.#pointsModel.points];
    }
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
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };

  #clearBoard = () => {
    this.#clearList();

    remove(this.#listEmptyComponent);
    remove(this.#listComponent);
    remove(this.#infoComponent);
    remove(this.#filterComponent);
    remove(this.#sortComponent);
  };

  #renderBoard = () => {
    this.#listItems = [...this.#pointsModel.points];
    this.#infoComponent = new TripInfoView(this.#listItems);
    this.#filterComponent = new TripFiltersView(this.#listItems);

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
