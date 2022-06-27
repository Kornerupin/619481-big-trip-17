import {render, remove, RenderPosition} from '../framework/render';
import TripSortView from '../view/trip-sort-view';
import TripEventsListView from '../view/trip-events-list-view';
import TripInfoView from '../view/trip-info-view';
import PointPresenter from './point-presenter';
import {sorts} from '../utils';
import {FILTER_TYPES, SORT_DATA, SORT_MODES, UPDATE_TYPE, USER_ACTION} from '../const';
import TripEventsListEmptyView from '../view/trip-events-list-empty-view';
import TripNewPointButtonView from '../view/trip-new-point-button-view';
import PointNewPresenter from './point-new-presenter';
import LoadingView from '../view/loading-view';
import UiBlocker from '../framework/ui-blocker/ui-blocker';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class BoardPresenter {
  #tripEventsContainer = null;
  #tripMainContainer = null;

  #pointsModel = null;
  #filtersModel = null;

  #pointNewPresenter = null;
  #newPointButtonComponent = null;
  #newPointButtonDisabled = false;

  #infoComponent = null;
  #listComponent = null;
  #emptyListComponent = null;
  #sortComponent = null;
  #loadingComponent = new LoadingView();

  #sortItems = SORT_DATA;
  #currentSortType = null;
  #filterType = FILTER_TYPES.EVERYTHING;
  #isLoading = true;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

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
      case SORT_MODES.DAY:
        return sorts[SORT_MODES.DAY](filteredTasks);
      case SORT_MODES.EVENT:
        return sorts[SORT_MODES.EVENT](filteredTasks);
      case SORT_MODES.TIME:
        return sorts[SORT_MODES.TIME](filteredTasks);
      case SORT_MODES.OFFERS:
        return sorts[SORT_MODES.OFFERS](filteredTasks);
      case SORT_MODES.PRICE:
        return sorts[SORT_MODES.PRICE](filteredTasks);
    }

    return filteredTasks;
  }

  init = () => {
    this.#renderBoard();
  };

  #handleViewAction = async (updateType, actionType, updateData) => {
    this.#uiBlocker.block();

    const test = this.#pointPresenter.get(updateData.id);

    switch (actionType) {
      case USER_ACTION.UPDATE_POINT:
        this.#pointPresenter.get(updateData.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, updateData);
        } catch(err) {
          this.#pointPresenter.get(updateData.id).setAborting();
        }
        break;
      case USER_ACTION.DELETE_POINT:
        test.setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, updateData);
        } catch(err) {
          test.setAborting();
        }
        break;
      case USER_ACTION.CREATE_POINT:
        this.#pointNewPresenter.setSaving();
        try {
          await this.#pointsModel.createPoint(updateType, updateData);
        } catch(err) {
          this.#pointNewPresenter.setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      // Меняем точку
      case UPDATE_TYPE.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      // Меняем список
      case UPDATE_TYPE.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      // Меняем всё
      case UPDATE_TYPE.MAJOR:
        this.#clearBoard();
        this.#renderBoard(true);
        break;
      case UPDATE_TYPE.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  #handleModeChange = () => {
    this.#clearListItems();
  };

  #renderLoading = () => {
    if (this.#loadingComponent === null) {
      this.#loadingComponent = new LoadingView();
    }
    render(this.#loadingComponent, this.#tripEventsContainer, RenderPosition.AFTERBEGIN);
  };

  #renderItem = (point) => {
    const pointPresenter = new PointPresenter(this.#listComponent.element, this.#handleViewAction, this.#handleModeChange, this.#pointsModel);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderSort = () => {
    if (this.#sortComponent === null) {
      this.#sortComponent = new TripSortView(this.#sortItems, this.#currentSortType);
      this.#sortComponent.setSortModeChangeHandler(this.#handlerSortChange);
    }

    render(this.#sortComponent, this.#tripEventsContainer);
  };

  #clearSort = () => {
    if (this.#sortComponent) {
      remove(this.#sortComponent);
      this.#sortComponent.removeElement();
      this.#sortComponent = null;
    }
  };

  #handlerSortChange = (sortMode) => {
    if (sortMode === this.#currentSortType) {
      return;
    }

    this.#currentSortType = sortMode;
    this.#clearListContainer();
    this.#renderListContainer();
    this.#renderListItems();
  };

  #renderInfo = () => {
    if (this.#infoComponent === null) {
      this.#infoComponent = new TripInfoView(this.points, this.#pointsModel);
    }
    render(this.#infoComponent, this.#tripMainContainer);
  };

  #clearInfo = () => {
    if (this.#infoComponent) {
      remove(this.#infoComponent);
      this.#infoComponent.removeElement();
      this.#infoComponent = null;
    }
  };

  #renderListContainer = () => {
    if (this.#listComponent === null) {
      this.#listComponent = new TripEventsListView();
    }
    render(this.#listComponent, this.#tripEventsContainer);
  };

  #renderListItems = () => {
    for (const current of this.points) {
      this.#renderItem(current);
    }
  };

  #clearListItems = () => {
    if (this.#pointPresenter) {
      this.#pointPresenter.forEach((presenter) => presenter.resetView());
    }
    if (this.#pointNewPresenter) {
      this.#pointNewPresenter.resetView();
    }
  };

  #clearListContainer = () => {
    if (this.#listComponent) {
      remove(this.#listComponent);
      this.#pointPresenter.forEach((presenter) => presenter.destroy());
      this.#pointPresenter.clear();
    }
  };

  #renderEmptyList = () => {
    if (this.#emptyListComponent === null) {
      this.#emptyListComponent = new TripEventsListEmptyView(this.#filterType);
    }

    render(this.#emptyListComponent, this.#listComponent.element);
  };

  #clearEmptyListComponent = () => {
    if (this.#emptyListComponent) {
      remove(this.#emptyListComponent);
      this.#emptyListComponent.removeElement();
      this.#emptyListComponent = null;
    }
  };

  #clearBoard = () => {
    this.#clearListContainer();
    this.#clearInfo();
    this.#clearSort();
    this.#clearAddItem();
    this.#clearEmptyListComponent();
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
      this.#renderListContainer();
      this.#renderAddItem();
      this.#renderInfo();
      this.#renderListItems();
      this.#handlerSortChange(this.#currentSortType);
    }
    else {
      this.#renderListContainer();
      this.#renderAddItem();
      this.#renderEmptyList();
    }
  };

  createTask = () => {
    this.#filtersModel.setFilter(UPDATE_TYPE.MAJOR, FILTER_TYPES.EVERYTHING);
    if (this.#pointsModel.points.length > 0) {
      this.#handlerSortChange(SORT_MODES.DAY);
    } else {
      this.#clearEmptyListComponent();
    }
    this.#pointNewPresenter = new PointNewPresenter(this.#listComponent.element, this.#handleViewAction, this.#handleModeChange, this.#handleNewPointFormClose, this.#pointsModel, this.#newPointButtonComponent);
    this.#pointNewPresenter.init();
  };

  #renderAddItem = () => {
    if (this.#newPointButtonComponent === null) {
      this.#newPointButtonComponent = new TripNewPointButtonView(this.#newPointButtonDisabled);
    }
    render(this.#newPointButtonComponent, this.#tripMainContainer);
    this.#newPointButtonComponent.setClickHandler(this.#handleNewPointButtonClick);
  };

  #clearAddItem = () => {
    if (this.#newPointButtonComponent) {
      remove(this.#newPointButtonComponent);
      this.#newPointButtonComponent.removeElement();
      this.#newPointButtonComponent = null;
    }
  };

  #clearPointNewPresenter = () => {
    if (this.#pointNewPresenter) {
      this.#pointNewPresenter = null;
    }
  };

  #handleNewPointButtonClick = () => {
    this.#newPointButtonComponent.element.disabled = true;
    this.#newPointButtonDisabled = true;
    this.createTask();
  };

  #handleNewPointFormClose = () => {
    this.#newPointButtonDisabled = false;
    this.#newPointButtonComponent.element.disabled = false;

    if (this.#pointsModel.points.length === 0) {
      this.#renderEmptyList();
    }
  };
}
