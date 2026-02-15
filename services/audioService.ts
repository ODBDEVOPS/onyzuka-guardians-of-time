
class AudioService {
  private ambient: HTMLAudioElement | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.4;
  private currentTrackName: string = "";

  private getFilePath(name: string): string {
    const mapping: Record<string, string> = {
      'nebula': 'nebula.mp3',
      'metallic forge': 'forge.mp3',
      'liquid light': 'liquid.mp3',
      'total darkness': 'darkness.mp3',
      'radiant city': 'city.mp3',
      'fractal labyrinth': 'fractal.mp3',
      'singularity': 'singularity.mp3',
      'click': 'click.mp3',
      'success': 'success.mp3',
      'mote': 'mote.mp3',
      'keyword': 'keyword.mp3'
    };
    return `./${mapping[name.toLowerCase()] || name + '.mp3'}`;
  }

  getCurrentTrack(): string {
    return this.currentTrackName;
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.ambient) this.ambient.muted = this.isMuted;
    return this.isMuted;
  }

  private playEffect(name: string) {
    if (this.isMuted) return;
    const effect = new Audio(this.getFilePath(name));
    effect.volume = 0.5;
    effect.play().catch(() => {});
  }

  playClick() { this.playEffect('click'); }
  playSuccess() { this.playEffect('success'); }
  playMoteCatch() { this.playEffect('mote'); }
  playKeywordLog() { this.playEffect('keyword'); }

  startBiomeAmbient(biome: string) {
    if (this.currentTrackName === biome) return;
    this.stopAmbient();
    this.currentTrackName = biome;
    
    this.ambient = new Audio(this.getFilePath(biome));
    this.ambient.loop = true;
    this.ambient.volume = 0;
    this.ambient.muted = this.isMuted;

    this.ambient.play().then(() => {
      let vol = 0;
      const interval = setInterval(() => {
        if (!this.ambient) { clearInterval(interval); return; }
        vol += 0.05;
        if (vol >= this.volume) { this.ambient.volume = this.volume; clearInterval(interval); }
        else this.ambient.volume = vol;
      }, 100);
    }).catch(() => {});
  }

  stopAmbient() {
    if (this.ambient) {
      const current = this.ambient;
      let vol = current.volume;
      const interval = setInterval(() => {
        vol -= 0.05;
        if (vol <= 0) { current.pause(); current.src = ""; clearInterval(interval); }
        else current.volume = vol;
      }, 100);
      this.ambient = null;
    }
  }
}

export const audio = new AudioService();
