export default class DOMHelper {
  startPage = document.querySelector('.home');
  userContainer = document.querySelector('.home__user');

  constructor() {
    this.startPage.addEventListener('click', this.dropdownHandler);
  }

  dropdownHandler = (e) => {
    if (e.target.closest('.home__user')) {
      this.userContainer.classList.toggle('open');
    } else {
      this.userContainer.classList.remove('open');
    }
  }
}