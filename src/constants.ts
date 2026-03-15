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
  { id: 'SET1', name: 'Hábito de Erudito', artifact: null },
  { id: 'SET2', name: 'Hábito de Clérigo', artifact: null },
  { id: 'SET3', name: 'Hábito de Mago', artifact: null },
  { id: 'KEEPER', name: 'Hábito de Druida', artifact: 'KEEPER' },
  { id: 'HELL', name: 'Hábito Malévolo', artifact: 'HELL' },
  { id: 'UNDEAD', name: 'Hábito de Sectário', artifact: 'UNDEAD' },
  { id: 'AVALON', name: 'Hábito da Pureza', artifact: 'AVALON' },
  { id: 'FEY', name: 'Hábito Escama-feérica', artifact: 'FEY' },
];

const CLOTH_COWL_TYPES = [
  { id: 'SET1', name: 'Capote de Erudito', artifact: null },
  { id: 'SET2', name: 'Capote de Clérigo', artifact: null },
  { id: 'SET3', name: 'Capote de Mago', artifact: null },
  { id: 'KEEPER', name: 'Capote de Druida', artifact: 'KEEPER' },
  { id: 'HELL', name: 'Capote Malévolo', artifact: 'HELL' },
  { id: 'UNDEAD', name: 'Capote de Sectário', artifact: 'UNDEAD' },
  { id: 'AVALON', name: 'Capote da Pureza', artifact: 'AVALON' },
  { id: 'FEY', name: 'Capote Escama-feérica', artifact: 'FEY' },
];

const LEATHER_JACKET_TYPES = [
  { id: 'SET1', name: 'Casaco de Mercenário', artifact: null },
  { id: 'SET2', name: 'Casaco de Caçador', artifact: null },
  { id: 'SET3', name: 'Casaco de Assassino', artifact: null },
  { id: 'KEEPER', name: 'Casaco de Espreitador', artifact: 'KEEPER' },
  { id: 'HELL', name: 'Casaco Infernal', artifact: 'HELL' },
  { id: 'UNDEAD', name: 'Casaco de Espectro', artifact: 'UNDEAD' },
  { id: 'AVALON', name: 'Casaco Tenaz', artifact: 'AVALON' },
  { id: 'FEY', name: 'Casaco Andarilho-da-névoa', artifact: 'FEY' },
];

const LEATHER_HOOD_TYPES = [
  { id: 'SET1', name: 'Capuz de Mercenário', artifact: null },
  { id: 'SET2', name: 'Capuz de Caçador', artifact: null },
  { id: 'SET3', name: 'Capuz de Assassino', artifact: null },
  { id: 'KEEPER', name: 'Capuz de Espreitador', artifact: 'KEEPER' },
  { id: 'HELL', name: 'Capuz Infernal', artifact: 'HELL' },
  { id: 'UNDEAD', name: 'Capuz de Espectro', artifact: 'UNDEAD' },
  { id: 'AVALON', name: 'Capuz Tenaz', artifact: 'AVALON' },
  { id: 'FEY', name: 'Capuz Andarilho-da-névoa', artifact: 'FEY' },
];

const PLATE_ARMOR_TYPES = [
  { id: 'SET1', name: 'Armadura de Soldado', artifact: null },
  { id: 'SET2', name: 'Armadura de Cavaleiro', artifact: null },
  { id: 'SET3', name: 'Armadura de Guardião', artifact: null },
  { id: 'UNDEAD', name: 'Armadura de Guardião de Túmulos', artifact: 'UNDEAD' },
  { id: 'HELL', name: 'Armadura Demoníaca', artifact: 'HELL' },
  { id: 'MORGANA', name: 'Armadura de Judicador', artifact: 'MORGANA' },
  { id: 'AVALON', name: 'Armadura da Bravura', artifact: 'AVALON' },
  { id: 'FEY', name: 'Armadura de Tecelão do Crepúsculo', artifact: 'FEY' },
];

