import { Item, Recipe, SpecNode } from './types';

const TIERS = ['T4', 'T5', 'T6', 'T7', 'T8'] as const;
const ENCHANTMENTS = ['0', '1', '2', '3', '4'] as const;

const METAL_BAR_FAME: Record<string, number> = {
  'T4': 90,
  'T5': 180,
  'T6': 360,
  'T7': 720,
  'T8': 1440,
};

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

const PLATE_SHOE_TYPES = [
  { id: 'SET1', name: 'Botas de Soldado', artifact: null },
  { id: 'SET2', name: 'Botas de Cavaleiro', artifact: null },
  { id: 'SET3', name: 'Botas de Guardião', artifact: null },
  { id: 'UNDEAD', name: 'Botas de Guardião de Túmulos', artifact: 'UNDEAD' },
  { id: 'HELL', name: 'Botas Demoníacas', artifact: 'HELL' },
  { id: 'MORGANA', name: 'Botas de Judicador', artifact: 'MORGANA' },
  { id: 'AVALON', name: 'Botas da Bravura', artifact: 'AVALON' },
  { id: 'FEY', name: 'Botas de Tecelão do Crepúsculo', artifact: 'FEY' },
];

const SPEAR_TYPES = [
  { id: 'MAIN_SPEAR', name: 'Lança', artifact: null, resources: { planks: 8, bars: 8 } },
  { id: '2H_PIKE', name: 'Pique', artifact: null, resources: { planks: 12, bars: 8 } },
  { id: '2H_GLAIVE', name: 'Glaive', artifact: null, resources: { planks: 12, bars: 8 } },
  { id: 'MAIN_SPEAR_KEEPER', name: 'Lança de Garça', artifact: 'MAIN_SPEAR_KEEPER', resources: { planks: 8, bars: 8 } },
  { id: '2H_SPEAR_MORGANA', name: 'Caçadora de Espíritos', artifact: '2H_SPEAR_MORGANA', resources: { planks: 12, bars: 8 } },
  { id: '2H_TRINITYSPEAR', name: 'Lança da Trindade', artifact: '2H_TRINITYSPEAR', resources: { planks: 12, bars: 8 } },
  { id: 'MAIN_SPEAR_AVALON', name: 'Quebradora do Dia', artifact: 'MAIN_SPEAR_AVALON', resources: { planks: 8, bars: 8 } },
  { id: '2H_SPEAR_FEY', name: 'Lança da Alvorada', artifact: '2H_SPEAR_FEY', resources: { planks: 12, bars: 8 } },
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
  ITEMS.push({ id: `${tier}_JOURNAL_WARRIOR_EMPTY`, name: `Diário de Ferreiro ${tier} (Vazio)`, category: 'Diários', tier: tier as any, enchantment: '0' });
  ITEMS.push({ id: `${tier}_JOURNAL_WARRIOR_FULL`, name: `Diário de Ferreiro ${tier} (Cheio)`, category: 'Diários', tier: tier as any, enchantment: '0' });
  ITEMS.push({ id: `${tier}_JOURNAL_HUNTER_EMPTY`, name: `Diário de Caçador ${tier} (Vazio)`, category: 'Diários', tier: tier as any, enchantment: '0' });
  ITEMS.push({ id: `${tier}_JOURNAL_HUNTER_FULL`, name: `Diário de Caçador ${tier} (Cheio)`, category: 'Diários', tier: tier as any, enchantment: '0' });
});

// Generate Artifacts
TIERS.forEach(tier => {
  ROBE_TYPES.forEach(robe => {
    if (robe.artifact) {
      const artifactId = `${tier}_ARTIFACT_ARMOR_CLOTH_${robe.artifact}`;
      ITEMS.push({ id: artifactId, name: `Artefato ${robe.name} ${tier}`, category: 'Artefatos', tier: tier as any, enchantment: '0' });
    }
  });
  PLATE_SHOE_TYPES.forEach(shoe => {
    if (shoe.artifact) {
      const artifactId = `${tier}_ARTIFACT_SHOES_PLATE_${shoe.artifact}`;
      ITEMS.push({ id: artifactId, name: `Artefato ${shoe.name} ${tier}`, category: 'Artefatos', tier: tier as any, enchantment: '0' });
    }
  });
  SPEAR_TYPES.forEach(spear => {
    if (spear.artifact) {
      const artifactId = `${tier}_ARTIFACT_${spear.artifact}`;
      ITEMS.push({ id: artifactId, name: `Artefato de ${spear.name} ${tier}`, category: 'Artefatos', tier: tier as any, enchantment: '0' });
    }
  });
});

