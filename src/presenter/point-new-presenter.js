import TripEventsItemEditView from '../view/trip-events-item-edit-view';
import {render, replace, remove, RenderPosition} from '../framework/render';
import {BLANK_POINT, UPDATE_TYPE, USER_ACTION} from '../const';
import {getFormatDayJs} from '../utils';
import dayjs from 'dayjs';

export default class PointNewPresenter {
  #boardContainer = null;

  #itemEditComponent = null;

  #point = null;
  #pointsModel = null;

  #closeMode = null;
  #changeData = null;
  #changeMode = null;

  #newPointButtonComponent = null;

  constructor(boardContainer, changeData, changeMode, closeMode, pointsModel, newPointButtonComponent) {
    this.#boardContainer = boardContainer;
    this.#closeMode = closeMode;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#pointsModel = pointsModel;
    this.#newPointButtonComponent = newPointButtonComponent;
  }

  init = (point = BLANK_POINT) => {
    const timeZoneOffset = new Date().getTimezoneOffset() / 60;
    point.dateFrom = getFormatDayJs(dayjs().add(timeZoneOffset, 'hour'));
    point.dateTo = getFormatDayJs(dayjs().add(timeZoneOffset, 'hour'));
    this.#point = point;

    const oldItemEditComponent = this.#itemEditComponent;

    this.#itemEditComponent = new TripEventsItemEditView(this.#point, this.#pointsModel);

    this.#itemEditComponent.setFormSubmitHandler(this.#handlerItemSubmit);
    this.#itemEditComponent.setCanselHandler(this.#handlerItemEditClose);
    this.#itemEditComponent.setClickHandler(this.#handlerItemEditClose);
    document.addEventListener('keydown', this.#onEscKeyDown);
    document.addEventListener('click', this.#checkClickOutOfForm);

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
    document.removeEventListener('click', this.#checkClickOutOfForm);
    this.#closeMode();
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

  #checkClickOutOfForm = (evt) => {
    if (`${evt.target.classList}` !== `${this.#newPointButtonComponent.element.classList}` && !this.#boardContainer.contains(evt.target)) {
      this.resetView();
    }
  };

  #handlerItemSubmit = (newData) => {
    const pointsCount = this.#pointsModel.points.length;
    this.#changeData(
      UPDATE_TYPE.MINOR,
      USER_ACTION.CREATE_POINT,
      {...this.#point, ...newData}
    );
    const pointsCountNew = this.#pointsModel.points.length;
    if (pointsCount !== pointsCountNew) {
      this.#closeMode();
    }
  };

  #handlerItemEditClose = () => {
    this.resetView();
  };

  destroy = () => {
    remove(this.#itemEditComponent);
  };
}
