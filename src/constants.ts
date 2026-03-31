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
  { id: 'FEY', name: 'Robe Escama-feérica', artifact: 'FEY' },
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

const AXE_TYPES = [
  { id: 'MAIN_AXE', name: 'Machado', artifact: null, resources: { bars: 24, planks: 8 } },
  { id: '2H_AXE', name: 'Grande Machado', artifact: null, resources: { bars: 32, planks: 0 } },
  { id: '2H_HALBERD', name: 'Alabarda', artifact: null, resources: { bars: 32, planks: 0 } },
  { id: '2H_CARRIONEATER', name: 'Segadeira de Almas', artifact: '2H_CARRIONEATER', resources: { bars: 20, planks: 12 } },
  { id: '2H_SCYTHE_HELL', name: 'Gadanha Infernal', artifact: '2H_SCYTHE_HELL', resources: { bars: 32, planks: 0 } },
  { id: '2H_BATTLEAXE_KEEPER', name: 'Machado de Batalha de urso', artifact: '2H_BATTLEAXE_KEEPER', resources: { bars: 20, planks: 12 } },
  { id: '2H_AXE_AVALON', name: 'Portador da Noite', artifact: '2H_AXE_AVALON', resources: { bars: 20, planks: 12 } },
];

const MACE_TYPES = [
  { id: 'MAIN_MACE', name: 'Maça', artifact: null, resources: { bars: 16, planks: 0 } },
  { id: '2H_MACE', name: 'Maça Pesada', artifact: null, resources: { bars: 20, planks: 0 } },
  { id: '2H_FLAIL', name: 'Mangual', artifact: null, resources: { bars: 20, planks: 0 } },
  { id: 'MAIN_ROCKMACE_KEEPER', name: 'Maça de Pedra', artifact: 'MAIN_ROCKMACE_KEEPER', resources: { bars: 16, planks: 0 } },
  { id: '2H_MACE_HELL', name: 'Incubus', artifact: '2H_MACE_HELL', resources: { bars: 20, planks: 0 } },
  { id: '2H_MACE_UNDEAD', name: 'Maça de Camas', artifact: '2H_MACE_UNDEAD', resources: { bars: 20, planks: 0 } },
  { id: '2H_MACE_AVALON', name: 'Maça de Cristal', artifact: '2H_MACE_AVALON', resources: { bars: 20, planks: 0 } },
];

const HAMMER_TYPES = [
  { id: 'MAIN_HAMMER', name: 'Martelo', artifact: null, resources: { bars: 16, planks: 0 } },
  { id: '2H_HAMMER', name: 'Grande Martelo', artifact: null, resources: { bars: 20, planks: 0 } },
  { id: '2H_POLEHAMMER', name: 'Martelo de Haste', artifact: null, resources: { bars: 20, planks: 0 } },
  { id: '2H_HAMMER_UNDEAD', name: 'Guardião de Túmulos', artifact: '2H_HAMMER_UNDEAD', resources: { bars: 20, planks: 0 } },
  { id: '2H_DUALHAMMER_HELL', name: 'Forja-almas', artifact: '2H_DUALHAMMER_HELL', resources: { bars: 20, planks: 0 } },
  { id: '2H_RAM_KEEPER', name: 'Guardião do Bosque', artifact: '2H_RAM_KEEPER', resources: { bars: 20, planks: 0 } },
  { id: '2H_HAMMER_AVALON', name: 'Martelo de Cristal', artifact: '2H_HAMMER_AVALON', resources: { bars: 20, planks: 0 } },
];

const CROSSBOW_TYPES = [
  { id: 'MAIN_CROSSBOW', name: 'Besta', artifact: null, resources: { planks: 20, bars: 12 } },
  { id: '2H_CROSSBOW', name: 'Besta Pesada', artifact: null, resources: { planks: 20, bars: 12 } },
  { id: '2H_REPEATINGCROSSBOW', name: 'Besta Leve', artifact: null, resources: { planks: 20, bars: 12 } },
  { id: '2H_DUALCROSSBOW_HELL', name: 'Besta de Repetição', artifact: '2H_DUALCROSSBOW_HELL', resources: { planks: 20, bars: 12 } },
  { id: '2H_CROSSBOW_AVALON', name: 'Besta de Cristal', artifact: '2H_CROSSBOW_AVALON', resources: { planks: 20, bars: 12 } },
];

const FIRE_STAFF_TYPES = [
  { id: 'MAIN_FIRESTAFF', name: 'Cajado de Fogo', artifact: null, resources: { planks: 16, cloth: 0 } },
  { id: '2H_FIRESTAFF', name: 'Grande Cajado de Fogo', artifact: null, resources: { planks: 20, cloth: 0 } },
  { id: '2H_INFERNOSTAFF', name: 'Cajado Infernal', artifact: null, resources: { planks: 20, cloth: 0 } },
  { id: 'MAIN_FIRESTAFF_KEEPER', name: 'Cajado de Fogo de Enxofre', artifact: 'MAIN_FIRESTAFF_KEEPER', resources: { planks: 16, cloth: 0 } },
  { id: '2H_FIRESTAFF_HELL', name: 'Cajado de Fogo de Brimstone', artifact: '2H_FIRESTAFF_HELL', resources: { planks: 20, cloth: 0 } },
];