// Generate Resources, Robes and Shoes
TIERS.forEach(tier => {
  ENCHANTMENTS.forEach(ench => {
    const enchSuffix = ench === '0' ? '' : `_LEVEL${ench}@${ench}`;
    
    // Cloth
    const clothId = `${tier}_CLOTH${enchSuffix}`;
    ITEMS.push({ id: clothId, name: `Tecido ${tier}.${ench}`, category: 'Recursos Refinados', tier: tier as any, enchantment: ench as any });

    // Metal Bars
    const barId = `${tier}_METALBAR${enchSuffix}`;
    ITEMS.push({ id: barId, name: `Barra de Metal ${tier}.${ench}`, category: 'Recursos Refinados', tier: tier as any, enchantment: ench as any });

    // Planks
    const plankId = `${tier}_PLANKS${enchSuffix}`;
    ITEMS.push({ id: plankId, name: `Tábua ${tier}.${ench}`, category: 'Recursos Refinados', tier: tier as any, enchantment: ench as any });

    const itemEnchSuffix = ench === '0' ? '' : `@${ench}`;

    // Robes
    ROBE_TYPES.forEach(robe => {
      const robeId = `${tier}_ARMOR_CLOTH_${robe.id}${itemEnchSuffix}`;
      const robeName = `${robe.name} ${tier}.${ench}`;
      ITEMS.push({ id: robeId, name: robeName, category: 'Armadura de Tecido', tier: tier as any, enchantment: ench as any });
      
      const materials = [{ itemId: clothId, amount: 16 }];
      if (robe.artifact) {
        materials.push({ itemId: `${tier}_ARTIFACT_ARMOR_CLOTH_${robe.artifact}`, amount: 1 });
      }

      RECIPES.push({
        itemId: robeId,
        materials,
        fame: TIER_FAME[tier],
        journalId: `${tier}_JOURNAL_MAGIC_EMPTY`,
        baseFocusCost: TIER_FOCUS[tier],
      });
    });

    // Plate Shoes
    PLATE_SHOE_TYPES.forEach(shoe => {
      const shoeId = `${tier}_SHOES_PLATE_${shoe.id}${itemEnchSuffix}`;
      const shoeName = `${shoe.name} ${tier}.${ench}`;
      ITEMS.push({ id: shoeId, name: shoeName, category: 'Sapatos de Placa', tier: tier as any, enchantment: ench as any });

      const materials = [{ itemId: barId, amount: 8 }];
      if (shoe.artifact) {
        materials.push({ itemId: `${tier}_ARTIFACT_SHOES_PLATE_${shoe.artifact}`, amount: 1 });
      }

      RECIPES.push({
        itemId: shoeId,
        materials,
        fame: TIER_FAME[tier] / 2, // Shoes are 1/2 fame of armor
        journalId: `${tier}_JOURNAL_WARRIOR_EMPTY`,
        baseFocusCost: TIER_FOCUS[tier] / 2, // Shoes are 1/2 focus of armor
      });
    });

    // Spears
    SPEAR_TYPES.forEach(spear => {
      const spearId = `${tier}_${spear.id}${itemEnchSuffix}`;
      const spearName = `${spear.name} ${tier}.${ench}`;
      ITEMS.push({ id: spearId, name: spearName, category: 'Lanças', tier: tier as any, enchantment: ench as any });

      const materials = [
        { itemId: plankId, amount: spear.resources.planks },
        { itemId: barId, amount: spear.resources.bars }
      ];
      if (spear.artifact) {
        materials.push({ itemId: `${tier}_ARTIFACT_${spear.artifact}`, amount: 1 });
      }

      const totalResources = spear.resources.planks + spear.resources.bars;
      const resourceMultiplier = totalResources / 16;

      RECIPES.push({
        itemId: spearId,
        materials,
        fame: TIER_FAME[tier] * resourceMultiplier,
        journalId: `${tier}_JOURNAL_HUNTER_EMPTY`,
        baseFocusCost: TIER_FOCUS[tier] * resourceMultiplier,
      });
    });
  });
});

