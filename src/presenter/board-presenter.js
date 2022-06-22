import {render, remove, RenderPosition} from '../framework/render';
import TripSortView from '../view/trip-sort-view';
import TripEventsListView from '../view/trip-events-list-view';
import TripInfoView from '../view/trip-info-view';
import PointPresenter from './point-presenter';
import {sorts} from '../utils';
import {sortData} from '../mock/sort';
import {FilterTypes, SortModes, UpdateType, UserAction} from '../const';
import TripEventsListEmptyView from '../view/trip-events-list-empty-view';
import TripNewPointButtonView from '../view/trip-new-point-button-view';
import PointNewPresenter from './point-new-presenter';
import LoadingView from '../view/loading-view';

export default class BoardPresenter {
  #tripEventsContainer = null;
  #tripMainContainer = null;

  #pointsModel = null;
  #filtersModel = null;

  #pointNewPresenter = null;
  #newPointButtonComponent = null;

  #infoComponent = null;
  #listComponent = null;
  #emptyListComponent = null;
  #sortComponent = null;
  #loadingComponent = new LoadingView();

  #sortItems = sortData;
  #currentSortType = null;
  #filterType = FilterTypes.EVERYTHING;
  #isLoading = true;

  #newPointButtonDisabled = false;

  #pointPresenter = new Map();

  constructor(tripEventsContainer, tripMainContainer, pointsModel, filtersModel) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#tripMainContainer = tripMainContainer;
    this.#pointsModel = pointsModel;
    this.#pointsModel.addObserver(this.#handleModelEvent);

    this.#filtersModel = filtersModel;
    this.#filtersModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filtersModel.filter;
    const points = this.#pointsModel.points;
    const filteredTasks = this.#filtersModel.filters[this.#filterType].filterFunc(points);

    switch(this.#currentSortType) {
      case SortModes.DAY:
        return sorts[SortModes.DAY](filteredTasks);
      case SortModes.EVENT:
        return sorts[SortModes.EVENT](filteredTasks);
      case SortModes.TIME:
        return sorts[SortModes.TIME](filteredTasks);
      case SortModes.OFFERS:
        return sorts[SortModes.OFFERS](filteredTasks);
      case SortModes.PRICE:
        return sorts[SortModes.PRICE](filteredTasks);
    }

    return filteredTasks;
  }

  init = () => {
    this.#renderBoard();
  };

  #handleViewAction = (updateType, actionType, updateData) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, updateData);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, updateData);
        break;
      case UserAction.CREATE_POINT:
        this.#pointsModel.createPoint(updateType, updateData);
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
        this.#clearBoard();
        this.#renderBoard();
        break;
      // Меняем всё
      case UpdateType.MAJOR:
        this.#clearBoard();
        this.#renderBoard(true);
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
    if (this.#pointNewPresenter) {
      this.#pointNewPresenter.resetView();
    }
  };

  #renderLoading = () => {
    if (this.#loadingComponent === null) {
      this.#loadingComponent = new LoadingView();
    }
    render(this.#loadingComponent, this.#tripEventsContainer, RenderPosition.AFTERBEGIN)
  };

  #renderItem = (point) => {
    const pointPresenter = new PointPresenter(this.#listComponent.element, this.#handleViewAction, this.#handleModeChange, this.#pointsModel);
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
    this.#renderList();
  };

  #renderInfo = () => {
    if (this.#infoComponent === null) {
      this.#infoComponent = new TripInfoView(this.points);
    }
    render(this.#infoComponent, this.#tripMainContainer);
  };

  #renderList = () => {
    if (this.#listComponent === null) {
      this.#listComponent = new TripEventsListView();
    }
    render(this.#listComponent, this.#tripEventsContainer);
  };

  #clearList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };

  #renderEmptyList = () => {
    if (this.#emptyListComponent === null) {
      this.#emptyListComponent = new TripEventsListEmptyView(this.#filterType);
    }

    render(this.#emptyListComponent, this.#listComponent.element);
  };

  #clearBoard = () => {
    this.#clearList();

    remove(this.#listComponent);
    remove(this.#infoComponent);
    remove(this.#sortComponent);
    remove(this.#newPointButtonComponent);

    if (this.#emptyListComponent) {
      remove(this.#emptyListComponent);
    }
  };

  #renderBoard = (setSortTypeByDefault = false) => {
    if (setSortTypeByDefault) {
      this.#currentSortType = null;
    }

    if (this.#isLoading) {
      this.#renderLoading();
      return true;
    }

    if (this.points.length > 0) {
      this.#renderSort();
      this.#renderList();
      this.#pointNewPresenter = new PointNewPresenter(this.#listComponent.element, this.#handleViewAction, this.#handleModeChange);
      this.#renderAddItem();
      this.#renderInfo();

      for (const current of this.points) {
        this.#renderItem(current);
      }
    }
    else {
      this.#renderList();
      this.#renderAddItem();
      this.#renderEmptyList();
    }
  };

  createTask = () => {
    this.#filtersModel.setFilter(UpdateType.MAJOR, FilterTypes.EVERYTHING);
    this.#handlerSortChange(SortModes.DAY);
    this.#pointNewPresenter.init();
  };

  #renderAddItem = () => {
    if (this.#newPointButtonComponent === null) {
      this.#newPointButtonComponent = new TripNewPointButtonView(this.#newPointButtonDisabled);
    }
    render(this.#newPointButtonComponent, this.#tripMainContainer);
    this.#newPointButtonComponent.setClickHandler(this.#handleNewPointButtonClick);
  };

  #handleNewPointButtonClick = () => {
    this.#newPointButtonComponent.element.disabled = true;
    this.#newPointButtonDisabled = true;
    this.createTask();
  };

  #handleNewPointFormClose = () => {
    this.#newPointButtonComponent.element.disabled = false;
  };
}
