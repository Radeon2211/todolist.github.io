import Register, { RestAuth } from './auth';
import Utilities from './utilities';
import DOMHelper from './dom-helper';
import { ExistingTodo, NewTodo } from './todo';

const register = new Register();
const restAuth = new RestAuth();
const domHelper = new DOMHelper();

const addTodoBtns = document.querySelectorAll('.day__add-todo');
addTodoBtns.forEach((btn) => {
  const renderHookName = btn.dataset.todoTarget;
  btn.addEventListener('click', () => new NewTodo(renderHookName, btn));
});

const fetchTodos = (uid) => {
  const fetchTodosAction = async () => {
    const { docs: todos } = await db.collection('todos').where('owner', '==', uid).orderBy('expires_at', 'asc').get();
    todos.forEach((todo) => {
      const { content, done, expires_at: { seconds: expiresAt } } = todo.data();
      new ExistingTodo(content, done, expiresAt, todo.id);
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
