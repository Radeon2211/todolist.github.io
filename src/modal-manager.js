export default class ModalManager {
  constructor() {
    this.dropdown = document.querySelector('.dropdown');
    this.modal = document.querySelector('.modal');
    this.closeBtn = document.querySelector('.modal__close');
    this.showedForm = null;
    this.switchFormLinks = document.querySelectorAll('.form__switch-form');
    this.openModalLinks = document.querySelectorAll('.open-modal-link');

    this.switchFormLinks.forEach((link) => link.addEventListener('click', this.switchForm.bind(this, link)));
    this.openModalLinks.forEach((link) => link.addEventListener('click', this.openModal.bind(this, link)));
    this.closeBtn.addEventListener('click', this.closeModal.bind(this));
    this.dropdown.addEventListener('click', this.closeModal.bind(this));
  }

  openModal(link) {
    this.showedForm = document.querySelector(`.${link.dataset.target}`);
    this.showedForm.classList.add('show');
    this.dropdown.style.transitionDelay = '0s';
    this.modal.style.transitionDelay = '.2s';
    this.dropdown.classList.add('open');
  }

  closeModal(e) {
    e.stopPropagation();
    if (!e.target.classList.contains('dropdown') && !e.target.closest('.modal__close')) return;
    this.dropdown.style.transitionDelay = '.2s';
    this.modal.style.transitionDelay = '0s';
    this.dropdown.classList.remove('open');
    if (this.showedForm) this.showedForm.classList.remove('show');
  }

  switchForm(link) {
    this.showedForm.classList.remove('show');
    this.showedForm.classList.add('hide');
    this.showedForm.addEventListener('animationend', function resetFormPosition() { this.classList.remove('hide'); });
    this.showedForm = document.querySelector(`.${link.dataset.target}`);
    this.showedForm.classList.add('show');
  }
}
