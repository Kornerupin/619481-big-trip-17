import TripEventsItemEditView from '../view/trip-events-item-edit-view';
import {render, replace, remove, RenderPosition} from '../framework/render';
import {BlankPoint, UpdateType, UserAction} from '../const';
import {getFormatDayJs} from '../utils';
import daysjs from 'dayjs';

export default class PointNewPresenter {
  #boardContainer = null;

  #itemEditComponent = null;

  #point = null;
  #pointsModel = null;

  #changeData = null;
  #changeMode = null;

  constructor(boardContainer, changeData, changeMode, pointsModel) {
    this.#boardContainer = boardContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#pointsModel = pointsModel;
  }

  init = (point = BlankPoint) => {
    point.dateFrom = getFormatDayJs(daysjs());
    point.dateTo = getFormatDayJs(daysjs());
    this.#point = point;

    const oldItemEditComponent = this.#itemEditComponent;

    this.#itemEditComponent = new TripEventsItemEditView(this.#point, this.#pointsModel);

    this.#itemEditComponent.setFormSubmitHandler(this.#handlerItemSubmit);
    this.#itemEditComponent.setCloseHandler(this.#handlerItemEditClose);
    this.#itemEditComponent.setClickHandler(this.#handlerItemEditClose);
    document.addEventListener('keydown', this.#onEscKeyDown);

    if (oldItemEditComponent === null) {
      render(this.#itemEditComponent, this.#boardContainer, RenderPosition.AFTERBEGIN);
      return false;
    }

    // При повторном обращении - перерисовываем компоненты.
    // За счёт проверки наличия в DOM, всегда заменяется только один компонент (существующий в списке)
    replace(this.#itemEditComponent, oldItemEditComponent);
    remove(oldItemEditComponent);
  };

  resetView = () => {
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.destroy();
  };

  setSaving = () => {
    this.#itemEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  };

  setAborting = () => {
    const resetFormState = () => {
      this.#itemEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#itemEditComponent.shake(resetFormState);
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.resetView();
    }
  };

  #handlerItemSubmit = (newData) => {
    this.#changeData(
      UpdateType.MINOR,
      UserAction.CREATE_POINT,
      {...this.#point, ...newData}
    );
  };

  #handlerItemEditClose = () => {
    this.resetView();
  };

  destroy = () => {
    remove(this.#itemEditComponent);
  };
}
