import Auth from './auth';

const auth = new Auth();

const startPage = document.querySelector('.home');
const userContainer = document.querySelector('.home__user');
startPage.addEventListener('click', (e) => {
  if (e.target.closest('.home__user')) {
    userContainer.classList.toggle('open');
  } else {
    userContainer.classList.remove('open');
  }
});