export const SPEC_NODES: SpecNode[] = [
  // Cloth Armor
  { id: 'baseClothArmor', name: 'Fabricante de Armadura de Tecido', multiplier: 30 },
  { id: 'SET1', name: 'Especialista em Robe de Erudito', baseNodeId: 'baseClothArmor', multiplier: 250 },
  { id: 'SET2', name: 'Especialista em Robe de Clérigo', baseNodeId: 'baseClothArmor', multiplier: 250 },
  { id: 'SET3', name: 'Especialista em Robe de Mago', baseNodeId: 'baseClothArmor', multiplier: 250 },
  { id: 'KEEPER', name: 'Especialista em Robe de Druida', baseNodeId: 'baseClothArmor', multiplier: 250, isArtifact: true },
  { id: 'HELL', name: 'Especialista em Robe Malévolo', baseNodeId: 'baseClothArmor', multiplier: 250, isArtifact: true },
  { id: 'UNDEAD', name: 'Especialista em Robe de Sectário', baseNodeId: 'baseClothArmor', multiplier: 250, isArtifact: true },
  { id: 'AVALON', name: 'Especialista em Robe da Pureza', baseNodeId: 'baseClothArmor', multiplier: 250, isArtifact: true },
  { id: 'FEY', name: 'Especialista em Robe Feérico', baseNodeId: 'baseClothArmor', multiplier: 250, isArtifact: true },
  
  // Plate Shoes
  { id: 'basePlateShoes', name: 'Fabricante de Sapatos de Placa', multiplier: 30 },
  { id: 'PLATE_SET1', name: 'Especialista em Botas de Soldado', baseNodeId: 'basePlateShoes', multiplier: 250 },
  { id: 'PLATE_SET2', name: 'Especialista em Botas de Cavaleiro', baseNodeId: 'basePlateShoes', multiplier: 250 },
  { id: 'PLATE_SET3', name: 'Especialista em Botas de Guardião', baseNodeId: 'basePlateShoes', multiplier: 250 },
  { id: 'PLATE_UNDEAD', name: 'Especialista em Botas de Guardião de Túmulos', baseNodeId: 'basePlateShoes', multiplier: 250, isArtifact: true },
  { id: 'PLATE_HELL', name: 'Especialista em Botas Demoníacas', baseNodeId: 'basePlateShoes', multiplier: 250, isArtifact: true },
  { id: 'PLATE_MORGANA', name: 'Especialista em Botas de Judicador', baseNodeId: 'basePlateShoes', multiplier: 250, isArtifact: true },
  { id: 'PLATE_AVALON', name: 'Especialista em Botas da Bravura', baseNodeId: 'basePlateShoes', multiplier: 250, isArtifact: true },
  { id: 'PLATE_FEY', name: 'Especialista em Botas de Tecelão do Crepúsculo', baseNodeId: 'basePlateShoes', multiplier: 250, isArtifact: true },

  // Spears
  { id: 'baseSpear', name: 'Fabricante de Lanças', multiplier: 30 },
  { id: 'MAIN_SPEAR', name: 'Especialista em Lança', baseNodeId: 'baseSpear', multiplier: 250 },
  { id: '2H_PIKE', name: 'Especialista em Pique', baseNodeId: 'baseSpear', multiplier: 250 },
  { id: '2H_GLAIVE', name: 'Especialista em Glaive', baseNodeId: 'baseSpear', multiplier: 250 },
  { id: 'MAIN_SPEAR_KEEPER', name: 'Especialista em Lança de Garça', baseNodeId: 'baseSpear', multiplier: 250, isArtifact: true },
  { id: '2H_SPEAR_MORGANA', name: 'Especialista em Caçadora de Espíritos', baseNodeId: 'baseSpear', multiplier: 250, isArtifact: true },
  { id: '2H_TRINITYSPEAR', name: 'Especialista em Lança da Trindade', baseNodeId: 'baseSpear', multiplier: 250, isArtifact: true },
  { id: 'MAIN_SPEAR_AVALON', name: 'Especialista em Quebradora do Dia', baseNodeId: 'baseSpear', multiplier: 250, isArtifact: true },
  { id: '2H_SPEAR_FEY', name: 'Especialista em Lança da Alvorada', baseNodeId: 'baseSpear', multiplier: 250, isArtifact: true },
];
