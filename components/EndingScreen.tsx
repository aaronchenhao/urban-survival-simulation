import React from 'react';
import { GameState } from '../types';

interface Props {
  gameState: GameState;
  onRestart: () => void;
}

const EndingScreen: React.FC<Props> = ({ gameState, onRestart }) => {
  const { endingType, endingReason, stats } = gameState;

  let title = "";
  let stamp = "";
  let color = "";
  let status = "";

  switch (endingType) {
    case 'slaughtered':
      title = "CITIZEN TERMINATED";
      stamp = "WASTED";
      color = "text-red-600";
      status = "DECEASED / INSOLVENT";
      break;
    case 'survival':
      title = "RESIDENCY RENEWED";
      stamp = "APPROVED";
      color = "text-blue-400";
      status = "ACTIVE CITIZEN";
      break;
    case 'success':
      title = "CLASS ASCENSION";
      stamp = "ELITE";
      color = "text-emerald-400";
      status = "PLATINUM MEMBER";
      break;
    default:
      title = "FILE CLOSED";
  }

  return (
    <div className="flex flex-col h-full bg-zinc-950 p-6 items-center justify-center relative overflow-hidden">
      {/* Background noise */}
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>
      <div className="absolute inset-0 border-8 border-double border-zinc-800 pointer-events-none m-4"></div>

      {/* Report Card */}
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-700 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative p-8 transform rotate-1">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-zinc-700 pb-4 mb-6">
            <div>
                <div className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] mb-1">CITY ADMINISTRATION // FINAL REPORT</div>
                <h1 className={`text-3xl md:text-4xl font-bold cyber-font leading-none ${color}`}>{title}</h1>
            </div>
            <div className="w-16 h-16 border border-zinc-600 bg-zinc-800 flex items-center justify-center">
                <span className="text-4xl">💀</span>
            </div>
        </div>

        {/* Status Stamp */}
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-4 ${color} ${color.replace('text', 'border')} p-4 rounded text-5xl font-black opacity-30 rotate-[-15deg] pointer-events-none uppercase tracking-widest`}>
            {stamp}
        </div>

        {/* Content */}
        <div className="space-y-6 font-mono text-sm relative z-10">
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/50 p-3 border border-zinc-800">
                    <span className="text-zinc-500 block text-xs mb-1">CITIZEN STATUS</span>
                    <span className="text-zinc-200 font-bold">{status}</span>
                </div>
                <div className="bg-black/50 p-3 border border-zinc-800">
                    <span className="text-zinc-500 block text-xs mb-1">DURATION</span>
                    <span className="text-zinc-200 font-bold">{gameState.stage} / 6 CYCLES</span>
                </div>
            </div>

            <div className="bg-black/50 p-4 border border-zinc-800">
                <span className="text-zinc-500 block text-xs mb-2 uppercase">Cause of Termination / Notes</span>
                <p className="text-zinc-300 leading-relaxed italic border-l-2 border-zinc-700 pl-3">
                    "{endingReason}"
                </p>
            </div>

            <div className="bg-black/50 p-4 border border-zinc-800">
                <span className="text-zinc-500 block text-xs mb-3 uppercase border-b border-zinc-800 pb-1">Final Asset Valuation</span>
                <div className="flex justify-between items-end">
                    <span className="text-zinc-400">LIQUID CASH</span>
                    <span className="text-xl font-bold text-white">¥{Math.floor(stats.cash).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-end mt-2">
                    <span className="text-zinc-400">ASSETS</span>
                    <span className="text-zinc-300">¥{(gameState.config.deposit + gameState.config.stocks + gameState.config.funds).toLocaleString()}</span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
                 <div className="bg-zinc-800 p-2 rounded">
                    <div className="text-[10px] text-zinc-500">HP</div>
                    <div className={`font-bold ${stats.health < 20 ? 'text-red-500' : 'text-zinc-300'}`}>{stats.health}</div>
                 </div>
                 <div className="bg-zinc-800 p-2 rounded">
                    <div className="text-[10px] text-zinc-500">PSY</div>
                    <div className={`font-bold ${stats.mental < 20 ? 'text-red-500' : 'text-zinc-300'}`}>{stats.mental}</div>
                 </div>
                 <div className="bg-zinc-800 p-2 rounded">
                    <div className="text-[10px] text-zinc-500">KAR</div>
                    <div className={`font-bold ${stats.moral < 20 ? 'text-red-500' : 'text-zinc-300'}`}>{stats.moral}</div>
                 </div>
            </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-zinc-700 flex justify-between items-center">
            <div className="text-[10px] text-zinc-600">
                SYS_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
            </div>
            <button
                onClick={onRestart}
                className="bg-emerald-800 hover:bg-emerald-700 text-emerald-100 px-6 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors border border-emerald-600"
            >
                Re-Initialize
            </button>
        </div>
      </div>
    </div>
  );
};

export default EndingScreen;