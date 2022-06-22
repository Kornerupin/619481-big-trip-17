import TripEventsItemView from '../view/trip-events-item-view';
import TripEventsItemEditView from '../view/trip-events-item-edit-view';
import {render, replace, remove} from '../framework/render';
import {BlankPoint, PointModes, UpdateType, UserAction} from '../const';

export default class PointPresenter {
  #boardContainer = null;

  #itemComponent = null;
  #itemEditComponent = null;

  #point = null;
  #pointsModel = null;

  #changeData = null;
  #changeMode = null;

  #mode = PointModes.DEFAULT;

  constructor(boardContainer, changeData, changeMode, pointsModel) {
    this.#boardContainer = boardContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#pointsModel = pointsModel;
  }

  init = (point = BlankPoint) => {
    this.#point = point;

    const oldItemComponent = this.#itemComponent;
    const oldItemEditComponent = this.#itemEditComponent;

    this.#itemComponent = new TripEventsItemView(this.#point, this.#pointsModel);
    this.#itemEditComponent = new TripEventsItemEditView(this.#point, this.#pointsModel);

    this.#itemComponent.setClickHandler(this.#handlerItemClick);
    this.#itemComponent.setToggleFavoriteHandler(this.#handlerToggleFavorite);
    this.#itemEditComponent.setFormSubmitHandler(this.#handlerItemSubmit);
    this.#itemEditComponent.setClickHandler(this.#handlerItemEditClick);
    this.#itemEditComponent.setDeleteHandler(this.#handlerItemDelete);

    if (oldItemComponent === null || oldItemEditComponent === null) {
      render(this.#itemComponent, this.#boardContainer);
      return false;
    }

    // При повторном обращении - перерисовываем компоненты.
    // За счёт проверки наличия в DOM, всегда заменяется только один компонент (существующий в списке)
    if (this.#mode === PointModes.DEFAULT) {
      replace(this.#itemComponent, oldItemComponent);
    }

    if (this.#mode === PointModes.EDIT) {
      replace(this.#itemEditComponent, oldItemEditComponent);
    }

    remove(oldItemComponent);
    remove(oldItemEditComponent);
  };

  resetView = () => {
    if (this.#mode === PointModes.EDIT) {
      this.#itemEditComponent.reset(this.#point);
      this.#replaceEditToItem();
    }
  };

  #replaceEditToItem = () => {
    replace(this.#itemComponent, this.#itemEditComponent);
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#mode = PointModes.DEFAULT;
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.resetView();
    }
  };

  #replaceItemToEdit = () => {
    this.#changeMode();
    replace(this.#itemEditComponent, this.#itemComponent);
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#mode = PointModes.EDIT;
  };

  #handlerItemClick = () => {
    this.#replaceItemToEdit();
  };

  #handlerItemSubmit = (newData) => {
    this.#changeData(
      UpdateType.MINOR,
      UserAction.UPDATE_POINT,
      {...this.#point, ...newData}
    );
    this.#replaceEditToItem();
  };

  #handlerItemDelete = () => {
    this.#changeData(
      UpdateType.MINOR,
      UserAction.DELETE_POINT,
      {...this.#point}
    );
  };

  #handlerItemEditClick = () => {
    this.resetView();
  };

  #handlerToggleFavorite = () => {
    this.#changeData(
      UpdateType.PATCH,
      UserAction.UPDATE_POINT,
      {...this.#point, isFavorite: !this.#point.isFavorite}
    );
  };

  destroy = () => {
    remove(this.#itemComponent);
    remove(this.#itemEditComponent);
  };
}