const PLATE_HELMET_TYPES = [
  { id: 'SET1', name: 'Elmo de Soldado', artifact: null },
  { id: 'SET2', name: 'Elmo de Cavaleiro', artifact: null },
  { id: 'SET3', name: 'Elmo de Guardião', artifact: null },
  { id: 'UNDEAD', name: 'Elmo de Guardião de Túmulos', artifact: 'UNDEAD' },
  { id: 'HELL', name: 'Elmo Demoníaco', artifact: 'HELL' },
  { id: 'MORGANA', name: 'Elmo de Judicador', artifact: 'MORGANA' },
  { id: 'AVALON', name: 'Elmo da Bravura', artifact: 'AVALON' },
  { id: 'FEY', name: 'Elmo de Tecelão do Crepúsculo', artifact: 'FEY' },
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
  { id: '2H_GLAIVE', name: 'Archa', artifact: null, resources: { planks: 12, bars: 8 } },
  { id: 'MAIN_SPEAR_KEEPER', name: 'Lança Garceira', artifact: 'MAIN_SPEAR_KEEPER', resources: { planks: 8, bars: 8 } },
  { id: '2H_SPEAR_MORGANA', name: 'Caça-espíritos', artifact: '2H_SPEAR_MORGANA', resources: { planks: 12, bars: 8 } },
  { id: '2H_TRINITYSPEAR', name: 'Lança Trina', artifact: '2H_TRINITYSPEAR', resources: { planks: 12, bars: 8 } },
  { id: 'MAIN_SPEAR_AVALON', name: 'Archa Fraturada', artifact: 'MAIN_SPEAR_AVALON', resources: { planks: 8, bars: 8 } },
  { id: '2H_SPEAR_FEY', name: 'Alvorada', artifact: '2H_SPEAR_FEY', resources: { planks: 12, bars: 8 } },
];

const SWORD_TYPES = [
  { id: 'MAIN_SWORD', name: 'Espada Larga', artifact: null, resources: { planks: 8, bars: 8 } },
  { id: '2H_CLAYMORE', name: 'Montante', artifact: null, resources: { planks: 12, bars: 8 } },
  { id: '2H_DUALSWORD', name: 'Espadas Duplas', artifact: null, resources: { planks: 12, bars: 8 } },
  { id: 'MAIN_SCIMITAR_MORGANA', name: 'Lâmina de Clarent', artifact: 'MAIN_SCIMITAR_MORGANA', resources: { planks: 8, bars: 8 } },
  { id: '2H_CLEAVER_HELL', name: 'Espada Entalhada', artifact: '2H_CLEAVER_HELL', resources: { planks: 12, bars: 8 } },
  { id: '2H_DUALSCIMITAR_UNDEAD', name: 'Par de Galatinas', artifact: '2H_DUALSCIMITAR_UNDEAD', resources: { planks: 12, bars: 8 } },
  { id: '2H_CLAYMORE_AVALON', name: 'Faz-Rei', artifact: '2H_CLAYMORE_AVALON', resources: { planks: 12, bars: 8 } },
];

const BOW_TYPES = [
  { id: '2H_BOW', name: 'Arco', artifact: null, resources: { planks: 32, bars: 0 } },
  { id: '2H_WARBOW', name: 'Arco de Guerra', artifact: null, resources: { planks: 32, bars: 0 } },
  { id: '2H_LONGBOW', name: 'Arco Longo', artifact: null, resources: { planks: 32, bars: 0 } },
  { id: '2H_LONGBOW_UNDEAD', name: 'Arco Sussurrante', artifact: '2H_LONGBOW_UNDEAD', resources: { planks: 32, bars: 0 } },
  { id: '2H_BOW_HELL', name: 'Arco Lamurioso', artifact: '2H_BOW_HELL', resources: { planks: 32, bars: 0 } },
  { id: '2H_BOW_KEEPER', name: 'Arco de Badon', artifact: '2H_BOW_KEEPER', resources: { planks: 32, bars: 0 } },
  { id: '2H_BOW_AVALON', name: 'Perfura-bruma', artifact: '2H_BOW_AVALON', resources: { planks: 32, bars: 0 } },
];

const DAGGER_TYPES = [
  { id: 'MAIN_DAGGER', name: 'Adaga', artifact: null, resources: { leather: 8, bars: 8 } },
  { id: '2H_DAGGERPAIR', name: 'Par de Adagas', artifact: null, resources: { leather: 12, bars: 8 } },
  { id: '2H_CLAWPAIR', name: 'Garras', artifact: null, resources: { leather: 12, bars: 8 } },
  { id: 'MAIN_DAGGER_HELL', name: 'Sangra-letra', artifact: 'MAIN_DAGGER_HELL', resources: { leather: 8, bars: 8 } },
  { id: '2H_DUALDAGGER_UNDEAD', name: 'Mãos da Morte', artifact: '2H_DUALDAGGER_UNDEAD', resources: { leather: 12, bars: 8 } },
  { id: '2H_DAGGER_KEEPER', name: 'Empalador', artifact: '2H_DAGGER_KEEPER', resources: { leather: 12, bars: 8 } },
  { id: 'MAIN_DAGGER_AVALON', name: 'Presas Demoníacas', artifact: 'MAIN_DAGGER_AVALON', resources: { leather: 8, bars: 8 } },
];

