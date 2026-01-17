
export interface GameConfig {
  rentType: 'homeless' | 'cheap' | 'expensive'; // homeless: 0, cheap: 2500, expensive: 5500
  carType: 'none' | 'gas' | 'electric'; // gas: 120k, electric: 150k
  deposit: number; // Time deposit
  stocks: number; // High risk
  funds: number; // Med risk
  insurance: boolean; // Cost 10k flat, protects large health drops
}

export interface PlayerStats {
  cash: number; // Liquid assets
  health: number; // 0-100
  mental: number; // 0-100
  moral: number; // 0-100
}

export interface GameState {
  screen: 'intro' | 'allocation' | 'game' | 'summary' | 'ending';
  stage: number; // 0-5 (6 stages total)
  config: GameConfig;
  stats: PlayerStats;
  baseSalary: number; // Dynamic monthly salary
  history: string[]; // Log of events
  currentEvents: GameEvent[];
  currentEventIndex: number;
  totalDebt: number; // Accumulated negative cash turns into debt
  isGameOver: boolean;
  endingType?: 'slaughtered' | 'survival' | 'success';
  endingReason?: string;
}

export interface OptionEffect {
  cash: number;
  health: number; // 0-100
  mental: number; // 0-100
  moral: number; // 0-100
  description?: string; // Narrative result
}

export interface GameOption {
  label: string;
  effect: OptionEffect;
}

export interface DialogueLine {
  speaker: string;
  text: string;
}

export type EventCategory = 'work' | 'love' | 'housing' | 'health' | 'moral' | 'general';

export interface GameEvent {
  id: string;
  type: 'core' | 'random';
  category?: EventCategory; // New field for BGM mapping
  title: string;
  description: string;
  options: GameOption[];
  dialogue?: DialogueLine[]; // Optional dialogue sequence
  backgroundImage?: string; // Local/Static background URL
}

export interface StageTheme {
  title: string;
  description: string;
}
