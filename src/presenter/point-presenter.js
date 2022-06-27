import TripEventsItemView from '../view/trip-events-item-view';
import TripEventsItemEditView from '../view/trip-events-item-edit-view';
import {render, replace, remove} from '../framework/render';
import {BLANK_POINT, POINT_MODES, UPDATE_TYPE, USER_ACTION} from '../const';

export default class PointPresenter {
  #boardContainer = null;

  #itemComponent = null;
  #itemEditComponent = null;

  #point = null;
  #pointsModel = null;

  #changeData = null;
  #changeMode = null;

  #mode = POINT_MODES.DEFAULT;

  constructor(boardContainer, changeData, changeMode, pointsModel) {
    this.#boardContainer = boardContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#pointsModel = pointsModel;
  }

  init = (point = BLANK_POINT) => {
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
    if (this.#mode === POINT_MODES.DEFAULT) {
      replace(this.#itemComponent, oldItemComponent);
    }

    if (this.#mode === POINT_MODES.EDIT) {
      replace(this.#itemEditComponent, oldItemEditComponent);
    }

    remove(oldItemComponent);
    remove(oldItemEditComponent);
  };

  setSaving = () => {
    if (this.#mode === POINT_MODES.EDIT) {
      this.#itemEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  };

  setDeleting = () => {
    if (this.#mode === POINT_MODES.EDIT) {
      this.#itemEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  };

  setAborting = () => {
    if (this.#mode === POINT_MODES.DEFAULT) {
      this.#itemComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#itemEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#itemEditComponent.shake(resetFormState);
  };

  resetView = () => {
    if (this.#mode === POINT_MODES.EDIT) {
      this.#itemEditComponent.reset(this.#point);
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
      this.resetView();
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

  #handlerItemSubmit = (newData) => {
    this.#changeData(
      UPDATE_TYPE.MINOR,
      USER_ACTION.UPDATE_POINT,
      {...this.#point, ...newData}
    );
  };

  #handlerItemDelete = () => {
    this.#changeData(
      UPDATE_TYPE.MINOR,
      USER_ACTION.DELETE_POINT,
      {...this.#point}
    );
  };

  #handlerItemEditClick = () => {
    this.resetView();
  };

  #handlerToggleFavorite = () => {
    this.#changeData(
      UPDATE_TYPE.PATCH,
      USER_ACTION.UPDATE_POINT,
      {...this.#point, isFavorite: !this.#point.isFavorite}
    );
  };

  destroy = () => {
    remove(this.#itemComponent);
    remove(this.#itemEditComponent);
  };
}
