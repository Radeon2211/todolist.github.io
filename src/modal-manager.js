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
    this.dropdown.addEventListener('mousedown', (e) => this.startingTriggerElement = e.target);
    this.dropdown.addEventListener('mouseup', this.tryToCloseModal.bind(this));
  }

  openModal(link) {
    this.showedForm = document.querySelector(`.${link.dataset.formTarget}`);
    this.showedForm.classList.add('show');
    this.showedForm.querySelector('.form__input-field').focus();
    this.dropdown.style.transitionDelay = '0s';
    this.modal.style.transitionDelay = '.2s';
    this.dropdown.classList.add('open');
  }

  tryToCloseModal(e) {
    e.stopPropagation();
    if (e.target === this.startingTriggerElement && (e.target.classList.contains('dropdown') || e.target.closest('.modal__close'))) {
      this.closeModal();
    }
  }

  closeModal() {
    this.dropdown.style.transitionDelay = '.2s';
    this.modal.style.transitionDelay = '0s';
    this.dropdown.classList.remove('open');
    if (this.showedForm) this.showedForm.classList.remove('show');
  }

  switchForm(link) {
    this.showedForm.classList.remove('show');
    this.showedForm.classList.add('hide');
    this.showedForm.addEventListener('animationend', function resetFormPosition() { this.classList.remove('hide'); });
    this.showedForm = document.querySelector(`.${link.dataset.formTarget}`);
    this.showedForm.classList.add('show');
  }
}
