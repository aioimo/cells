export class AutoHide {
  constructor(elements, timeoutMs = 3000) {
    this.elements = elements;
    this.timeoutMs = timeoutMs;
    this.timerId = null;
    this.show();
    this._listen();
  }

  show() {
    this.elements.forEach((el) => el.classList.remove("hidden"));
    clearTimeout(this.timerId);
    this.timerId = setTimeout(() => this.hide(), this.timeoutMs);
  }

  hide() {
    this.elements.forEach((el) => el.classList.add("hidden"));
  }

  _listen() {
    const trigger = () => this.show();
    document.addEventListener("pointermove", trigger, { passive: true });
    document.addEventListener("pointerdown", trigger, { passive: true });
    document.addEventListener("keydown", trigger, { passive: true });
  }
}
