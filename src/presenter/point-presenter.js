import TripEventsItemView from '../view/trip-events-item-view';
import TripEventsItemEditView from '../view/trip-events-item-edit-view';
import {render, replace, remove} from '../framework/render';
import {POINT_MODES} from '../const';

export default class PointPresenter {
  #listContainer = null;

  #itemComponent = null;
  #itemEditComponent = null;

  #point = null;

  #changeData = null;
  #changeMode = null;

  #mode = POINT_MODES.DEFAULT;

  constructor(listContainer, changeData, changeMode) {
    this.#listContainer = listContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (point) => {
    this.#point = point;

    const oldItemComponent = this.#itemComponent;
    const oldItemEditComponent = this.#itemEditComponent;

    this.#itemComponent = new TripEventsItemView(this.#point);
    this.#itemEditComponent = new TripEventsItemEditView(this.#point);

    this.#itemComponent.setClickHandler(this.#handlerItemClick);
    this.#itemComponent.setToggleFavoriteHandler(this.#handlerToggleFavorite);
    this.#itemEditComponent.setSubmitHandler(this.#handlerItemSubmit);
    this.#itemEditComponent.setClickHandler(this.#handlerItemEditClick);

    if (oldItemComponent === null || oldItemEditComponent === null) {
      render(this.#itemComponent, this.#listContainer);
      return false;
    }

    // При повторном обращении - перерисовываем компоненты.
    // За счёт проверки наличия в DOM, всегда заменяется только один компонент (существующий в списке)
    if (this.#mode === POINT_MODES.DEFAULT) {
      replace(this.#itemComponent, oldItemComponent);
    }

    if (this.#mode === POINT_MODES.EDIT) {
      replace(this.#itemEditComponent, oldItemEditComponent);
    }

    remove(oldItemComponent);
    remove(oldItemEditComponent);
  };

  resetView = () => {
    if (this.#mode === POINT_MODES.EDIT) {
      this.#replaceEditToItem();
    }
  };

  #replaceEditToItem = () => {
    replace(this.#itemComponent, this.#itemEditComponent);
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#mode = POINT_MODES.DEFAULT;
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceEditToItem();
    }
  };

  #replaceItemToEdit = () => {
    this.#changeMode();
    replace(this.#itemEditComponent, this.#itemComponent);
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#mode = POINT_MODES.EDIT;
  };

  #handlerItemClick = () => {
    this.#replaceItemToEdit();
  };

  #handlerItemSubmit = () => {
    // this.#changeData(updateItem);
    this.#replaceEditToItem();
  };

  #handlerItemEditClick = () => {
    this.#replaceEditToItem();
  };

  #handlerToggleFavorite = () => {
    this.#changeData({...this.#point, isFavorite: !this.#point.isFavorite});
  };

  destroy = () => {
    this.#itemComponent = null;
    this.#itemEditComponent = null;
  };
}
