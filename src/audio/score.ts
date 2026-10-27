/**
 * Trilha sonora original, sintetizada em tempo real com Web Audio.
 * Nada de arquivos de áudio: cada cena tem um "humor" com acordes,
 * andamento e timbres próprios, e o motor faz a transição entre eles.
 */

export type Mood =
  | 'silence'
  | 'title'
  | 'cold'
  | 'tension'
  | 'montage'
  | 'comic'
  | 'warm'
  | 'rising'
  | 'calm'
  | 'finale'

interface MoodSpec {
  bpm: number
  /** Acordes em MIDI, um por compasso. */
  chords: number[][]
  pad: number
  padWave: OscillatorType
  filter: number
  /** Índices das notas do acorde tocadas a cada colcheia (-1 = pausa). */
  arp?: number[]
  arpGain?: number
  arpOctave?: number
  bass?: boolean
  pulse?: 'heart' | 'tick' | 'sneak'
  /** Crescendo: segundos até o volume e o filtro chegarem ao máximo. */
  swell?: number
}

const C3 = 48

const MOODS: Record<Exclude<Mood, 'silence'>, MoodSpec> = {
  title: {
    bpm: 60,
    chords: [
      [57, 60, 64, 67],
      [53, 57, 60, 64],
    ],
    pad: 0.11,
    padWave: 'sawtooth',
    filter: 700,
    arp: [3, -1, -1, -1, 2, -1, -1, -1],
    arpGain: 0.07,
    arpOctave: 1,
  },
  cold: {
    bpm: 72,
    chords: [
      [57, 60, 64, 71], // Am(add9)
      [53, 57, 60, 67], // Fmaj7
      [48, 55, 60, 64], // C
      [55, 59, 62, 69], // G(add9)
    ],
    pad: 0.1,
    padWave: 'sawtooth',
    filter: 900,
    arp: [0, 2, 3, 2, 1, 2, 3, 2],
    arpGain: 0.06,
    arpOctave: 1,
    bass: true,
  },
  tension: {
    bpm: 84,
    chords: [
      [45, 52, 57, 58], // Am com 2ª menor (bb)
      [44, 51, 56, 57],
      [45, 52, 57, 60],
      [41, 48, 53, 54],
    ],
    pad: 0.12,
    padWave: 'sawtooth',
    filter: 520,
    arp: [3, -1, 3, -1, 2, -1, 3, 2],
    arpGain: 0.05,
    arpOctave: 0,
    bass: true,
    pulse: 'heart',
  },
  montage: {
    bpm: 104,
    chords: [
      [48, 55, 60, 64],
      [55, 59, 62, 67],
      [57, 60, 64, 69],
      [53, 57, 60, 65],
    ],
    pad: 0.07,
    padWave: 'triangle',
    filter: 1800,
    arp: [0, 1, 2, 3, 2, 1, 3, 2],
    arpGain: 0.065,
    arpOctave: 1,
    bass: true,
    pulse: 'tick',
  },
  comic: {
    bpm: 118,
    chords: [
      [45, 48, 52],
      [44, 47, 51],
      [43, 46, 50],
      [44, 47, 51],
    ],
    pad: 0.03,
    padWave: 'triangle',
    filter: 900,
    arp: [0, -1, 1, -1, 2, -1, 1, -1],
    arpGain: 0.11,
    arpOctave: 1,
    pulse: 'sneak',
  },
  warm: {
    bpm: 80,
    chords: [
      [53, 57, 60, 64], // Fmaj7
      [48, 52, 55, 62], // C(add9)
      [50, 53, 57, 60], // Dm7
      [46, 50, 53, 57], // Bbmaj7
    ],
    pad: 0.09,
    padWave: 'triangle',
    filter: 1500,
    arp: [0, 2, 1, 3, -1, 2, 1, -1],
    arpGain: 0.06,
    arpOctave: 1,
    bass: true,
  },
  rising: {
    bpm: 66,
    chords: [
      [45, 52, 57, 60, 64],
      [41, 48, 53, 57, 64],
      [43, 50, 55, 59, 62],
      [40, 47, 52, 56, 59],
    ],
    pad: 0.14,
    padWave: 'sawtooth',
    filter: 400,
    arp: [4, -1, 3, -1, 2, -1, 3, -1],
    arpGain: 0.05,
    arpOctave: 1,
    bass: true,
    swell: 16,
  },
  calm: {
    bpm: 70,
    chords: [
      [48, 52, 55, 59], // Cmaj7
      [53, 57, 60, 64], // Fmaj7
      [45, 48, 52, 55], // Am7
      [50, 53, 57, 60], // Dm7
    ],
    pad: 0.075,
    padWave: 'triangle',
    filter: 1300,
    arp: [0, 1, 2, 3, 1, 2, 3, -1],
    arpGain: 0.075,
    arpOctave: 1,
    bass: true,
  },
  finale: {
    bpm: 64,
    chords: [
      [53, 57, 60, 64],
      [55, 59, 62, 67],
      [52, 55, 59, 64],
      [57, 60, 64, 67],
    ],
    pad: 0.1,
    padWave: 'sawtooth',
    filter: 1100,
    arp: [3, -1, 2, -1, 1, -1, 2, -1],
    arpGain: 0.06,
    arpOctave: 1,
    bass: true,
  },
}

