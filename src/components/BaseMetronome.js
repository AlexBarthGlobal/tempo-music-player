class BaseMetronome {
    constructor(tempo = 60) {
      this.tempo = tempo;
      this.playing = false;
      
      this.audioCtx = null;
      this.tick = null;
      this.tickVolume = null;
      this.soundHz = 1000;
    }
    
    initAudio() {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      this.tick = this.audioCtx.createOscillator();
      this.tickVolume = this.audioCtx.createGain();
  
      this.tick.type = 'sine'; 
      this.tick.frequency.value = this.soundHz;
      this.tickVolume.gain.value = 0;
      
      this.tick.connect(this.tickVolume);
      this.tickVolume.connect(this.audioCtx.destination);
      this.tick.start(0);  // No offset, start immediately.
    }
    
    click(callbackFn) {
      const time = this.audioCtx.currentTime;
      this.clickAtTime(time);
      
      if (callbackFn) {
        callbackFn(time);
      }
    }
    
    clickAtTime(time) {
      // Silence the click.
      this.tickVolume.gain.cancelScheduledValues(time);
      this.tickVolume.gain.setValueAtTime(0, time);
  
      // Audible click sound.
      this.tickVolume.gain.linearRampToValueAtTime(1, time + .001);
      this.tickVolume.gain.linearRampToValueAtTime(0, time + .001 + .01);
    }
    
    start(callbackFn) {
      this.playing = true;
      this.initAudio();
    }
    
    stop(callbackFn) {
      this.playing = false;
      this.tickVolume.gain.value = 0;
    }
  }

class SetIntervalMetronome extends BaseMetronome {
    constructor(tempo, playing) {
      super(tempo, playing);
      this.intervalId = null;
    }
    
    start(callbackFn) {
      super.start();
      const timeoutDuration = Math.round((60 / this.tempo) * 1000);
      this.intervalId = setInterval(() => this.click(callbackFn), timeoutDuration);
    }
    
    stop() {
      super.stop();
      clearInterval(this.intervalId);
    }

    changeTempo(newTempo) {
      if (this.playing && this.tempo !== newTempo) {
        this.stop();
        this.tempo = (newTempo);
        this.start();
      } else this.tempo = (newTempo);

      return;
    }

    playing() {
      return this.playing
    }
}

module.exports = {
  BaseMetronome,
  SetIntervalMetronome
}