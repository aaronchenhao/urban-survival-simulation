import React, { useState, useEffect } from 'react';
import { GameConfig } from '../types';
import { INITIAL_CASH, COSTS } from '../constants';
import { getResourcePath } from '../utils/path';

interface Props {
  onComplete: (config: GameConfig, initialCash: number) => void;
}

const AllocationScreen: React.FC<Props> = ({ onComplete }) => {
  const [rentType, setRentType] = useState<'cheap' | 'expensive'>('cheap');
  const [carType, setCarType] = useState<'none' | 'gas' | 'electric'>('none');
  const [deposit, setDeposit] = useState<number>(0);
  const [stocks, setStocks] = useState<number>(0);
  const [funds, setFunds] = useState<number>(0);
  const [insurance, setInsurance] = useState<boolean>(false);

  const [remainingCash, setRemainingCash] = useState(INITIAL_CASH);

  useEffect(() => {
    let totalSpent = 0;
    
    if (carType === 'gas') totalSpent += COSTS.CAR_GAS_PRICE;
    if (carType === 'electric') totalSpent += COSTS.CAR_ELEC_PRICE;

    totalSpent += deposit;
    totalSpent += stocks;
    totalSpent += funds;
    if (insurance) totalSpent += COSTS.INSURANCE_PRICE;
    
    setRemainingCash(INITIAL_CASH - totalSpent);
  }, [rentType, carType, deposit, stocks, funds, insurance]);

  const isValid = remainingCash >= 0;

  const handleStart = () => {
    if (isValid) {
      const config: GameConfig = {
        rentType,
        carType,
        deposit,
        stocks,
        funds,
        insurance
      };
      onComplete(config, remainingCash);
    }
  };

  const formatMoney = (val: number) => `¥${val.toLocaleString()}`;

  return (
    <div className="flex flex-col h-full w-full bg-black text-zinc-100 font-sans select-none overflow-y-auto custom-scrollbar pb-72 md:pb-32 relative">
       {/* Background */}
       <div className="fixed inset-0 pointer-events-none opacity-10" style={{ backgroundImage: `url('${getResourcePath('/noise.svg')}')` }}></div>
       <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-black via-zinc-900/50 to-emerald-900/10"></div>

       <div className="relative z-10 p-4 md:p-6 max-w-lg mx-auto w-full space-y-6 md:space-y-8 animate-fade-in-up">
          
          {/* Header */}
          <header className="border-b border-emerald-500/30 pb-4">
            <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-emerald-500 border border-emerald-500 px-2 py-0.5 rounded uppercase tracking-widest">Setup Wizard v9.2</span>
                <span className="text-[10px] text-zinc-500 font-mono">ID: 8921-X</span>
            </div>
            <h1 className="text-3xl font-bold text-white cyber-font glitch-effect mb-1">INITIALIZE_ASSETS</h1>
            <p className="text-zinc-400 text-xs">Allocating starting capital for urban integration.</p>
          </header>

          {/* Cash Display */}
          <div className="bg-zinc-900/80 border border-zinc-700 p-4 rounded-lg flex justify-between items-center shadow-[0_0_15px_rgba(0,0,0,0.5)]">
             <div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Available Credits</div>
                <div className={`font-mono text-2xl font-bold ${remainingCash < 0 ? 'text-red-500' : 'text-emerald-400'}`}>
                  {formatMoney(remainingCash)}
                </div>
             </div>
             <div className="text-right text-[10px] text-zinc-600">
                INITIAL: ¥200,000<br/>
                STATUS: {remainingCash >= 0 ? 'SOLVENT' : 'INSOLVENT'}
             </div>
          </div>

          {/* 1. Housing */}
          <section className="space-y-3">
             <h2 className="text-sm font-bold text-emerald-500 uppercase tracking-widest flex items-center">
                <span className="w-1.5 h-1.5 bg-emerald-500 mr-2"></span>
                Habitation Protocol // 居住模块
             </h2>
             <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => setRentType('cheap')}
                    className={`relative p-3 rounded border transition-all ${
                        rentType === 'cheap' 
                        ? 'bg-emerald-900/20 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
                        : 'bg-zinc-900 border-zinc-800 opacity-60 hover:opacity-100'
                    }`}
                >
                    <div className="text-left">
                        <div className="font-bold text-sm text-zinc-100">胶囊笼屋 (D区)</div>
                        <div className="text-[10px] text-emerald-400 font-mono mt-1">¥{COSTS.RENT_CHEAP}/mo</div>
                        <div className="text-[10px] text-red-400 mt-2 leading-tight">
                            ⚠️ 混合供氧<br/>⚠️ 辐射超标<br/>📉 SAN值损耗
                        </div>
                    </div>
                </button>
                <button
                    onClick={() => setRentType('expensive')}
                    className={`relative p-3 rounded border transition-all ${
                        rentType === 'expensive' 
                        ? 'bg-emerald-900/20 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
                        : 'bg-zinc-900 border-zinc-800 opacity-60 hover:opacity-100'
                    }`}
                >
                    <div className="text-left">
                        <div className="font-bold text-sm text-zinc-100">智能公寓 (B区)</div>
                        <div className="text-[10px] text-emerald-400 font-mono mt-1">¥{COSTS.RENT_EXPENSIVE}/mo</div>
                        <div className="text-[10px] text-zinc-400 mt-2 leading-tight">
                            ✅ 独立滤镜<br/>✅ 噪音屏蔽<br/>📈 精神恢复
                        </div>
                    </div>
                </button>
             </div>
          </section>

          {/* 2. Mobility */}
          <section className="space-y-3">
             <h2 className="text-sm font-bold text-emerald-500 uppercase tracking-widest flex items-center">
                <span className="w-1.5 h-1.5 bg-emerald-500 mr-2"></span>
                Mobility Solution // 载具模块
             </h2>
             <div className="space-y-2">
                 {/* No Car */}
                 <button
                    onClick={() => setCarType('none')}
                    className={`w-full p-3 rounded border flex justify-between items-center transition-all ${
                        carType === 'none' ? 'bg-emerald-900/20 border-emerald-500' : 'bg-zinc-900 border-zinc-800 opacity-70'
                    }`}
                 >
                    <div className="text-left">
                        <div className="text-sm font-bold">公用磁悬浮 (Public Transit)</div>
                        <div className="text-[10px] text-zinc-500">拥挤，可能遭遇扒手</div>
                    </div>
                    <span className="font-mono text-emerald-400 text-sm">¥0</span>
                 </button>

                 {/* Gas Car -> Retro Combustion */}
                 <button
                    onClick={() => setCarType('gas')}
                    className={`w-full p-3 rounded border flex justify-between items-center transition-all ${
                        carType === 'gas' ? 'bg-emerald-900/20 border-emerald-500' : 'bg-zinc-900 border-zinc-800 opacity-70'
                    }`}
                 >
                    <div className="text-left">
                        <div className="text-sm font-bold">复古内燃机车 (Retro ICE)</div>
                        <div className="text-[10px] text-red-400">高污染税，高维护费，但车价低</div>
                    </div>
                    <span className="font-mono text-red-400 text-sm">-¥{COSTS.CAR_GAS_PRICE.toLocaleString()}</span>
                 </button>

                 {/* Electric -> Hover/Smart */}
                 <button
                    onClick={() => setCarType('electric')}
                    className={`w-full p-3 rounded border flex justify-between items-center transition-all ${
                        carType === 'electric' ? 'bg-emerald-900/20 border-emerald-500' : 'bg-zinc-900 border-zinc-800 opacity-70'
                    }`}
                 >
                    <div className="text-left">
                        <div className="text-sm font-bold">智能浮空舱 (Smart Pod)</div>
                        <div className="text-[10px] text-emerald-400">自动驾驶，极低维护</div>
                    </div>
                    <span className="font-mono text-red-400 text-sm">-¥{COSTS.CAR_ELEC_PRICE.toLocaleString()}</span>
                 </button>
             </div>
          </section>

          {/* 3. Assets */}
          <section className="space-y-3 md:space-y-4">
             <h2 className="text-sm font-bold text-emerald-500 uppercase tracking-widest flex items-center">
                <span className="w-1.5 h-1.5 bg-emerald-500 mr-2"></span>
                Capital Allocation // 资产配置
             </h2>
             
             {/* Deposit -> Corp Bonds */}
             <div className="bg-zinc-900/50 p-3 rounded border border-zinc-800">
                <div className="flex justify-between mb-2">
                    <span className="text-xs text-zinc-300">巨企债券 (低风险)</span>
                    <span className="text-xs font-mono text-emerald-400">{formatMoney(deposit)}</span>
                </div>
                <input
                    type="range" min="0" max="200000" step="10000"
                    value={deposit} onChange={(e) => setDeposit(Number(e.target.value))}
                    className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
             </div>

             {/* Funds -> AI Quant */}
             <div className="bg-zinc-900/50 p-3 rounded border border-zinc-800">
                <div className="flex justify-between mb-2">
                    <span className="text-xs text-zinc-300">AI量化基金 (中风险)</span>
                    <span className="text-xs font-mono text-emerald-400">{formatMoney(funds)}</span>
                </div>
                <input
                    type="range" min="0" max="200000" step="10000"
                    value={funds} onChange={(e) => setFunds(Number(e.target.value))}
                    className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
             </div>

             {/* Stocks -> Dark Net Futures */}
             <div className="bg-zinc-900/50 p-3 rounded border border-zinc-800">
                <div className="flex justify-between mb-2">
                    <span className="text-xs text-zinc-300">暗网期货 (高风险)</span>
                    <span className="text-xs font-mono text-emerald-400">{formatMoney(stocks)}</span>
                </div>
                <input
                    type="range" min="0" max="200000" step="10000"
                    value={stocks} onChange={(e) => setStocks(Number(e.target.value))}
                    className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
             </div>

             {/* Insurance -> Trauma Team */}
             <button
                onClick={() => setInsurance(!insurance)}
                className={`w-full p-3 rounded border flex justify-between items-center transition-all mb-12 md:mb-4 ${
                    insurance ? 'bg-emerald-900/20 border-emerald-500' : 'bg-zinc-900 border-zinc-800'
                }`}
             >
                <div className="text-left flex-1 min-w-0">
                    <div className="text-sm font-bold flex items-center gap-2 flex-wrap">
                        <span>🛡️ 生物保险 (Bio-Secure)</span>
                        {insurance && <span className="text-[10px] bg-emerald-500 text-black px-1 rounded">ACTIVE</span>}
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-1">抵御重大义体故障与急救费用</div>
                </div>
                <span className={`text-sm font-mono ml-2 flex-shrink-0 ${insurance ? 'text-red-400' : 'text-zinc-500'}`}>
                    {insurance ? `-¥${COSTS.INSURANCE_PRICE.toLocaleString()}` : 'UNINSURED'}
                </span>
             </button>
          </section>
          
          {/* Extra spacing for mobile to ensure button is not hidden */}
          <div className="h-8 md:h-0"></div>

          {/* Footer Action - Ensure enough space above on mobile */}
          <div className="fixed bottom-0 left-0 right-0 p-3 md:p-4 bg-black/90 backdrop-blur-md border-t border-zinc-800 z-50 flex justify-center" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
                <button
                onClick={handleStart}
                disabled={!isValid}
                className={`w-full max-w-lg py-4 relative overflow-hidden group transition-all clip-path-polygon ${
                    isValid 
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-black' 
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                }`}
                >
                <div className="relative z-10 font-bold text-lg cyber-font tracking-widest flex items-center justify-center gap-2">
                    {isValid ? 'UPLOAD CONFIGURATION >>' : 'INSUFFICIENT FUNDS'}
                </div>
                {isValid && <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>}
                </button>
          </div>

       </div>
    </div>
  );
};

export default AllocationScreen;