const HOLY_STAFF_TYPES = [
  { id: 'MAIN_HOLYSTAFF', name: 'Cajado Sagrado', artifact: null, resources: { planks: 16, cloth: 0 } },
  { id: '2H_HOLYSTAFF', name: 'Grande Cajado Sagrado', artifact: null, resources: { planks: 20, cloth: 0 } },
  { id: '2H_DIVINESTAFF', name: 'Cajado Divino', artifact: null, resources: { planks: 20, cloth: 0 } },
  { id: 'MAIN_HOLYSTAFF_MORGANA', name: 'Cajado da Queda', artifact: 'MAIN_HOLYSTAFF_MORGANA', resources: { planks: 16, cloth: 0 } },
  { id: '2H_HOLYSTAFF_HELL', name: 'Cajado da Redenção', artifact: '2H_HOLYSTAFF_HELL', resources: { planks: 20, cloth: 0 } },
];

const NATURE_STAFF_TYPES = [
  { id: 'MAIN_NATURESTAFF', name: 'Cajado da Natureza', artifact: null, resources: { planks: 16, cloth: 0 } },
  { id: '2H_NATURESTAFF', name: 'Grande Cajado da Natureza', artifact: null, resources: { planks: 20, cloth: 0 } },
  { id: '2H_WILDSTAFF', name: 'Cajado Selvagem', artifact: null, resources: { planks: 20, cloth: 0 } },
  { id: 'MAIN_NATURESTAFF_KEEPER', name: 'Cajado da Natureza de Garça', artifact: 'MAIN_NATURESTAFF_KEEPER', resources: { planks: 16, cloth: 0 } },
  { id: '2H_NATURESTAFF_HELL', name: 'Cajado da Natureza Silvestre', artifact: '2H_NATURESTAFF_HELL', resources: { planks: 20, cloth: 0 } },
];

const FROST_STAFF_TYPES = [
  { id: 'MAIN_FROSTSTAFF', name: 'Cajado de Gelo', artifact: null, resources: { planks: 16, cloth: 0 } },
  { id: '2H_FROSTSTAFF', name: 'Grande Cajado de Gelo', artifact: null, resources: { planks: 20, cloth: 0 } },
  { id: '2H_GLACIALSTAFF', name: 'Cajado Glacial', artifact: null, resources: { planks: 20, cloth: 0 } },
  { id: 'MAIN_FROSTSTAFF_KEEPER', name: 'Cajado de Gelo das Bermudas', artifact: 'MAIN_FROSTSTAFF_KEEPER', resources: { planks: 16, cloth: 0 } },
  { id: '2H_FROSTSTAFF_HELL', name: 'Cajado de Gelo de Icicle', artifact: '2H_FROSTSTAFF_HELL', resources: { planks: 20, cloth: 0 } },
];

const CURSE_STAFF_TYPES = [
  { id: 'MAIN_CURSEDSTAFF', name: 'Cajado Amaldiçoado', artifact: null, resources: { planks: 16, cloth: 0 } },
  { id: '2H_CURSEDSTAFF', name: 'Grande Cajado Amaldiçoado', artifact: null, resources: { planks: 20, cloth: 0 } },
  { id: '2H_DEMONICSTAFF', name: 'Cajado Demoníaco', artifact: null, resources: { planks: 20, cloth: 0 } },
  { id: 'MAIN_CURSEDSTAFF_UNDEAD', name: 'Cajado Amaldiçoado de Mãos da Vida', artifact: 'MAIN_CURSEDSTAFF_UNDEAD', resources: { planks: 16, cloth: 0 } },
  { id: '2H_CURSEDSTAFF_HELL', name: 'Cajado Amaldiçoado de Danação', artifact: '2H_CURSEDSTAFF_HELL', resources: { planks: 20, cloth: 0 } },
];

const QUARTERSTAFF_TYPES = [
  { id: '2H_QUARTERSTAFF', name: 'Cajado de Batalha', artifact: null, resources: { planks: 12, leather: 20 } },
  { id: '2H_IRONCLADSTAFF', name: 'Cajado Revestido de Ferro', artifact: null, resources: { planks: 12, leather: 20 } },
  { id: '2H_DOUBLEBLADEDSTAFF', name: 'Cajado de Lâmina Dupla', artifact: null, resources: { planks: 12, leather: 20 } },
  { id: '2H_QUARTERSTAFF_KEEPER', name: 'Cajado de Batalha de urso', artifact: '2H_QUARTERSTAFF_KEEPER', resources: { planks: 12, leather: 20 } },
];

const OFFHAND_TYPES = [
  { id: 'OFF_SHIELD', name: 'Escudo', artifact: null, resources: { bars: 8 } },
  { id: 'OFF_BOOK', name: 'Tomo de Feitiços', artifact: null, resources: { cloth: 8 } },
  { id: 'OFF_TORCH', name: 'Tocha', artifact: null, resources: { planks: 8 } },
  { id: 'OFF_SHIELD_HELL', name: 'Sarcófago', artifact: 'OFF_SHIELD_HELL', resources: { bars: 8 } },
  { id: 'OFF_BOOK_HELL', name: 'Muleta', artifact: 'OFF_BOOK_HELL', resources: { cloth: 8 } },
  { id: 'OFF_TORCH_HELL', name: 'Vela de Sétimo Sono', artifact: 'OFF_TORCH_HELL', resources: { planks: 8 } },
];

