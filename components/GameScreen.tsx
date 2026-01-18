
import React, { useState, useEffect, useRef } from 'react';
import { GameEvent, GameState, GameOption } from '../types';
import { STAGE_THEMES } from '../constants';
import { SFX_SOURCES } from '../storyData';
import { getResourcePath } from '../utils/path';
import Typewriter from './Typewriter';

interface Props {
  gameState: GameState;
  events: GameEvent[];
  onOptionSelected: (option: GameOption) => void;
  loading: boolean;
}

// Helper hook to track previous value
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const StatBadge = ({ label, value, colorClass }: { label: string, value: number, colorClass: string }) => {
    const prevValue = usePrevious(value);
    const [diff, setDiff] = useState<number | null>(null);

    useEffect(() => {
        if (prevValue !== undefined && prevValue !== value) {
            setDiff(value - prevValue);
            const timer = setTimeout(() => setDiff(null), 2000); 
            return () => clearTimeout(timer);
        }
    }, [value, prevValue]);

    return (
        <div className={`flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm border-b-2 border-${colorClass} p-0.5 md:p-1 w-9 md:w-16 h-8 md:h-auto relative transition-all duration-300 ${diff && diff < 0 ? 'animate-shake bg-red-900/40' : ''}`}>
            <span className={`text-[6px] md:text-[10px] text-${colorClass} uppercase tracking-wider leading-tight`}>{label}</span>
            <span className={`text-[10px] md:text-lg font-bold font-mono text-white leading-tight`}>{Math.floor(value)}</span>
            
            {diff !== null && diff !== 0 && (
                <div className={`absolute -bottom-5 left-0 right-0 text-center font-bold font-mono text-xs animate-bounce ${diff > 0 ? 'text-cyan-400' : 'text-red-500'}`}>
                    {diff > 0 ? '+' : ''}{Math.floor(diff)}
                </div>
            )}
        </div>
    );
};

