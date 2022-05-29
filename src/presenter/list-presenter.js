import {render, replace} from '../framework/render';
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
    const itemComponent = new TripEventsItemView(data);
    const itemEditComponent = new TripEventsItemEditView(data);

    const replaceEditToItem = () => {
      replace(itemComponent, itemEditComponent);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceEditToItem();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    const replaceItemToEdit = () => {
      replace(itemEditComponent, itemComponent);
    };

    itemComponent.setClickHandler(() => {
      replaceItemToEdit();
      document.addEventListener('keydown', onEscKeyDown);
    });

    itemEditComponent.setSubmitHandler(() => {
      replaceEditToItem();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    itemEditComponent.setClickHandler(() => {
      replaceEditToItem();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    this.#itemsList.push({
      itemComponent,
      itemEditComponent
    });

    render(itemComponent, this.#listComponent.element);
  };
}
