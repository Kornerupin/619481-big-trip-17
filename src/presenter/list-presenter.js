import {render} from '../render';
import TripSortView from '../view/trip-sort-view';
import TripEventsListView from '../view/trip-events-list-view';
import TripEventsItemView from '../view/trip-events-item-view';
import TripEventsItemEditView from '../view/trip-events-item-edit-view';
import TripEventsListEmpty from '../view/trip-events-list-empty';


export default class ListPresenter {
  #tripContainer = null;
  #pointsModel = null;

  #sortComponent = new TripSortView();
  #listComponent = new TripEventsListView();

  #itemsList = [];
  #listItems = [];

  constructor(tripContainer, pointsModel) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
  }

  init = () => {
    this.#listItems = [...this.#pointsModel.points];

    this.#renderApp();
  };

  #renderApp = () => {
    if (this.#listItems.length === 0) {
      render(new TripEventsListEmpty(), this.#tripContainer);
    }
    else {
      render(this.#sortComponent, this.#tripContainer);
      render(this.#listComponent, this.#tripContainer);
      for (const current of this.#listItems) {
        this.#renderItem(current);
      }
    }
  };

  #renderItem = (data) => {
    const item = new TripEventsItemView(data);
    const itemEdit = new TripEventsItemEditView(data);

    const replaceEditToItem = () => {
      this.#listComponent.element.replaceChild(item.element, itemEdit.element);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceEditToItem();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    const replaceItemToEdit = () => {
      this.#listComponent.element.replaceChild(itemEdit.element, item.element);
      document.addEventListener('keydown', onEscKeyDown);
    };

    item.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceItemToEdit();
    });

    itemEdit.element.querySelector('form').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceEditToItem();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    itemEdit.element.querySelector('.event__rollup-btn').addEventListener('click', (evt) => {
      evt.preventDefault();
      replaceEditToItem();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    this.#itemsList.push({
      item,
      itemEdit
    });

    render(item, this.#listComponent.element);
  };
}