const CashDisplay = ({ cash }: { cash: number }) => {
    const prevCash = usePrevious(cash);
    const [diff, setDiff] = useState<number | null>(null);

    useEffect(() => {
        if (prevCash !== undefined && prevCash !== cash) {
            setDiff(cash - prevCash);
            const timer = setTimeout(() => setDiff(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [cash, prevCash]);

    return (
        <div className="relative mr-0.5 md:mr-3">
            <div className={`font-mono text-[10px] md:text-xl font-bold leading-tight ${cash < 0 ? 'text-red-500 neon-text' : 'text-cyan-400 neon-text'}`}>
                ¥{cash.toLocaleString()}
            </div>
            {diff !== null && diff !== 0 && (
                <div className={`absolute top-full right-0 text-xs font-bold font-mono animate-bounce ${diff > 0 ? 'text-cyan-300' : 'text-red-400'}`}>
                    {diff > 0 ? '+' : ''}{diff.toLocaleString()}
                </div>
            )}
        </div>
    );
};

const GameScreen: React.FC<Props> = ({ gameState, events, onOptionSelected, loading }) => {
  const currentEvent = events[gameState.currentEventIndex];
  const theme = STAGE_THEMES[gameState.stage];
  
  const [dialogueIndex, setDialogueIndex] = useState(-1);
  const [showOptions, setShowOptions] = useState(false);
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [instantText, setInstantText] = useState(false);
  
  // SFX Refs
  const damageSfx = useRef<HTMLAudioElement | null>(null);

  // Visual Damage Feedback State
  const prevHealth = usePrevious(gameState.stats.health);
  const prevMental = usePrevious(gameState.stats.mental);
  const [damageFlash, setDamageFlash] = useState<'none' | 'health' | 'mental'>('none');

  // Init SFX
  useEffect(() => {
    damageSfx.current = new Audio(SFX_SOURCES.DAMAGE_IMPACT);
    damageSfx.current.volume = 0.4;
  }, []);

  // Trigger damage flash & sound
  useEffect(() => {
      if (prevHealth !== undefined && gameState.stats.health < prevHealth) {
          setDamageFlash('health');
          damageSfx.current?.play().catch(() => {});
          setTimeout(() => setDamageFlash('none'), 500);
      } else if (prevMental !== undefined && gameState.stats.mental < prevMental) {
          setDamageFlash('mental');
          damageSfx.current?.play().catch(() => {});
          setTimeout(() => setDamageFlash('none'), 500);
      }
  }, [gameState.stats.health, gameState.stats.mental, prevHealth, prevMental]);


  // Reset state when event changes
  useEffect(() => {
    if (currentEvent) {
        setDialogueIndex(-1);
        setShowOptions(false);
        setIsTypingDone(false);
        setInstantText(false);
    }
  }, [currentEvent, theme.title]);

  // Reset state when dialogue line changes
  useEffect(() => {
      setInstantText(false);
      // Only reset isTypingDone if dialogue index actually changes to a new dialogue
      if (dialogueIndex >= 0) {
          setIsTypingDone(false);
      }
  }, [dialogueIndex]);

  const handleScreenTap = () => {
      if (showOptions) return; // Don't do anything if options are shown

      // 1. If typing is NOT done, force it to finish instantly (SKIP)
      if (!isTypingDone) {
          setInstantText(true);
          // Force completion after a brief delay to ensure state updates
          setTimeout(() => {
              setIsTypingDone(true);
          }, 100);
          return;
      }

      // 2. If typing IS done, proceed to next step (ADVANCE)
      // Check if we have dialogue to show
      if (currentEvent.dialogue && currentEvent.dialogue.length > 0) {
          // If we are currently showing description (-1), move to first dialogue (0)
          if (dialogueIndex === -1) {
              setDialogueIndex(0);
              setIsTypingDone(false); // Reset for dialogue typing
          } 
          // If we are in dialogue sequence
          else if (dialogueIndex >= 0 && dialogueIndex < currentEvent.dialogue.length - 1) {
              setDialogueIndex(prev => prev + 1);
              setIsTypingDone(false); // Reset for next dialogue typing
          }
          // End of dialogue
          else {
               setDialogueIndex(-2); // Hide dialogue
               setShowOptions(true);
          }
      } else {
          // No dialogue, show options directly after description
          setShowOptions(true);
      }
  };

  const handleDescriptionComplete = () => {
      setIsTypingDone(true);
  };
  
  const handleDialogueComplete = () => {
      setIsTypingDone(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-cyan-400 p-8 text-center space-y-6">
        <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full animate-ping"></div>
            <div className="absolute inset-2 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div>
            <h2 className="text-2xl font-bold cyber-font tracking-widest animate-pulse">LOADING SIMULATION</h2>
            <p className="text-sm text-cyan-800 mt-2 font-mono">Generating Scenarios...</p>
        </div>
      </div>
    );
  }

  if (!currentEvent) {
    return (
        <div className="flex items-center justify-center h-screen text-red-500 font-mono">
             SYSTEM ERROR: EVENT DATA CORRUPTED [INDEX_OOB]
        </div>
    );
  }

  const currentDialogueLine = (currentEvent.dialogue && dialogueIndex >= 0 && dialogueIndex < currentEvent.dialogue.length)
    ? currentEvent.dialogue[dialogueIndex]
    : null;

  return (
    <div 
      className="h-full w-full bg-black text-zinc-100 overflow-hidden relative font-sans select-none" 
      onClick={handleScreenTap}
      onTouchEnd={(e) => {
        // Prevent double-tap zoom on mobile
        e.preventDefault();
        handleScreenTap();
      }}
      style={{ touchAction: 'manipulation' }}
    >
      <div className="scanlines"></div>
      
      {/* 0. BACKGROUND LAYER */}
      <div className="absolute inset-0 z-0">
          {currentEvent.backgroundImage ? (
             <img 
                src={currentEvent.backgroundImage} 
                alt="Scene" 
                className="w-full h-full object-cover opacity-60 transition-opacity duration-1000"
             />
           ) : (
             <div className="w-full h-full bg-zinc-900" />
           )}
           {/* Heavy gradient at bottom to ensure text readability */}
           <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/30"></div>
           <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: `url('${getResourcePath('/noise.svg')}')` }}></div>
      </div>

      {/* Damage Flash Overlay */}
      <div className={`absolute inset-0 z-50 pointer-events-none transition-opacity duration-300 ${damageFlash === 'health' ? 'bg-red-900/60 opacity-100' : 'opacity-0'}`}></div>
      <div className={`absolute inset-0 z-50 pointer-events-none transition-opacity duration-100 ${damageFlash === 'mental' ? 'bg-white/30 mix-blend-difference opacity-100' : 'opacity-0'}`}></div>

      {/* 1. HUD LAYER (Fixed Top) */}
      <header className="fixed top-0 left-0 right-0 z-40 px-2 md:px-4 pt-1 md:pt-2 pb-1 md:pb-2 flex items-start justify-between bg-gradient-to-b from-black/95 via-black/90 to-transparent pointer-events-none" style={{ minHeight: 'auto' }}>
        <div className="flex flex-col flex-shrink-0">
             <div className="text-[9px] md:text-[10px] text-cyan-400 cyber-font border border-cyan-500/50 px-1 md:px-1.5 py-0.5 rounded bg-black/50 w-max mb-0.5 whitespace-nowrap">
                STAGE {gameState.stage + 1}
             </div>
             <div className="text-[9px] md:text-xs font-bold text-zinc-300 cyber-font tracking-wider opacity-80 max-w-[90px] md:max-w-[120px] leading-tight mt-0.5">
                {theme.title}
             </div>
        </div>
        
        <div className="flex space-x-0.5 md:space-x-1.5 items-center flex-shrink-0 flex-wrap justify-end gap-x-0.5 md:gap-x-1.5">
            <CashDisplay cash={gameState.stats.cash} />
            <StatBadge label="HP" value={gameState.stats.health} colorClass="rose-500" />
            <StatBadge label="PSY" value={gameState.stats.mental} colorClass="cyan-400" />
            <StatBadge label="KAR" value={gameState.stats.moral} colorClass="amber-400" />
        </div>
      </header>

      {/* 2. MAIN CONTENT LAYER (Scrollable Description + Fixed Interactions) */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between pt-14 md:pt-20 pb-8 px-5">
          
          {/* A. Narrative Description (Top/Middle) */}
          <div className="flex-1 overflow-y-auto custom-scrollbar mb-4 relative">
             <div className="animate-fade-in-up">
                <span className={`inline-block text-[10px] px-2 py-[2px] mb-2 border ${currentEvent.type === 'core' ? 'border-cyan-500 text-cyan-400' : 'border-rose-500 text-rose-400'} tracking-widest uppercase bg-black/60 backdrop-blur-md rounded-sm`}>
                    {currentEvent.type === 'core' ? 'Main Sequence' : 'Random Encounter'}
                </span>
                <h2 className="text-2xl font-bold text-white mb-4 cyber-font leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {currentEvent.title}
                </h2>
                
                <div 
                    className={`text-zinc-100 text-base leading-relaxed font-light p-4 bg-black/40 backdrop-blur-md border-l-2 border-cyan-500/50 rounded-r-lg shadow-lg min-h-[100px] transition-all duration-300 ${dialogueIndex !== -1 ? 'opacity-50 scale-[0.98]' : 'hover:bg-black/50'}`}
                >
                    <Typewriter 
                        text={currentEvent.description} 
                        speed={20} 
                        enableSound={false}
                        instant={instantText}
                        onComplete={handleDescriptionComplete}
                    />
                </div>
                {dialogueIndex === -1 && !showOptions && isTypingDone && (
                     <div className="text-right mt-2">
                        <span className="text-[10px] text-cyan-400 animate-bounce cursor-pointer">▼ CLICK TO CONTINUE</span>
                     </div>
                )}
             </div>
          </div>

          {/* B. Interactions Area (Bottom) */}
          <div className="min-h-[180px] flex flex-col justify-end">
              
            {/* STATE: Dialogue Active */}
            {currentDialogueLine && !showOptions && (
                 <div className="animate-fade-in-up w-full">
                     <div 
                        className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-600 rounded-lg p-5 relative shadow-[0_0_30px_rgba(0,0,0,0.8)] cursor-pointer hover:border-zinc-500 active:border-zinc-400 transition-colors mt-2"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleScreenTap();
                        }}
                        onTouchEnd={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleScreenTap();
                        }}
                        style={{ touchAction: 'manipulation' }}
                     >
                        {/* Speaker Tag */}
                        <div className="absolute -top-3 left-4 bg-cyan-900 text-white text-xs font-bold px-3 py-1 rounded-sm border border-cyan-500 shadow-lg uppercase tracking-wider">
                            {currentDialogueLine.speaker}
                        </div>
                        
                        <div className="mt-2 text-lg text-zinc-100 leading-snug">
                            <Typewriter 
                                text={currentDialogueLine.text} 
                                speed={25} 
                                enableSound={true}
                                instant={instantText}
                                onComplete={handleDialogueComplete}
                            />
                        </div>
                        
                        <div className="mt-3 flex justify-end min-h-[16px]">
                             {isTypingDone && <span className="text-[10px] text-cyan-400 animate-pulse">▼ CLICK TO NEXT</span>}
                        </div>
                     </div>
                 </div>
            )}

            {/* STATE: Options Active */}
            {showOptions && (
                 <div className="space-y-3 animate-fade-in-up w-full">
                     <div className="text-center mb-2">
                        <span className="text-[10px] text-cyan-400/70 border-b border-cyan-500/30 pb-1 uppercase tracking-[0.2em]">Awaiting Input</span>
                     </div>
                     {currentEvent.options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onOptionSelected(option);
                            }}
                            onTouchEnd={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onOptionSelected(option);
                            }}
                            className="w-full relative group bg-zinc-900/90 backdrop-blur-md border border-zinc-600 active:border-cyan-400 active:bg-zinc-800 p-4 text-left rounded-lg transition-all shadow-lg active:scale-[0.98]"
                            style={{ touchAction: 'manipulation' }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-white text-base mb-1 cyber-font group-active:text-cyan-400">
                                        {option.label}
                                    </div>
                                    <div className="text-[10px] text-zinc-400 font-mono">
                                        {idx === 0 ? ">> OPTION_ALPHA" : ">> OPTION_BETA"}
                                    </div>
                                </div>
                                <div className="text-zinc-600 group-active:text-cyan-400 text-xl">
                                    ›
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
            
          </div>
      </div>
    </div>
  );
};

export default GameScreen;
