import TripEventsItemView from '../view/trip-events-item-view';
import TripEventsItemEditView from '../view/trip-events-item-edit-view';
import {render, replace} from '../framework/render';

export default class PointPresenter {
  #listContainer = null;

  #itemComponent = null;
  #itemEditComponent = null;

  #point = null;

  constructor(listContainer) {
    this.#listContainer = listContainer;
  }

  init = (point) => {
    this.#point = point;

    const oldItemComponent = this.#itemComponent;
    const oldItemEditComponent = this.#itemEditComponent;

    this.#itemComponent = new TripEventsItemView(this.#point);
    this.#itemEditComponent = new TripEventsItemEditView(this.#point);

    this.#itemComponent.setClickHandler(this.#handlerItemClick);
    this.#itemEditComponent.setSubmitHandler(this.#handlerItemSubmit);
    this.#itemEditComponent.setClickHandler(this.#handlerItemEditClick);

    if (oldItemComponent === null || oldItemEditComponent === null) {
      render(this.#itemComponent, this.#listContainer);
      return false;
    }
  };

  #replaceEditToItem = () => {
    replace(this.#itemComponent, this.#itemEditComponent);
    document.removeEventListener('keydown', this.#onEscKeyDown);
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceEditToItem();
    }
  };

  #replaceItemToEdit = () => {
    replace(this.#itemEditComponent, this.#itemComponent);
    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  #handlerItemClick = () => {
    this.#replaceItemToEdit();
  };

  #handlerItemSubmit = () => {
    this.#replaceEditToItem();
  };

  #handlerItemEditClick = () => {
    this.#replaceEditToItem();
  };
}
