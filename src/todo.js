export default class Todo {
  template = document.importNode(document.getElementById('todo').content, true);
  todoEl = this.template.querySelector('.todo');
  switchIcon = this.todoEl.querySelector('.todo__switch-box');
  textarea = this.todoEl.querySelector('.todo__textarea');
  removeIcon = this.todoEl.querySelector('.todo__icon-remove');

  constructor(content, done, expiresAt) {
    this.content = content;
    const day = this.getTime(expiresAt, Date.now() / 1000);
    this.renderHook = document.querySelector(`.day-${day}`);
    if (day === 'yesterday') this.renderHook.classList.remove('d-none');
    this.renderBeforeEl = this.renderHook.querySelector('.day__add-todo');

    this.switchIcon.addEventListener('click', this.changeState.bind(this));
    this.textarea.addEventListener('input', this.textareaInputHandler.bind(this));
    this.textarea.addEventListener('focusout', this.textareaFocusOutHandler.bind(this));

    this.textarea.value = content;

    if (done) this.switchIcon.click();

    if (this.renderBeforeEl) this.renderHook.insertBefore(this.todoEl, this.renderBeforeEl);
    else this.renderHook.append(this.todoEl);
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
  }

  textareaInputHandler(e) {
    if (this.done) {
      e.preventDefault();
      this.textarea.disabled = true;
    }
    this.textarea.style.height = `${this.textarea.scrollHeight}px`;
  }

  textareaFocusOutHandler() {

  }

  getTime(todoTime, curTime) {
    const today = new Date(curTime * 1000);
    const todaySeconds = today.getSeconds() + today.getMinutes() * 60 + today.getHours() * 3600;
    const todaySecondsLeft = 86400 - todaySeconds;
    if (todoTime > curTime + todaySecondsLeft && todoTime <= curTime + todaySecondsLeft + 86400) return 'tomorrow';
    if (todoTime <= curTime + todaySecondsLeft && todoTime >= curTime - todaySeconds) return 'today';
    if (todoTime < curTime - todaySeconds && todoTime >= curTime - todaySeconds - 86400) return 'yesterday';
  }
}