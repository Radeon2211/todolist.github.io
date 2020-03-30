import Register, { RestAuth } from './auth';
import Utilities from './utilities';
import DOMHelper from './dom-helper';
import Todo from './todo';

const register = new Register();
const restAuth = new RestAuth();
const domHelper = new DOMHelper();

const addTodoBtns = document.querySelectorAll('.day__add-todo');
addTodoBtns.forEach((btn) => {
  const target = btn.dataset.todoTarget;
  const newTodoExpiresAt = Date.now() + (btn.dataset.todoTarget === 'tomorrow' ? 86400 : 0) / 1000;
  btn.addEventListener('click', () => new Todo('', false, newTodoExpiresAt));
});

const fetchTodos = (uid) => {
  const fetchTodosAction = async () => {
    const { docs: todos } = await db.collection('todos').where('owner', '==', uid).orderBy('expires_at', 'asc').get();
    todos.forEach((todo) => {
      const { content, done, expires_at: { seconds: expiresAt } } = todo.data();
      new Todo(content, done, expiresAt);
    });
  };
  const safeFetchTodosAction = Utilities.handleError(fetchTodosAction);
  safeFetchTodosAction();
};

auth.onAuthStateChanged((user) => {
  const startPage = document.querySelector('.start');
  const homePage = document.querySelector('.home');
  if (user) {
    fetchTodos(user.uid);
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
