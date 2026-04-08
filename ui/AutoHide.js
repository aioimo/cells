export class AutoHide {
  constructor(elements, { zoneHeight = 80, hideDelay = 1000, initialDelay = 3000 } = {}) {
    this.elements = elements;
    this.zoneHeight = zoneHeight;
    this.hideDelay = hideDelay;
    this.timerId = null;

    this.show();
    this.timerId = setTimeout(() => this.hide(), initialDelay);
    this._listen();
  }

  show() {
    this.elements.forEach((el) => el.classList.remove("hidden"));
    clearTimeout(this.timerId);
    this.timerId = null;
  }

  hide() {
    this.elements.forEach((el) => el.classList.add("hidden"));
    this.timerId = null;
  }

  _scheduleHide() {
    if (this.timerId) return;
    this.timerId = setTimeout(() => this.hide(), this.hideDelay);
  }

  _listen() {
    document.addEventListener("pointermove", (e) => {
      const inZone = e.clientY >= window.innerHeight - this.zoneHeight;
      if (inZone) {
        this.show();
      } else {
        this._scheduleHide();
      }
    }, { passive: true });

    document.addEventListener("keydown", () => {
      this.show();
      clearTimeout(this.timerId);
      this.timerId = setTimeout(() => this.hide(), 3000);
    });
  }
}