const ARCANE_STAFF_TYPES = [
  { id: 'MAIN_ARCANESTAFF', name: 'Cajado Arcano', artifact: null, resources: { planks: 8, cloth: 8 } },
  { id: '2H_ARCANESTAFF', name: 'Cajado Arcano Grande', artifact: null, resources: { planks: 12, cloth: 8 } },
  { id: '2H_ENIGMATICSTAFF', name: 'Cajado Enigmático', artifact: null, resources: { planks: 12, cloth: 8 } },
  { id: 'MAIN_ARCANESTAFF_MORGANA', name: 'Cajado Arcano de Bruxa', artifact: 'MAIN_ARCANESTAFF_MORGANA', resources: { planks: 8, cloth: 8 } },
  { id: '2H_ARCANESTAFF_HELL', name: 'Cajado Arcano Oculto', artifact: '2H_ARCANESTAFF_HELL', resources: { planks: 12, cloth: 8 } },
  { id: '2H_ARCANESTAFF_UNDEAD', name: 'Locus Malevolente', artifact: '2H_ARCANESTAFF_UNDEAD', resources: { planks: 12, cloth: 8 } },
  { id: '2H_ARCANESTAFF_AVALON', name: 'Alvorecer', artifact: '2H_ARCANESTAFF_AVALON', resources: { planks: 12, cloth: 8 } },
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
  ITEMS.push({ id: `${tier}_JOURNAL_HUNTER_EMPTY`, name: `Diário de Flecheiro ${tier} (Vazio)`, category: 'Diários', tier: tier as any, enchantment: '0' });
  ITEMS.push({ id: `${tier}_JOURNAL_HUNTER_FULL`, name: `Diário de Flecheiro ${tier} (Cheio)`, category: 'Diários', tier: tier as any, enchantment: '0' });
});

