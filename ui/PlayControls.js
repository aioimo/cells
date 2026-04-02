import { ICON_PLAY, ICON_PAUSE } from "./icons.js";

export class PlayControls {
  constructor({ playPauseBtn, stepBtn, resetBtn }) {
    this.$playPause = playPauseBtn;
    this.$step = stepBtn;
    this.$reset = resetBtn;
    this.playing = false;
  }

  initialise() {
    this.playing = false;
    this.$playPause.innerHTML = ICON_PLAY;
    this.$playPause.setAttribute("aria-label", "Play");
    this.$playPause.disabled = false;
    this.$step.disabled = false;
    this.$reset.disabled = false;
  }

  setPlaying(isPlaying) {
    this.playing = isPlaying;
    this.$playPause.innerHTML = isPlaying ? ICON_PAUSE : ICON_PLAY;
    this.$playPause.setAttribute("aria-label", isPlaying ? "Pause" : "Play");
    this.$step.disabled = isPlaying;
    this.$reset.disabled = isPlaying;
  }

  onEnd() {
    this.playing = false;
    this.$playPause.innerHTML = ICON_PLAY;
    this.$playPause.setAttribute("aria-label", "Play");
    this.$playPause.disabled = true;
    this.$step.disabled = true;
    this.$reset.disabled = false;
  }

  onReset() {
    this.playing = false;
    this.$playPause.innerHTML = ICON_PLAY;
    this.$playPause.setAttribute("aria-label", "Play");
    this.$playPause.disabled = false;
    this.$step.disabled = false;
    this.$reset.disabled = false;
  }
}
