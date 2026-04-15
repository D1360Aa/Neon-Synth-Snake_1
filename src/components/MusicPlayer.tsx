import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
  cover: string;
}

const DUMMY_TRACKS: Track[] = [
  {
    id: 1,
    title: "Neon Pulse",
    artist: "SynthAI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/seed/neon1/200/200"
  },
  {
    id: 2,
    title: "Cyber Drift",
    artist: "GlitchBot",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/seed/cyber2/200/200"
  },
  {
    id: 3,
    title: "Digital Sunset",
    artist: "WaveGen",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://picsum.photos/seed/sunset3/200/200"
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleEnded = () => {
    skipForward();
  };

  return (
    <div className="flex-1 flex items-center justify-between gap-[60px]">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      {/* NOW PLAYING */}
      <div className="w-[250px] flex items-center gap-[15px] shrink-0">
        <div className="w-[60px] h-[60px] bg-gradient-to-br from-neon-magenta to-neon-cyan rounded shrink-0">
          <img
            src={currentTrack.cover}
            alt={currentTrack.title}
            className="w-full h-full object-cover rounded opacity-80"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="min-w-0">
          <div className="text-base font-semibold text-[#eee] truncate">{currentTrack.title}</div>
          <div className="text-[11px] text-[#666] font-mono uppercase tracking-wider truncate">{currentTrack.artist}</div>
        </div>
      </div>

      {/* PLAYER CONTROLS */}
      <div className="flex-1 flex flex-col items-center gap-[10px] max-w-xl">
        <div className="flex items-center gap-[30px]">
          <button 
            onClick={skipBackward}
            className="text-[#888] hover:text-white transition-colors text-xl"
          >
            ⏮
          </button>
          <button 
            onClick={togglePlay}
            className="w-12 h-12 bg-neon-cyan rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform shadow-[0_0_10px_rgba(0,255,255,0.5)]"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
          </button>
          <button 
            onClick={skipForward}
            className="text-[#888] hover:text-white transition-colors text-xl"
          >
            ⏭
          </button>
        </div>

        <div className="w-full space-y-1">
          <div className="relative h-1 w-full bg-[#222] rounded-sm overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-neon-cyan shadow-[0_0_8px_#00ffff]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between font-mono text-[10px] text-[#555]">
            <span>{audioRef.current ? formatTime(audioRef.current.currentTime) : '00:00'}</span>
            <span>{audioRef.current ? formatTime(audioRef.current.duration) : '00:00'}</span>
          </div>
        </div>
      </div>

      {/* ADDITIONAL CONTROLS */}
      <div className="w-[250px] flex justify-end items-center gap-5 shrink-0">
        <div className="flex items-center gap-3 group mr-4">
          <Volume2 className="w-4 h-4 text-[#555]" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 h-1 bg-[#222] rounded-full appearance-none cursor-pointer accent-neon-cyan"
          />
        </div>
        <button className="text-[10px] font-mono text-[#888] hover:text-white uppercase tracking-widest">SHUFFLE</button>
        <button className="text-[10px] font-mono text-neon-cyan uppercase tracking-widest">REPEAT</button>
      </div>
    </div>
  );
};

const formatTime = (time: number) => {
  if (isNaN(time)) return '00:00';
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
