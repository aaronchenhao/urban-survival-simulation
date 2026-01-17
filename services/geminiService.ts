
import { GameEvent, GameState, OptionEffect, GameOption, DialogueLine } from "../types";
import { COSTS } from "../constants";
import { STORY_DATABASE, StoryArchetype } from "../storyData";

// --- Configuration for Local Generation ---
export interface LocalGenerationConfig {
    randomizeEffects: boolean; // If true, adds fluctuation
    jitterPercentage: number;  // Base fluctuation percentage
    defaultDescriptionPrefix: boolean; 
}

const DEFAULT_CONFIG: LocalGenerationConfig = {
    randomizeEffects: true,
    jitterPercentage: 0.15, // Increased to 15% for more variance
    defaultDescriptionPrefix: true
};

// --- Helper Functions ---

const calculateApproxWealth = (state: GameState) => {
    let wealth = state.stats.cash;
    wealth += state.config.deposit;
    wealth += state.config.stocks;
    wealth += state.config.funds;
    if (state.config.carType === 'gas') wealth += COSTS.CAR_GAS_PRICE * 0.6; 
    if (state.config.carType === 'electric') wealth += COSTS.CAR_ELEC_PRICE * 0.4;
    return wealth;
};

// Helper to pick random items from array
function getRandomItems<T>(arr: T[], count: number): T[] {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Logic Filter for Requirements
const filterArchetypes = (archetypes: StoryArchetype[], state: GameState): StoryArchetype[] => {
    return archetypes.filter(a => {
        if (!a.requirements) return true;
        
        // Rent Check
        if (a.requirements.rentType) {
            if (!a.requirements.rentType.includes(state.config.rentType)) return false;
        }

        // Car Check
        if (a.requirements.carType) {
             if (!a.requirements.carType.includes(state.config.carType)) return false;
        }

        return true;
    });
};

// --- Outcome Parser ---
// Parses strings like "[Cash +1000, HP -10] Some description text."
const parseOutcomeHint = (hint: string, config: LocalGenerationConfig): { effect: OptionEffect, description: string } => {
    const defaultEffect: OptionEffect = { cash: 0, health: 0, mental: 0, moral: 0, description: "" };
    
    // Regex to find content inside brackets [] and the rest
    const match = hint.match(/^\[(.*?)\]\s*(.*)$/);
    
    if (!match) {
        // Fallback if format doesn't match
        return { effect: defaultEffect, description: hint };
    }

    const statsPart = match[1];
    const textPart = match[2];

    // Parse stats
    // Looking for patterns like "Cash +1000", "HP -10", "PSY +5"
    const statRegex = /(Cash|HP|Health|PSY|Mental|KAR|Moral)\s*([+-]?\d+)/gi;
    let statMatch;
    
    const parsedEffect = { ...defaultEffect };
    
    // Volatility Check: 10% chance to double the jitter (Critical Event)
    const isCriticalVolatility = Math.random() < 0.1;
    const effectiveJitter = isCriticalVolatility ? config.jitterPercentage * 2 : config.jitterPercentage;

    while ((statMatch = statRegex.exec(statsPart)) !== null) {
        const key = statMatch[1].toUpperCase();
        let value = parseInt(statMatch[2], 10);

        // Apply Jitter
        if (config.randomizeEffects && value !== 0) {
            // Random factor between -(effectiveJitter) and +(effectiveJitter)
            // e.g., if jitter is 0.15, random multiplier is between -0.15 and 0.15
            const fluctuation = Math.random() * (effectiveJitter * 2) - effectiveJitter;
            const jitterAmount = Math.floor(Math.abs(value) * fluctuation);
            
            value += jitterAmount;
        }

        switch (key) {
            case 'CASH': parsedEffect.cash += value; break;
            case 'HP':
            case 'HEALTH': parsedEffect.health += value; break;
            case 'PSY':
            case 'MENTAL': parsedEffect.mental += value; break;
            case 'KAR':
            case 'MORAL': parsedEffect.moral += value; break;
        }
    }

    return { 
        effect: { ...parsedEffect, description: textPart }, 
        description: textPart 
    };
};

// --- Main Transformation Logic ---
const processArchetypeToEvent = (archetype: StoryArchetype, config: LocalGenerationConfig): GameEvent => {
    // Process options
    const processedOptions: GameOption[] = archetype.options.map(opt => {
        const { effect } = parseOutcomeHint(opt.outcomeHint, config);
        return {
            label: opt.label,
            effect: effect
        };
    });

    return {
        id: archetype.id,
        type: 'core', // Default to core, overridden later
        category: archetype.category,
        title: archetype.title,
        description: archetype.context, // Use context as description
        options: processedOptions,
        dialogue: archetype.dialogue, // Pass the dialogue explicitly
        backgroundImage: archetype.imageUrl
    };
};


// --- Public Service Method ---
export const generateStageEvents = async (gameState: GameState): Promise<GameEvent[]> => {
    // This function is now fully local, but keeps the async signature for compatibility
    console.log(`Generating Local Events for Stage ${gameState.stage}`);
    
    const stageData = STORY_DATABASE[gameState.stage];
    if (!stageData) {
        console.error("No story data for stage", gameState.stage);
        // Fallback to avoid crash
        return [{
             id: 'fallback',
             type: 'core',
             title: '数据缺失',
             description: '系统无法加载当前阶段数据。',
             options: [{label: '继续', effect: {cash: 0, health: 0, mental: 0, moral: 0}}],
             backgroundImage: ''
        }];
    }

    const availableCore = filterArchetypes(stageData.core, gameState);
    const availableRandom = filterArchetypes(stageData.random, gameState);

    // Selection Logic
    // Try to pick 3 core, but handle if fewer are available
    let selectedCore = getRandomItems(availableCore, Math.min(3, availableCore.length));
    let selectedRandom = getRandomItems(availableRandom, Math.min(2, availableRandom.length));

    // Logic Injection for "Elite Path" (Stage 5 Override)
    const totalWealth = calculateApproxWealth(gameState);
    if (gameState.stage === 5 && totalWealth > 400000) {
        const arkEvent = stageData.core.find(e => e.title.includes("船票"));
        if (arkEvent) {
             // Put Ark event at the top
             selectedCore = [arkEvent, ...selectedCore.filter(e => e.id !== arkEvent.id)].slice(0, 3);
        }
    }

    // Convert to GameEvents
    const events: GameEvent[] = [];

    // Process Core
    selectedCore.forEach(arch => {
        const evt = processArchetypeToEvent(arch, DEFAULT_CONFIG);
        evt.type = 'core';
        events.push(evt);
    });

    // Process Random
    selectedRandom.forEach(arch => {
        const evt = processArchetypeToEvent(arch, DEFAULT_CONFIG);
        evt.type = 'random';
        events.push(evt);
    });

    // Shuffle final events to mix core and random for better pacing
    return events.sort(() => 0.5 - Math.random());
};