const freq = (midi: number) => 440 * 2 ** ((midi - 69) / 12)

class Score {
  private ctx: AudioContext | null = null
  private master!: GainNode
  private music!: GainNode
  private musicFilter!: BiquadFilterNode
  private reverb!: ConvolverNode
  private reverbSend!: GainNode
  private sfx!: GainNode
  private timer: number | null = null
  private mood: Mood = 'silence'
  private spec: MoodSpec | null = null
  private step = 0
  private nextTime = 0
  private moodStartedAt = 0
  private muted = true

  get ready() {
    return this.ctx !== null
  }

  /** Precisa ser chamado a partir de um gesto do usuário. */
  start() {
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!Ctor) return
      const ctx = new Ctor()
      this.ctx = ctx
      this.master = ctx.createGain()
      this.master.gain.value = this.muted ? 0 : 0.9
      const comp = ctx.createDynamicsCompressor()
      comp.threshold.value = -16
      comp.ratio.value = 4
      this.master.connect(comp).connect(ctx.destination)

      this.reverb = ctx.createConvolver()
      this.reverb.buffer = this.impulse(3.2)
      this.reverbSend = ctx.createGain()
      this.reverbSend.gain.value = 0.55
      this.reverbSend.connect(this.reverb).connect(this.master)

      this.musicFilter = ctx.createBiquadFilter()
      this.musicFilter.type = 'lowpass'
      this.musicFilter.frequency.value = 1200
      this.music = ctx.createGain()
      this.music.gain.value = 0
      this.music.connect(this.musicFilter)
      this.musicFilter.connect(this.master)
      this.musicFilter.connect(this.reverbSend)

