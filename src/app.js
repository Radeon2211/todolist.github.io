import Register, { RestAuth } from './auth';
import Utilities from './utilities';

const register = new Register();
const restAuth = new RestAuth();

const startPage = document.querySelector('.home');
const userContainer = document.querySelector('.home__user');
startPage.addEventListener('click', (e) => {
  if (e.target.closest('.home__user')) {
    userContainer.classList.toggle('open');
  } else {
    userContainer.classList.remove('open');
  }
});

auth.onAuthStateChanged((user) => {
  const startPage = document.querySelector('.start');
  const homePage = document.querySelector('.home');
  if (user) {
    document.body.classList.add('logged-in');
    startPage.classList.add('d-none');
    homePage.classList.remove('d-none');
    Utilities.updateUsername(user.displayName);
  } else {
    document.body.classList.remove('logged-in');
    startPage.classList.remove('d-none');
    homePage.classList.add('d-none');
  }
});
