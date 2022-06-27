import AbstractView from '../framework/view/abstract-view';

const createSortItemTemplate = (item) => {
  const name = item.name;
  const nameLower = item.name.toLowerCase();
  const id = `sort-${nameLower}`;
  const value = `sort-${nameLower}`;
  const checkedText = item.isChecked ? 'checked' : '';
  const disabledText = item.isDisabled ? 'disabled' : '';

  return `
    <div class="trip-sort__item  trip-sort__item--${nameLower}">
      <input id="${id}" data-sort-mode="${name}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${value}" ${checkedText} ${disabledText}>
      <label class="trip-sort__btn" for="${id}">${name}</label>
    </div>
  `;
};

const createSortTemplate = (sortItems, currentSort) => {
  // Проверяем, что хоть один фильтр задан как активный
  const checkedIndex = sortItems.findIndex((current) => current.name === currentSort);
  if (checkedIndex === -1) {
    sortItems[0].isChecked = true;
  } else {
    sortItems[checkedIndex].isChecked = true;
  }

  const items = sortItems.map((current) => createSortItemTemplate(current)).join('');

  return `
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${items}
    </form>
  `;
};

export default class TripSortView extends AbstractView {
  #sortsData = null;
  #currentSort = null;

  constructor(sortsData, currentSort) {
    super();
    this.#sortsData = sortsData;
    this.#currentSort = currentSort;
  }

  get template() {
    return createSortTemplate(this.#sortsData, this.#currentSort);
  }

  setSortModeChangeHandler = (callback) => {
    this._callback.inputClick = callback;
    this.element.addEventListener('change', this.#sortModeChangeHandler);
  };

  #sortModeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.inputClick(evt.target.dataset.sortMode);
  };
}
