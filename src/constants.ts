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

const CLOTH_SHOE_TYPES = [
  { id: 'SET1', name: 'Sandálias de Erudito', artifact: null },
  { id: 'SET2', name: 'Sandálias de Clérigo', artifact: null },
  { id: 'SET3', name: 'Sandálias de Mago', artifact: null },
  { id: 'KEEPER', name: 'Sandálias de Druida', artifact: 'KEEPER' },
  { id: 'HELL', name: 'Sandálias Malévolas', artifact: 'HELL' },
  { id: 'UNDEAD', name: 'Sandálias de Sectário', artifact: 'UNDEAD' },
  { id: 'AVALON', name: 'Sandálias da Pureza', artifact: 'AVALON' },
  { id: 'FEY', name: 'Sandálias Escama-feérica', artifact: 'FEY' },
];

const LEATHER_SHOE_TYPES = [
  { id: 'SET1', name: 'Sapatos de Mercenário', artifact: null },
  { id: 'SET2', name: 'Sapatos de Caçador', artifact: null },
  { id: 'SET3', name: 'Sapatos de Assassino', artifact: null },
  { id: 'KEEPER', name: 'Sapatos de Espreitador', artifact: 'KEEPER' },
  { id: 'HELL', name: 'Sapatos Infernais', artifact: 'HELL' },
  { id: 'UNDEAD', name: 'Sapatos de Espectro', artifact: 'UNDEAD' },
  { id: 'AVALON', name: 'Sapatos Tenazes', artifact: 'AVALON' },
  { id: 'FEY', name: 'Sapatos Andarilho-da-névoa', artifact: 'FEY' },
];

const AXE_TYPES = [
  { id: 'MAIN_AXE', name: 'Machado de Batalha', artifact: null, resources: { planks: 8, bars: 8 } },
  { id: '2H_AXE', name: 'Machadão', artifact: null, resources: { planks: 12, bars: 8 } },
  { id: '2H_HALBERD', name: 'Alabarda', artifact: null, resources: { planks: 12, bars: 8 } },
  { id: '2H_HALBERD_MORGANA', name: 'Sacha-carnes', artifact: '2H_HALBERD_MORGANA', resources: { planks: 12, bars: 8 } },
  { id: '2H_SCYTHE_HELL', name: 'Ceifadora Sangrenta', artifact: '2H_SCYTHE_HELL', resources: { planks: 12, bars: 8 } },
  { id: '2H_DUALAXE_KEEPER', name: 'Patas de Urso', artifact: '2H_DUALAXE_KEEPER', resources: { planks: 12, bars: 8 } },
  { id: '2H_AXE_AVALON', name: 'Quebra-reinos', artifact: '2H_AXE_AVALON', resources: { planks: 12, bars: 8 } },
  { id: '2H_AXE_FEY', name: 'Chamadora de Raiz', artifact: '2H_AXE_FEY', resources: { planks: 12, bars: 8 } },
];

const MACE_TYPES = [
  { id: 'MAIN_MACE', name: 'Maça', artifact: null, resources: { leather: 8, bars: 8 } },
  { id: '2H_MACE', name: 'Maça Pesada', artifact: null, resources: { leather: 12, bars: 8 } },
  { id: '2H_FLAIL', name: 'Mangual', artifact: null, resources: { leather: 12, bars: 8 } },
  { id: 'MAIN_ROCKMACE_KEEPER', name: 'Maça de Incubo', artifact: 'MAIN_ROCKMACE_KEEPER', resources: { leather: 8, bars: 8 } },
  { id: 'MAIN_MACE_HELL', name: 'Maça de Camlann', artifact: 'MAIN_MACE_HELL', resources: { leather: 8, bars: 8 } },
  { id: '2H_MACE_MORGANA', name: 'Padecedor', artifact: '2H_MACE_MORGANA', resources: { leather: 12, bars: 8 } },
  { id: '2H_DUALMACE_AVALON', name: 'Juradores Guardiões', artifact: '2H_DUALMACE_AVALON', resources: { leather: 12, bars: 8 } },
];

const HAMMER_TYPES = [
  { id: 'MAIN_HAMMER', name: 'Martelo', artifact: null, resources: { planks: 8, bars: 8 } },
  { id: '2H_POLEHAMMER', name: 'Martelo-Lança', artifact: null, resources: { planks: 12, bars: 8 } },
  { id: '2H_HAMMER', name: 'Grande Martelo', artifact: null, resources: { planks: 12, bars: 8 } },
  { id: '2H_RAM_KEEPER', name: 'Cadeados de Túmulo', artifact: '2H_RAM_KEEPER', resources: { planks: 12, bars: 8 } },
  { id: '2H_HAMMER_UNDEAD', name: 'Forjador de Túmulos', artifact: '2H_HAMMER_UNDEAD', resources: { planks: 12, bars: 8 } },
  { id: '2H_DUALHAMMER_HELL', name: 'Martelos de Forja', artifact: '2H_DUALHAMMER_HELL', resources: { planks: 12, bars: 8 } },
  { id: '2H_HAMMER_AVALON', name: 'Mãos da Justiça', artifact: '2H_HAMMER_AVALON', resources: { planks: 12, bars: 8 } },
];

