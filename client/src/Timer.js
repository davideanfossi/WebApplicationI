import API from './API';

class Timer {
    constructor(idIndovinello, duration) {
      this.idIndovinello = idIndovinello;
      this.startTime = Date.now();
      this.duration = duration;
      this.timer = duration;
    }
}
  
export {Timer};