const KNUCKLES_TYPES = [
  { id: '2H_KNUCKLES_SET1', name: 'Luvas de Brigão', artifact: null, resources: { leather: 12, bars: 8 } },
  { id: '2H_KNUCKLES_SET2', name: 'Braçadeiras de Batalha', artifact: null, resources: { leather: 12, bars: 8 } },
  { id: '2H_KNUCKLES_SET3', name: 'Manoplas Espigadas', artifact: null, resources: { leather: 12, bars: 8 } },
  { id: '2H_KNUCKLES_KEEPER', name: 'Esmagadores Ursíneos', artifact: '2H_KNUCKLES_KEEPER', resources: { leather: 12, bars: 8 } },
  { id: '2H_KNUCKLES_HELL', name: 'Mãos de Fogo do Inferno', artifact: '2H_KNUCKLES_HELL', resources: { leather: 12, bars: 8 } },
  { id: '2H_KNUCKLES_UNDEAD', name: 'Golpe-corvo', artifact: '2H_KNUCKLES_UNDEAD', resources: { leather: 12, bars: 8 } },
  { id: '2H_KNUCKLES_AVALON', name: 'Punhos de Avalon', artifact: '2H_KNUCKLES_AVALON', resources: { leather: 12, bars: 8 } },
];

const ACCESSORY_TYPES = [
  { id: 'BAG', name: 'Bolsa', category: 'Bolsas', resources: { leather: 16, cloth: 16 }, artifact: null },
  { id: 'CAPE', name: 'Capa', category: 'Capas', resources: { leather: 8, cloth: 8 }, artifact: null },
  { id: 'CAPEITEM_KEEPER', name: 'Capa de Guardião', category: 'Capas de Facção', resources: { leather: 8, cloth: 8 }, artifact: 'CAPEITEM_KEEPER' },
  { id: 'CAPEITEM_UNDEAD', name: 'Capa de Morto-vivo', category: 'Capas de Facção', resources: { leather: 8, cloth: 8 }, artifact: 'CAPEITEM_UNDEAD' },
  { id: 'CAPEITEM_MORGANA', name: 'Capa de Morgana', category: 'Capas de Facção', resources: { leather: 8, cloth: 8 }, artifact: 'CAPEITEM_MORGANA' },
  { id: 'CAPEITEM_DEMON', name: 'Capa de Demônio', category: 'Capas de Facção', resources: { leather: 8, cloth: 8 }, artifact: 'CAPEITEM_DEMON' },
  { id: 'CAPEITEM_HERETIC', name: 'Capa de Herege', category: 'Capas de Facção', resources: { leather: 8, cloth: 8 }, artifact: 'CAPEITEM_HERETIC' }
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
  CLOTH_SHOE_TYPES.forEach(shoe => {
    if (shoe.artifact) {
      const artifactId = `${tier}_ARTIFACT_SHOES_CLOTH_${shoe.artifact}`;
      ITEMS.push({ id: artifactId, name: `Artefato de ${shoe.name} ${tier}`, category: 'Artefatos', tier: tier as any, enchantment: '0' });
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
  LEATHER_SHOE_TYPES.forEach(shoe => {
    if (shoe.artifact) {
      const artifactId = `${tier}_ARTIFACT_SHOES_LEATHER_${shoe.artifact}`;
      ITEMS.push({ id: artifactId, name: `Artefato de ${shoe.name} ${tier}`, category: 'Artefatos', tier: tier as any, enchantment: '0' });
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
  AXE_TYPES.forEach(item => {
    if (item.artifact) {
      const artifactId = `${tier}_ARTIFACT_${item.artifact}`;
      ITEMS.push({ id: artifactId, name: `Artefato de ${item.name} ${tier}`, category: 'Artefatos', tier: tier as any, enchantment: '0' });
    }
  });
  MACE_TYPES.forEach(item => {
    if (item.artifact) {
      const artifactId = `${tier}_ARTIFACT_${item.artifact}`;
      ITEMS.push({ id: artifactId, name: `Artefato de ${item.name} ${tier}`, category: 'Artefatos', tier: tier as any, enchantment: '0' });
    }
  });
  HAMMER_TYPES.forEach(item => {
    if (item.artifact) {
      const artifactId = `${tier}_ARTIFACT_${item.artifact}`;
      ITEMS.push({ id: artifactId, name: `Artefato de ${item.name} ${tier}`, category: 'Artefatos', tier: tier as any, enchantment: '0' });
    }
  });
  CROSSBOW_TYPES.forEach(item => {
    if (item.artifact) {
      const artifactId = `${tier}_ARTIFACT_${item.artifact}`;
      ITEMS.push({ id: artifactId, name: `Artefato de ${item.name} ${tier}`, category: 'Artefatos', tier: tier as any, enchantment: '0' });
    }
  });
  FIRE_STAFF_TYPES.forEach(item => {
    if (item.artifact) {
      const artifactId = `${tier}_ARTIFACT_${item.artifact}`;
      ITEMS.push({ id: artifactId, name: `Artefato de ${item.name} ${tier}`, category: 'Artefatos', tier: tier as any, enchantment: '0' });
    }
  });
  HOLY_STAFF_TYPES.forEach(item => {
    if (item.artifact) {
      const artifactId = `${tier}_ARTIFACT_${item.artifact}`;
      ITEMS.push({ id: artifactId, name: `Artefato de ${item.name} ${tier}`, category: 'Artefatos', tier: tier as any, enchantment: '0' });
    }
  });
  NATURE_STAFF_TYPES.forEach(item => {
    if (item.artifact) {
      const artifactId = `${tier}_ARTIFACT_${item.artifact}`;
      ITEMS.push({ id: artifactId, name: `Artefato de ${item.name} ${tier}`, category: 'Artefatos', tier: tier as any, enchantment: '0' });
    }
  });
  FROST_STAFF_TYPES.forEach(item => {
    if (item.artifact) {
      const artifactId = `${tier}_ARTIFACT_${item.artifact}`;
      ITEMS.push({ id: artifactId, name: `Artefato de ${item.name} ${tier}`, category: 'Artefatos', tier: tier as any, enchantment: '0' });
    }
  });
  CURSE_STAFF_TYPES.forEach(item => {
    if (item.artifact) {
      const artifactId = `${tier}_ARTIFACT_${item.artifact}`;
      ITEMS.push({ id: artifactId, name: `Artefato de ${item.name} ${tier}`, category: 'Artefatos', tier: tier as any, enchantment: '0' });
    }
  });
  QUARTERSTAFF_TYPES.forEach(item => {
    if (item.artifact) {
      const artifactId = `${tier}_ARTIFACT_${item.artifact}`;
      ITEMS.push({ id: artifactId, name: `Artefato de ${item.name} ${tier}`, category: 'Artefatos', tier: tier as any, enchantment: '0' });
    }
  });
  OFFHAND_TYPES.forEach(item => {
    if (item.artifact) {
      const artifactId = `${tier}_ARTIFACT_${item.artifact}`;
      ITEMS.push({ id: artifactId, name: `Artefato de ${item.name} ${tier}`, category: 'Artefatos', tier: tier as any, enchantment: '0' });
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
      ITEMS.push({ id: cowlId, name: cowlName, category: 'Capotes de Tecido', tier: tier as any, enchantment: ench as any });
      
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

    // Cloth Shoes
    CLOTH_SHOE_TYPES.forEach(shoe => {
      const shoeId = `${tier}_SHOES_CLOTH_${shoe.id}${itemEnchSuffix}`;
      const shoeName = `${shoe.name} ${tier}.${ench}`;
      ITEMS.push({ id: shoeId, name: shoeName, category: 'Sapatos de Tecido', tier: tier as any, enchantment: ench as any });
      
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

    // Leather Shoes
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

    // Axes
    AXE_TYPES.forEach(item => {
      const id = `${tier}_${item.id}${itemEnchSuffix}`;
      ITEMS.push({ id, name: `${item.name} ${tier}.${ench}`, category: 'Machados', tier: tier as any, enchantment: ench as any });
      const materials = [
        { itemId: barId, amount: item.resources.bars },
        { itemId: plankId, amount: item.resources.planks }
      ];
      if (item.artifact) materials.push({ itemId: `${tier}_ARTIFACT_${item.artifact}`, amount: 1 });
      const resourceMultiplier = (item.resources.bars + item.resources.planks) / 16;
      RECIPES.push({ itemId: id, materials, fame: TIER_FAME[tier] * resourceMultiplier, journalId: `${tier}_JOURNAL_WARRIOR_EMPTY`, baseFocusCost: TIER_FOCUS[tier] * resourceMultiplier });
    });

    // Maces
    MACE_TYPES.forEach(item => {
      const id = `${tier}_${item.id}${itemEnchSuffix}`;
      ITEMS.push({ id, name: `${item.name} ${tier}.${ench}`, category: 'Maças', tier: tier as any, enchantment: ench as any });
      const materials = [{ itemId: barId, amount: item.resources.bars }];
      if (item.artifact) materials.push({ itemId: `${tier}_ARTIFACT_${item.artifact}`, amount: 1 });
      const resourceMultiplier = item.resources.bars / 16;
      RECIPES.push({ itemId: id, materials, fame: TIER_FAME[tier] * resourceMultiplier, journalId: `${tier}_JOURNAL_WARRIOR_EMPTY`, baseFocusCost: TIER_FOCUS[tier] * resourceMultiplier });
    });

    // Hammers
    HAMMER_TYPES.forEach(item => {
      const id = `${tier}_${item.id}${itemEnchSuffix}`;
      ITEMS.push({ id, name: `${item.name} ${tier}.${ench}`, category: 'Martelos', tier: tier as any, enchantment: ench as any });
      const materials = [{ itemId: barId, amount: item.resources.bars }];
      if (item.artifact) materials.push({ itemId: `${tier}_ARTIFACT_${item.artifact}`, amount: 1 });
      const resourceMultiplier = item.resources.bars / 16;
      RECIPES.push({ itemId: id, materials, fame: TIER_FAME[tier] * resourceMultiplier, journalId: `${tier}_JOURNAL_WARRIOR_EMPTY`, baseFocusCost: TIER_FOCUS[tier] * resourceMultiplier });
    });

    // Crossbows
    CROSSBOW_TYPES.forEach(item => {
      const id = `${tier}_${item.id}${itemEnchSuffix}`;
      ITEMS.push({ id, name: `${item.name} ${tier}.${ench}`, category: 'Bestas', tier: tier as any, enchantment: ench as any });
      const materials = [{ itemId: plankId, amount: item.resources.planks }, { itemId: barId, amount: item.resources.bars }];
      if (item.artifact) materials.push({ itemId: `${tier}_ARTIFACT_${item.artifact}`, amount: 1 });
      const resourceMultiplier = (item.resources.planks + item.resources.bars) / 16;
      RECIPES.push({ itemId: id, materials, fame: TIER_FAME[tier] * resourceMultiplier, journalId: `${tier}_JOURNAL_HUNTER_EMPTY`, baseFocusCost: TIER_FOCUS[tier] * resourceMultiplier });
    });

    // Fire Staffs
    FIRE_STAFF_TYPES.forEach(item => {
      const id = `${tier}_${item.id}${itemEnchSuffix}`;
      ITEMS.push({ id, name: `${item.name} ${tier}.${ench}`, category: 'Cajados de Fogo', tier: tier as any, enchantment: ench as any });
      const materials = [{ itemId: plankId, amount: item.resources.planks }];
      if (item.artifact) materials.push({ itemId: `${tier}_ARTIFACT_${item.artifact}`, amount: 1 });
      const resourceMultiplier = item.resources.planks / 16;
      RECIPES.push({ itemId: id, materials, fame: TIER_FAME[tier] * resourceMultiplier, journalId: `${tier}_JOURNAL_MAGIC_EMPTY`, baseFocusCost: TIER_FOCUS[tier] * resourceMultiplier });
    });

    // Holy Staffs
    HOLY_STAFF_TYPES.forEach(item => {
      const id = `${tier}_${item.id}${itemEnchSuffix}`;
      ITEMS.push({ id, name: `${item.name} ${tier}.${ench}`, category: 'Cajados Sagrados', tier: tier as any, enchantment: ench as any });
      const materials = [{ itemId: plankId, amount: item.resources.planks }];
      if (item.artifact) materials.push({ itemId: `${tier}_ARTIFACT_${item.artifact}`, amount: 1 });
      const resourceMultiplier = item.resources.planks / 16;
      RECIPES.push({ itemId: id, materials, fame: TIER_FAME[tier] * resourceMultiplier, journalId: `${tier}_JOURNAL_MAGIC_EMPTY`, baseFocusCost: TIER_FOCUS[tier] * resourceMultiplier });
    });

    // Nature Staffs
    NATURE_STAFF_TYPES.forEach(item => {
      const id = `${tier}_${item.id}${itemEnchSuffix}`;
      ITEMS.push({ id, name: `${item.name} ${tier}.${ench}`, category: 'Cajados da Natureza', tier: tier as any, enchantment: ench as any });
      const materials = [{ itemId: plankId, amount: item.resources.planks }];
      if (item.artifact) materials.push({ itemId: `${tier}_ARTIFACT_${item.artifact}`, amount: 1 });
      const resourceMultiplier = item.resources.planks / 16;
      RECIPES.push({ itemId: id, materials, fame: TIER_FAME[tier] * resourceMultiplier, journalId: `${tier}_JOURNAL_HUNTER_EMPTY`, baseFocusCost: TIER_FOCUS[tier] * resourceMultiplier });
    });

    // Frost Staffs
    FROST_STAFF_TYPES.forEach(item => {
      const id = `${tier}_${item.id}${itemEnchSuffix}`;
      ITEMS.push({ id, name: `${item.name} ${tier}.${ench}`, category: 'Cajados de Gelo', tier: tier as any, enchantment: ench as any });
      const materials = [{ itemId: plankId, amount: item.resources.planks }];
      if (item.artifact) materials.push({ itemId: `${tier}_ARTIFACT_${item.artifact}`, amount: 1 });
      const resourceMultiplier = item.resources.planks / 16;
      RECIPES.push({ itemId: id, materials, fame: TIER_FAME[tier] * resourceMultiplier, journalId: `${tier}_JOURNAL_MAGIC_EMPTY`, baseFocusCost: TIER_FOCUS[tier] * resourceMultiplier });
    });

    // Curse Staffs
    CURSE_STAFF_TYPES.forEach(item => {
      const id = `${tier}_${item.id}${itemEnchSuffix}`;
      ITEMS.push({ id, name: `${item.name} ${tier}.${ench}`, category: 'Cajados Amaldiçoados', tier: tier as any, enchantment: ench as any });
      const materials = [{ itemId: plankId, amount: item.resources.planks }];
      if (item.artifact) materials.push({ itemId: `${tier}_ARTIFACT_${item.artifact}`, amount: 1 });
      const resourceMultiplier = item.resources.planks / 16;
      RECIPES.push({ itemId: id, materials, fame: TIER_FAME[tier] * resourceMultiplier, journalId: `${tier}_JOURNAL_MAGIC_EMPTY`, baseFocusCost: TIER_FOCUS[tier] * resourceMultiplier });
    });

    // Quarterstaffs
    QUARTERSTAFF_TYPES.forEach(item => {
      const id = `${tier}_${item.id}${itemEnchSuffix}`;
      ITEMS.push({ id, name: `${item.name} ${tier}.${ench}`, category: 'Cajados de Batalha', tier: tier as any, enchantment: ench as any });
      const materials = [{ itemId: leatherId, amount: item.resources.leather }, { itemId: plankId, amount: item.resources.planks }];
      if (item.artifact) materials.push({ itemId: `${tier}_ARTIFACT_${item.artifact}`, amount: 1 });
      const resourceMultiplier = (item.resources.leather + item.resources.planks) / 16;
      RECIPES.push({ itemId: id, materials, fame: TIER_FAME[tier] * resourceMultiplier, journalId: `${tier}_JOURNAL_HUNTER_EMPTY`, baseFocusCost: TIER_FOCUS[tier] * resourceMultiplier });
    });

    // Off-hands
    OFFHAND_TYPES.forEach(item => {
      const id = `${tier}_${item.id}${itemEnchSuffix}`;
      ITEMS.push({ id, name: `${item.name} ${tier}`, category: 'Itens Secundários', tier: tier as any, enchantment: ench as any });
      const materials = [];
      if (item.resources.bars) materials.push({ itemId: barId, amount: item.resources.bars });
      if (item.resources.cloth) materials.push({ itemId: clothId, amount: item.resources.cloth });
      if (item.resources.planks) materials.push({ itemId: plankId, amount: item.resources.planks });
      if (item.artifact) materials.push({ itemId: `${tier}_ARTIFACT_${item.artifact}`, amount: 1 });
      RECIPES.push({ itemId: id, materials, fame: TIER_FAME[tier] / 4, journalId: `${tier}_JOURNAL_WARRIOR_EMPTY`, baseFocusCost: TIER_FOCUS[tier] / 4 });
    });

    // Knuckles (War Gloves)
    KNUCKLES_TYPES.forEach(item => {
      const id = `${tier}_${item.id}${itemEnchSuffix}`;
      ITEMS.push({ id, name: `${item.name} ${tier}.${ench}`, category: 'Luvas de Guerra', tier: tier as any, enchantment: ench as any });
      const materials = [
        { itemId: leatherId, amount: item.resources.leather },
        { itemId: barId, amount: item.resources.bars }
      ];
      if (item.artifact) materials.push({ itemId: `${tier}_ARTIFACT_${item.artifact}`, amount: 1 });
      const resourceMultiplier = (item.resources.leather + item.resources.bars) / 16;
      RECIPES.push({ itemId: id, materials, fame: TIER_FAME[tier] * resourceMultiplier, journalId: `${tier}_JOURNAL_WARRIOR_EMPTY`, baseFocusCost: TIER_FOCUS[tier] * resourceMultiplier });
    });

    // Accessories (Bags and Capes)
    ACCESSORY_TYPES.forEach(item => {
      const id = `${tier}_${item.id}${itemEnchSuffix}`;
      ITEMS.push({ id, name: `${item.name} ${tier}.${ench}`, category: item.category, tier: tier as any, enchantment: ench as any });
      
      const materials = [
        { itemId: leatherId, amount: item.resources.leather },
        { itemId: clothId, amount: item.resources.cloth }
      ];
      if (item.artifact) materials.push({ itemId: `${tier}_ARTIFACT_${item.artifact}`, amount: 1 });
      
      const resourceMultiplier = (item.resources.leather + item.resources.cloth) / 16;
      // Capes and bags typically use Toolmaker, but mostly match Hunter/Mage depending.
      RECIPES.push({ itemId: id, materials, fame: TIER_FAME[tier] * resourceMultiplier, journalId: `${tier}_JOURNAL_HUNTER_EMPTY`, baseFocusCost: TIER_FOCUS[tier] * resourceMultiplier });
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

  // Cloth Shoes (Sandals)
  { id: 'baseClothShoes', name: 'Fabricante de Sandálias de Tecido', multiplier: 30 },
  { id: 'SHOE_CLOTH_SET1', name: 'Especialista em Sandálias de Erudito', baseNodeId: 'baseClothShoes', multiplier: 250 },
  { id: 'SHOE_CLOTH_SET2', name: 'Especialista em Sandálias de Clérigo', baseNodeId: 'baseClothShoes', multiplier: 250 },
  { id: 'SHOE_CLOTH_SET3', name: 'Especialista em Sandálias de Mago', baseNodeId: 'baseClothShoes', multiplier: 250 },
  { id: 'SHOE_CLOTH_KEEPER', name: 'Especialista em Sandálias de Druida', baseNodeId: 'baseClothShoes', multiplier: 250, isArtifact: true },
  { id: 'SHOE_CLOTH_HELL', name: 'Especialista em Sandálias Malévolas', baseNodeId: 'baseClothShoes', multiplier: 250, isArtifact: true },
  { id: 'SHOE_CLOTH_UNDEAD', name: 'Especialista em Sandálias de Sectário', baseNodeId: 'baseClothShoes', multiplier: 250, isArtifact: true },
  { id: 'SHOE_CLOTH_AVALON', name: 'Especialista em Sandálias da Pureza', baseNodeId: 'baseClothShoes', multiplier: 250, isArtifact: true },
  { id: 'SHOE_CLOTH_FEY', name: 'Especialista em Sandálias Escama-feérica', baseNodeId: 'baseClothShoes', multiplier: 250, isArtifact: true },

  // Leather Shoes
  { id: 'baseLeatherShoes', name: 'Fabricante de Sapatos de Couro', multiplier: 30 },
  { id: 'SHOE_LEATHER_SET1', name: 'Especialista em Sapatos de Mercenário', baseNodeId: 'baseLeatherShoes', multiplier: 250 },
  { id: 'SHOE_LEATHER_SET2', name: 'Especialista em Sapatos de Caçador', baseNodeId: 'baseLeatherShoes', multiplier: 250 },
  { id: 'SHOE_LEATHER_SET3', name: 'Especialista em Sapatos de Assassino', baseNodeId: 'baseLeatherShoes', multiplier: 250 },
  { id: 'SHOE_LEATHER_KEEPER', name: 'Especialista em Sapatos de Espreitador', baseNodeId: 'baseLeatherShoes', multiplier: 250, isArtifact: true },
  { id: 'SHOE_LEATHER_HELL', name: 'Especialista em Sapatos Infernais', baseNodeId: 'baseLeatherShoes', multiplier: 250, isArtifact: true },
  { id: 'SHOE_LEATHER_UNDEAD', name: 'Especialista em Sapatos de Espectro', baseNodeId: 'baseLeatherShoes', multiplier: 250, isArtifact: true },
  { id: 'SHOE_LEATHER_AVALON', name: 'Especialista em Sapatos Tenazes', baseNodeId: 'baseLeatherShoes', multiplier: 250, isArtifact: true },
  { id: 'SHOE_LEATHER_FEY', name: 'Especialista em Sapatos Andarilho-da-névoa', baseNodeId: 'baseLeatherShoes', multiplier: 250, isArtifact: true },

  // Axes
  { id: 'baseAxe', name: 'Fabricante de Machados', multiplier: 30 },
  { id: 'MAIN_AXE', name: 'Especialista em Machado', baseNodeId: 'baseAxe', multiplier: 250 },
  { id: '2H_AXE', name: 'Especialista em Grande Machado', baseNodeId: 'baseAxe', multiplier: 250 },
  { id: '2H_HALBERD', name: 'Especialista em Alabarda', baseNodeId: 'baseAxe', multiplier: 250 },
  { id: '2H_CARRIONEATER', name: 'Especialista em Segadeira de Almas', baseNodeId: 'baseAxe', multiplier: 250, isArtifact: true },
  { id: '2H_SCYTHE_HELL', name: 'Especialista em Gadanha Infernal', baseNodeId: 'baseAxe', multiplier: 250, isArtifact: true },
  { id: '2H_BATTLEAXE_KEEPER', name: 'Especialista em Machado de Batalha de urso', baseNodeId: 'baseAxe', multiplier: 250, isArtifact: true },
  { id: '2H_AXE_AVALON', name: 'Especialista em Portador da Noite', baseNodeId: 'baseAxe', multiplier: 250, isArtifact: true },

  // Maces
  { id: 'baseMace', name: 'Fabricante de Maças', multiplier: 30 },
  { id: 'MAIN_MACE', name: 'Especialista em Maça', baseNodeId: 'baseMace', multiplier: 250 },
  { id: '2H_MACE', name: 'Especialista em Maça Pesada', baseNodeId: 'baseMace', multiplier: 250 },
  { id: '2H_FLAIL', name: 'Especialista em Mangual', baseNodeId: 'baseMace', multiplier: 250 },
  { id: 'MAIN_ROCKMACE_KEEPER', name: 'Especialista em Maça de Pedra', baseNodeId: 'baseMace', multiplier: 250, isArtifact: true },
  { id: '2H_MACE_HELL', name: 'Especialista em Incubus', baseNodeId: 'baseMace', multiplier: 250, isArtifact: true },
  { id: '2H_MACE_UNDEAD', name: 'Especialista em Maça de Camas', baseNodeId: 'baseMace', multiplier: 250, isArtifact: true },
  { id: '2H_MACE_AVALON', name: 'Especialista em Maça de Cristal', baseNodeId: 'baseMace', multiplier: 250, isArtifact: true },

  // Hammers
  { id: 'baseHammer', name: 'Fabricante de Martelos', multiplier: 30 },
  { id: 'MAIN_HAMMER', name: 'Especialista em Martelo', baseNodeId: 'baseHammer', multiplier: 250 },
  { id: '2H_HAMMER', name: 'Especialista em Grande Martelo', baseNodeId: 'baseHammer', multiplier: 250 },
  { id: '2H_POLEHAMMER', name: 'Especialista em Martelo de Haste', baseNodeId: 'baseHammer', multiplier: 250 },
  { id: '2H_HAMMER_UNDEAD', name: 'Especialista em Guardião de Túmulos', baseNodeId: 'baseHammer', multiplier: 250, isArtifact: true },
  { id: '2H_DUALHAMMER_HELL', name: 'Especialista em Forja-almas', baseNodeId: 'baseHammer', multiplier: 250, isArtifact: true },
  { id: '2H_RAM_KEEPER', name: 'Especialista em Guardião do Bosque', baseNodeId: 'baseHammer', multiplier: 250, isArtifact: true },
  { id: '2H_HAMMER_AVALON', name: 'Especialista em Martelo de Cristal', baseNodeId: 'baseHammer', multiplier: 250, isArtifact: true },

  // Crossbows
  { id: 'baseCrossbow', name: 'Fabricante de Bestas', multiplier: 30 },
  { id: 'MAIN_CROSSBOW', name: 'Especialista em Besta', baseNodeId: 'baseCrossbow', multiplier: 250 },
  { id: '2H_CROSSBOW', name: 'Especialista em Besta Pesada', baseNodeId: 'baseCrossbow', multiplier: 250 },
  { id: '2H_REPEATINGCROSSBOW', name: 'Especialista em Besta Leve', baseNodeId: 'baseCrossbow', multiplier: 250 },
  { id: '2H_DUALCROSSBOW_HELL', name: 'Especialista em Besta de Repetição', baseNodeId: 'baseCrossbow', multiplier: 250, isArtifact: true },
  { id: '2H_CROSSBOW_AVALON', name: 'Especialista em Besta de Cristal', baseNodeId: 'baseCrossbow', multiplier: 250, isArtifact: true },

  // Staves (Fire, Holy, Nature, Frost, Curse)
  { id: 'baseFireStaff', name: 'Fabricante de Cajados de Fogo', multiplier: 30 },
  { id: 'MAIN_FIRESTAFF', name: 'Especialista em Cajado de Fogo', baseNodeId: 'baseFireStaff', multiplier: 250 },
  { id: '2H_FIRESTAFF', name: 'Especialista em Grande Cajado de Fogo', baseNodeId: 'baseFireStaff', multiplier: 250 },
  { id: '2H_INFERNOSTAFF', name: 'Especialista em Cajado Infernal', baseNodeId: 'baseFireStaff', multiplier: 250 },
  { id: 'MAIN_FIRESTAFF_KEEPER', name: 'Especialista em Cajado de Enxofre', baseNodeId: 'baseFireStaff', multiplier: 250, isArtifact: true },
  { id: '2H_FIRESTAFF_HELL', name: 'Especialista em Cajado de Brimstone', baseNodeId: 'baseFireStaff', multiplier: 250, isArtifact: true },

  { id: 'baseHolyStaff', name: 'Fabricante de Cajados Sagrados', multiplier: 30 },
  { id: 'MAIN_HOLYSTAFF', name: 'Especialista em Cajado Sagrado', baseNodeId: 'baseHolyStaff', multiplier: 250 },
  { id: '2H_HOLYSTAFF', name: 'Especialista em Grande Cajado Sagrado', baseNodeId: 'baseHolyStaff', multiplier: 250 },
  { id: '2H_DIVINESTAFF', name: 'Especialista em Cajado Divino', baseNodeId: 'baseHolyStaff', multiplier: 250 },
  { id: 'MAIN_HOLYSTAFF_MORGANA', name: 'Especialista em Cajado da Queda', baseNodeId: 'baseHolyStaff', multiplier: 250, isArtifact: true },
  { id: '2H_HOLYSTAFF_HELL', name: 'Especialista em Cajado da Redenção', baseNodeId: 'baseHolyStaff', multiplier: 250, isArtifact: true },

  { id: 'baseNatureStaff', name: 'Fabricante de Cajados da Natureza', multiplier: 30 },
  { id: 'MAIN_NATURESTAFF', name: 'Especialista em Cajado da Natureza', baseNodeId: 'baseNatureStaff', multiplier: 250 },
  { id: '2H_NATURESTAFF', name: 'Especialista em Grande Cajado da Natureza', baseNodeId: 'baseNatureStaff', multiplier: 250 },
  { id: '2H_WILDSTAFF', name: 'Especialista em Cajado Selvagem', baseNodeId: 'baseNatureStaff', multiplier: 250 },
  { id: 'MAIN_NATURESTAFF_KEEPER', name: 'Especialista em Cajado da Natureza Garceiro', baseNodeId: 'baseNatureStaff', multiplier: 250, isArtifact: true },
  { id: '2H_NATURESTAFF_HELL', name: 'Especialista em Cajado da Natureza Silvestre', baseNodeId: 'baseNatureStaff', multiplier: 250, isArtifact: true },

  { id: 'baseFrostStaff', name: 'Fabricante de Cajados de Gelo', multiplier: 30 },
  { id: 'MAIN_FROSTSTAFF', name: 'Especialista em Cajado de Gelo', baseNodeId: 'baseFrostStaff', multiplier: 250 },
  { id: '2H_FROSTSTAFF', name: 'Especialista em Grande Cajado de Gelo', baseNodeId: 'baseFrostStaff', multiplier: 250 },
  { id: '2H_GLACIALSTAFF', name: 'Especialista em Cajado Glacial', baseNodeId: 'baseFrostStaff', multiplier: 250 },
  { id: 'MAIN_FROSTSTAFF_KEEPER', name: 'Especialista em Cajado das Bermudas', baseNodeId: 'baseFrostStaff', multiplier: 250, isArtifact: true },
  { id: '2H_FROSTSTAFF_HELL', name: 'Especialista em Cajado de Gelo de Icicle', baseNodeId: 'baseFrostStaff', multiplier: 250, isArtifact: true },

  { id: 'baseCurseStaff', name: 'Fabricante de Cajados Amaldiçoados', multiplier: 30 },
  { id: 'MAIN_CURSEDSTAFF', name: 'Especialista em Cajado Amaldiçoado', baseNodeId: 'baseCurseStaff', multiplier: 250 },
  { id: '2H_CURSEDSTAFF', name: 'Especialista em Grande Cajado Amaldiçoado', baseNodeId: 'baseCurseStaff', multiplier: 250 },
  { id: '2H_DEMONICSTAFF', name: 'Especialista em Cajado Demoníaco', baseNodeId: 'baseCurseStaff', multiplier: 250 },
  { id: 'MAIN_CURSEDSTAFF_UNDEAD', name: 'Especialista em Cajado de Mãos da Vida', baseNodeId: 'baseCurseStaff', multiplier: 250, isArtifact: true },
  { id: '2H_CURSEDSTAFF_HELL', name: 'Especialista em Cajado de Danação', baseNodeId: 'baseCurseStaff', multiplier: 250, isArtifact: true },
  
  // Quarterstaffs
  { id: 'baseQuarterstaff', name: 'Fabricante de Cajados de Batalha', multiplier: 30 },
  { id: '2H_QUARTERSTAFF', name: 'Especialista em Cajado de Batalha', baseNodeId: 'baseQuarterstaff', multiplier: 250 },
  { id: '2H_IRONCLADSTAFF', name: 'Especialista em Cajado de Batalha Revestido', baseNodeId: 'baseQuarterstaff', multiplier: 250 },
  { id: '2H_DOUBLEBLADEDSTAFF', name: 'Especialista em Cajado de Lâmina Dupla', baseNodeId: 'baseQuarterstaff', multiplier: 250 },
  { id: '2H_QUARTERSTAFF_KEEPER', name: 'Especialista em Cajado de Batalha de Urso', baseNodeId: 'baseQuarterstaff', multiplier: 250, isArtifact: true },

  // Off-hands
  { id: 'baseOffhand', name: 'Fabricante de Itens Secundários', multiplier: 15 },
  { id: 'OFF_SHIELD', name: 'Especialista em Escudo', baseNodeId: 'baseOffhand', multiplier: 125 },
  { id: 'OFF_BOOK', name: 'Especialista em Tomo de Feitiços', baseNodeId: 'baseOffhand', multiplier: 125 },
  { id: 'OFF_TORCH', name: 'Especialista em Tocha', baseNodeId: 'baseOffhand', multiplier: 125 },
  { id: 'OFF_SHIELD_HELL', name: 'Especialista em Sarcófago', baseNodeId: 'baseOffhand', multiplier: 125, isArtifact: true },
  { id: 'OFF_BOOK_HELL', name: 'Especialista em Muleta', baseNodeId: 'baseOffhand', multiplier: 125, isArtifact: true },
  { id: 'OFF_TORCH_HELL', name: 'Especialista em Vela do Sétimo Sono', baseNodeId: 'baseOffhand', multiplier: 125, isArtifact: true },
];
