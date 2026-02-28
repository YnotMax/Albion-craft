export type Tier = 'T4' | 'T5' | 'T6' | 'T7' | 'T8';
export type Enchantment = '0' | '1' | '2' | '3' | '4';

export interface Item {
  id: string;
  name: string;
  category: string;
  tier: Tier;
  enchantment: Enchantment;
}

export interface Recipe {
  itemId: string;
  materials: { itemId: string; amount: number }[];
  fame: number;
  journalId?: string;
  baseFocusCost: number;
}

export interface SpecNode {
  id: string;
  name: string;
  baseNodeId?: string;
  multiplier: number;
  isArtifact?: boolean;
}

export interface AppState {
  specs: Record<string, number>; // nodeId -> level (0-100)
  prices: Record<string, { buy: number; sell: number; updatedAt?: string }>; // itemId -> prices
  favorites: CraftConfig[];
  groups: string[];
  server: 'west' | 'east' | 'europe';
  buyCity: string;
  sellCity: string;
  calculatorState?: {
    selectedCategory: string;
    selectedTier: string;
    selectedEnchantment: string;
    selectedRecipeId: string;
    usageFee: number;
    rrr: number;
    useFocus: boolean;
  };
}

export interface CraftConfig {
  id: string;
  itemId: string;
  timestamp: number;
  group?: string;
  configSnapshot: {
    rrr: number;
    useFocus: boolean;
    usageFee: number;
    focusCost: number;
    prices: Record<string, { buy: number; sell: number; updatedAt?: string }>; // Snapshot of prices at the time
  };
}

