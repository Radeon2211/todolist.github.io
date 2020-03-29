import ModalManager from './modal-manager';
import Utilities from './utilities';

const modalManager = new ModalManager();

const patterns = {
  username: /^[a-z\d]{1,20}$/i,
  email: /^([a-z\d]{1})([a-z\d-\._]*)?@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/i,
  password: /^.{6,64}$/i,
};

export default class Register {
  form = document.querySelector('.form-register');
  formInputs = this.form.querySelectorAll('.form__input-field');
  submitBtn = this.form.querySelector('.form__input-submit');
  inputValidationState = {
    username: false,
    email: false,
    password: false,
  };

  constructor() {
    this.formInputs.forEach((input) => input.addEventListener('keyup', () => {
      this.validateFormInput(input, patterns[input.attributes.name.value]);
    }));
    this.form.addEventListener('submit', this.formSubmitHandler);
  }

  validateFormInput(field, regex) {
    if (!regex.test(field.value.trim())) {
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

  async createUser(email, password, username) {
    const setDisplayName = firebase.functions().httpsCallable('setDisplayName');
    const { user } = await auth.createUserWithEmailAndPassword(email, password);
    await setDisplayName({ username, uid: user.uid });
  }

  formSubmitHandler = (e) => {
    e.preventDefault();
    const username = this.form.username.value.trim();
    const email = this.form.email.value.trim();
    const password = this.form.password.value.trim();

    if (!patterns.username.test(username)
    || !patterns.email.test(email)
    || !patterns.password.test(password)) {
      Utilities.renderNotification({ message: 'You entered incorrect credentials. Please try again' }, 'danger');
      return;
    }
    const safeCreateUser = Utilities.handleError(this.createUser.bind(null, email, password, username), true);
    safeCreateUser();
  }
}

export class RestAuth {
  loginForm = document.querySelector('.form-login');
  changeUsernameForm = document.querySelector('.form-change-username');
  changeUsernameInput = this.changeUsernameForm.querySelector('.form__input-field');
  changeUsernameSubmitBtn = this.changeUsernameForm.querySelector('.form__input-submit');
  logoutLink = document.querySelector('.log-out-link');

  constructor() {
    this.loginForm.addEventListener('submit', this.logIn);
    this.changeUsernameForm.addEventListener('submit', this.changeUsername);
    this.changeUsernameInput.addEventListener('keyup', this.validateChangeUsernameInput);
    this.logoutLink.addEventListener('click', this.signOut);
  }

  logIn(e) {
    e.preventDefault();
    const logInAction = async () => {
      await auth.signInWithEmailAndPassword(this.email.value.trim(), this.password.value.trim());
    }
    const safeLogInAction = Utilities.handleError(logInAction, true);
    safeLogInAction();
  }

  changeUsername(e) {
    e.preventDefault();
    const newUsername = this.username.value.trim();
    if (!patterns.username.test(newUsername)) {
      Utilities.renderNotification({ message: 'Username is invalid. Please try something different' }, 'danger');
    }
    const changeUsernameAction = async () => {
      const setDisplayName = firebase.functions().httpsCallable('setDisplayName');
      await setDisplayName({ username: newUsername, uid: auth.currentUser.uid });
    }
    const safeChangeUsernameAction = Utilities.handleError(changeUsernameAction, true);
    safeChangeUsernameAction();
  }

  validateChangeUsernameInput = () => {
    if (!patterns.username.test(this.changeUsernameInput.value.trim())) {
      this.changeUsernameInput.classList.add('invalid');
      this.changeUsernameSubmitBtn.disabled = true;
      this.changeUsernameSubmitBtn.classList.add('disabled');
    } else {
      this.changeUsernameInput.classList.remove('invalid');
      this.changeUsernameSubmitBtn.disabled = false;
      this.changeUsernameSubmitBtn.classList.remove('disabled');
    }
  }

  signOut() {
    const signOutAction = async () => {
      await auth.signOut();
    }
    const safeSignOutAction = Utilities.handleError(signOutAction, true);
    safeSignOutAction();
  }
}