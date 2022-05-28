import {render} from '../render';
import TripSortView from '../view/trip-sort-view';
import TripEventsListView from '../view/trip-events-list-view';
import TripEventsItemView from '../view/trip-events-item-view';
import TripEventsItemEditView from '../view/trip-events-item-edit-view';


export default class ListPresenter {
  #tripContainer = null;
  #pointsModel = null;

  #sortComponent = new TripSortView();
  #listComponent = new TripEventsListView();

  #itemsList = [];
  #listItems = [];

  init = (tripContainer, pointsModel) => {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;

    this.#listItems = [...this.#pointsModel.points];

    render(this.#sortComponent, this.#tripContainer);
    render(this.#listComponent, this.#tripContainer);

    // Редактирование без исходных данных = добавление
    render(new TripEventsItemEditView(), this.#listComponent.element);
    // Редактирование с исходными данными
    render(new TripEventsItemEditView(this.#listItems[0]), this.#listComponent.element);

    for (let i = 1; i < this.#listItems.length; i++) {
      const item = new TripEventsItemView(this.#listItems[i]);
      this.#itemsList.push(item);

      render(item, this.#listComponent.element);
    }
  };
}