      this.sfx = ctx.createGain()
      this.sfx.gain.value = 0.6
      this.sfx.connect(this.master)
      this.sfx.connect(this.reverbSend)
    }
    void this.ctx?.resume()
    if (this.timer === null) {
      this.timer = window.setInterval(() => this.tick(), 40)
    }
  }

  setMuted(muted: boolean) {
    this.muted = muted
    if (!this.ctx) return
    const now = this.ctx.currentTime
    this.master.gain.cancelScheduledValues(now)
    this.master.gain.setTargetAtTime(muted ? 0 : 0.9, now, 0.15)
  }

  pause() {
    void this.ctx?.suspend()
  }

  resume() {
    void this.ctx?.resume()
  }

  setMood(mood: Mood) {
    if (!this.ctx || mood === this.mood) return
    this.mood = mood
    const ctx = this.ctx
    const now = ctx.currentTime
    const g = this.music.gain
    g.cancelScheduledValues(now)
    g.setValueAtTime(g.value, now)
    if (mood === 'silence') {
      // Silêncio dramático: corte rápido, mas sem estalo.
      g.linearRampToValueAtTime(0, now + 0.5)
      this.spec = null
      return
    }
    const spec = MOODS[mood]
    g.linearRampToValueAtTime(0, now + 0.7)
    this.spec = spec
    this.step = 0
    this.nextTime = now + 0.75
    this.moodStartedAt = now + 0.75
    const f = this.musicFilter.frequency
    f.cancelScheduledValues(now)
    f.setValueAtTime(f.value, now)
    f.linearRampToValueAtTime(spec.filter, now + 0.8)
    if (spec.swell) {
      g.linearRampToValueAtTime(0.25, now + 1.6)
      g.linearRampToValueAtTime(1.15, now + spec.swell)
      f.linearRampToValueAtTime(3600, now + spec.swell)
    } else {
      g.linearRampToValueAtTime(1, now + 2.2)
    }
  }

  private tick() {
    const ctx = this.ctx
    const spec = this.spec
    if (!ctx || !spec || ctx.state !== 'running') return
    const eighth = 60 / spec.bpm / 2
    // Se a aba ficou em segundo plano, não "despeja" notas atrasadas.
    if (this.nextTime < ctx.currentTime - 0.2) this.nextTime = ctx.currentTime + 0.05
    while (this.nextTime < ctx.currentTime + 0.18) {
      this.scheduleStep(spec, this.step, this.nextTime, eighth)
      this.step++
      this.nextTime += eighth
    }
  }

  private scheduleStep(spec: MoodSpec, step: number, time: number, eighth: number) {
    const bar = Math.floor(step / 8)
    const inBar = step % 8
    const chord = spec.chords[bar % spec.chords.length]
    const barLen = eighth * 8

    if (inBar === 0) {
      chord.forEach((n) => this.padNote(freq(n), time, barLen * 1.08, spec.pad / chord.length, spec.padWave))
      if (spec.bass) this.bassNote(freq(chord[0] - 12), time, barLen * 0.95)
    }

    if (spec.arp) {
      const idx = spec.arp[inBar]
      if (idx >= 0 && idx < chord.length) {
        const oct = (spec.arpOctave ?? 1) * 12
        const decay = this.mood === 'comic' ? 0.18 : 1.4
        this.pluck(freq(chord[idx] + oct), time, spec.arpGain ?? 0.06, decay)
      }
    }

    if (spec.pulse === 'heart' && (inBar === 0 || inBar === 1 || inBar === 4 || inBar === 5)) {
      const strong = inBar === 0 || inBar === 4
      this.thump(time, strong ? 0.5 : 0.28)
    }
    if (spec.pulse === 'tick' && inBar % 2 === 1) this.tickNoise(time, 0.05)
    if (spec.pulse === 'sneak' && inBar % 2 === 0) this.bassNote(freq(chord[0] - 12 + (inBar === 4 ? 1 : 0)), time, eighth * 0.6, 0.18)
  }

  private padNote(f: number, t: number, dur: number, gain: number, wave: OscillatorType) {
    const ctx = this.ctx!
    const env = ctx.createGain()
    env.gain.setValueAtTime(0, t)
    env.gain.linearRampToValueAtTime(gain, t + Math.min(1.2, dur * 0.4))
    env.gain.setValueAtTime(gain, t + dur * 0.7)
    env.gain.linearRampToValueAtTime(0, t + dur)
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 2400
    lp.connect(env).connect(this.music)
    for (const detune of [-8, 7]) {
      const o = ctx.createOscillator()
      o.type = wave
      o.frequency.value = f
      o.detune.value = detune
      o.connect(lp)
      o.start(t)
      o.stop(t + dur + 0.05)
    }
  }

  private pluck(f: number, t: number, gain: number, decay: number) {
    const ctx = this.ctx!
    const env = ctx.createGain()
    env.gain.setValueAtTime(0, t)
    env.gain.linearRampToValueAtTime(gain, t + 0.008)
    env.gain.exponentialRampToValueAtTime(0.0001, t + decay)
    env.connect(this.music)
    const o1 = ctx.createOscillator()
    o1.type = 'triangle'
    o1.frequency.value = f
    const o2 = ctx.createOscillator()
    o2.type = 'sine'
    o2.frequency.value = f * 2
    const g2 = ctx.createGain()
    g2.gain.value = 0.3
    o1.connect(env)
    o2.connect(g2).connect(env)
    o1.start(t)
    o2.start(t)
    o1.stop(t + decay + 0.05)
    o2.stop(t + decay + 0.05)
  }

  private bassNote(f: number, t: number, dur: number, gain = 0.12) {
    const ctx = this.ctx!
    const env = ctx.createGain()
    env.gain.setValueAtTime(0, t)
    env.gain.linearRampToValueAtTime(gain, t + 0.04)
    env.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    env.connect(this.music)
    const o = ctx.createOscillator()
    o.type = 'sine'
    o.frequency.value = f
    o.connect(env)
    o.start(t)
    o.stop(t + dur + 0.05)
  }

  private thump(t: number, gain: number) {
    const ctx = this.ctx!
    const env = ctx.createGain()
    env.gain.setValueAtTime(gain, t)
    env.gain.exponentialRampToValueAtTime(0.0001, t + 0.35)
    env.connect(this.music)
    const o = ctx.createOscillator()
    o.type = 'sine'
    o.frequency.setValueAtTime(90, t)
    o.frequency.exponentialRampToValueAtTime(38, t + 0.3)
    o.connect(env)
    o.start(t)
    o.stop(t + 0.4)
  }

  private tickNoise(t: number, gain: number) {
    const ctx = this.ctx!
    const src = ctx.createBufferSource()
    src.buffer = this.noise(0.05)
    const hp = ctx.createBiquadFilter()
    hp.type = 'highpass'
    hp.frequency.value = 6000
    const env = ctx.createGain()
    env.gain.setValueAtTime(gain, t)
    env.gain.exponentialRampToValueAtTime(0.0001, t + 0.05)
    src.connect(hp).connect(env).connect(this.music)
    src.start(t)
  }

  /* ---------- Efeitos sonoros ---------- */

  /** Notificação de mensagem: "me" = enviada, "them" = recebida. */
  pop(kind: 'me' | 'them' | 'alert' = 'them') {
    const ctx = this.ctx
    if (!ctx || ctx.state !== 'running') return
    const t = ctx.currentTime + 0.01
    const notes = kind === 'me' ? [880, 1320] : kind === 'alert' ? [740, 740] : [1175, 1568]
    notes.forEach((f, i) => {
      const env = ctx.createGain()
      const start = t + i * 0.07
      env.gain.setValueAtTime(0, start)
      env.gain.linearRampToValueAtTime(0.18, start + 0.01)
      env.gain.exponentialRampToValueAtTime(0.0001, start + 0.22)
      env.connect(this.sfx)
      const o = ctx.createOscillator()
      o.type = 'sine'
      o.frequency.value = f
      o.connect(env)
      o.start(start)
      o.stop(start + 0.25)
    })
  }

  whoosh() {
    const ctx = this.ctx
    if (!ctx || ctx.state !== 'running') return
    const t = ctx.currentTime
    const src = ctx.createBufferSource()
    src.buffer = this.noise(1.4)
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.Q.value = 0.8
    bp.frequency.setValueAtTime(300, t)
    bp.frequency.exponentialRampToValueAtTime(2600, t + 0.6)
    bp.frequency.exponentialRampToValueAtTime(400, t + 1.3)
    const env = ctx.createGain()
    env.gain.setValueAtTime(0, t)
    env.gain.linearRampToValueAtTime(0.22, t + 0.5)
    env.gain.linearRampToValueAtTime(0, t + 1.35)
    src.connect(bp).connect(env).connect(this.sfx)
    src.start(t)
  }

  /** "DUN DUN DUNNN" — suspense exageradamente dramático. */
  dun() {
    const ctx = this.ctx
    if (!ctx || ctx.state !== 'running') return
    const t = ctx.currentTime + 0.02
    const hits: [number, number, number][] = [
      [C3 + 7, 0, 0.32],
      [C3 + 6, 0.42, 0.32],
      [C3 + 3, 0.86, 2.4],
    ]
    hits.forEach(([n, at, dur]) => {
      const start = t + at
      const env = ctx.createGain()
      env.gain.setValueAtTime(0, start)
      env.gain.linearRampToValueAtTime(0.3, start + 0.02)
      env.gain.setValueAtTime(0.3, start + dur * 0.6)
      env.gain.linearRampToValueAtTime(0, start + dur)
      const lp = ctx.createBiquadFilter()
      lp.type = 'lowpass'
      lp.frequency.setValueAtTime(2400, start)
      lp.frequency.exponentialRampToValueAtTime(600, start + dur)
      lp.connect(env).connect(this.sfx)
      for (const mult of [0.5, 1, 2]) {
        const o = ctx.createOscillator()
        o.type = 'sawtooth'
        o.frequency.value = freq(n) * mult
        o.detune.value = mult === 1 ? 6 : -6
        o.connect(lp)
        o.start(start)
        o.stop(start + dur + 0.05)
      }
      this.thump(start, 0.6)
    })
  }

  /** Coração quebrando: um acorde baixo seco. */
  impact() {
    const ctx = this.ctx
    if (!ctx || ctx.state !== 'running') return
    const t = ctx.currentTime + 0.01
    this.thump(t, 0.9)
    const src = ctx.createBufferSource()
    src.buffer = this.noise(1.2)
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 500
    const env = ctx.createGain()
    env.gain.setValueAtTime(0.35, t)
    env.gain.exponentialRampToValueAtTime(0.0001, t + 1.1)
    src.connect(lp).connect(env).connect(this.sfx)
    src.start(t)
  }

  /* ---------- Utilitários ---------- */

  private noiseCache = new Map<number, AudioBuffer>()

  private noise(seconds: number) {
    const cached = this.noiseCache.get(seconds)
    if (cached) return cached
    const ctx = this.ctx!
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * seconds), ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
    this.noiseCache.set(seconds, buf)
    return buf
  }

  private impulse(seconds: number) {
    const ctx = this.ctx!
    const len = Math.floor(ctx.sampleRate * seconds)
    const buf = ctx.createBuffer(2, len, ctx.sampleRate)
    for (let c = 0; c < 2; c++) {
      const data = buf.getChannelData(c)
      for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 2.6
    }
    return buf
  }

  /** Tempo decorrido no humor atual (útil para debug). */
  get moodTime() {
    return this.ctx ? this.ctx.currentTime - this.moodStartedAt : 0
  }
}

export const score = new Score()
