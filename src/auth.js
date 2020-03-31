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

  async createUser(email, password, username, loader) {
    this.form.querySelector('.form__input-submit').append(loader);
    const setDisplayName = firebase.functions().httpsCallable('setDisplayName');
    const { user } = await auth.createUserWithEmailAndPassword(email, password);
    await setDisplayName({ username, uid: user.uid });
    loader.remove();
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
    const loader = Utilities.createLoader('small', '#fff', 'mg-left-sm');
    const safeCreateUser = Utilities.handleError(this.createUser.bind(this, email, password, username, loader), loader, true);
    safeCreateUser();
  }
}

export class RestAuth {
  loginForm = document.querySelector('.form-login');
  resetPasswordForm = document.querySelector('.form-reset-password');
  changeUsernameForm = document.querySelector('.form-change-username');
  changeUsernameInput = this.changeUsernameForm.querySelector('.form__input-field');
  changeUsernameSubmitBtn = this.changeUsernameForm.querySelector('.form__input-submit');
  changePasswordForm = document.querySelector('.form-change-password');
  changePasswordInput = this.changePasswordForm.querySelector('[name=newPassword]');
  changePasswordSubmitBtn = this.changePasswordForm.querySelector('.form__input-submit');
  deleteAccountForm = document.querySelector('.form-delete-account');
  logoutLink = document.querySelector('.log-out-link');

  constructor() {
    this.loginForm.addEventListener('submit', this.logIn);
    this.resetPasswordForm.addEventListener('submit', this.resetPassword);
    this.changeUsernameForm.addEventListener('submit', this.changeUsername);
    this.changeUsernameInput.addEventListener('keyup', this.validateChangeUsernameInput);
    this.changePasswordForm.addEventListener('submit', this.changePassword);
    this.changePasswordInput.addEventListener('keyup', this.validateChangePasswordInput);
    this.deleteAccountForm.addEventListener('submit', this.deleteAccount);
    this.logoutLink.addEventListener('click', this.signOut);
  }

  logIn(e) {
    e.preventDefault();
    const loader = Utilities.createLoader('small', '#fff', 'mg-left-sm');
    const logInAction = async () => {
      this.querySelector('.form__input-submit').append(loader);
      await auth.signInWithEmailAndPassword(this.email.value.trim(), this.password.value.trim());
      loader.remove();
    }
    const safeLogInAction = Utilities.handleError(logInAction, loader, true);
    safeLogInAction();
    this.password.value = '';
  }

  resetPassword(e) {
    e.preventDefault();
    const loader = Utilities.createLoader('small', '#fff', 'mg-left-sm');
    const resetPasswordAction = async () => {
      this.querySelector('.form__input-submit').append(loader);
      await auth.sendPasswordResetEmail(this.email.value.trim());
      Utilities.renderNotification({ message: 'Please, check out your email! :)' }, 'info', 6000);
      loader.remove();
    }
    const safeResetPasswordAction = Utilities.handleError(resetPasswordAction, loader);
    safeResetPasswordAction();
  }

  changeUsername(e) {
    e.preventDefault();
    const newUsername = this.username.value.trim();
    if (!patterns.username.test(newUsername)) {
      Utilities.renderNotification({ message: 'Username is invalid. Please try something different' }, 'danger');
      return;
    }
    if (newUsername === auth.currentUser.displayName) {
      Utilities.renderNotification({ message: 'You have this name already' }, 'warning');
      return;
    }

    const loader = Utilities.createLoader('small', '#fff', 'mg-left-sm');
    const changeUsernameAction = async () => {
      this.querySelector('.form__input-submit').append(loader);
      const setDisplayName = firebase.functions().httpsCallable('setDisplayName');
      await setDisplayName({ username: newUsername, uid: auth.currentUser.uid });
      loader.remove();
    }
    const safeChangeUsernameAction = Utilities.handleError(changeUsernameAction, loader, true);
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

  changePassword = (e) => {
    e.preventDefault();
    const email = this.changePasswordForm.email.value.trim();
    const password = this.changePasswordForm.password.value.trim();
    const newPassword = this.changePasswordForm.newPassword.value.trim();

    const loader = Utilities.createLoader('small', '#fff', 'mg-left-sm');
    const changePasswordAction = async () => {
      this.changePasswordForm.querySelector('.form__input-submit').append(loader);
      const user = auth.currentUser;
      await this.reauthenticateUser(email, password, user);
      await user.updatePassword(newPassword);
      Utilities.renderNotification({ message: 'Password has been changed successfully! :)' }, 'success', 4000);
      modalManager.closeModal();
      loader.remove();
    }
    const safeChangePasswordAction = Utilities.handleError(changePasswordAction, loader);
    safeChangePasswordAction();
    this.changePasswordForm.password.value = '';
    this.changePasswordForm.newPassword.value = '';
  }

  validateChangePasswordInput = () => {
    if (!patterns.password.test(this.changePasswordInput.value.trim())) {
      this.changePasswordInput.classList.add('invalid');
      this.changePasswordSubmitBtn.disabled = true;
      this.changePasswordSubmitBtn.classList.add('disabled');
    } else {
      this.changePasswordInput.classList.remove('invalid');
      this.changePasswordSubmitBtn.disabled = false;
      this.changePasswordSubmitBtn.classList.remove('disabled');
    }
  }

  deleteAccount = (e) => {
    e.preventDefault();
    const email = this.deleteAccountForm.email.value.trim();
    const password = this.deleteAccountForm.password.value.trim();

    const loader = Utilities.createLoader('small', '#fff', 'mg-left-sm');
    const deleteAccountAction = async () => {
      this.deleteAccountForm.querySelector('.form__input-submit').append(loader);
      const user = auth.currentUser;
      await this.reauthenticateUser(email, password, user);
      await user.delete();
      loader.remove();
    }
    const safeDeleteAccountAction = Utilities.handleError(deleteAccountAction, loader, true);
    safeDeleteAccountAction();
    this.deleteAccountForm.password.value = '';
  }

  signOut() {
    const signOutAction = async () => {
      await auth.signOut();
    }
    const safeSignOutAction = Utilities.handleError(signOutAction, null, true);
    safeSignOutAction();
  }

  reauthenticateUser(email, password, user) {
    const credential = firebase.auth.EmailAuthProvider.credential(email, password);
    return user.reauthenticateWithCredential(credential);
  }
}
