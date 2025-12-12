import { useState, useRef, useEffect } from 'react';
import { Volume2, Play, Pause } from 'lucide-react';

export default function HearingTest() {
  const [frequency, setFrequency] = useState(1000);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const startTone = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
    }

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gainNode.gain.value = volume;

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    oscillator.start();
    oscillatorRef.current = oscillator;
    setPlaying(true);
  };

  const stopTone = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }
    setPlaying(false);
  };

  const togglePlay = () => {
    if (playing) {
      stopTone();
    } else {
      startTone();
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center space-x-2">
          <Volume2 className="w-6 h-6" />
          <span>Hearing Test</span>
        </h2>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            ⚠️ Warning: Start with low volume and adjust gradually. This is not a medical test.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Frequency: {frequency} Hz
            </label>
            <input
              type="range"
              min="20"
              max="20000"
              step="10"
              value={frequency}
              onChange={(e) => {
                setFrequency(Number(e.target.value));
                if (playing) {
                  stopTone();
                  setTimeout(startTone, 100);
                }
              }}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>20 Hz</span>
              <span>20,000 Hz</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Volume: {Math.round(volume * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => {
                setVolume(Number(e.target.value));
                if (oscillatorRef.current && audioContextRef.current) {
                  const gainNode = audioContextRef.current.createGain();
                  gainNode.gain.value = Number(e.target.value);
                  oscillatorRef.current.connect(gainNode);
                  gainNode.connect(audioContextRef.current.destination);
                }
              }}
              className="w-full"
            />
          </div>

          <button
            onClick={togglePlay}
            className={`btn-primary w-full flex items-center justify-center space-x-2 ${
              playing ? 'bg-red-500 hover:bg-red-600' : ''
            }`}
          >
            {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            <span>{playing ? 'Stop Tone' : 'Play Tone'}</span>
          </button>
        </div>

        <div className="mt-6 grid grid-cols-4 gap-2">
          {[250, 500, 1000, 2000, 4000, 8000].map(freq => (
            <button
              key={freq}
              onClick={() => {
                setFrequency(freq);
                if (playing) {
                  stopTone();
                  setTimeout(startTone, 100);
                }
              }}
              className="btn-secondary text-sm"
            >
              {freq} Hz
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}