const QUARTERSTAFF_TYPES = [
  { id: '2H_QUARTERSTAFF', name: 'Bordão', artifact: null, resources: { leather: 12, bars: 8 } },
  { id: '2H_IRONCLADEDSTAFF', name: 'Cajado Ferrado', artifact: null, resources: { leather: 12, bars: 8 } },
  { id: '2H_DOUBLEBLADEDSTAFF', name: 'Cajado de Lâmina Dupla', artifact: null, resources: { leather: 12, bars: 8 } },
  { id: '2H_COMBATSTAFF_MORGANA', name: 'Atacante Negro', artifact: '2H_COMBATSTAFF_MORGANA', resources: { leather: 12, bars: 8 } },
  { id: '2H_TWINSCYTHE_HELL', name: 'Foice de Almas', artifact: '2H_TWINSCYTHE_HELL', resources: { leather: 12, bars: 8 } },
  { id: '2H_ROCKSTAFF_KEEPER', name: 'Aríete Equilíbrio', artifact: '2H_ROCKSTAFF_KEEPER', resources: { leather: 12, bars: 8 } },
  { id: '2H_QUARTERSTAFF_AVALON', name: 'Buscagralha', artifact: '2H_QUARTERSTAFF_AVALON', resources: { leather: 12, bars: 8 } },
];

const CROSSBOW_TYPES = [
  { id: '2H_CROSSBOW', name: 'Besta', artifact: null, resources: { planks: 20, bars: 0 } },
  { id: '2H_CROSSBOWLARGE', name: 'Besta Pesada', artifact: null, resources: { planks: 20, bars: 0 } },
  { id: 'MAIN_1HCROSSBOW', name: 'Besta Leve', artifact: null, resources: { planks: 16, bars: 0 } },
  { id: '2H_REPEATINGCROSSBOW_UNDEAD', name: 'Choramingadora', artifact: '2H_REPEATINGCROSSBOW_UNDEAD', resources: { planks: 20, bars: 0 } },
  { id: '2H_DUALCROSSBOW_HELL', name: 'Mãos Atiradoras', artifact: '2H_DUALCROSSBOW_HELL', resources: { planks: 20, bars: 0 } },
  { id: '2H_CROSSBOWLARGE_MORGANA', name: 'Criador de Cercos', artifact: '2H_CROSSBOWLARGE_MORGANA', resources: { planks: 20, bars: 0 } },
  { id: '2H_CROSSBOW_AVALON', name: 'Convocadora de Energia', artifact: '2H_CROSSBOW_AVALON', resources: { planks: 20, bars: 0 } },
];

const FIRE_STAFF_TYPES = [
  { id: 'MAIN_FIRESTAFF', name: 'Cajado de Fogo', artifact: null, resources: { planks: 16, bars: 0 } },
  { id: '2H_FIRESTAFF', name: 'Cajado de Fogo Grande', artifact: null, resources: { planks: 20, bars: 0 } },
  { id: '2H_INFERNOSTAFF', name: 'Cajado Infernal', artifact: null, resources: { planks: 20, bars: 0 } },
  { id: 'MAIN_FIRESTAFF_KEEPER', name: 'Cajado de Fogo Feroz', artifact: 'MAIN_FIRESTAFF_KEEPER', resources: { planks: 16, bars: 0 } },
  { id: '2H_FIRESTAFF_HELL', name: 'Cajado de Enxofre', artifact: '2H_FIRESTAFF_HELL', resources: { planks: 20, bars: 0 } },
  { id: '2H_INFERNOSTAFF_MORGANA', name: 'Música Chamejante', artifact: '2H_INFERNOSTAFF_MORGANA', resources: { planks: 20, bars: 0 } },
  { id: '2H_FIRESTAFF_AVALON', name: 'Cajado de Fogo da Aurora', artifact: '2H_FIRESTAFF_AVALON', resources: { planks: 20, bars: 0 } },
];

const HOLY_STAFF_TYPES = [
  { id: 'MAIN_HOLYSTAFF', name: 'Cajado Sagrado', artifact: null, resources: { planks: 16, bars: 0 } },
  { id: '2H_HOLYSTAFF', name: 'Cajado Sagrado Grande', artifact: null, resources: { planks: 20, bars: 0 } },
  { id: '2H_DIVINESTAFF', name: 'Cajado Divino', artifact: null, resources: { planks: 20, bars: 0 } },
  { id: 'MAIN_HOLYSTAFF_MORGANA', name: 'Cajado Vil', artifact: 'MAIN_HOLYSTAFF_MORGANA', resources: { planks: 16, bars: 0 } },
  { id: '2H_HOLYSTAFF_HELL', name: 'Cajado de Condenado', artifact: '2H_HOLYSTAFF_HELL', resources: { planks: 20, bars: 0 } },
  { id: '2H_HOLYSTAFF_UNDEAD', name: 'Cajado de Redenção', artifact: '2H_HOLYSTAFF_UNDEAD', resources: { planks: 20, bars: 0 } },
  { id: 'MAIN_HOLYSTAFF_AVALON', name: 'Cajado de Luz', artifact: 'MAIN_HOLYSTAFF_AVALON', resources: { planks: 16, bars: 0 } },
];

