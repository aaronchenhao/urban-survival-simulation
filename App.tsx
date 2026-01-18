
import React, { useState, useEffect, useMemo } from 'react';
import { GameConfig, GameState, GameEvent, GameOption, PlayerStats } from './types';
import { INITIAL_CASH, MAX_STATS, CRITICAL_THRESHOLD, COSTS, SALARY_BASE_INITIAL, DEBT_INTEREST_RATE, THRESHOLDS } from './constants';
import AllocationScreen from './components/AllocationScreen';
import GameScreen from './components/GameScreen';
import SummaryScreen from './components/SummaryScreen';
import EndingScreen from './components/EndingScreen';
import AudioManager from './components/AudioManager';
import { generateStageEvents } from './services/geminiService';

// Background Matrix/Code Effect Component for Intro
const MatrixBackground = () => {
    // Use useMemo to ensure consistent content across renders
    const codeLines = useMemo(() => {
        return Array(60).fill(0).map((_, i) => {
            const hex = Math.random().toString(16).substr(2, 8).toUpperCase();
            const hex2 = Math.random().toString(16).substr(2, 6).toUpperCase();
            const errCode = Math.floor(Math.random() * 9000) + 1000;
            const size = (Math.random() * 100).toFixed(2);
            // More "Data World" feeling text
            return `0x${hex} :: SYSTEM_KERNEL_PANIC [ERR_${errCode}] \n` +
                   `   >> UPLOADING_USER_DATA... ${size}TB \n` + 
                   `   >> OVERRIDE_PROTOCOL_INITIATED [${hex2}] \n` +
                   `   WARNING: REALITY_INTEGRITY_CRITICAL... \n`;
        }).join('');
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-black">
            {/* The Code Stream - Faster (25s), Brighter, Clearer */}
            <div className="absolute inset-0 animate-[slideUp_25s_linear_infinite] font-mono text-emerald-500/50 text-lg md:text-2xl leading-relaxed whitespace-pre-wrap break-all p-4 select-none z-0 filter blur-[0.3px]">
                {codeLines}
                {codeLines} {/* Repeat for looping effect */}
            </div>
            
            {/* Much Lighter Gradient Overlay - Only darkens the very edges */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.3)_0%,rgba(0,0,0,0.8)_80%,rgba(0,0,0,1)_100%)] z-10"></div>
            
            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(0); }
                    to { transform: translateY(-50%); }
                }
            `}</style>
        </div>
    );
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    screen: 'intro',
    stage: 0,
    config: {
      rentType: 'cheap',
      carType: 'none',
      deposit: 0,
      stocks: 0,
      funds: 0,
      insurance: false
    },
    stats: {
      cash: INITIAL_CASH,
      health: 80,
      mental: 80,
      moral: 80
    },
    baseSalary: SALARY_BASE_INITIAL,
    history: [],
    currentEvents: [],
    currentEventIndex: 0,
    totalDebt: 0,
    isGameOver: false
  });

  const [isLoading, setIsLoading] = useState(false);

  // Initial Setup Complete
  const handleAllocationComplete = (config: GameConfig, initialCash: number) => {
    setGameState(prev => ({
      ...prev,
      config,
      stats: {
        ...prev.stats,
        cash: initialCash
      },
      screen: 'game'
    }));
  };

  // Fetch events when entering a new stage (game screen)
  useEffect(() => {
    if (gameState.screen === 'game' && gameState.currentEvents.length === 0 && !gameState.isGameOver) {
      setIsLoading(true);
      generateStageEvents(gameState)
        .then(events => {
          setGameState(prev => ({
            ...prev,
            currentEvents: events,
            currentEventIndex: 0
          }));
        })
        .finally(() => setIsLoading(false));
    }
  }, [gameState.screen, gameState.stage, gameState.currentEvents.length, gameState.isGameOver]);

  const checkGameOver = (stats: PlayerStats, debt: number, totalAssets: number, trigger: string) => {
    // 1. Debt check: If debt exceeds assets significantly, instant death
    if (debt > totalAssets + 50000) { // Buffer of 50k
        return { 
            isOver: true, 
            type: 'slaughtered' as const, 
            reason: `【信用破产】因为"${trigger}"引发的连锁反应，你的资产结构彻底崩盘。清道夫甚至没有敲门，直接用激光切割了你的门锁。` 
        };
    }
    
    // 2. Health Critical
    if (stats.health <= 0) {
        return { 
            isOver: true, 
            type: 'slaughtered' as const, 
            reason: `【生理机能停止】"${trigger}"带来的肉体创伤击穿了你的生理极限。你的义体因供能不足停止运转，心脏在电流过载中停跳。` 
        };
    }

    // 3. Mental Critical
    if (stats.mental <= 0) {
         return { 
            isOver: true, 
            type: 'slaughtered' as const, 
            reason: `【意识丧失】"${trigger}"带来的精神冲击导致了不可逆的突触熔毁。你陷入了永久性的赛博精神错乱，被暴恐机动队当场无害化处理。` 
        };
    }

    // 4. Critical Stats Check (Multi-failure)
    let criticalCount = 0;
    if (stats.health <= CRITICAL_THRESHOLD) criticalCount++;
    if (stats.mental <= CRITICAL_THRESHOLD) criticalCount++;
    if (stats.moral <= CRITICAL_THRESHOLD) criticalCount++;

    if (criticalCount >= 2) {
        return { 
            isOver: true, 
            type: 'slaughtered' as const, 
            reason: `【系统性崩溃】长期的高压生活与"${trigger}"的余波导致你的身心全面崩盘。你在雨夜的街头毫无尊严地倒下，成为了这座城市无数无名尸体中的一具。` 
        };
    }

    return { isOver: false };
  };

  const calculateTotalAssets = (state: GameState) => {
    let assets = state.stats.cash > 0 ? state.stats.cash : 0;
    assets += state.config.deposit;
    assets += state.config.stocks;
    assets += state.config.funds;
    if (state.config.carType === 'gas') assets += COSTS.CAR_GAS_PRICE * 0.6; 
    if (state.config.carType === 'electric') assets += COSTS.CAR_ELEC_PRICE * 0.4;
    return assets;
  };

  const handleOptionSelected = (option: GameOption) => {
    setGameState(prev => {
      const newStats = {
        cash: prev.stats.cash + option.effect.cash,
        health: Math.min(MAX_STATS, Math.max(0, prev.stats.health + option.effect.health)),
        mental: Math.min(MAX_STATS, Math.max(0, prev.stats.mental + option.effect.mental)),
        moral: Math.min(MAX_STATS, Math.max(0, prev.stats.moral + option.effect.moral))
      };
      
      const gameOverCheck = checkGameOver(
          newStats, 
          newStats.cash < 0 ? Math.abs(newStats.cash) : 0, 
          calculateTotalAssets({...prev, stats: newStats}),
          option.label
      );

      if (gameOverCheck.isOver) {
        return {
          ...prev,
          stats: newStats,
          isGameOver: true,
          screen: 'ending',
          endingType: gameOverCheck.type,
          endingReason: gameOverCheck.reason
        };
      }

      const nextIndex = prev.currentEventIndex + 1;
      const isStageDone = nextIndex >= prev.currentEvents.length;

      return {
        ...prev,
        stats: newStats,
        currentEventIndex: nextIndex,
        screen: isStageDone ? 'summary' : 'game',
        history: [...prev.history, `Stage ${prev.stage}: Selected ${option.label} (${option.effect.description})`]
      };
    });
  };

  // Accepting investmentIncome calculated in SummaryScreen
  const handleStageSummaryContinue = (investmentIncome: number, newRentType?: 'homeless' | 'cheap' | 'expensive') => {
    setGameState(prev => {
      // 1. Calculate Finances based on PREVIOUS cycle config
      let rentCost = 0;
      if (prev.config.rentType === 'cheap') rentCost = COSTS.RENT_CHEAP * 6;
      else if (prev.config.rentType === 'expensive') rentCost = COSTS.RENT_EXPENSIVE * 6;
      // Homeless = 0 rent

      const livingCost = COSTS.LIVING_EXPENSE * 6;
      const carCost = prev.config.carType === 'none' ? 0 : 
                      (prev.config.carType === 'gas' ? COSTS.CAR_GAS_MAINTENANCE : COSTS.CAR_ELEC_MAINTENANCE) * 6;
      const income = prev.baseSalary * 6;
      
      const currentDebt = prev.stats.cash < 0 ? Math.abs(prev.stats.cash) : 0;
      const interest = currentDebt * DEBT_INTEREST_RATE; 
      
      // Use passed investment income
      let newCash = prev.stats.cash + income - rentCost - livingCost - carCost - interest + investmentIncome;

      // 2. Career & Stat Dynamic Adjustments (The "Snowball" Logic)
      let newBaseSalary = prev.baseSalary;
      let healthPenalty = 0;
      let mentalPenalty = 0;

      // Homeless Penalty Logic for the PREVIOUS cycle
      if (prev.config.rentType === 'homeless') {
          healthPenalty += COSTS.HOMELESS_PENALTY_HP;
          mentalPenalty += COSTS.HOMELESS_PENALTY_PSY;
      }
      
      // If stats are high, get promoted
      if (prev.stats.health >= THRESHOLDS.HIGH_PERFORMANCE_STAT && prev.stats.mental >= THRESHOLDS.HIGH_PERFORMANCE_STAT) {
          newBaseSalary = Math.floor(prev.baseSalary * 1.2); // 20% Raise
      } 
      // If stats are low, get salary cut or medical bills
      else if (prev.stats.health <= THRESHOLDS.LOW_PERFORMANCE_STAT || prev.stats.mental <= THRESHOLDS.LOW_PERFORMANCE_STAT) {
          newBaseSalary = Math.floor(prev.baseSalary * 0.9); // 10% Cut
          newCash -= 5000; // Extra medical bill
      } else {
          // Standard cost of living adjustment
          newBaseSalary = Math.floor(prev.baseSalary * 1.05);
      }

      const newStats = { 
          ...prev.stats, 
          cash: newCash,
          health: Math.max(0, prev.stats.health - healthPenalty),
          mental: Math.max(0, prev.stats.mental - mentalPenalty)
      };

      const totalAssets = calculateTotalAssets({...prev, stats: newStats});
      const newDebt = newCash < 0 ? Math.abs(newCash) : 0;

      // 3. Check Survival
      const gameOverCheck = checkGameOver(newStats, newDebt, totalAssets, "月度账单结算");
      if (gameOverCheck.isOver) {
          return {
              ...prev,
              stats: newStats,
              screen: 'ending',
              isGameOver: true,
              endingType: gameOverCheck.type,
              endingReason: gameOverCheck.reason
          };
      }

      // 4. Game End Check (Stage 6)
      if (prev.stage >= 5) {
          const netWorth = totalAssets - newDebt;
          let type: 'slaughtered' | 'survival' | 'success' = 'slaughtered';
          let reason = "";
          
          if (netWorth >= THRESHOLDS.SUCCESS_CASH) {
              type = 'success';
              reason = "你完成了不可能的挑战。通过极度的自律、精准的决策以及对机遇的把握，你跨越了阶级壁垒，成为了这座城市的掌控者之一。";
          } else if (netWorth >= THRESHOLDS.SURVIVAL_CASH && prev.stats.health > 20 && prev.stats.mental > 20) {
              type = 'survival';
              reason = "你在绞肉机般的城市中活了下来。虽然没有大富大贵，但你守住了自己的底线和生活。你是那9%的幸存者。";
          } else {
              type = 'slaughtered';
              reason = "虽然你撑到了最后，但除去债务和损耗，你几乎一无所有。你在城市中耗尽了青春，最终成为了废弃的燃料。";
          }

          return {
              ...prev,
              stats: newStats,
              screen: 'ending',
              endingType: type,
              endingReason: reason,
              isGameOver: true
          };
      }

      // 5. Next Stage
      return {
        ...prev,
        stage: prev.stage + 1,
        baseSalary: newBaseSalary,
        stats: newStats,
        config: {
            ...prev.config,
            rentType: newRentType || prev.config.rentType // Update rent type if changed
        },
        screen: 'game',
        currentEvents: [],
        currentEventIndex: 0
      };
    });
  };

  const handleAdjustAsset = (type: 'deposit' | 'stocks' | 'funds', amount: number) => {
    setGameState(prev => {
        if (amount > 0 && prev.stats.cash < amount) return prev; 
        if (amount < 0 && prev.config[type] < Math.abs(amount)) return prev;

        const newConfig = { ...prev.config };
        newConfig[type] += amount;
        
        const newStats = { ...prev.stats };
        newStats.cash -= amount;

        return {
            ...prev,
            config: newConfig,
            stats: newStats
        };
    });
  };

  const handleSellCar = () => {
    setGameState(prev => {
        if (prev.config.carType === 'none') return prev;
        
        let cashAdded = 0;
        if (prev.config.carType === 'gas') cashAdded = COSTS.CAR_GAS_PRICE * 0.6; 
        if (prev.config.carType === 'electric') cashAdded = COSTS.CAR_ELEC_PRICE * 0.4;

        return {
            ...prev,
            config: { ...prev.config, carType: 'none' },
            stats: { ...prev.stats, cash: prev.stats.cash + cashAdded }
        };
    });
  };

  if (gameState.screen === 'intro') {
      return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4 md:p-8 text-center relative overflow-y-auto font-sans">
              <AudioManager gameState={gameState} />
              
              {/* Animated Scanlines + Matrix */}
              <div className="scanlines z-10"></div>
              <MatrixBackground />
              
              {/* Content Container with proper spacing for mobile */}
              <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen py-8 md:py-12">
                  {/* Hero Section */}
                  <div className="z-20 flex flex-col items-center mb-6 md:mb-12 animate-fade-in-up">
                      <div className="border border-cyan-500/50 bg-cyan-950/20 px-4 py-1 rounded-sm text-[10px] tracking-[0.4em] text-cyan-400 mb-4 md:mb-6 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                          SYSTEM_READY // VER 4.2
                      </div>
                      <h1 className="text-4xl md:text-7xl font-bold tracking-tighter cyber-font text-white mb-2 glitch-effect relative drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" data-text="URBAN SURVIVAL">
                          URBAN SURVIVAL
                      </h1>
                      <h2 className="text-xl md:text-3xl text-cyan-500 cyber-font tracking-[0.2em] uppercase neon-text opacity-90">
                          都市生存模拟
                      </h2>
                  </div>
                  
                  {/* Lore/Context - Cleaned up visual hierarchy */}
                  <div className="relative z-20 max-w-2xl mx-auto text-center space-y-4 md:space-y-8 mb-8 md:mb-12 px-4 md:px-6 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                      
                      {/* Warning Box - Less "Christmassy", more "System Alert" */}
                      <div className="inline-block border-l-2 border-rose-500 bg-gradient-to-r from-rose-950/40 to-transparent px-4 md:px-6 py-2">
                          <span className="text-rose-400 font-bold tracking-widest text-xs md:text-base flex items-center gap-2 md:gap-3">
                              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping"></span>
                              ALERT: CREDIT SCORE CRITICAL
                          </span>
                      </div>
                      
                      <div className="space-y-3 md:space-y-4">
                          <p className="text-base md:text-2xl text-zinc-300 leading-relaxed font-light">
                              在这座被数据吞噬的霓虹废墟里，<br className="hidden md:block"/>
                              你不是公民，只是一个 <span className="text-cyan-100 font-bold border-b border-cyan-500/50 pb-1">待消耗的电池</span>。
                          </p>
                          
                          <p className="text-sm md:text-lg text-zinc-400 leading-relaxed max-w-xl mx-auto">
                              房租、贷款、医疗费、消费陷阱……<br/>
                              世界已被折叠，只为将你 <span className="text-rose-400 font-bold neon-text">永远囚禁在底层</span>。
                          </p>
                      </div>

                      <div className="pt-2 md:pt-4">
                           <p className="text-base md:text-2xl text-zinc-200 flex flex-col md:flex-row items-center justify-center gap-2">
                              哪怕只有 <span className="text-cyan-400 font-bold text-2xl md:text-5xl glitch-effect drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">1%</span> 的机会，
                          </p>
                          <p className="text-base md:text-2xl text-white font-bold mt-2">
                              你敢撕开这虚幻的幕布吗？
                          </p>
                      </div>
                  </div>

                  {/* Start Button Area - Fixed position on mobile, centered on desktop */}
                  <div className="z-20 w-full max-w-xs flex flex-col items-center space-y-4 md:space-y-6 animate-fade-in-up pb-8 md:pb-0" style={{animationDelay: '0.4s'}}>
                      <button 
                          onClick={() => setGameState(prev => ({ ...prev, screen: 'allocation' }))}
                          className="w-full bg-transparent hover:bg-cyan-500/10 text-cyan-400 font-bold text-lg md:text-xl py-4 md:py-5 transition-all duration-300 shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] tracking-[0.25em] border border-cyan-500 rounded-sm relative group overflow-hidden"
                      >
                          <span className="relative z-10 group-hover:text-white transition-colors">接受挑战</span>
                          {/* Scanline passing through button */}
                          <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent skew-x-[-20deg] group-hover:animate-[shine_1s_ease-in-out_infinite]"></div>
                      </button>
                      <p className="text-[10px] text-zinc-500 font-mono text-center max-w-[240px] leading-tight opacity-60 px-2">
                          *点击即代表您已签署《个人意识数据让渡协议》并放弃一切追索权。
                      </p>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="h-screen w-full bg-zinc-900 text-zinc-100 overflow-hidden font-sans">
      <AudioManager gameState={gameState} />
      {gameState.screen === 'allocation' && <AllocationScreen onComplete={handleAllocationComplete} />}
      {gameState.screen === 'game' && (
        <GameScreen 
            gameState={gameState} 
            events={gameState.currentEvents} 
            onOptionSelected={handleOptionSelected}
            loading={isLoading}
        />
      )}
      {gameState.screen === 'summary' && (
        <SummaryScreen 
            gameState={gameState} 
            onContinue={handleStageSummaryContinue}
            onAdjustAsset={handleAdjustAsset}
            onSellCar={handleSellCar}
        />
      )}
      {gameState.screen === 'ending' && (
        <EndingScreen 
            gameState={gameState}
            onRestart={() => window.location.reload()}
        />
      )}
      <style>{`
          @keyframes shine {
              0% { left: -100%; }
              100% { left: 200%; }
          }
      `}</style>
    </div>
  );
};

export default App;
