
import { StageTheme } from './types';

export const INITIAL_CASH = 200000;
export const MAX_STATS = 100;
export const CRITICAL_THRESHOLD = 5; // Lowered slightly to allow living on the edge

export const COSTS = {
  RENT_HOMELESS: 0,
  RENT_CHEAP: 2500, // Slight inflation
  RENT_EXPENSIVE: 5500,
  CAR_GAS_PRICE: 100000,
  CAR_ELEC_PRICE: 140000,
  CAR_GAS_MAINTENANCE: 2000, // Increased burden
  CAR_ELEC_MAINTENANCE: 800, 
  LIVING_EXPENSE: 3500, // Inflation
  INSURANCE_PRICE: 8000,
  HOMELESS_PENALTY_HP: 15, // Damage per stage for being homeless
  HOMELESS_PENALTY_PSY: 15, // Mental damage per stage for being homeless
};

// Winning Thresholds
export const THRESHOLDS = {
    SUCCESS_CASH: 1000000, // The 1% goal (Millionaire)
    SURVIVAL_CASH: 50000,  // The 9% goal (Safety net)
    HIGH_PERFORMANCE_STAT: 80, // Threshold to get a raise
    LOW_PERFORMANCE_STAT: 40, // Threshold to get a pay cut
};

export const STAGE_THEMES: StageTheme[] = [
  { title: "初入职场", description: "试用期的压力，办公室的潜规则，以及无休止的加班。" }, 
  { title: "消费主义陷阱", description: "光鲜亮丽的城市生活诱惑着你，通过消费获得短暂的快乐是如此简单。" }, 
  { title: "资本寒冬", description: "行业开始动荡，裁员的流言四起，你需要证明自己的不可替代性。" }, 
  { title: "家庭与责任", description: "远方的父母，突如其来的变故，或者是一个组建家庭的承诺。" }, 
  { title: "身心临界点", description: "长期透支的身体开始报警，你是选择停下休息还是冲刺最后的机会？" }, 
  { title: "最终审判", description: "所有的选择都已标好价格，现在是支付账单的时候了。" }, 
];

export const SALARY_BASE_INITIAL = 8000; // Monthly net income start
export const DEBT_INTEREST_RATE = 0.10; // Increased to 10% (Predatory loans) - makes debt spiral harder
export const INVESTMENT_RETURN_RATES = {
  DEPOSIT: 0.015, 
  FUNDS: 0.04, 
  STOCKS: 0.08, 
};
