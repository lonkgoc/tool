import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface AudioNode {
  oscillator?: OscillatorNode;
  gain?: GainNode;
  noise?: AudioBufferSourceNode;
}

export default function FocusMusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState('rain');
  const [volume, setVolume] = useState(0.5);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<AudioNode[]>([]);
  const intervalRef = useRef<number | null>(null);

  const tracks: Record<string, { name: string; icon: string; description: string }> = {
    rain: { name: 'Rain Sounds', icon: '🌧️', description: 'Gentle rain for focus' },
    ocean: { name: 'Ocean Waves', icon: '🌊', description: 'Calming wave sounds' },
    forest: { name: 'Forest Birds', icon: '🌲', description: 'Nature ambience' },
    cafe: { name: 'Café Ambient', icon: '☕', description: 'Coffee shop vibes' },
    whitenoise: { name: 'White Noise', icon: '⚪', description: 'Pure concentration' },
    bonfire: { name: 'Fireplace', icon: '🔥', description: 'Cozy crackling fire' },
  };

  const stopAllAudio = useCallback(() => {
    nodesRef.current.forEach(node => {
      try {
        node.oscillator?.stop();
        node.noise?.stop();
      } catch { }
    });
    nodesRef.current = [];
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const createNoiseBuffer = (ctx: AudioContext, type: 'white' | 'brown' | 'pink') => {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    if (type === 'white') {
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    } else if (type === 'brown') {
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
      }
    } else { // pink
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        data[i] *= 0.11;
        b6 = white * 0.115926;
      }
    }
    return buffer;
  };

  const playRain = useCallback((ctx: AudioContext, masterGain: GainNode) => {
    // Brown noise for rain base
    const noiseBuffer = createNoiseBuffer(ctx, 'brown');
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.3;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000;

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(masterGain);
    noise.start();

    nodesRef.current.push({ noise });

    // Random raindrops
    const playDrop = () => {
      if (!playing) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 3000 + Math.random() * 2000;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.02 * Math.random(), ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    };

    intervalRef.current = setInterval(playDrop, 50) as unknown as number;
  }, [playing]);

  const playOcean = useCallback((ctx: AudioContext, masterGain: GainNode) => {
    const noiseBuffer = createNoiseBuffer(ctx, 'pink');
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const noiseGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 500;

    // Wave modulation
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.1;
    lfoGain.gain.value = 0.2;
    lfo.connect(lfoGain);
    lfoGain.connect(noiseGain.gain);

    noiseGain.gain.value = 0.3;
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(masterGain);
    lfo.start();
    noise.start();

    nodesRef.current.push({ noise, oscillator: lfo });
  }, []);

  const playForest = useCallback((ctx: AudioContext, masterGain: GainNode) => {
    // Subtle wind
    const noiseBuffer = createNoiseBuffer(ctx, 'pink');
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.08;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(masterGain);
    noise.start();
    nodesRef.current.push({ noise });

    // Bird chirps
    const playBird = () => {
      const baseFreq = 2000 + Math.random() * 2000;
      for (let i = 0; i < 3 + Math.floor(Math.random() * 3); i++) {
        setTimeout(() => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.value = baseFreq + Math.random() * 500;
          osc.type = 'sine';
          gain.gain.setValueAtTime(0.03, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start();
          osc.stop(ctx.currentTime + 0.1);
        }, i * 80);
      }
    };

    intervalRef.current = setInterval(playBird, 2000 + Math.random() * 3000) as unknown as number;
    playBird();
  }, []);

  const playCafe = useCallback((ctx: AudioContext, masterGain: GainNode) => {
    // Murmur (brown noise)
    const noiseBuffer = createNoiseBuffer(ctx, 'brown');
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.15;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 400;
    filter.Q.value = 0.5;

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(masterGain);
    noise.start();
    nodesRef.current.push({ noise });

    // Occasional clinks/sounds
    const playClink = () => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 800 + Math.random() * 1500;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    };

    intervalRef.current = setInterval(playClink, 3000 + Math.random() * 5000) as unknown as number;
  }, []);

  const playWhiteNoise = useCallback((ctx: AudioContext, masterGain: GainNode) => {
    const noiseBuffer = createNoiseBuffer(ctx, 'white');
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.25;
    noise.connect(noiseGain);
    noiseGain.connect(masterGain);
    noise.start();

    nodesRef.current.push({ noise });
  }, []);

  const playBonfire = useCallback((ctx: AudioContext, masterGain: GainNode) => {
    const noiseBuffer = createNoiseBuffer(ctx, 'brown');
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.2;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 600;

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(masterGain);
    noise.start();
    nodesRef.current.push({ noise });

    // Crackling pops
    const playCrackle = () => {
      for (let i = 0; i < 1 + Math.floor(Math.random() * 3); i++) {
        setTimeout(() => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.value = 100 + Math.random() * 300;
          osc.type = 'square';
          gain.gain.setValueAtTime(0.04, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start();
          osc.stop(ctx.currentTime + 0.02);
        }, i * 30);
      }
    };

    intervalRef.current = setInterval(playCrackle, 200 + Math.random() * 400) as unknown as number;
  }, []);

  const startAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    stopAllAudio();

    const masterGain = ctx.createGain();
    masterGain.gain.value = volume;
    masterGain.connect(ctx.destination);

    switch (currentTrack) {
      case 'rain': playRain(ctx, masterGain); break;
      case 'ocean': playOcean(ctx, masterGain); break;
      case 'forest': playForest(ctx, masterGain); break;
      case 'cafe': playCafe(ctx, masterGain); break;
      case 'whitenoise': playWhiteNoise(ctx, masterGain); break;
      case 'bonfire': playBonfire(ctx, masterGain); break;
    }
  }, [currentTrack, volume, stopAllAudio, playRain, playOcean, playForest, playCafe, playWhiteNoise, playBonfire]);

  useEffect(() => {
    if (playing) {
      startAudio();
    } else {
      stopAllAudio();
    }
    return () => stopAllAudio();
  }, [playing, currentTrack, startAudio, stopAllAudio]);

  useEffect(() => {
    if (audioContextRef.current) {
      // Volume is handled by master gain in startAudio
      if (playing) startAudio();
    }
  }, [volume, playing, startAudio]);

  const togglePlay = () => setPlaying(!playing);

  const selectTrack = (track: string) => {
    setCurrentTrack(track);
    if (playing) startAudio();
  };

  return (
    <div className="space-y-6">
      {/* Now Playing Card */}
      <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl p-6 text-white shadow-lg">
        <div className="text-5xl mb-3">{tracks[currentTrack].icon}</div>
        <h2 className="text-2xl font-bold mb-1">{tracks[currentTrack].name}</h2>
        <p className="text-white/70 mb-6">{tracks[currentTrack].description}</p>

        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
          >
            {playing ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-3">
          <button onClick={() => setVolume(v => Math.max(0, v - 0.1))} className="p-2 hover:bg-white/20 rounded-lg">
            <VolumeX className="w-5 h-5" />
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={e => setVolume(Number(e.target.value))}
            className="flex-1 h-2 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
          />
          <button onClick={() => setVolume(v => Math.min(1, v + 0.1))} className="p-2 hover:bg-white/20 rounded-lg">
            <Volume2 className="w-5 h-5" />
          </button>
          <span className="text-sm w-12 text-right">{Math.round(volume * 100)}%</span>
        </div>
      </div>

      {/* Track Selection */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Ambient Sounds</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(tracks).map(([key, track]) => (
            <button
              key={key}
              onClick={() => selectTrack(key)}
              className={`p-4 rounded-xl font-medium transition-all ${currentTrack === key
                  ? 'bg-indigo-500 text-white shadow-lg scale-105'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
            >
              <div className="text-2xl mb-1">{track.icon}</div>
              <div className="text-sm">{track.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4 text-sm text-indigo-800 dark:text-indigo-100">
        <strong>💡 Tip:</strong> Ambient sounds help mask distracting noises and improve focus. Try different sounds to find what works best for you!
      </div>
    </div>
  );
}
