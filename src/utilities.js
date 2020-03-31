export default class Utilities {
  static usernameNode = document.querySelector('.home__username');
  static notificationsContainer = document.querySelector('.notifications');

  static renderNotification(error, type, time = 4000) {
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

  static handleError(fn, reload) {
    return function (...params) {
      return fn(...params).then(() => {
        if (reload) location.reload();
      }).catch((err) => {
        Utilities.renderNotification(err, 'danger');
      });
    }
  }

  static updateUsername(username) {
    this.usernameNode.textContent = username;
  }
}