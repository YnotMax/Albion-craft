import { Item, Recipe, SpecNode } from './types';

const TIERS = ['T4', 'T5', 'T6', 'T7', 'T8'] as const;
const ENCHANTMENTS = ['0', '1', '2', '3', '4'] as const;

const ROBE_TYPES = [
  { id: 'SET1', name: 'Robe de Erudito', artifact: null },
  { id: 'SET2', name: 'Robe de Clérigo', artifact: null },
  { id: 'SET3', name: 'Robe de Mago', artifact: null },
  { id: 'KEEPER', name: 'Robe de Druida', artifact: 'KEEPER' },
  { id: 'HELL', name: 'Robe Malévolo', artifact: 'HELL' },
  { id: 'UNDEAD', name: 'Robe de Sectário', artifact: 'UNDEAD' },
  { id: 'AVALON', name: 'Robe da Pureza', artifact: 'AVALON' },
  { id: 'FEY', name: 'Robe Feérico', artifact: 'FEY' },
];

const TIER_FAME: Record<string, number> = {
  'T4': 180,
  'T5': 360,
  'T6': 720,
  'T7': 1440,
  'T8': 2880,
};

const TIER_FOCUS: Record<string, number> = {
  'T4': 1000,
  'T5': 2000,
  'T6': 4000,
  'T7': 8000,
  'T8': 16000,
};

export const ITEMS: Item[] = [];
export const RECIPES: Recipe[] = [];

// Generate Journals
TIERS.forEach(tier => {
  ITEMS.push({ id: `${tier}_JOURNAL_MAGIC_EMPTY`, name: `Diário de Imbuidor ${tier} (Vazio)`, category: 'Diários', tier: tier as any, enchantment: '0' });
  ITEMS.push({ id: `${tier}_JOURNAL_MAGIC_FULL`, name: `Diário de Imbuidor ${tier} (Cheio)`, category: 'Diários', tier: tier as any, enchantment: '0' });
});

// Generate Artifacts
TIERS.forEach(tier => {
  ROBE_TYPES.forEach(robe => {
    if (robe.artifact) {
      const artifactId = `${tier}_ARTIFACT_ARMOR_CLOTH_${robe.artifact}`;
      ITEMS.push({ id: artifactId, name: `Artefato ${robe.name} ${tier}`, category: 'Artefatos', tier: tier as any, enchantment: '0' });
    }
  });
});

// Generate Cloth and Robes
TIERS.forEach(tier => {
  ENCHANTMENTS.forEach(ench => {
    const enchSuffix = ench === '0' ? '' : `_LEVEL${ench}@${ench}`;
    const clothId = `${tier}_CLOTH${enchSuffix}`;
    const clothName = `Tecido ${tier}.${ench}`;
    
    ITEMS.push({ id: clothId, name: clothName, category: 'Recursos Refinados', tier: tier as any, enchantment: ench as any });

    ROBE_TYPES.forEach(robe => {
      const itemEnchSuffix = ench === '0' ? '' : `@${ench}`;
      const robeId = `${tier}_ARMOR_CLOTH_${robe.id}${itemEnchSuffix}`;
      const robeName = `${robe.name} ${tier}.${ench}`;
      
      ITEMS.push({ id: robeId, name: robeName, category: 'Armadura de Tecido', tier: tier as any, enchantment: ench as any });

      const materials = [{ itemId: clothId, amount: 16 }];
      
      if (robe.artifact) {
        const artifactId = `${tier}_ARTIFACT_ARMOR_CLOTH_${robe.artifact}`;
        materials.push({ itemId: artifactId, amount: 1 });
      }

      RECIPES.push({
        itemId: robeId,
        materials,
        fame: TIER_FAME[tier],
        journalId: `${tier}_JOURNAL_MAGIC_EMPTY`,
        baseFocusCost: TIER_FOCUS[tier],
      });
    });
  });
});

export const SPEC_NODES: SpecNode[] = [
  { id: 'baseCrafter', name: 'Fabricante de Armadura de Tecido', multiplier: 30 },
  { id: 'SET1', name: 'Especialista em Robe de Erudito', baseNodeId: 'baseCrafter', multiplier: 250 },
  { id: 'SET2', name: 'Especialista em Robe de Clérigo', baseNodeId: 'baseCrafter', multiplier: 250 },
  { id: 'SET3', name: 'Especialista em Robe de Mago', baseNodeId: 'baseCrafter', multiplier: 250 },
  { id: 'KEEPER', name: 'Especialista em Robe de Druida', baseNodeId: 'baseCrafter', multiplier: 250, isArtifact: true },
  { id: 'HELL', name: 'Especialista em Robe Malévolo', baseNodeId: 'baseCrafter', multiplier: 250, isArtifact: true },
  { id: 'UNDEAD', name: 'Especialista em Robe de Sectário', baseNodeId: 'baseCrafter', multiplier: 250, isArtifact: true },
  { id: 'AVALON', name: 'Especialista em Robe da Pureza', baseNodeId: 'baseCrafter', multiplier: 250, isArtifact: true },
  { id: 'FEY', name: 'Especialista em Robe Feérico', baseNodeId: 'baseCrafter', multiplier: 250, isArtifact: true },
];
