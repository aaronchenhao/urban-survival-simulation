
import React, { useMemo, useState } from 'react';
import { GameState } from '../types';
import { COSTS, DEBT_INTEREST_RATE, THRESHOLDS, INVESTMENT_RETURN_RATES } from '../constants';

interface Props {
  gameState: GameState;
  onContinue: (investmentIncome: number, newRentType?: 'homeless' | 'cheap' | 'expensive') => void;
  onAdjustAsset: (type: 'deposit' | 'stocks' | 'funds', amount: number) => void;
  onSellCar: () => void;
}

const SummaryScreen: React.FC<Props> = ({ gameState, onContinue, onAdjustAsset, onSellCar }) => {
  const [selectedRentType, setSelectedRentType] = useState(gameState.config.rentType);

  // Financial breakdown
  const income = gameState.baseSalary * 6;
  
  // Calculate rent based on PREVIOUS config for the bill
  let rentMonthly = 0;
  if (gameState.config.rentType === 'cheap') rentMonthly = COSTS.RENT_CHEAP;
  else if (gameState.config.rentType === 'expensive') rentMonthly = COSTS.RENT_EXPENSIVE;
  
  const rentCost = rentMonthly * 6;
  
  const livingCost = COSTS.LIVING_EXPENSE * 6;
  
  const carMonthly = gameState.config.carType === 'none' ? 0 : 
                  (gameState.config.carType === 'gas' ? COSTS.CAR_GAS_MAINTENANCE : COSTS.CAR_ELEC_MAINTENANCE);
  const carCost = carMonthly * 6;
  
  const debtInterest = gameState.stats.cash < 0 ? Math.abs(gameState.stats.cash * DEBT_INTEREST_RATE) : 0;
  
  // Investment Logic
  const investmentData = useMemo(() => {
      const stockFluctuation = (Math.random() * 0.2 - 0.1); 
      const fundFluctuation = (Math.random() * 0.1 - 0.04); 
      
      const stockReturn = gameState.config.stocks * (INVESTMENT_RETURN_RATES.STOCKS + stockFluctuation);
      const fundReturn = gameState.config.funds * (INVESTMENT_RETURN_RATES.FUNDS + fundFluctuation);
      const depositReturn = gameState.config.deposit * INVESTMENT_RETURN_RATES.DEPOSIT;
      
      return {
          total: Math.floor(stockReturn + fundReturn + depositReturn),
          details: {
              stockRate: INVESTMENT_RETURN_RATES.STOCKS + stockFluctuation,
              fundRate: INVESTMENT_RETURN_RATES.FUNDS + fundFluctuation,
              stockAmt: stockReturn,
              fundAmt: fundReturn,
              depositAmt: depositReturn
          }
      };
  }, [gameState.config.stocks, gameState.config.funds, gameState.config.deposit, gameState.stage]); 
  
  const totalExpenses = rentCost + livingCost + carCost + debtInterest;
  const netChange = income - totalExpenses + investmentData.total;

  const STEP_AMOUNT = 10000;

  // Analysis of status
  let totalNetWorth = gameState.stats.cash;
  totalNetWorth += gameState.config.deposit;
  totalNetWorth += gameState.config.stocks;
  totalNetWorth += gameState.config.funds;
  if (gameState.config.carType === 'gas') totalNetWorth += COSTS.CAR_GAS_PRICE * 0.6;
  if (gameState.config.carType === 'electric') totalNetWorth += COSTS.CAR_ELEC_PRICE * 0.4;

  const progressPercent = Math.min(100, Math.max(0, (totalNetWorth / THRESHOLDS.SUCCESS_CASH) * 100));

  const renderAssetControl = (label: string, type: 'deposit' | 'stocks' | 'funds', value: number) => {
    const canBuy = gameState.stats.cash >= STEP_AMOUNT;
    const canSell = value >= STEP_AMOUNT;

    return (
      <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700 flex flex-col space-y-3">
        <div className="flex justify-between items-center border-b border-zinc-700 pb-2">
            <span className="text-zinc-300 font-bold flex items-center gap-2">
                {type === 'deposit' && '🏦'}
                {type === 'stocks' && '📈'}
                {type === 'funds' && '📊'}
                {label}
            </span>
            <span className="font-mono text-xl text-zinc-100">¥{value.toLocaleString()}</span>
        </div>
        <div className="flex space-x-3">
            <button 
                onClick={() => onAdjustAsset(type, -STEP_AMOUNT)}
                disabled={!canSell}
                className={`flex-1 py-3 rounded font-bold text-sm transition-colors flex items-center justify-center gap-1 ${
                    canSell 
                    ? 'bg-zinc-700 hover:bg-zinc-600 text-cyan-400 border border-zinc-600' 
                    : 'bg-zinc-800/50 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                }`}
            >
                <span>⬇️ 取出 1w</span>
            </button>
            <button 
                onClick={() => onAdjustAsset(type, STEP_AMOUNT)}
                disabled={!canBuy}
                className={`flex-1 py-3 rounded font-bold text-sm transition-colors flex items-center justify-center gap-1 ${
                    canBuy 
                    ? 'bg-zinc-700 hover:bg-zinc-600 text-red-400 border border-zinc-600' 
                    : 'bg-zinc-800/50 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                }`}
            >
                <span>⬆️ 存入 1w</span>
            </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 p-6 overflow-y-auto custom-scrollbar">
      <h1 className="text-3xl font-bold text-white mb-2 cyber-font border-l-4 border-cyan-500 pl-4">
        STAGE REPORT <span className="text-cyan-400 text-lg">//{gameState.stage}</span>
      </h1>
      
      {/* Wealth Goal Tracker */}
      <div className="bg-black border border-zinc-800 p-4 rounded-lg mb-6 shadow-[0_0_10px_rgba(0,255,100,0.1)]">
        <div className="flex justify-between items-end mb-2">
            <span className="text-zinc-400 text-xs uppercase tracking-widest">距离阶级跨越 (¥1,000,000)</span>
            <span className={`font-mono font-bold ${totalNetWorth >= THRESHOLDS.SUCCESS_CASH ? 'text-cyan-400' : 'text-zinc-300'}`}>
                ¥{Math.floor(totalNetWorth).toLocaleString()}
            </span>
        </div>
        <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div 
                className="h-full bg-cyan-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(34,211,238,0.5)]" 
                style={{ width: `${progressPercent}%` }}
            ></div>
        </div>
      </div>

      {/* Bill Section */}
      <div className="bg-zinc-950 rounded-lg p-1 mb-6 border border-zinc-800 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-900 via-cyan-500 to-cyan-900 opacity-50"></div>
        <div className="p-5">
            <h2 className="text-cyan-400 font-bold tracking-widest text-sm mb-4 flex items-center">
                <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2 animate-pulse"></span>
                FISCAL SUMMARY (6 MONTHS)
            </h2>
            
            <div className="space-y-2 font-mono text-sm">
                {/* Income */}
                <div className="flex justify-between items-center py-1 border-b border-zinc-800/50">
                    <span className="text-zinc-400">➕ 基础薪资 (6个月)</span>
                    <span className="text-cyan-400">¥{income.toLocaleString()}</span>
                </div>

                {/* Investments */}
                <div className="flex justify-between items-center py-1 border-b border-zinc-800/50">
                    <span className="text-zinc-400">
                        {investmentData.total >= 0 ? '➕' : '➖'} 投资盈亏
                    </span>
                    <div className="text-right">
                        <span className={investmentData.total >= 0 ? 'text-cyan-400' : 'text-red-500'}>
                             {investmentData.total >= 0 ? '+' : ''}¥{investmentData.total.toLocaleString()}
                        </span>
                        <div className="text-[10px] text-zinc-600">
                             股:{(investmentData.details.stockRate * 100).toFixed(1)}% | 基:{(investmentData.details.fundRate * 100).toFixed(1)}%
                        </div>
                    </div>
                </div>

                {/* Expenses Breakdown */}
                <div className="pt-2 pb-1">
                    <div className="flex justify-between items-center text-red-900/80 mb-1">
                         <span className="text-xs text-zinc-500 uppercase tracking-wider">Expenses Breakdown</span>
                    </div>
                    
                    <div className="flex justify-between items-center pl-2 border-l-2 border-red-900/30 py-1">
                        <span className="text-zinc-400">🏠 房租 ({gameState.config.rentType === 'homeless' ? '流浪' : (gameState.config.rentType === 'cheap' ? '合租' : '公寓')})</span>
                        <span className="text-red-400">-¥{rentCost.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between items-center pl-2 border-l-2 border-red-900/30 py-1">
                        <span className="text-zinc-400">🍱 生活成本</span>
                        <span className="text-red-400">-¥{livingCost.toLocaleString()}</span>
                    </div>

                    {carCost > 0 && (
                        <div className="flex justify-between items-center pl-2 border-l-2 border-red-900/30 py-1">
                            <span className="text-zinc-400">🚗 车辆维护</span>
                            <span className="text-red-400">-¥{carCost.toLocaleString()}</span>
                        </div>
                    )}

                    {debtInterest > 0 && (
                        <div className="flex justify-between items-center pl-2 border-l-2 border-red-900/30 py-1 bg-red-900/10">
                            <span className="text-red-500 font-bold">⚠️ 负债利息 (10%)</span>
                            <span className="text-red-500 font-bold">-¥{Math.floor(debtInterest).toLocaleString()}</span>
                        </div>
                    )}
                </div>
                
                {/* Total */}
                <div className="border-t border-zinc-700 pt-3 mt-2 flex justify-between items-center">
                    <span className="text-zinc-200 font-bold text-base">NET CASH FLOW</span>
                    <span className={`text-xl font-bold ${netChange >= 0 ? 'text-cyan-400' : 'text-red-500'}`}>
                         {netChange >= 0 ? '+' : ''}¥{Math.floor(netChange).toLocaleString()}
                    </span>
                </div>
            </div>
        </div>
      </div>

      <div className="mb-8 flex justify-between items-center bg-zinc-800 p-4 rounded border border-zinc-700">
        <div>
            <div className="text-xs text-zinc-500 uppercase">Current Balance</div>
            <div className={`font-mono text-3xl font-bold ${gameState.stats.cash < 0 ? 'text-red-500 neon-text' : 'text-cyan-400 neon-text'}`}>
                ¥{Math.floor(gameState.stats.cash).toLocaleString()}
            </div>
        </div>
        {gameState.stats.cash < 0 && (
            <div className="text-right max-w-[50%]">
                <span className="inline-block bg-red-900 text-red-200 text-xs px-2 py-1 rounded border border-red-500 animate-pulse">
                    ! DEBT WARNING !
                </span>
            </div>
        )}
      </div>

      {/* Housing Switcher */}
      <h2 className="text-zinc-400 text-xs uppercase tracking-wider mb-4 border-b border-zinc-800 pb-1">
          LIVING ARRANGEMENT PROTOCOL // NEXT CYCLE
      </h2>
      <div className="grid grid-cols-3 gap-2 mb-8">
          <button
             onClick={() => setSelectedRentType('homeless')}
             className={`p-3 rounded border text-left transition-all ${selectedRentType === 'homeless' ? 'bg-red-900/30 border-red-500' : 'bg-zinc-800 border-zinc-700 opacity-60'}`}
          >
              <div className="text-xs font-bold text-white mb-1">⛺ 流浪街头</div>
              <div className="text-[10px] text-cyan-400 font-mono">¥0/mo</div>
              <div className="text-[10px] text-red-400 mt-1">HP/PSY 大幅持续受损</div>
          </button>
          <button
             onClick={() => setSelectedRentType('cheap')}
             className={`p-3 rounded border text-left transition-all ${selectedRentType === 'cheap' ? 'bg-cyan-900/30 border-cyan-500' : 'bg-zinc-800 border-zinc-700 opacity-60'}`}
          >
              <div className="text-xs font-bold text-white mb-1">🏠 胶囊笼屋</div>
              <div className="text-[10px] text-cyan-400 font-mono">¥{COSTS.RENT_CHEAP}/mo</div>
              <div className="text-[10px] text-zinc-400 mt-1">低维护，环境恶劣</div>
          </button>
          <button
             onClick={() => setSelectedRentType('expensive')}
             className={`p-3 rounded border text-left transition-all ${selectedRentType === 'expensive' ? 'bg-cyan-900/30 border-cyan-500' : 'bg-zinc-800 border-zinc-700 opacity-60'}`}
          >
              <div className="text-xs font-bold text-white mb-1">🏢 智能公寓</div>
              <div className="text-[10px] text-cyan-400 font-mono">¥{COSTS.RENT_EXPENSIVE}/mo</div>
              <div className="text-[10px] text-zinc-400 mt-1">恢复精神，保护隐私</div>
          </button>
      </div>


      <h2 className="text-zinc-400 text-xs uppercase tracking-wider mb-4 border-b border-zinc-800 pb-1">
          Asset Reallocation
      </h2>
      <div className="space-y-4 mb-8">
        
        {renderAssetControl("定期存款 (保本)", "deposit", gameState.config.deposit)}
        {renderAssetControl("基金 (稳健)", "funds", gameState.config.funds)}
        {renderAssetControl("股票 (激进)", "stocks", gameState.config.stocks)}

        {/* Car Selling Logic */}
        {gameState.config.carType !== 'none' && (
             <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-zinc-300 font-bold">🚗 车辆资产</span>
                    <span className="text-zinc-500 text-sm">
                        {gameState.config.carType === 'gas' ? '燃油车' : '新能源'}
                    </span>
                </div>
                <button 
                    onClick={onSellCar}
                    className="w-full bg-zinc-700 border border-zinc-600 hover:bg-zinc-600 p-3 rounded text-left flex justify-between items-center transition-colors group"
                >
                    <span className="text-zinc-200 font-bold group-hover:text-white">卖掉车辆变现</span>
                    <span className="text-cyan-400 font-mono font-bold">+ ¥{(gameState.config.carType === 'gas' ? COSTS.CAR_GAS_PRICE : COSTS.CAR_ELEC_PRICE) * 0.6}</span>
                </button>
            </div>
        )}
      </div>

      <button
        onClick={() => onContinue(investmentData.total, selectedRentType)}
        className="mt-auto w-full bg-gradient-to-r from-cyan-800 to-cyan-600 hover:from-cyan-700 hover:to-cyan-500 text-white font-bold py-4 rounded-lg shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all border-t border-cyan-400/30 uppercase tracking-widest"
      >
        INITIATE NEXT CYCLE
      </button>
    </div>
  );
};

export default SummaryScreen;
