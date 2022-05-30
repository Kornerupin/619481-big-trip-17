import {render} from '../framework/render';
import TripSortView from '../view/trip-sort-view';
import TripEventsListView from '../view/trip-events-list-view';
import TripEventsListEmpty from '../view/trip-events-list-empty';
import TripInfoView from '../view/trip-info-view';
import TripFiltersView from '../view/trip-filters-view';
import PointPresenter from './point-presenter';

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

  #listItems = [];

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

  #renderItem = (point) => {
    const pointPresenter = new PointPresenter(this.#listComponent.element);
    pointPresenter.init(point);
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#tripEventsContainer);
  };

  #renderInfo = () => {
    if (this.#sortComponent === null) {
      this.#sortComponent = new TripSortView();
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