// Generate Artifacts
TIERS.forEach(tier => {
  ROBE_TYPES.forEach(robe => {
    if (robe.artifact) {
      const artifactId = `${tier}_ARTIFACT_ARMOR_CLOTH_${robe.artifact}`;
      ITEMS.push({ id: artifactId, name: `Artefato de ${robe.name} ${tier}`, category: 'Artefatos', tier: tier as any, enchantment: '0' });
    }
  });
  CLOTH_COWL_TYPES.forEach(cowl => {
    if (cowl.artifact) {
      const artifactId = `${tier}_ARTIFACT_HEAD_CLOTH_${cowl.artifact}`;
      ITEMS.push({ id: artifactId, name: `Artefato de ${cowl.name} ${tier}`, category: 'Artefatos', tier: tier as any, enchantment: '0' });
    }
  });
  LEATHER_JACKET_TYPES.forEach(jacket => {
    if (jacket.artifact) {
      const artifactId = `${tier}_ARTIFACT_ARMOR_LEATHER_${jacket.artifact}`;
      ITEMS.push({ id: artifactId, name: `Artefato de ${jacket.name} ${tier}`, category: 'Artefatos', tier: tier as any, enchantment: '0' });
    }
  });
  LEATHER_HOOD_TYPES.forEach(hood => {
    if (hood.artifact) {
      const artifactId = `${tier}_ARTIFACT_HEAD_LEATHER_${hood.artifact}`;
      ITEMS.push({ id: artifactId, name: `Artefato de ${hood.name} ${tier}`, category: 'Artefatos', tier: tier as any, enchantment: '0' });
    }
  });
  PLATE_ARMOR_TYPES.forEach(armor => {
    if (armor.artifact) {
      const artifactId = `${tier}_ARTIFACT_ARMOR_PLATE_${armor.artifact}`;
      ITEMS.push({ id: artifactId, name: `Artefato de ${armor.name} ${tier}`, category: 'Artefatos', tier: tier as any, enchantment: '0' });
    }
  });
  PLATE_HELMET_TYPES.forEach(helmet => {
    if (helmet.artifact) {
      const artifactId = `${tier}_ARTIFACT_HEAD_PLATE_${helmet.artifact}`;
      ITEMS.push({ id: artifactId, name: `Artefato de ${helmet.name} ${tier}`, category: 'Artefatos', tier: tier as any, enchantment: '0' });
    }
  });
  PLATE_SHOE_TYPES.forEach(shoe => {
    if (shoe.artifact) {
      const artifactId = `${tier}_ARTIFACT_SHOES_PLATE_${shoe.artifact}`;
      ITEMS.push({ id: artifactId, name: `Artefato de ${shoe.name} ${tier}`, category: 'Artefatos', tier: tier as any, enchantment: '0' });
    }
  });
  SPEAR_TYPES.forEach(spear => {
    if (spear.artifact) {
      const artifactId = `${tier}_ARTIFACT_${spear.artifact}`;
      ITEMS.push({ id: artifactId, name: `Artefato de ${spear.name} ${tier}`, category: 'Artefatos', tier: tier as any, enchantment: '0' });
    }
  });
  SWORD_TYPES.forEach(sword => {
    if (sword.artifact) {
      const artifactId = `${tier}_ARTIFACT_${sword.artifact}`;
      ITEMS.push({ id: artifactId, name: `Artefato de ${sword.name} ${tier}`, category: 'Artefatos', tier: tier as any, enchantment: '0' });
    }
  });
  BOW_TYPES.forEach(bow => {
    if (bow.artifact) {
      const artifactId = `${tier}_ARTIFACT_${bow.artifact}`;
      ITEMS.push({ id: artifactId, name: `Artefato de ${bow.name} ${tier}`, category: 'Artefatos', tier: tier as any, enchantment: '0' });
    }
  });
  DAGGER_TYPES.forEach(dagger => {
    if (dagger.artifact) {
      const artifactId = `${tier}_ARTIFACT_${dagger.artifact}`;
      ITEMS.push({ id: artifactId, name: `Artefato de ${dagger.name} ${tier}`, category: 'Artefatos', tier: tier as any, enchantment: '0' });
    }
  });
  ARCANE_STAFF_TYPES.forEach(arcane => {
    if (arcane.artifact) {
      const artifactId = `${tier}_ARTIFACT_${arcane.artifact}`;
      ITEMS.push({ id: artifactId, name: `Artefato de ${arcane.name} ${tier}`, category: 'Artefatos', tier: tier as any, enchantment: '0' });
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

    // Leather
    const leatherId = `${tier}_LEATHER${enchSuffix}`;
    ITEMS.push({ id: leatherId, name: `Couro ${tier}.${ench}`, category: 'Recursos Refinados', tier: tier as any, enchantment: ench as any });

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

    // Cloth Cowls
    CLOTH_COWL_TYPES.forEach(cowl => {
      const cowlId = `${tier}_HEAD_CLOTH_${cowl.id}${itemEnchSuffix}`;
      const cowlName = `${cowl.name} ${tier}.${ench}`;
      ITEMS.push({ id: cowlId, name: cowlName, category: 'Capuzes de Tecido', tier: tier as any, enchantment: ench as any });
      
      const materials = [{ itemId: clothId, amount: 8 }];
      if (cowl.artifact) {
        materials.push({ itemId: `${tier}_ARTIFACT_HEAD_CLOTH_${cowl.artifact}`, amount: 1 });
      }

      RECIPES.push({
        itemId: cowlId,
        materials,
        fame: TIER_FAME[tier] / 2,
        journalId: `${tier}_JOURNAL_MAGIC_EMPTY`,
        baseFocusCost: TIER_FOCUS[tier] / 2,
      });
    });

    // Leather Jackets
    LEATHER_JACKET_TYPES.forEach(jacket => {
      const jacketId = `${tier}_ARMOR_LEATHER_${jacket.id}${itemEnchSuffix}`;
      const jacketName = `${jacket.name} ${tier}.${ench}`;
      ITEMS.push({ id: jacketId, name: jacketName, category: 'Casacos de Couro', tier: tier as any, enchantment: ench as any });
      
      const materials = [{ itemId: leatherId, amount: 16 }];
      if (jacket.artifact) {
        materials.push({ itemId: `${tier}_ARTIFACT_ARMOR_LEATHER_${jacket.artifact}`, amount: 1 });
      }

      RECIPES.push({
        itemId: jacketId,
        materials,
        fame: TIER_FAME[tier],
        journalId: `${tier}_JOURNAL_HUNTER_EMPTY`,
        baseFocusCost: TIER_FOCUS[tier],
      });
    });

    // Leather Hoods
    LEATHER_HOOD_TYPES.forEach(hood => {
      const hoodId = `${tier}_HEAD_LEATHER_${hood.id}${itemEnchSuffix}`;
      const hoodName = `${hood.name} ${tier}.${ench}`;
      ITEMS.push({ id: hoodId, name: hoodName, category: 'Capuzes de Couro', tier: tier as any, enchantment: ench as any });
      
      const materials = [{ itemId: leatherId, amount: 8 }];
      if (hood.artifact) {
        materials.push({ itemId: `${tier}_ARTIFACT_HEAD_LEATHER_${hood.artifact}`, amount: 1 });
      }

      RECIPES.push({
        itemId: hoodId,
        materials,
        fame: TIER_FAME[tier] / 2,
        journalId: `${tier}_JOURNAL_HUNTER_EMPTY`,
        baseFocusCost: TIER_FOCUS[tier] / 2,
      });
    });

    // Plate Armors
    PLATE_ARMOR_TYPES.forEach(armor => {
      const armorId = `${tier}_ARMOR_PLATE_${armor.id}${itemEnchSuffix}`;
      const armorName = `${armor.name} ${tier}.${ench}`;
      ITEMS.push({ id: armorId, name: armorName, category: 'Armaduras de Placas', tier: tier as any, enchantment: ench as any });
      
      const materials = [{ itemId: barId, amount: 16 }];
      if (armor.artifact) {
        materials.push({ itemId: `${tier}_ARTIFACT_ARMOR_PLATE_${armor.artifact}`, amount: 1 });
      }

      RECIPES.push({
        itemId: armorId,
        materials,
        fame: TIER_FAME[tier],
        journalId: `${tier}_JOURNAL_WARRIOR_EMPTY`,
        baseFocusCost: TIER_FOCUS[tier],
      });
    });

    // Plate Helmets
    PLATE_HELMET_TYPES.forEach(helmet => {
      const helmetId = `${tier}_HEAD_PLATE_${helmet.id}${itemEnchSuffix}`;
      const helmetName = `${helmet.name} ${tier}.${ench}`;
      ITEMS.push({ id: helmetId, name: helmetName, category: 'Elmos de Placa', tier: tier as any, enchantment: ench as any });
      
      const materials = [{ itemId: barId, amount: 8 }];
      if (helmet.artifact) {
        materials.push({ itemId: `${tier}_ARTIFACT_HEAD_PLATE_${helmet.artifact}`, amount: 1 });
      }

      RECIPES.push({
        itemId: helmetId,
        materials,
        fame: TIER_FAME[tier] / 2,
        journalId: `${tier}_JOURNAL_WARRIOR_EMPTY`,
        baseFocusCost: TIER_FOCUS[tier] / 2,
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

    // Swords
    SWORD_TYPES.forEach(sword => {
      const swordId = `${tier}_${sword.id}${itemEnchSuffix}`;
      const swordName = `${sword.name} ${tier}.${ench}`;
      ITEMS.push({ id: swordId, name: swordName, category: 'Espadas', tier: tier as any, enchantment: ench as any });

      const materials = [
        { itemId: plankId, amount: sword.resources.planks },
        { itemId: barId, amount: sword.resources.bars }
      ];
      if (sword.artifact) {
        materials.push({ itemId: `${tier}_ARTIFACT_${sword.artifact}`, amount: 1 });
      }

      const totalResources = sword.resources.planks + sword.resources.bars;
      const resourceMultiplier = totalResources / 16;

      RECIPES.push({
        itemId: swordId,
        materials,
        fame: TIER_FAME[tier] * resourceMultiplier,
        journalId: `${tier}_JOURNAL_WARRIOR_EMPTY`,
        baseFocusCost: TIER_FOCUS[tier] * resourceMultiplier,
      });
    });

    // Bows
    BOW_TYPES.forEach(bow => {
      const bowId = `${tier}_${bow.id}${itemEnchSuffix}`;
      const bowName = `${bow.name} ${tier}.${ench}`;
      ITEMS.push({ id: bowId, name: bowName, category: 'Arcos', tier: tier as any, enchantment: ench as any });

      const materials = [
        { itemId: plankId, amount: bow.resources.planks }
      ];
      if (bow.artifact) {
        materials.push({ itemId: `${tier}_ARTIFACT_${bow.artifact}`, amount: 1 });
      }

      const totalResources = bow.resources.planks + bow.resources.bars;
      const resourceMultiplier = totalResources / 16;

      RECIPES.push({
        itemId: bowId,
        materials,
        fame: TIER_FAME[tier] * resourceMultiplier,
        journalId: `${tier}_JOURNAL_HUNTER_EMPTY`,
        baseFocusCost: TIER_FOCUS[tier] * resourceMultiplier,
      });
    });

    // Daggers
    DAGGER_TYPES.forEach(dagger => {
      const daggerId = `${tier}_${dagger.id}${itemEnchSuffix}`;
      const daggerName = `${dagger.name} ${tier}.${ench}`;
      ITEMS.push({ id: daggerId, name: daggerName, category: 'Adagas', tier: tier as any, enchantment: ench as any });

      const materials = [
        { itemId: leatherId, amount: dagger.resources.leather },
        { itemId: barId, amount: dagger.resources.bars }
      ];
      if (dagger.artifact) {
        materials.push({ itemId: `${tier}_ARTIFACT_${dagger.artifact}`, amount: 1 });
      }

      const totalResources = dagger.resources.leather + dagger.resources.bars;
      const resourceMultiplier = totalResources / 16;

      RECIPES.push({
        itemId: daggerId,
        materials,
        fame: TIER_FAME[tier] * resourceMultiplier,
        journalId: `${tier}_JOURNAL_HUNTER_EMPTY`,
        baseFocusCost: TIER_FOCUS[tier] * resourceMultiplier,
      });
    });

    // Arcane Staffs
    ARCANE_STAFF_TYPES.forEach(arcane => {
      const arcaneId = `${tier}_${arcane.id}${itemEnchSuffix}`;
      const arcaneName = `${arcane.name} ${tier}.${ench}`;
      ITEMS.push({ id: arcaneId, name: arcaneName, category: 'Cajados Arcanos', tier: tier as any, enchantment: ench as any });

      const materials = [
        { itemId: plankId, amount: arcane.resources.planks },
        { itemId: clothId, amount: arcane.resources.cloth }
      ];
      if (arcane.artifact) {
        materials.push({ itemId: `${tier}_ARTIFACT_${arcane.artifact}`, amount: 1 });
      }

      const totalResources = arcane.resources.planks + arcane.resources.cloth;
      const resourceMultiplier = totalResources / 16;

      RECIPES.push({
        itemId: arcaneId,
        materials,
        fame: TIER_FAME[tier] * resourceMultiplier,
        journalId: `${tier}_JOURNAL_MAGIC_EMPTY`,
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

  // Cloth Cowls
  { id: 'baseClothCowl', name: 'Fabricante de Capuz de Tecido', multiplier: 30 },
  { id: 'COWL_SET1', name: 'Especialista em Capote de Erudito', baseNodeId: 'baseClothCowl', multiplier: 250 },
  { id: 'COWL_SET2', name: 'Especialista em Capote de Clérigo', baseNodeId: 'baseClothCowl', multiplier: 250 },
  { id: 'COWL_SET3', name: 'Especialista em Capote de Mago', baseNodeId: 'baseClothCowl', multiplier: 250 },
  { id: 'COWL_KEEPER', name: 'Especialista em Capote de Druida', baseNodeId: 'baseClothCowl', multiplier: 250, isArtifact: true },
  { id: 'COWL_HELL', name: 'Especialista em Capote Malévolo', baseNodeId: 'baseClothCowl', multiplier: 250, isArtifact: true },
  { id: 'COWL_UNDEAD', name: 'Especialista em Capote de Sectário', baseNodeId: 'baseClothCowl', multiplier: 250, isArtifact: true },
  { id: 'COWL_AVALON', name: 'Especialista em Capote da Pureza', baseNodeId: 'baseClothCowl', multiplier: 250, isArtifact: true },
  { id: 'COWL_FEY', name: 'Especialista em Capote Escama-feérica', baseNodeId: 'baseClothCowl', multiplier: 250, isArtifact: true },

  // Leather Jackets
  { id: 'baseLeatherJacket', name: 'Fabricante de Casaco de Couro', multiplier: 30 },
  { id: 'JACKET_SET1', name: 'Especialista em Casaco de Mercenário', baseNodeId: 'baseLeatherJacket', multiplier: 250 },
  { id: 'JACKET_SET2', name: 'Especialista em Casaco de Caçador', baseNodeId: 'baseLeatherJacket', multiplier: 250 },
  { id: 'JACKET_SET3', name: 'Especialista em Casaco de Assassino', baseNodeId: 'baseLeatherJacket', multiplier: 250 },
  { id: 'JACKET_KEEPER', name: 'Especialista em Casaco de Espreitador', baseNodeId: 'baseLeatherJacket', multiplier: 250, isArtifact: true },
  { id: 'JACKET_HELL', name: 'Especialista em Casaco Infernal', baseNodeId: 'baseLeatherJacket', multiplier: 250, isArtifact: true },
  { id: 'JACKET_UNDEAD', name: 'Especialista em Casaco de Espectro', baseNodeId: 'baseLeatherJacket', multiplier: 250, isArtifact: true },
  { id: 'JACKET_AVALON', name: 'Especialista em Casaco Tenaz', baseNodeId: 'baseLeatherJacket', multiplier: 250, isArtifact: true },
  { id: 'JACKET_FEY', name: 'Especialista em Casaco Andarilho-da-névoa', baseNodeId: 'baseLeatherJacket', multiplier: 250, isArtifact: true },

  // Leather Hoods
  { id: 'baseLeatherHood', name: 'Fabricante de Capuz de Couro', multiplier: 30 },
  { id: 'HOOD_SET1', name: 'Especialista em Capuz de Mercenário', baseNodeId: 'baseLeatherHood', multiplier: 250 },
  { id: 'HOOD_SET2', name: 'Especialista em Capuz de Caçador', baseNodeId: 'baseLeatherHood', multiplier: 250 },
  { id: 'HOOD_SET3', name: 'Especialista em Capuz de Assassino', baseNodeId: 'baseLeatherHood', multiplier: 250 },
  { id: 'HOOD_KEEPER', name: 'Especialista em Capuz de Espreitador', baseNodeId: 'baseLeatherHood', multiplier: 250, isArtifact: true },
  { id: 'HOOD_HELL', name: 'Especialista em Capuz Infernal', baseNodeId: 'baseLeatherHood', multiplier: 250, isArtifact: true },
  { id: 'HOOD_UNDEAD', name: 'Especialista em Capuz de Espectro', baseNodeId: 'baseLeatherHood', multiplier: 250, isArtifact: true },
  { id: 'HOOD_AVALON', name: 'Especialista em Capuz Tenaz', baseNodeId: 'baseLeatherHood', multiplier: 250, isArtifact: true },
  { id: 'HOOD_FEY', name: 'Especialista em Capuz Andarilho-da-névoa', baseNodeId: 'baseLeatherHood', multiplier: 250, isArtifact: true },

  // Plate Armors
  { id: 'basePlateArmor', name: 'Fabricante de Armadura de Placa', multiplier: 30 },
  { id: 'ARMOR_SET1', name: 'Especialista em Armadura de Soldado', baseNodeId: 'basePlateArmor', multiplier: 250 },
  { id: 'ARMOR_SET2', name: 'Especialista em Armadura de Cavaleiro', baseNodeId: 'basePlateArmor', multiplier: 250 },
  { id: 'ARMOR_SET3', name: 'Especialista em Armadura de Guardião', baseNodeId: 'basePlateArmor', multiplier: 250 },
  { id: 'ARMOR_UNDEAD', name: 'Especialista em Armadura de Guardião de Túmulos', baseNodeId: 'basePlateArmor', multiplier: 250, isArtifact: true },
  { id: 'ARMOR_HELL', name: 'Especialista em Armadura Demoníaca', baseNodeId: 'basePlateArmor', multiplier: 250, isArtifact: true },
  { id: 'ARMOR_MORGANA', name: 'Especialista em Armadura de Judicador', baseNodeId: 'basePlateArmor', multiplier: 250, isArtifact: true },
  { id: 'ARMOR_AVALON', name: 'Especialista em Armadura da Bravura', baseNodeId: 'basePlateArmor', multiplier: 250, isArtifact: true },
  { id: 'ARMOR_FEY', name: 'Especialista em Armadura de Tecelão do Crepúsculo', baseNodeId: 'basePlateArmor', multiplier: 250, isArtifact: true },

  // Plate Helmets
  { id: 'basePlateHelmet', name: 'Fabricante de Elmo de Placa', multiplier: 30 },
  { id: 'HELMET_SET1', name: 'Especialista em Elmo de Soldado', baseNodeId: 'basePlateHelmet', multiplier: 250 },
  { id: 'HELMET_SET2', name: 'Especialista em Elmo de Cavaleiro', baseNodeId: 'basePlateHelmet', multiplier: 250 },
  { id: 'HELMET_SET3', name: 'Especialista em Elmo de Guardião', baseNodeId: 'basePlateHelmet', multiplier: 250 },
  { id: 'HELMET_UNDEAD', name: 'Especialista em Elmo de Guardião de Túmulos', baseNodeId: 'basePlateHelmet', multiplier: 250, isArtifact: true },
  { id: 'HELMET_HELL', name: 'Especialista em Elmo Demoníaco', baseNodeId: 'basePlateHelmet', multiplier: 250, isArtifact: true },
  { id: 'HELMET_MORGANA', name: 'Especialista em Elmo de Judicador', baseNodeId: 'basePlateHelmet', multiplier: 250, isArtifact: true },
  { id: 'HELMET_AVALON', name: 'Especialista em Elmo da Bravura', baseNodeId: 'basePlateHelmet', multiplier: 250, isArtifact: true },
  { id: 'HELMET_FEY', name: 'Especialista em Elmo de Tecelão do Crepúsculo', baseNodeId: 'basePlateHelmet', multiplier: 250, isArtifact: true },

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

  // Swords
  { id: 'baseSword', name: 'Fabricante de Espadas', multiplier: 30 },
  { id: 'MAIN_SWORD', name: 'Especialista em Espada Larga', baseNodeId: 'baseSword', multiplier: 250 },
  { id: '2H_CLAYMORE', name: 'Especialista em Montante', baseNodeId: 'baseSword', multiplier: 250 },
  { id: '2H_DUALSWORD', name: 'Especialista em Espadas Duplas', baseNodeId: 'baseSword', multiplier: 250 },
  { id: 'MAIN_SCIMITAR_MORGANA', name: 'Especialista em Lâmina de Clarent', baseNodeId: 'baseSword', multiplier: 250, isArtifact: true },
  { id: '2H_CLEAVER_HELL', name: 'Especialista em Espada Entalhada', baseNodeId: 'baseSword', multiplier: 250, isArtifact: true },
  { id: '2H_DUALSCIMITAR_UNDEAD', name: 'Especialista em Par de Galatinas', baseNodeId: 'baseSword', multiplier: 250, isArtifact: true },
  { id: '2H_CLAYMORE_AVALON', name: 'Especialista em Faz-Rei', baseNodeId: 'baseSword', multiplier: 250, isArtifact: true },

  // Bows
  { id: 'baseBow', name: 'Fabricante de Arcos', multiplier: 30 },
  { id: '2H_BOW', name: 'Especialista em Arco', baseNodeId: 'baseBow', multiplier: 250 },
  { id: '2H_WARBOW', name: 'Especialista em Arco de Guerra', baseNodeId: 'baseBow', multiplier: 250 },
  { id: '2H_LONGBOW', name: 'Especialista em Arco Longo', baseNodeId: 'baseBow', multiplier: 250 },
  { id: '2H_LONGBOW_UNDEAD', name: 'Especialista em Arco Sussurrante', baseNodeId: 'baseBow', multiplier: 250, isArtifact: true },
  { id: '2H_BOW_HELL', name: 'Especialista em Arco Lamurioso', baseNodeId: 'baseBow', multiplier: 250, isArtifact: true },
  { id: '2H_BOW_KEEPER', name: 'Especialista em Arco de Badon', baseNodeId: 'baseBow', multiplier: 250, isArtifact: true },
  { id: '2H_BOW_AVALON', name: 'Especialista em Perfura-bruma', baseNodeId: 'baseBow', multiplier: 250, isArtifact: true },

  // Daggers
  { id: 'baseDagger', name: 'Fabricante de Adagas', multiplier: 30 },
  { id: 'MAIN_DAGGER', name: 'Especialista em Adaga', baseNodeId: 'baseDagger', multiplier: 250 },
  { id: '2H_DAGGERPAIR', name: 'Especialista em Par de Adagas', baseNodeId: 'baseDagger', multiplier: 250 },
  { id: '2H_CLAWPAIR', name: 'Especialista em Garras', baseNodeId: 'baseDagger', multiplier: 250 },
  { id: 'MAIN_DAGGER_HELL', name: 'Especialista em Sangra-letra', baseNodeId: 'baseDagger', multiplier: 250, isArtifact: true },
  { id: '2H_DUALDAGGER_UNDEAD', name: 'Especialista em Mãos da Morte', baseNodeId: 'baseDagger', multiplier: 250, isArtifact: true },
  { id: '2H_DAGGER_KEEPER', name: 'Especialista em Empalador', baseNodeId: 'baseDagger', multiplier: 250, isArtifact: true },
  { id: 'MAIN_DAGGER_AVALON', name: 'Especialista em Presas Demoníacas', baseNodeId: 'baseDagger', multiplier: 250, isArtifact: true },

  // Arcane Staffs
  { id: 'baseArcane', name: 'Fabricante de Cajados Arcanos', multiplier: 30 },
  { id: 'MAIN_ARCANESTAFF', name: 'Especialista em Cajado Arcano', baseNodeId: 'baseArcane', multiplier: 250 },
  { id: '2H_ARCANESTAFF', name: 'Especialista em Cajado Arcano Grande', baseNodeId: 'baseArcane', multiplier: 250 },
  { id: '2H_ENIGMATICSTAFF', name: 'Especialista em Cajado Enigmático', baseNodeId: 'baseArcane', multiplier: 250 },
  { id: 'MAIN_ARCANESTAFF_MORGANA', name: 'Especialista em Cajado Arcano de Bruxa', baseNodeId: 'baseArcane', multiplier: 250, isArtifact: true },
  { id: '2H_ARCANESTAFF_HELL', name: 'Especialista em Cajado Arcano Oculto', baseNodeId: 'baseArcane', multiplier: 250, isArtifact: true },
  { id: '2H_ARCANESTAFF_UNDEAD', name: 'Especialista em Locus Malevolente', baseNodeId: 'baseArcane', multiplier: 250, isArtifact: true },
  { id: '2H_ARCANESTAFF_AVALON', name: 'Especialista em Alvorecer', baseNodeId: 'baseArcane', multiplier: 250, isArtifact: true },
];