const NATURE_STAFF_TYPES = [
  { id: 'MAIN_NATURESTAFF', name: 'Cajado da Natureza', artifact: null, resources: { planks: 16, bars: 0 } },
  { id: '2H_NATURESTAFF', name: 'Cajado da Natureza Grande', artifact: null, resources: { planks: 20, bars: 0 } },
  { id: '2H_WILDSTAFF', name: 'Cajado Selvagem', artifact: null, resources: { planks: 20, bars: 0 } },
  { id: 'MAIN_NATURESTAFF_KEEPER', name: 'Cajado Contaminador', artifact: 'MAIN_NATURESTAFF_KEEPER', resources: { planks: 16, bars: 0 } },
  { id: '2H_NATURESTAFF_HELL', name: 'Cajado de Praga', artifact: '2H_NATURESTAFF_HELL', resources: { planks: 20, bars: 0 } },
  { id: '2H_NATURESTAFF_KEEPER', name: 'Cajado Rampante', artifact: '2H_NATURESTAFF_KEEPER', resources: { planks: 20, bars: 0 } },
  { id: 'MAIN_NATURESTAFF_AVALON', name: 'Cajado da Madeira-ferro', artifact: 'MAIN_NATURESTAFF_AVALON', resources: { planks: 16, bars: 0 } },
];

const FROST_STAFF_TYPES = [
  { id: 'MAIN_FROSTSTAFF', name: 'Cajado de Gelo', artifact: null, resources: { planks: 16, bars: 0 } },
  { id: '2H_FROSTSTAFF', name: 'Cajado de Gelo Grande', artifact: null, resources: { planks: 20, bars: 0 } },
  { id: '2H_GLACIALSTAFF', name: 'Cajado Glacial', artifact: null, resources: { planks: 20, bars: 0 } },
  { id: 'MAIN_FROSTSTAFF_KEEPER', name: 'Cajado de Gelo Gris', artifact: 'MAIN_FROSTSTAFF_KEEPER', resources: { planks: 16, bars: 0 } },
  { id: '2H_ICEGAUNTLETS_HELL', name: 'Manoplas de Gelo', artifact: '2H_ICEGAUNTLETS_HELL', resources: { planks: 20, bars: 0 } },
  { id: '2H_ICECRYSTAL_UNDEAD', name: 'Prisma Congelante', artifact: '2H_ICECRYSTAL_UNDEAD', resources: { planks: 20, bars: 0 } },
  { id: 'MAIN_FROSTSTAFF_AVALON', name: 'Cajado de Gelo Glacial', artifact: 'MAIN_FROSTSTAFF_AVALON', resources: { planks: 16, bars: 0 } },
];

const CURSED_STAFF_TYPES = [
  { id: 'MAIN_CURSEDSTAFF', name: 'Cajado Amaldiçoado', artifact: null, resources: { planks: 16, bars: 0 } },
  { id: '2H_CURSEDSTAFF', name: 'Cajado Amaldiçoado Grande', artifact: null, resources: { planks: 20, bars: 0 } },
  { id: '2H_DEMONICSTAFF', name: 'Cajado Demoníaco', artifact: null, resources: { planks: 20, bars: 0 } },
  { id: 'MAIN_CURSEDSTAFF_UNDEAD', name: 'Cajado Vil', artifact: 'MAIN_CURSEDSTAFF_UNDEAD', resources: { planks: 16, bars: 0 } },
  { id: '2H_SKULLORB_HELL', name: 'Cajado Amaldiçoado Condenado', artifact: '2H_SKULLORB_HELL', resources: { planks: 20, bars: 0 } },
  { id: '2H_CURSEDSTAFF_MORGANA', name: 'Chamador das Sombras', artifact: '2H_CURSEDSTAFF_MORGANA', resources: { planks: 20, bars: 0 } },
  { id: 'MAIN_CURSEDSTAFF_AVALON', name: 'Cajado Amaldiçoado da Escuridão', artifact: 'MAIN_CURSEDSTAFF_AVALON', resources: { planks: 16, bars: 0 } },
];

