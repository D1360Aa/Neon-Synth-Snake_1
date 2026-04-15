import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
    }
  };

  return (
    <div className="h-full flex flex-col bg-cyber-black text-white font-sans selection:bg-neon-cyan selection:text-black relative">
      <div className="scanline"></div>

      {/* HEADER SECTION */}
      <header className="h-20 flex items-center justify-between px-10 border-b border-border-dim bg-gradient-to-r from-cyber-gray to-cyber-black shrink-0">
        <div className="text-[32px] font-black tracking-tighter uppercase neon-text-cyan">
          SYNTH // SNAKE
        </div>
        
        <div className="flex gap-10 font-mono">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-[#666] uppercase tracking-[2px]">Score</span>
            <span className="text-2xl text-neon-lime tabular-nums">
              {score.toString().padStart(4, '0')}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-[#666] uppercase tracking-[2px]">High Score</span>
            <span className="text-2xl text-neon-lime tabular-nums">
              {highScore.toString().padStart(4, '0')}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-[#666] uppercase tracking-[2px]">Multi</span>
            <span className="text-2xl text-neon-magenta">x1.5</span>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 grid grid-cols-[280px_1fr_280px] gap-5 p-5 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="panel-bg border border-border-dim rounded flex flex-col overflow-hidden">
          <div className="p-[15px] border-b border-border-dim font-mono text-xs text-[#888] uppercase">
            Neural Playlists
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="p-[15px] border-b border-[#1a1a1a] flex flex-col gap-1 cursor-pointer bg-neon-cyan/5 border-l-3 border-l-neon-cyan">
              <span className="text-sm font-semibold text-[#eee]">Neon Pulse</span>
              <span className="text-[11px] text-[#666] font-mono">AI UNIT_01</span>
            </div>
            <div className="p-[15px] border-b border-[#1a1a1a] flex flex-col gap-1 cursor-pointer hover:bg-white/5 transition-colors">
              <span className="text-sm font-semibold text-[#eee]">Cyber Drift</span>
              <span className="text-[11px] text-[#666] font-mono">SYNTH_CORE</span>
            </div>
            <div className="p-[15px] border-b border-[#1a1a1a] flex flex-col gap-1 cursor-pointer hover:bg-white/5 transition-colors">
              <span className="text-sm font-semibold text-[#eee]">Digital Rain</span>
              <span className="text-[11px] text-[#666] font-mono">BIT_ATMOSPHERE</span>
            </div>
            <div className="p-[15px] border-b border-[#1a1a1a] flex flex-col gap-1 cursor-pointer hover:bg-white/5 transition-colors">
              <span className="text-sm font-semibold text-[#eee]">Void Runner</span>
              <span className="text-[11px] text-[#666] font-mono">NEURAL_ARCADE</span>
            </div>
            <div className="p-[15px] border-b border-[#1a1a1a] flex flex-col gap-1 cursor-pointer hover:bg-white/5 transition-colors">
              <span className="text-sm font-semibold text-[#eee]">Ghost Logic</span>
              <span className="text-[11px] text-[#666] font-mono">DATA_STREAM</span>
            </div>
          </div>
        </aside>

        {/* Game Area */}
        <section className="flex flex-col items-center justify-center bg-[radial-gradient(circle,#0a0a0a_0%,#000_100%)] border border-border-dim relative rounded overflow-hidden">
          <SnakeGame onScoreChange={handleScoreChange} />
          <div className="mt-5 font-mono text-[11px] text-[#444] uppercase tracking-widest">
            PRESS [W/A/S/D] TO OVERRIDE SYSTEM
          </div>
        </section>

        {/* Right Sidebar */}
        <aside className="panel-bg border border-border-dim rounded flex flex-col overflow-hidden">
          <div className="p-[15px] border-b border-border-dim font-mono text-xs text-[#888] uppercase">
            Visual Analysis
          </div>
          <div className="p-5 flex-1 flex flex-col justify-center items-center">
            <div className="flex items-end gap-[2px] h-10">
              <motion.div className="w-[3px] bg-neon-magenta opacity-70" animate={{ height: ['60%', '80%', '40%', '60%'] }} transition={{ duration: 0.5, repeat: Infinity }} />
              <motion.div className="w-[3px] bg-neon-magenta opacity-70" animate={{ height: ['80%', '40%', '90%', '80%'] }} transition={{ duration: 0.7, repeat: Infinity }} />
              <motion.div className="w-[3px] bg-neon-magenta opacity-70" animate={{ height: ['40%', '90%', '70%', '40%'] }} transition={{ duration: 0.6, repeat: Infinity }} />
              <motion.div className="w-[3px] bg-neon-magenta opacity-70" animate={{ height: ['90%', '70%', '30%', '90%'] }} transition={{ duration: 0.8, repeat: Infinity }} />
              <motion.div className="w-[3px] bg-neon-magenta opacity-70" animate={{ height: ['70%', '30%', '100%', '70%'] }} transition={{ duration: 0.4, repeat: Infinity }} />
              <motion.div className="w-[3px] bg-neon-magenta opacity-70" animate={{ height: ['30%', '100%', '50%', '30%'] }} transition={{ duration: 0.9, repeat: Infinity }} />
              <motion.div className="w-[3px] bg-neon-magenta opacity-70" animate={{ height: ['100%', '50%', '85%', '100%'] }} transition={{ duration: 0.5, repeat: Infinity }} />
              <motion.div className="w-[3px] bg-neon-magenta opacity-70" animate={{ height: ['50%', '85%', '60%', '50%'] }} transition={{ duration: 0.7, repeat: Infinity }} />
              <motion.div className="w-[3px] bg-neon-magenta opacity-70" animate={{ height: ['85%', '60%', '80%', '85%'] }} transition={{ duration: 0.6, repeat: Infinity }} />
            </div>
            <div className="mt-5 text-center font-mono text-[10px] text-neon-magenta uppercase tracking-widest">
              FREQ ANALYSIS: OPTIMAL
            </div>
          </div>
        </aside>
      </main>

      {/* FOOTER / PLAYER CONTROLS */}
      <footer className="h-[120px] panel-bg border-t border-border-dim flex items-center px-10 gap-[60px] shrink-0">
        <MusicPlayer />
      </footer>
    </div>
  );
}
