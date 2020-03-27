import ModalManager from './modal-manager';

const modalManager = new ModalManager();

export default class Register {
  constructor() {
    this.form = document.querySelector('.form-register');
    this.formInputs = this.form.querySelectorAll('.form__input-field');
    this.submitBtn = this.form.querySelector('.form__input-submit');

    this.patterns = {
      username: /^[a-z\d]{1,20}$/i,
      email: /^([a-z\d]{1})([a-z\d-\._]*)?@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/i,
      password: /^.{6,64}$/i,
    };

    this.inputValidationState = {
      username: false,
      email: false,
      password: false,
    };

    this.formInputs.forEach((input) => input.addEventListener('keyup', () => {
      this.validateFormInput(input, this.patterns[input.attributes.name.value]);
    }));
    this.form.addEventListener('submit', this.formSubmitHandler);
  }

  validateFormInput(field, regex) {
    if (!regex.test(field.value)) {
      field.classList.add('invalid');
      this.inputValidationState[field.attributes.name.value] = false;
      this.submitBtn.disabled = true;
      this.submitBtn.classList.add('disabled');
    } else {
      field.classList.remove('invalid');
      this.inputValidationState[field.attributes.name.value] = true;
      if (Object.values(this.inputValidationState).every((state) => state)) {
        this.submitBtn.disabled = false;
        this.submitBtn.classList.remove('disabled');
      }
    }
  }

  formSubmitHandler(e) {
    e.preventDefault();
  }
}