const SHIELD_TYPES = [
  { id: 'SHIELD', name: 'Escudo', artifact: null, resources: { planks: 4, bars: 0 } },
  { id: 'SHIELD_HELL', name: 'Sarcófago', artifact: 'SHIELD_HELL', resources: { planks: 4, bars: 0 } },
  { id: 'SHIELD_UNDEAD', name: 'Escudo Condenado', artifact: 'SHIELD_UNDEAD', resources: { planks: 4, bars: 0 } },
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

  CLOTH_SHOE_TYPES.forEach(shoe => { if (shoe.artifact) ITEMS.push({ id: `${tier}_ARTIFACT_SHOES_CLOTH_${shoe.artifact}`, name: `Artefato de ${shoe.name} ${tier}`, category: 'Artefatos', tier: tier as any, enchantment: '0' }); });
  LEATHER_SHOE_TYPES.forEach(shoe => { if (shoe.artifact) ITEMS.push({ id: `${tier}_ARTIFACT_SHOES_LEATHER_${shoe.artifact}`, name: `Artefato de ${shoe.name} ${tier}`, category: 'Artefatos', tier: tier as any, enchantment: '0' }); });
  AXE_TYPES.forEach(axe => { if (axe.artifact) ITEMS.push({ id: `${tier}_ARTIFACT_${axe.artifact}`, name: `Artefato de ${axe.name} ${tier}`, category: 'Artefatos', tier: tier as any, enchantment: '0' }); });
  MACE_TYPES.forEach(mace => { if (mace.artifact) ITEMS.push({ id: `${tier}_ARTIFACT_${mace.artifact}`, name: `Artefato de ${mace.name} ${tier}`, category: 'Artefatos', tier: tier as any, enchantment: '0' }); });
  HAMMER_TYPES.forEach(hammer => { if (hammer.artifact) ITEMS.push({ id: `${tier}_ARTIFACT_${hammer.artifact}`, name: `Artefato de ${hammer.name} ${tier}`, category: 'Artefatos', tier: tier as any, enchantment: '0' }); });
  QUARTERSTAFF_TYPES.forEach(qstaff => { if (qstaff.artifact) ITEMS.push({ id: `${tier}_ARTIFACT_${qstaff.artifact}`, name: `Artefato de ${qstaff.name} ${tier}`, category: 'Artefatos', tier: tier as any, enchantment: '0' }); });
  CROSSBOW_TYPES.forEach(cbow => { if (cbow.artifact) ITEMS.push({ id: `${tier}_ARTIFACT_${cbow.artifact}`, name: `Artefato de ${cbow.name} ${tier}`, category: 'Artefatos', tier: tier as any, enchantment: '0' }); });
  FIRE_STAFF_TYPES.forEach(staff => { if (staff.artifact) ITEMS.push({ id: `${tier}_ARTIFACT_${staff.artifact}`, name: `Artefato de ${staff.name} ${tier}`, category: 'Artefatos', tier: tier as any, enchantment: '0' }); });
  HOLY_STAFF_TYPES.forEach(staff => { if (staff.artifact) ITEMS.push({ id: `${tier}_ARTIFACT_${staff.artifact}`, name: `Artefato de ${staff.name} ${tier}`, category: 'Artefatos', tier: tier as any, enchantment: '0' }); });
  NATURE_STAFF_TYPES.forEach(staff => { if (staff.artifact) ITEMS.push({ id: `${tier}_ARTIFACT_${staff.artifact}`, name: `Artefato de ${staff.name} ${tier}`, category: 'Artefatos', tier: tier as any, enchantment: '0' }); });
  FROST_STAFF_TYPES.forEach(staff => { if (staff.artifact) ITEMS.push({ id: `${tier}_ARTIFACT_${staff.artifact}`, name: `Artefato de ${staff.name} ${tier}`, category: 'Artefatos', tier: tier as any, enchantment: '0' }); });
  CURSED_STAFF_TYPES.forEach(staff => { if (staff.artifact) ITEMS.push({ id: `${tier}_ARTIFACT_${staff.artifact}`, name: `Artefato de ${staff.name} ${tier}`, category: 'Artefatos', tier: tier as any, enchantment: '0' }); });
  SHIELD_TYPES.forEach(shield => { if (shield.artifact) ITEMS.push({ id: `${tier}_ARTIFACT_${shield.artifact}`, name: `Artefato de ${shield.name} ${tier}`, category: 'Artefatos', tier: tier as any, enchantment: '0' }); });
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

    // --- NEW WEAPON CATEGORIES ---
    const addWeaponCategory = (array: Array<any>, categoryName: string, journalType: string, mainMaterial: string) => {
      array.forEach(itemConfig => {
        const fullId = `${tier}_${itemConfig.id}${itemEnchSuffix}`;
        const fullName = `${itemConfig.name} ${tier}.${ench}`;
        ITEMS.push({ id: fullId, name: fullName, category: categoryName, tier: tier as any, enchantment: ench as any });

        const materials: Array<{ itemId: string, amount: number }> = [];
        if (itemConfig.resources) {
          if (itemConfig.resources.planks) materials.push({ itemId: plankId, amount: itemConfig.resources.planks });
          if (itemConfig.resources.bars) materials.push({ itemId: barId, amount: itemConfig.resources.bars });
          if (itemConfig.resources.leather) materials.push({ itemId: leatherId, amount: itemConfig.resources.leather });
          if (itemConfig.resources.cloth) materials.push({ itemId: clothId, amount: itemConfig.resources.cloth });
        }

        if (itemConfig.artifact) {
          materials.push({ itemId: `${tier}_ARTIFACT_${itemConfig.artifact}`, amount: 1 });
        }

        const totalResources = (itemConfig.resources?.planks || 0) + (itemConfig.resources?.bars || 0) + (itemConfig.resources?.leather || 0) + (itemConfig.resources?.cloth || 0);
        const resourceMultiplier = totalResources > 0 ? totalResources / 16 : 1;

        RECIPES.push({
          itemId: fullId,
          materials,
          fame: TIER_FAME[tier] * resourceMultiplier,
          journalId: `${tier}_JOURNAL_${journalType}_EMPTY`,
          baseFocusCost: TIER_FOCUS[tier] * resourceMultiplier,
        });
      });
    };

    addWeaponCategory(AXE_TYPES, 'Machados', 'WARRIOR', barId);
    addWeaponCategory(MACE_TYPES, 'Maças', 'WARRIOR', barId);
    addWeaponCategory(HAMMER_TYPES, 'Martelos', 'WARRIOR', barId);
    addWeaponCategory(QUARTERSTAFF_TYPES, 'Bordões', 'HUNTER', leatherId);
    addWeaponCategory(CROSSBOW_TYPES, 'Bestas', 'HUNTER', plankId);
    addWeaponCategory(FIRE_STAFF_TYPES, 'Cajados de Fogo', 'MAGIC', plankId);
    addWeaponCategory(HOLY_STAFF_TYPES, 'Cajados Sagrados', 'MAGIC', plankId);
    addWeaponCategory(NATURE_STAFF_TYPES, 'Cajados da Natureza', 'MAGIC', plankId);
    addWeaponCategory(FROST_STAFF_TYPES, 'Cajados de Gelo', 'MAGIC', plankId);
    addWeaponCategory(CURSED_STAFF_TYPES, 'Cajados Amaldiçoados', 'MAGIC', plankId);
    addWeaponCategory(SHIELD_TYPES, 'Escudos', 'WARRIOR', plankId);

    CLOTH_SHOE_TYPES.forEach(shoe => {
      const shoeId = `${tier}_SHOES_CLOTH_${shoe.id}${itemEnchSuffix}`;
      const shoeName = `${shoe.name} ${tier}.${ench}`;
      ITEMS.push({ id: shoeId, name: shoeName, category: 'Sandálias de Tecido', tier: tier as any, enchantment: ench as any });

      const materials = [{ itemId: clothId, amount: 8 }];
      if (shoe.artifact) {
        materials.push({ itemId: `${tier}_ARTIFACT_SHOES_CLOTH_${shoe.artifact}`, amount: 1 });
      }

      RECIPES.push({
        itemId: shoeId,
        materials,
        fame: TIER_FAME[tier] / 2,
        journalId: `${tier}_JOURNAL_MAGIC_EMPTY`,
        baseFocusCost: TIER_FOCUS[tier] / 2,
      });
    });

    LEATHER_SHOE_TYPES.forEach(shoe => {
      const shoeId = `${tier}_SHOES_LEATHER_${shoe.id}${itemEnchSuffix}`;
      const shoeName = `${shoe.name} ${tier}.${ench}`;
      ITEMS.push({ id: shoeId, name: shoeName, category: 'Sapatos de Couro', tier: tier as any, enchantment: ench as any });

      const materials = [{ itemId: leatherId, amount: 8 }];
      if (shoe.artifact) {
        materials.push({ itemId: `${tier}_ARTIFACT_SHOES_LEATHER_${shoe.artifact}`, amount: 1 });
      }

      RECIPES.push({
        itemId: shoeId,
        materials,
        fame: TIER_FAME[tier] / 2,
        journalId: `${tier}_JOURNAL_HUNTER_EMPTY`,
        baseFocusCost: TIER_FOCUS[tier] / 2,
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

  // Axes
  { id: 'baseAxe', name: 'Fabricante de Machados', multiplier: 30 },
  { id: 'MAIN_AXE', name: 'Especialista em Machado de Batalha', baseNodeId: 'baseAxe', multiplier: 250 },
  { id: '2H_HALBERD', name: 'Especialista em Alabarda', baseNodeId: 'baseAxe', multiplier: 250 },
  { id: '2H_HALBERD_MORGANA', name: 'Especialista em Foice Carrasca', baseNodeId: 'baseAxe', multiplier: 250, isArtifact: true },
  { id: '2H_SCYTHE_HELL', name: 'Especialista em Segadeira Infernal', baseNodeId: 'baseAxe', multiplier: 250, isArtifact: true },
  { id: '2H_DUALAXE_KEEPER', name: 'Especialista em Patas de Urso', baseNodeId: 'baseAxe', multiplier: 250, isArtifact: true },
  { id: '2H_AXE_AVALON', name: 'Especialista em Quebra-Reinos', baseNodeId: 'baseAxe', multiplier: 250, isArtifact: true },

  // Maces
  { id: 'baseMace', name: 'Fabricante de Maças', multiplier: 30 },
  { id: 'MAIN_MACE', name: 'Especialista em Maça', baseNodeId: 'baseMace', multiplier: 250 },
  { id: '2H_MACE', name: 'Especialista em Maça Pesada', baseNodeId: 'baseMace', multiplier: 250 },
  { id: '2H_FLAIL', name: 'Especialista em Mangual', baseNodeId: 'baseMace', multiplier: 250 },
  { id: 'MAIN_ROCKMACE_KEEPER', name: 'Especialista em Clava de Chocobo', baseNodeId: 'baseMace', multiplier: 250, isArtifact: true },
  { id: 'MAIN_MACE_HELL', name: 'Especialista em Maça de Íncubo', baseNodeId: 'baseMace', multiplier: 250, isArtifact: true },
  { id: '2H_MACE_MORGANA', name: 'Especialista em Maça de Camlann', baseNodeId: 'baseMace', multiplier: 250, isArtifact: true },
  { id: '2H_DUALMACE_AVALON', name: 'Especialista em Juradores', baseNodeId: 'baseMace', multiplier: 250, isArtifact: true },

  // Hammers
  { id: 'baseHammer', name: 'Fabricante de Martelos', multiplier: 30 },
  { id: 'MAIN_HAMMER', name: 'Especialista em Martelo de Batalha', baseNodeId: 'baseHammer', multiplier: 250 },
  { id: '2H_POLEHAMMER', name: 'Especialista em Marreta', baseNodeId: 'baseHammer', multiplier: 250 },
  { id: '2H_HAMMER', name: 'Especialista em Grande Martelo', baseNodeId: 'baseHammer', multiplier: 250 },
  { id: '2H_HAMMER_UNDEAD', name: 'Especialista em Esmagadores de Túmulos', baseNodeId: 'baseHammer', multiplier: 250, isArtifact: true },
  { id: '2H_DUALHAMMER_HELL', name: 'Especialista em Martelos da Forja', baseNodeId: 'baseHammer', multiplier: 250, isArtifact: true },
  { id: '2H_RAM_KEEPER', name: 'Especialista em Martelos de Bosque', baseNodeId: 'baseHammer', multiplier: 250, isArtifact: true },
  { id: '2H_HAMMER_AVALON', name: 'Especialista em Mão da Justiça', baseNodeId: 'baseHammer', multiplier: 250, isArtifact: true },

  // Quarterstaffs
  { id: 'baseQuarterstaff', name: 'Fabricante de Bordões', multiplier: 30 },
  { id: '2H_QUARTERSTAFF', name: 'Especialista em Bordão', baseNodeId: 'baseQuarterstaff', multiplier: 250 },
  { id: '2H_TWINSCYTHE', name: 'Especialista em Lâminas Gêmeas', baseNodeId: 'baseQuarterstaff', multiplier: 250 },
  { id: '2H_DOUBLEBLADEDSTAFF', name: 'Especialista em Cajado de Lâmina Dupla', baseNodeId: 'baseQuarterstaff', multiplier: 250 },
  { id: '2H_COMBATSTAFF_MORGANA', name: 'Especialista em Cajado de Monge Cego', baseNodeId: 'baseQuarterstaff', multiplier: 250, isArtifact: true },
  { id: '2H_QUARTERSTAFF_UNDEAD', name: 'Especialista em Lâmina da Alma', baseNodeId: 'baseQuarterstaff', multiplier: 250, isArtifact: true },
  { id: '2H_TWINSCYTHE_HELL', name: 'Especialista em Cajado Infernal', baseNodeId: 'baseQuarterstaff', multiplier: 250, isArtifact: true },
  { id: '2H_QUARTERSTAFF_AVALON', name: 'Especialista em Busca-Graal', baseNodeId: 'baseQuarterstaff', multiplier: 250, isArtifact: true },

  // Crossbows
  { id: 'baseCrossbow', name: 'Fabricante de Bestas', multiplier: 30 },
  { id: 'MAIN_1HCROSSBOW', name: 'Especialista em Besta Leve', baseNodeId: 'baseCrossbow', multiplier: 250 },
  { id: '2H_CROSSBOW', name: 'Especialista em Besta', baseNodeId: 'baseCrossbow', multiplier: 250 },
  { id: '2H_CROSSBOWLARGE', name: 'Especialista em Besta Pesada', baseNodeId: 'baseCrossbow', multiplier: 250 },
  { id: '2H_REPEATINGCROSSBOW_UNDEAD', name: 'Especialista em Choramingas', baseNodeId: 'baseCrossbow', multiplier: 250, isArtifact: true },
  { id: '2H_DUALCROSSBOW_HELL', name: 'Especialista em Lança-Virotes', baseNodeId: 'baseCrossbow', multiplier: 250, isArtifact: true },
  { id: '2H_CROSSBOW_MORGANA', name: 'Especialista em Besta de Cerco', baseNodeId: 'baseCrossbow', multiplier: 250, isArtifact: true },
  { id: '2H_CROSSBOW_AVALON', name: 'Especialista em Clama-energia', baseNodeId: 'baseCrossbow', multiplier: 250, isArtifact: true },

  // Fire Staffs
  { id: 'baseFireStaff', name: 'Fabricante de Cajados de Fogo', multiplier: 30 },
  { id: 'MAIN_FIRESTAFF', name: 'Especialista em Cajado de Fogo', baseNodeId: 'baseFireStaff', multiplier: 250 },
  { id: '2H_FIRESTAFF', name: 'Especialista em Grande Cajado de Fogo', baseNodeId: 'baseFireStaff', multiplier: 250 },
  { id: '2H_INFERNOSTAFF', name: 'Especialista em Cajado Infernal', baseNodeId: 'baseFireStaff', multiplier: 250 },
  { id: 'MAIN_FIRESTAFF_KEEPER', name: 'Especialista em Cajado de Fogo Intenso', baseNodeId: 'baseFireStaff', multiplier: 250, isArtifact: true },
  { id: '2H_FIRESTAFF_HELL', name: 'Especialista em Cajado de Enxofre', baseNodeId: 'baseFireStaff', multiplier: 250, isArtifact: true },
  { id: '2H_FIRESTAFF_MORGANA', name: 'Especialista em Cajado Ardente', baseNodeId: 'baseFireStaff', multiplier: 250, isArtifact: true },
  { id: '2H_FIRESTAFF_AVALON', name: 'Especialista em Canhão de Aurora', baseNodeId: 'baseFireStaff', multiplier: 250, isArtifact: true },

  // Holy Staffs
  { id: 'baseHolyStaff', name: 'Fabricante de Cajados Sagrados', multiplier: 30 },
  { id: 'MAIN_HOLYSTAFF', name: 'Especialista em Cajado Sagrado', baseNodeId: 'baseHolyStaff', multiplier: 250 },
  { id: '2H_HOLYSTAFF', name: 'Especialista em Grande Cajado Sagrado', baseNodeId: 'baseHolyStaff', multiplier: 250 },
  { id: '2H_DIVINESTAFF', name: 'Especialista em Cajado Divino', baseNodeId: 'baseHolyStaff', multiplier: 250 },
  { id: 'MAIN_HOLYSTAFF_MORGANA', name: 'Especialista em Cajado da Vida', baseNodeId: 'baseHolyStaff', multiplier: 250, isArtifact: true },
  { id: '2H_HOLYSTAFF_HELL', name: 'Especialista em Cajado dos Caídos', baseNodeId: 'baseHolyStaff', multiplier: 250, isArtifact: true },
  { id: '2H_HOLYSTAFF_UNDEAD', name: 'Especialista em Cajado da Redenção', baseNodeId: 'baseHolyStaff', multiplier: 250, isArtifact: true },
  { id: 'MAIN_HOLYSTAFF_AVALON', name: 'Especialista em Glória Imaculada', baseNodeId: 'baseHolyStaff', multiplier: 250, isArtifact: true },

  // Nature Staffs
  { id: 'baseNatureStaff', name: 'Fabricante de Cajados da Natureza', multiplier: 30 },
  { id: 'MAIN_NATURESTAFF', name: 'Especialista em Cajado da Natureza', baseNodeId: 'baseNatureStaff', multiplier: 250 },
  { id: '2H_NATURESTAFF', name: 'Especialista em Grande Cajado da Natureza', baseNodeId: 'baseNatureStaff', multiplier: 250 },
  { id: '2H_WILDSTAFF', name: 'Especialista em Cajado Selvagem', baseNodeId: 'baseNatureStaff', multiplier: 250 },
  { id: 'MAIN_NATURESTAFF_KEEPER', name: 'Especialista em Cajado de Cinamono', baseNodeId: 'baseNatureStaff', multiplier: 250, isArtifact: true },
  { id: '2H_NATURESTAFF_HELL', name: 'Especialista em Cajado Pútrido', baseNodeId: 'baseNatureStaff', multiplier: 250, isArtifact: true },
  { id: '2H_NATURESTAFF_MORGANA', name: 'Especialista em Raiz Férrea', baseNodeId: 'baseNatureStaff', multiplier: 250, isArtifact: true },
  { id: 'MAIN_NATURESTAFF_AVALON', name: 'Especialista em Chama-espinhos', baseNodeId: 'baseNatureStaff', multiplier: 250, isArtifact: true },

  // Frost Staffs
  { id: 'baseFrostStaff', name: 'Fabricante de Cajados de Gelo', multiplier: 30 },
  { id: 'MAIN_FROSTSTAFF', name: 'Especialista em Cajado de Gelo', baseNodeId: 'baseFrostStaff', multiplier: 250 },
  { id: '2H_FROSTSTAFF', name: 'Especialista em Grande Cajado de Gelo', baseNodeId: 'baseFrostStaff', multiplier: 250 },
  { id: '2H_GLACIALSTAFF', name: 'Especialista em Cajado Glacial', baseNodeId: 'baseFrostStaff', multiplier: 250 },
  { id: 'MAIN_FROSTSTAFF_KEEPER', name: 'Especialista em Cajado de Geada', baseNodeId: 'baseFrostStaff', multiplier: 250, isArtifact: true },
  { id: '2H_FROSTSTAFF_HELL', name: 'Especialista em Cajado de Gelo Intenso', baseNodeId: 'baseFrostStaff', multiplier: 250, isArtifact: true },
  { id: '2H_ICEGAUNTLETS_HELL', name: 'Especialista em Prisma Congelado', baseNodeId: 'baseFrostStaff', multiplier: 250, isArtifact: true },
  { id: 'MAIN_FROSTSTAFF_AVALON', name: 'Especialista em Cântico das Geleiras', baseNodeId: 'baseFrostStaff', multiplier: 250, isArtifact: true },

  // Cursed Staffs
  { id: 'baseCursedStaff', name: 'Fabricante de Cajados Amaldiçoados', multiplier: 30 },
  { id: 'MAIN_CURSEDSTAFF', name: 'Especialista em Cajado Amaldiçoado', baseNodeId: 'baseCursedStaff', multiplier: 250 },
  { id: '2H_CURSEDSTAFF', name: 'Especialista em Grande Cajado Amaldiçoado', baseNodeId: 'baseCursedStaff', multiplier: 250 },
  { id: '2H_DEMONICSTAFF', name: 'Especialista em Cajado Demoníaco', baseNodeId: 'baseCursedStaff', multiplier: 250 },
  { id: 'MAIN_CURSEDSTAFF_UNDEAD', name: 'Especialista em Chama-vidas', baseNodeId: 'baseCursedStaff', multiplier: 250, isArtifact: true },
  { id: '2H_CURSEDSTAFF_MORGANA', name: 'Especialista em Cajado de Ocultista', baseNodeId: 'baseCursedStaff', multiplier: 250, isArtifact: true },
  { id: '2H_SKULLORB_HELL', name: 'Especialista em Crânio Amaldiçoado', baseNodeId: 'baseCursedStaff', multiplier: 250, isArtifact: true },
  { id: 'MAIN_CURSEDSTAFF_AVALON', name: 'Especialista em Invocador de Sombras', baseNodeId: 'baseCursedStaff', multiplier: 250, isArtifact: true },

  // Shields
  { id: 'baseShield', name: 'Fabricante de Escudos', multiplier: 30 },
  { id: 'MAIN_SHIELD', name: 'Especialista em Escudo', baseNodeId: 'baseShield', multiplier: 250 },
  { id: 'MAIN_SHIELD_HELL', name: 'Especialista em Sarcófago', baseNodeId: 'baseShield', multiplier: 250, isArtifact: true },
  { id: 'MAIN_SHIELD_UNDEAD', name: 'Especialista em Escudo Guardião das Almas', baseNodeId: 'baseShield', multiplier: 250, isArtifact: true },
  { id: 'MAIN_SHIELD_FEY', name: 'Especialista em Lampião de Espírito', baseNodeId: 'baseShield', multiplier: 250, isArtifact: true },
  { id: 'MAIN_SHIELD_AVALON', name: 'Especialista em Égide Astral', baseNodeId: 'baseShield', multiplier: 250, isArtifact: true },

  // Leather Shoes
  { id: 'baseLeatherShoes', name: 'Fabricante de Sapatos de Couro', multiplier: 30 },
  { id: 'SHOES_LEATHER_SET1', name: 'Especialista em Sapatos de Mercenário', baseNodeId: 'baseLeatherShoes', multiplier: 250 },
  { id: 'SHOES_LEATHER_SET2', name: 'Especialista em Sapatos de Caçador', baseNodeId: 'baseLeatherShoes', multiplier: 250 },
  { id: 'SHOES_LEATHER_SET3', name: 'Especialista em Sapatos de Assassino', baseNodeId: 'baseLeatherShoes', multiplier: 250 },

  // Cloth Shoes
  { id: 'baseClothShoes', name: 'Fabricante de Sandálias de Tecido', multiplier: 30 },
  { id: 'SHOES_CLOTH_SET1', name: 'Especialista em Sandálias de Erudito', baseNodeId: 'baseClothShoes', multiplier: 250 },
  { id: 'SHOES_CLOTH_SET2', name: 'Especialista em Sandálias de Clérigo', baseNodeId: 'baseClothShoes', multiplier: 250 },
  { id: 'SHOES_CLOTH_SET3', name: 'Especialista em Sandálias de Mago', baseNodeId: 'baseClothShoes', multiplier: 250 },
];
