import Utilities from './utilities';

class Todo {
  template = document.importNode(document.getElementById('todo').content, true);
  todoEl = this.template.querySelector('.todo');
  switchIcon = this.todoEl.querySelector('.todo__switch-box');
  textarea = this.todoEl.querySelector('.todo__textarea');
  removeIcon = this.todoEl.querySelector('.todo__icon-remove');
  updateTimeout = null;

  constructor(content = '', done = false, expiresAt = null) {
    this.content = content;
    this.done = done;
    this.expiresAt = expiresAt;

    if (this.done) {
      this.todoEl.classList.add('done');
      this.textarea.disabled = true;
    }

    this.switchIcon.addEventListener('click', this.changeState.bind(this));
    this.textarea.addEventListener('keypress', this.textareaInputHandler.bind(this));
    this.textarea.addEventListener('focusout', this.textareaFocusOutHandler.bind(this));
    this.removeIcon.addEventListener('click', this.removeHandler.bind(this));

    this.textarea.value = content;
  }

  changeState() {
    this.done = !this.done;
    if (this.done) {
      this.todoEl.classList.add('done');
      this.textarea.disabled = true;
    } else {
      this.todoEl.classList.remove('done');
      this.textarea.disabled = false;
    }
    this.tryToUpdate();
  }

  textareaInputHandler(e) {
    if (e.charCode === 13) {
      e.preventDefault();
      this.textarea.blur();
    }
    if (this.done) {
      e.preventDefault();
      this.textarea.disabled = true;
    }
    this.textarea.style.height = `${this.textarea.scrollHeight}px`;
  }

  textareaFocusOutHelper() {
    const newContent = this.textarea.value.trim();
    if (newContent === this.content || newContent.length <= 0) {
      this.textarea.value = this.content;
    }
    else {
      this.content = newContent;
      this.tryToUpdate();
    }
  }

  textareaFocusOutHandler() {}

  getTime(todoTime, curTime) {
    const today = new Date(curTime * 1000);
    const todaySeconds = today.getSeconds() + today.getMinutes() * 60 + today.getHours() * 3600;
    const todaySecondsLeft = 86400 - todaySeconds;
    if (todoTime > curTime + todaySecondsLeft && todoTime <= curTime + todaySecondsLeft + 86400) return 'tomorrow';
    if (todoTime <= curTime + todaySecondsLeft && todoTime >= curTime - todaySeconds) return 'today';
    if (todoTime < curTime - todaySeconds && todoTime >= curTime - todaySeconds - 86400) return 'yesterday';
    else {
      this.deleteDB();
    }
  }

  tryToUpdate() {
    if (!this.createTimeout) {
      clearTimeout(this.updateTimeout);
      this.updateTimeout = setTimeout(this.update.bind(this), 2000);
    }
  }

  update() {
    if (this.deleted) return;
    const updateAction = async () => {
      await db.collection('todos').doc(this.id).update({
        content: this.content,
        done: this.done,
      });
    };
    const safeUpdateAction = Utilities.handleError(updateAction);
    safeUpdateAction();
  }

  removeHandler() {
    if (this.isVeryNew || this.createTimeout) {
      clearTimeout(this.createTimeout);
      this.deleteObject();
      return;
    }
    clearTimeout(this.updateTimeout);
    this.deleteDB();
  }

  deleteDB() {
    const deleteAction = async () => {
      await db.collection('todos').doc(this.id).delete();
      this.deleteObject();
    };
    const safeDeleteAction = Utilities.handleError(deleteAction);
    safeDeleteAction();
  }

  deleteObject() {
    this.todoEl.remove();
    delete this;
  }
}

export class ExistingTodo extends Todo {
  constructor(content, done, expiresAt, id) {
    super(content, done, expiresAt);
    this.id = id;
    const day = this.getTime(expiresAt, Date.now() / 1000);
    if (!day) return;
    this.renderHook = document.querySelector(`.day-${day}`);
    this.renderBeforeEl = this.renderHook.querySelector('.day__add-todo');
    if (day === 'yesterday') this.renderHook.classList.remove('d-none');
    if (this.renderBeforeEl) this.renderHook.insertBefore(this.todoEl, this.renderBeforeEl);
    else this.renderHook.append(this.todoEl);
  }

  textareaFocusOutHandler() {
    this.textareaFocusOutHelper();
  }
}

export class NewTodo extends Todo {
  createTimeout = null;

  constructor(renderHookName, insertBeforeEl) {
    super();
    const expiresAtMilliseconds = Date.now() + (renderHookName === 'tomorrow' ? 86400000 : 0);
    this.expiresAt = new Date(expiresAtMilliseconds);
    this.isVeryNew = true;
    this.renderHook = document.querySelector(`.day-${renderHookName}`);
    this.insertBeforeEl = insertBeforeEl;
    this.renderHook.insertBefore(this.todoEl, this.insertBeforeEl);
    this.textarea.focus();
  }

  textareaFocusOutHandler() {
    if (this.isVeryNew) {
      const value = this.textarea.value.trim();
      if (value.length <= 0) {
        this.deleteObject();
        return;
      }
      this.content = value;
      this.createTimeout = setTimeout(this.create.bind(this), 1000);
      this.isVeryNew = false;
    } else {
      this.textareaFocusOutHelper();
    }
  }

  create() {
    const createAction = async () => {
      const { id } = await db.collection('todos').add({
        content: this.content,
        owner: auth.currentUser.uid,
        done: this.done,
        expires_at: firebase.firestore.Timestamp.fromDate(this.expiresAt),
      });
      this.id = id;
    };
    const safeCreateAction = Utilities.handleError(createAction);
    safeCreateAction();
    this.createTimeout = null;
  }
}