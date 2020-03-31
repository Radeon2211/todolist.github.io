export default class Utilities {
  static usernameNode = document.querySelector('.home__username');
  static notificationsContainer = document.querySelector('.notifications');

  static renderNotification(error, type, time = 5000) {
    const notifToReset = Utilities.notificationsContainer.querySelector(`[type="${type}"]`);
    if (notifToReset) {
      const notifContent = notifToReset.querySelector('span').textContent;
      if (notifContent === error.message) {
        notifToReset.resetTimeout();
        return;
      }
    }

    const newElement = document.createElement('rm-notification-box');
    newElement.setAttribute('type', type);
    newElement.setAttribute('time', time);
    newElement.innerHTML = `<span slot="text">${error.message}</span>`;
    Utilities.notificationsContainer.append(newElement);
  }

  static handleError(fn, loader, reload) {
    return function (...params) {
      return fn(...params).then(() => {
        if (reload) location.reload();
      }).catch((err) => {
        if (loader) loader.remove();
        Utilities.renderNotification(err, 'danger');
      });
    }
  }

  static updateUsername(username) {
    this.usernameNode.textContent = username;
  }

  static createLoader(size, color, classes) {
    const loader = document.createElement('rm-loader');
    if (size) loader.setAttribute('size', size);
    if (color) loader.setAttribute('color', color);
    if (classes) loader.className = classes;
    return loader;
  }
}