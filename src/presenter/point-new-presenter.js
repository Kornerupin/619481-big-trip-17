import TripEventsItemEditView from '../view/trip-events-item-edit-view';
import {render, replace, remove, RenderPosition} from '../framework/render';
import {BlankPoint, UpdateType, UserAction} from '../const';

export default class PointNewPresenter {
  #boardContainer = null;

  #pointsModel = null;

  #itemComponent = null;
  #itemEditComponent = null;

  #point = null;

  #changeData = null;
  #changeMode = null;

  constructor(boardContainer, changeData, changeMode) {
    this.#boardContainer = boardContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (point = BlankPoint) => {
    this.#point = point;

    const oldItemEditComponent = this.#itemEditComponent;

    this.#itemEditComponent = new TripEventsItemEditView(this.#point);

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
    remove(this.#itemComponent);
    remove(this.#itemEditComponent);
  };
}
