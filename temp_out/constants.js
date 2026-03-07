"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SPEC_NODES = exports.RECIPES = exports.ITEMS = void 0;
var TIERS = ['T4', 'T5', 'T6', 'T7', 'T8'];
var ENCHANTMENTS = ['0', '1', '2', '3', '4'];
var METAL_BAR_FAME = {
    'T4': 90,
    'T5': 180,
    'T6': 360,
    'T7': 720,
    'T8': 1440,
};
var ROBE_TYPES = [
    { id: 'SET1', name: 'Hábito de Erudito', artifact: null },
    { id: 'SET2', name: 'Hábito de Clérigo', artifact: null },
    { id: 'SET3', name: 'Hábito de Mago', artifact: null },
    { id: 'KEEPER', name: 'Hábito de Druida', artifact: 'KEEPER' },
    { id: 'HELL', name: 'Hábito Malévolo', artifact: 'HELL' },
    { id: 'UNDEAD', name: 'Hábito de Sectário', artifact: 'UNDEAD' },
    { id: 'AVALON', name: 'Hábito da Pureza', artifact: 'AVALON' },
    { id: 'FEY', name: 'Hábito Escama-feérica', artifact: 'FEY' },
];
var CLOTH_COWL_TYPES = [
    { id: 'SET1', name: 'Capote de Erudito', artifact: null },
    { id: 'SET2', name: 'Capote de Clérigo', artifact: null },
    { id: 'SET3', name: 'Capote de Mago', artifact: null },
    { id: 'KEEPER', name: 'Capote de Druida', artifact: 'KEEPER' },
    { id: 'HELL', name: 'Capote Malévolo', artifact: 'HELL' },
    { id: 'UNDEAD', name: 'Capote de Sectário', artifact: 'UNDEAD' },
    { id: 'AVALON', name: 'Capote da Pureza', artifact: 'AVALON' },
    { id: 'FEY', name: 'Capote Escama-feérica', artifact: 'FEY' },
];
var LEATHER_JACKET_TYPES = [
    { id: 'SET1', name: 'Casaco de Mercenário', artifact: null },
    { id: 'SET2', name: 'Casaco de Caçador', artifact: null },
    { id: 'SET3', name: 'Casaco de Assassino', artifact: null },
    { id: 'KEEPER', name: 'Casaco de Espreitador', artifact: 'KEEPER' },
    { id: 'HELL', name: 'Casaco Infernal', artifact: 'HELL' },
    { id: 'UNDEAD', name: 'Casaco de Espectro', artifact: 'UNDEAD' },
    { id: 'AVALON', name: 'Casaco Tenaz', artifact: 'AVALON' },
    { id: 'FEY', name: 'Casaco Andarilho-da-névoa', artifact: 'FEY' },
];
var LEATHER_HOOD_TYPES = [
    { id: 'SET1', name: 'Capuz de Mercenário', artifact: null },
    { id: 'SET2', name: 'Capuz de Caçador', artifact: null },
    { id: 'SET3', name: 'Capuz de Assassino', artifact: null },
    { id: 'KEEPER', name: 'Capuz de Espreitador', artifact: 'KEEPER' },
    { id: 'HELL', name: 'Capuz Infernal', artifact: 'HELL' },
    { id: 'UNDEAD', name: 'Capuz de Espectro', artifact: 'UNDEAD' },
    { id: 'AVALON', name: 'Capuz Tenaz', artifact: 'AVALON' },
    { id: 'FEY', name: 'Capuz Andarilho-da-névoa', artifact: 'FEY' },
];
var PLATE_ARMOR_TYPES = [
    { id: 'SET1', name: 'Armadura de Soldado', artifact: null },
    { id: 'SET2', name: 'Armadura de Cavaleiro', artifact: null },
    { id: 'SET3', name: 'Armadura de Guardião', artifact: null },
    { id: 'UNDEAD', name: 'Armadura de Guardião de Túmulos', artifact: 'UNDEAD' },
    { id: 'HELL', name: 'Armadura Demoníaca', artifact: 'HELL' },
    { id: 'MORGANA', name: 'Armadura de Judicador', artifact: 'MORGANA' },
    { id: 'AVALON', name: 'Armadura da Bravura', artifact: 'AVALON' },
    { id: 'FEY', name: 'Armadura de Tecelão do Crepúsculo', artifact: 'FEY' },
];
var PLATE_HELMET_TYPES = [
    { id: 'SET1', name: 'Elmo de Soldado', artifact: null },
    { id: 'SET2', name: 'Elmo de Cavaleiro', artifact: null },
    { id: 'SET3', name: 'Elmo de Guardião', artifact: null },
    { id: 'UNDEAD', name: 'Elmo de Guardião de Túmulos', artifact: 'UNDEAD' },
    { id: 'HELL', name: 'Elmo Demoníaco', artifact: 'HELL' },
    { id: 'MORGANA', name: 'Elmo de Judicador', artifact: 'MORGANA' },
    { id: 'AVALON', name: 'Elmo da Bravura', artifact: 'AVALON' },
    { id: 'FEY', name: 'Elmo de Tecelão do Crepúsculo', artifact: 'FEY' },
];
var PLATE_SHOE_TYPES = [
    { id: 'SET1', name: 'Botas de Soldado', artifact: null },
    { id: 'SET2', name: 'Botas de Cavaleiro', artifact: null },
    { id: 'SET3', name: 'Botas de Guardião', artifact: null },
    { id: 'UNDEAD', name: 'Botas de Guardião de Túmulos', artifact: 'UNDEAD' },
    { id: 'HELL', name: 'Botas Demoníacas', artifact: 'HELL' },
    { id: 'MORGANA', name: 'Botas de Judicador', artifact: 'MORGANA' },
    { id: 'AVALON', name: 'Botas da Bravura', artifact: 'AVALON' },
    { id: 'FEY', name: 'Botas de Tecelão do Crepúsculo', artifact: 'FEY' },
];
var SPEAR_TYPES = [
    { id: 'MAIN_SPEAR', name: 'Lança', artifact: null, resources: { planks: 8, bars: 8 } },
    { id: '2H_PIKE', name: 'Pique', artifact: null, resources: { planks: 12, bars: 8 } },
    { id: '2H_GLAIVE', name: 'Archa', artifact: null, resources: { planks: 12, bars: 8 } },
    { id: 'MAIN_SPEAR_KEEPER', name: 'Lança Garceira', artifact: 'MAIN_SPEAR_KEEPER', resources: { planks: 8, bars: 8 } },
    { id: '2H_SPEAR_MORGANA', name: 'Caça-espíritos', artifact: '2H_SPEAR_MORGANA', resources: { planks: 12, bars: 8 } },
    { id: '2H_TRINITYSPEAR', name: 'Lança Trina', artifact: '2H_TRINITYSPEAR', resources: { planks: 12, bars: 8 } },
    { id: 'MAIN_SPEAR_AVALON', name: 'Archa Fraturada', artifact: 'MAIN_SPEAR_AVALON', resources: { planks: 8, bars: 8 } },
    { id: '2H_SPEAR_FEY', name: 'Alvorada', artifact: '2H_SPEAR_FEY', resources: { planks: 12, bars: 8 } },
];
var SWORD_TYPES = [
    { id: 'MAIN_SWORD', name: 'Espada Larga', artifact: null, resources: { planks: 8, bars: 8 } },
    { id: '2H_CLAYMORE', name: 'Montante', artifact: null, resources: { planks: 12, bars: 8 } },
    { id: '2H_DUALSWORD', name: 'Espadas Duplas', artifact: null, resources: { planks: 12, bars: 8 } },
    { id: 'MAIN_SCIMITAR_MORGANA', name: 'Lâmina de Clarent', artifact: 'MAIN_SCIMITAR_MORGANA', resources: { planks: 8, bars: 8 } },
    { id: '2H_CLEAVER_HELL', name: 'Espada Entalhada', artifact: '2H_CLEAVER_HELL', resources: { planks: 12, bars: 8 } },
    { id: '2H_DUALSCIMITAR_UNDEAD', name: 'Par de Galatinas', artifact: '2H_DUALSCIMITAR_UNDEAD', resources: { planks: 12, bars: 8 } },
    { id: '2H_CLAYMORE_AVALON', name: 'Faz-Rei', artifact: '2H_CLAYMORE_AVALON', resources: { planks: 12, bars: 8 } },
];
var BOW_TYPES = [
    { id: '2H_BOW', name: 'Arco', artifact: null, resources: { planks: 32, bars: 0 } },
    { id: '2H_WARBOW', name: 'Arco de Guerra', artifact: null, resources: { planks: 32, bars: 0 } },
    { id: '2H_LONGBOW', name: 'Arco Longo', artifact: null, resources: { planks: 32, bars: 0 } },
    { id: '2H_LONGBOW_UNDEAD', name: 'Arco Sussurrante', artifact: '2H_LONGBOW_UNDEAD', resources: { planks: 32, bars: 0 } },
    { id: '2H_BOW_HELL', name: 'Arco Lamurioso', artifact: '2H_BOW_HELL', resources: { planks: 32, bars: 0 } },
    { id: '2H_BOW_KEEPER', name: 'Arco de Badon', artifact: '2H_BOW_KEEPER', resources: { planks: 32, bars: 0 } },
    { id: '2H_BOW_AVALON', name: 'Perfura-bruma', artifact: '2H_BOW_AVALON', resources: { planks: 32, bars: 0 } },
];
var DAGGER_TYPES = [
    { id: 'MAIN_DAGGER', name: 'Adaga', artifact: null, resources: { leather: 8, bars: 8 } },
    { id: '2H_DAGGERPAIR', name: 'Par de Adagas', artifact: null, resources: { leather: 12, bars: 8 } },
    { id: '2H_CLAWPAIR', name: 'Garras', artifact: null, resources: { leather: 12, bars: 8 } },
    { id: 'MAIN_DAGGER_HELL', name: 'Sangra-letra', artifact: 'MAIN_DAGGER_HELL', resources: { leather: 8, bars: 8 } },
    { id: '2H_DUALDAGGER_UNDEAD', name: 'Mãos da Morte', artifact: '2H_DUALDAGGER_UNDEAD', resources: { leather: 12, bars: 8 } },
    { id: '2H_DAGGER_KEEPER', name: 'Empalador', artifact: '2H_DAGGER_KEEPER', resources: { leather: 12, bars: 8 } },
    { id: 'MAIN_DAGGER_AVALON', name: 'Presas Demoníacas', artifact: 'MAIN_DAGGER_AVALON', resources: { leather: 8, bars: 8 } },
];
var CLOTH_SHOE_TYPES = [
    { id: 'SET1', name: 'Sandálias de Erudito', artifact: null },
    { id: 'SET2', name: 'Sandálias de Clérigo', artifact: null },
    { id: 'SET3', name: 'Sandálias de Mago', artifact: null },
    { id: 'KEEPER', name: 'Sandálias de Druida', artifact: 'KEEPER' },
    { id: 'HELL', name: 'Sandálias Malévolas', artifact: 'HELL' },
    { id: 'UNDEAD', name: 'Sandálias de Sectário', artifact: 'UNDEAD' },
    { id: 'AVALON', name: 'Sandálias da Pureza', artifact: 'AVALON' },
    { id: 'FEY', name: 'Sandálias Escama-feérica', artifact: 'FEY' },
];
var LEATHER_SHOE_TYPES = [
    { id: 'SET1', name: 'Sapatos de Mercenário', artifact: null },
    { id: 'SET2', name: 'Sapatos de Caçador', artifact: null },
    { id: 'SET3', name: 'Sapatos de Assassino', artifact: null },
    { id: 'KEEPER', name: 'Sapatos de Espreitador', artifact: 'KEEPER' },
    { id: 'HELL', name: 'Sapatos Infernais', artifact: 'HELL' },
    { id: 'UNDEAD', name: 'Sapatos de Espectro', artifact: 'UNDEAD' },
    { id: 'AVALON', name: 'Sapatos Tenazes', artifact: 'AVALON' },
    { id: 'FEY', name: 'Sapatos Andarilho-da-névoa', artifact: 'FEY' },
];
var AXE_TYPES = [
    { id: 'MAIN_AXE', name: 'Machado de Batalha', artifact: null, resources: { planks: 8, bars: 8 } },
    { id: '2H_AXE', name: 'Machadão', artifact: null, resources: { planks: 12, bars: 8 } },
    { id: '2H_HALBERD', name: 'Alabarda', artifact: null, resources: { planks: 12, bars: 8 } },
    { id: '2H_HALBERD_MORGANA', name: 'Sacha-carnes', artifact: '2H_HALBERD_MORGANA', resources: { planks: 12, bars: 8 } },
    { id: '2H_SCYTHE_HELL', name: 'Ceifadora Sangrenta', artifact: '2H_SCYTHE_HELL', resources: { planks: 12, bars: 8 } },
    { id: '2H_DUALAXE_KEEPER', name: 'Patas de Urso', artifact: '2H_DUALAXE_KEEPER', resources: { planks: 12, bars: 8 } },
    { id: '2H_AXE_AVALON', name: 'Quebra-reinos', artifact: '2H_AXE_AVALON', resources: { planks: 12, bars: 8 } },
    { id: '2H_AXE_FEY', name: 'Chamadora de Raiz', artifact: '2H_AXE_FEY', resources: { planks: 12, bars: 8 } },
];
var MACE_TYPES = [
    { id: 'MAIN_MACE', name: 'Maça', artifact: null, resources: { leather: 8, bars: 8 } },
    { id: '2H_MACE', name: 'Maça Pesada', artifact: null, resources: { leather: 12, bars: 8 } },
    { id: '2H_FLAIL', name: 'Mangual', artifact: null, resources: { leather: 12, bars: 8 } },
    { id: 'MAIN_ROCKMACE_KEEPER', name: 'Maça de Incubo', artifact: 'MAIN_ROCKMACE_KEEPER', resources: { leather: 8, bars: 8 } },
    { id: 'MAIN_MACE_HELL', name: 'Maça de Camlann', artifact: 'MAIN_MACE_HELL', resources: { leather: 8, bars: 8 } },
    { id: '2H_MACE_MORGANA', name: 'Padecedor', artifact: '2H_MACE_MORGANA', resources: { leather: 12, bars: 8 } },
    { id: '2H_DUALMACE_AVALON', name: 'Juradores Guardiões', artifact: '2H_DUALMACE_AVALON', resources: { leather: 12, bars: 8 } },
];
var HAMMER_TYPES = [
    { id: 'MAIN_HAMMER', name: 'Martelo', artifact: null, resources: { planks: 8, bars: 8 } },
    { id: '2H_POLEHAMMER', name: 'Martelo-Lança', artifact: null, resources: { planks: 12, bars: 8 } },
    { id: '2H_HAMMER', name: 'Grande Martelo', artifact: null, resources: { planks: 12, bars: 8 } },
    { id: '2H_RAM_KEEPER', name: 'Cadeados de Túmulo', artifact: '2H_RAM_KEEPER', resources: { planks: 12, bars: 8 } },
    { id: '2H_HAMMER_UNDEAD', name: 'Forjador de Túmulos', artifact: '2H_HAMMER_UNDEAD', resources: { planks: 12, bars: 8 } },
    { id: '2H_DUALHAMMER_HELL', name: 'Martelos de Forja', artifact: '2H_DUALHAMMER_HELL', resources: { planks: 12, bars: 8 } },
    { id: '2H_HAMMER_AVALON', name: 'Mãos da Justiça', artifact: '2H_HAMMER_AVALON', resources: { planks: 12, bars: 8 } },
];
var QUARTERSTAFF_TYPES = [
    { id: '2H_QUARTERSTAFF', name: 'Bordão', artifact: null, resources: { leather: 12, bars: 8 } },
    { id: '2H_IRONCLADEDSTAFF', name: 'Cajado Ferrado', artifact: null, resources: { leather: 12, bars: 8 } },
    { id: '2H_DOUBLEBLADEDSTAFF', name: 'Cajado de Lâmina Dupla', artifact: null, resources: { leather: 12, bars: 8 } },
    { id: '2H_COMBATSTAFF_MORGANA', name: 'Atacante Negro', artifact: '2H_COMBATSTAFF_MORGANA', resources: { leather: 12, bars: 8 } },
    { id: '2H_TWINSCYTHE_HELL', name: 'Foice de Almas', artifact: '2H_TWINSCYTHE_HELL', resources: { leather: 12, bars: 8 } },
    { id: '2H_ROCKSTAFF_KEEPER', name: 'Aríete Equilíbrio', artifact: '2H_ROCKSTAFF_KEEPER', resources: { leather: 12, bars: 8 } },
    { id: '2H_QUARTERSTAFF_AVALON', name: 'Buscagralha', artifact: '2H_QUARTERSTAFF_AVALON', resources: { leather: 12, bars: 8 } },
];
var CROSSBOW_TYPES = [
    { id: '2H_CROSSBOW', name: 'Besta', artifact: null, resources: { planks: 20, bars: 0 } },
    { id: '2H_CROSSBOWLARGE', name: 'Besta Pesada', artifact: null, resources: { planks: 20, bars: 0 } },
    { id: 'MAIN_1HCROSSBOW', name: 'Besta Leve', artifact: null, resources: { planks: 16, bars: 0 } },
    { id: '2H_REPEATINGCROSSBOW_UNDEAD', name: 'Choramingadora', artifact: '2H_REPEATINGCROSSBOW_UNDEAD', resources: { planks: 20, bars: 0 } },
    { id: '2H_DUALCROSSBOW_HELL', name: 'Mãos Atiradoras', artifact: '2H_DUALCROSSBOW_HELL', resources: { planks: 20, bars: 0 } },
    { id: '2H_CROSSBOWLARGE_MORGANA', name: 'Criador de Cercos', artifact: '2H_CROSSBOWLARGE_MORGANA', resources: { planks: 20, bars: 0 } },
    { id: '2H_CROSSBOW_AVALON', name: 'Convocadora de Energia', artifact: '2H_CROSSBOW_AVALON', resources: { planks: 20, bars: 0 } },
];
var FIRE_STAFF_TYPES = [
    { id: 'MAIN_FIRESTAFF', name: 'Cajado de Fogo', artifact: null, resources: { planks: 16, bars: 0 } },
    { id: '2H_FIRESTAFF', name: 'Cajado de Fogo Grande', artifact: null, resources: { planks: 20, bars: 0 } },
    { id: '2H_INFERNOSTAFF', name: 'Cajado Infernal', artifact: null, resources: { planks: 20, bars: 0 } },
    { id: 'MAIN_FIRESTAFF_KEEPER', name: 'Cajado de Fogo Feroz', artifact: 'MAIN_FIRESTAFF_KEEPER', resources: { planks: 16, bars: 0 } },
    { id: '2H_FIRESTAFF_HELL', name: 'Cajado de Enxofre', artifact: '2H_FIRESTAFF_HELL', resources: { planks: 20, bars: 0 } },
    { id: '2H_INFERNOSTAFF_MORGANA', name: 'Música Chamejante', artifact: '2H_INFERNOSTAFF_MORGANA', resources: { planks: 20, bars: 0 } },
    { id: '2H_FIRESTAFF_AVALON', name: 'Cajado de Fogo da Aurora', artifact: '2H_FIRESTAFF_AVALON', resources: { planks: 20, bars: 0 } },
];
var HOLY_STAFF_TYPES = [
    { id: 'MAIN_HOLYSTAFF', name: 'Cajado Sagrado', artifact: null, resources: { planks: 16, bars: 0 } },
    { id: '2H_HOLYSTAFF', name: 'Cajado Sagrado Grande', artifact: null, resources: { planks: 20, bars: 0 } },
    { id: '2H_DIVINESTAFF', name: 'Cajado Divino', artifact: null, resources: { planks: 20, bars: 0 } },
    { id: 'MAIN_HOLYSTAFF_MORGANA', name: 'Cajado Vil', artifact: 'MAIN_HOLYSTAFF_MORGANA', resources: { planks: 16, bars: 0 } },
    { id: '2H_HOLYSTAFF_HELL', name: 'Cajado de Condenado', artifact: '2H_HOLYSTAFF_HELL', resources: { planks: 20, bars: 0 } },
    { id: '2H_HOLYSTAFF_UNDEAD', name: 'Cajado de Redenção', artifact: '2H_HOLYSTAFF_UNDEAD', resources: { planks: 20, bars: 0 } },
    { id: 'MAIN_HOLYSTAFF_AVALON', name: 'Cajado de Luz', artifact: 'MAIN_HOLYSTAFF_AVALON', resources: { planks: 16, bars: 0 } },
];
var NATURE_STAFF_TYPES = [
    { id: 'MAIN_NATURESTAFF', name: 'Cajado da Natureza', artifact: null, resources: { planks: 16, bars: 0 } },
    { id: '2H_NATURESTAFF', name: 'Cajado da Natureza Grande', artifact: null, resources: { planks: 20, bars: 0 } },
    { id: '2H_WILDSTAFF', name: 'Cajado Selvagem', artifact: null, resources: { planks: 20, bars: 0 } },
    { id: 'MAIN_NATURESTAFF_KEEPER', name: 'Cajado Contaminador', artifact: 'MAIN_NATURESTAFF_KEEPER', resources: { planks: 16, bars: 0 } },
    { id: '2H_NATURESTAFF_HELL', name: 'Cajado de Praga', artifact: '2H_NATURESTAFF_HELL', resources: { planks: 20, bars: 0 } },
    { id: '2H_NATURESTAFF_KEEPER', name: 'Cajado Rampante', artifact: '2H_NATURESTAFF_KEEPER', resources: { planks: 20, bars: 0 } },
    { id: 'MAIN_NATURESTAFF_AVALON', name: 'Cajado da Madeira-ferro', artifact: 'MAIN_NATURESTAFF_AVALON', resources: { planks: 16, bars: 0 } },
];
var FROST_STAFF_TYPES = [
    { id: 'MAIN_FROSTSTAFF', name: 'Cajado de Gelo', artifact: null, resources: { planks: 16, bars: 0 } },
    { id: '2H_FROSTSTAFF', name: 'Cajado de Gelo Grande', artifact: null, resources: { planks: 20, bars: 0 } },
    { id: '2H_GLACIALSTAFF', name: 'Cajado Glacial', artifact: null, resources: { planks: 20, bars: 0 } },
    { id: 'MAIN_FROSTSTAFF_KEEPER', name: 'Cajado de Gelo Gris', artifact: 'MAIN_FROSTSTAFF_KEEPER', resources: { planks: 16, bars: 0 } },
    { id: '2H_ICEGAUNTLETS_HELL', name: 'Manoplas de Gelo', artifact: '2H_ICEGAUNTLETS_HELL', resources: { planks: 20, bars: 0 } },
    { id: '2H_ICECRYSTAL_UNDEAD', name: 'Prisma Congelante', artifact: '2H_ICECRYSTAL_UNDEAD', resources: { planks: 20, bars: 0 } },
    { id: 'MAIN_FROSTSTAFF_AVALON', name: 'Cajado de Gelo Glacial', artifact: 'MAIN_FROSTSTAFF_AVALON', resources: { planks: 16, bars: 0 } },
];
var CURSED_STAFF_TYPES = [
    { id: 'MAIN_CURSEDSTAFF', name: 'Cajado Amaldiçoado', artifact: null, resources: { planks: 16, bars: 0 } },
    { id: '2H_CURSEDSTAFF', name: 'Cajado Amaldiçoado Grande', artifact: null, resources: { planks: 20, bars: 0 } },
    { id: '2H_DEMONICSTAFF', name: 'Cajado Demoníaco', artifact: null, resources: { planks: 20, bars: 0 } },
    { id: 'MAIN_CURSEDSTAFF_UNDEAD', name: 'Cajado Vil', artifact: 'MAIN_CURSEDSTAFF_UNDEAD', resources: { planks: 16, bars: 0 } },
    { id: '2H_SKULLORB_HELL', name: 'Cajado Amaldiçoado Condenado', artifact: '2H_SKULLORB_HELL', resources: { planks: 20, bars: 0 } },
    { id: '2H_CURSEDSTAFF_MORGANA', name: 'Chamador das Sombras', artifact: '2H_CURSEDSTAFF_MORGANA', resources: { planks: 20, bars: 0 } },
    { id: 'MAIN_CURSEDSTAFF_AVALON', name: 'Cajado Amaldiçoado da Escuridão', artifact: 'MAIN_CURSEDSTAFF_AVALON', resources: { planks: 16, bars: 0 } },
];
var SHIELD_TYPES = [
    { id: 'SHIELD', name: 'Escudo', artifact: null, resources: { planks: 4, bars: 0 } },
    { id: 'SHIELD_HELL', name: 'Sarcófago', artifact: 'SHIELD_HELL', resources: { planks: 4, bars: 0 } },
    { id: 'SHIELD_UNDEAD', name: 'Escudo Condenado', artifact: 'SHIELD_UNDEAD', resources: { planks: 4, bars: 0 } },
];
var TIER_FAME = {
    'T4': 180,
    'T5': 360,
    'T6': 720,
    'T7': 1440,
    'T8': 2880,
};
var TIER_FOCUS = {
    'T4': 1000,
    'T5': 2000,
    'T6': 4000,
    'T7': 8000,
    'T8': 16000,
};
exports.ITEMS = [];
exports.RECIPES = [];
// Generate Journals
TIERS.forEach(function (tier) {
    exports.ITEMS.push({ id: "".concat(tier, "_JOURNAL_MAGIC_EMPTY"), name: "Di\u00E1rio de Imbuidor ".concat(tier, " (Vazio)"), category: 'Diários', tier: tier, enchantment: '0' });
    exports.ITEMS.push({ id: "".concat(tier, "_JOURNAL_MAGIC_FULL"), name: "Di\u00E1rio de Imbuidor ".concat(tier, " (Cheio)"), category: 'Diários', tier: tier, enchantment: '0' });
    exports.ITEMS.push({ id: "".concat(tier, "_JOURNAL_WARRIOR_EMPTY"), name: "Di\u00E1rio de Ferreiro ".concat(tier, " (Vazio)"), category: 'Diários', tier: tier, enchantment: '0' });
    exports.ITEMS.push({ id: "".concat(tier, "_JOURNAL_WARRIOR_FULL"), name: "Di\u00E1rio de Ferreiro ".concat(tier, " (Cheio)"), category: 'Diários', tier: tier, enchantment: '0' });
    exports.ITEMS.push({ id: "".concat(tier, "_JOURNAL_HUNTER_EMPTY"), name: "Di\u00E1rio de Flecheiro ".concat(tier, " (Vazio)"), category: 'Diários', tier: tier, enchantment: '0' });
    exports.ITEMS.push({ id: "".concat(tier, "_JOURNAL_HUNTER_FULL"), name: "Di\u00E1rio de Flecheiro ".concat(tier, " (Cheio)"), category: 'Diários', tier: tier, enchantment: '0' });
});
// Generate Artifacts
TIERS.forEach(function (tier) {
    ROBE_TYPES.forEach(function (robe) {
        if (robe.artifact) {
            var artifactId = "".concat(tier, "_ARTIFACT_ARMOR_CLOTH_").concat(robe.artifact);
            exports.ITEMS.push({ id: artifactId, name: "Artefato de ".concat(robe.name, " ").concat(tier), category: 'Artefatos', tier: tier, enchantment: '0' });
        }
    });
    CLOTH_COWL_TYPES.forEach(function (cowl) {
        if (cowl.artifact) {
            var artifactId = "".concat(tier, "_ARTIFACT_HEAD_CLOTH_").concat(cowl.artifact);
            exports.ITEMS.push({ id: artifactId, name: "Artefato de ".concat(cowl.name, " ").concat(tier), category: 'Artefatos', tier: tier, enchantment: '0' });
        }
    });
    LEATHER_JACKET_TYPES.forEach(function (jacket) {
        if (jacket.artifact) {
            var artifactId = "".concat(tier, "_ARTIFACT_ARMOR_LEATHER_").concat(jacket.artifact);
            exports.ITEMS.push({ id: artifactId, name: "Artefato de ".concat(jacket.name, " ").concat(tier), category: 'Artefatos', tier: tier, enchantment: '0' });
        }
    });
    LEATHER_HOOD_TYPES.forEach(function (hood) {
        if (hood.artifact) {
            var artifactId = "".concat(tier, "_ARTIFACT_HEAD_LEATHER_").concat(hood.artifact);
            exports.ITEMS.push({ id: artifactId, name: "Artefato de ".concat(hood.name, " ").concat(tier), category: 'Artefatos', tier: tier, enchantment: '0' });
        }
    });
    PLATE_ARMOR_TYPES.forEach(function (armor) {
        if (armor.artifact) {
            var artifactId = "".concat(tier, "_ARTIFACT_ARMOR_PLATE_").concat(armor.artifact);
            exports.ITEMS.push({ id: artifactId, name: "Artefato de ".concat(armor.name, " ").concat(tier), category: 'Artefatos', tier: tier, enchantment: '0' });
        }
    });
    PLATE_HELMET_TYPES.forEach(function (helmet) {
        if (helmet.artifact) {
            var artifactId = "".concat(tier, "_ARTIFACT_HEAD_PLATE_").concat(helmet.artifact);
            exports.ITEMS.push({ id: artifactId, name: "Artefato de ".concat(helmet.name, " ").concat(tier), category: 'Artefatos', tier: tier, enchantment: '0' });
        }
    });
    PLATE_SHOE_TYPES.forEach(function (shoe) {
        if (shoe.artifact) {
            var artifactId = "".concat(tier, "_ARTIFACT_SHOES_PLATE_").concat(shoe.artifact);
            exports.ITEMS.push({ id: artifactId, name: "Artefato de ".concat(shoe.name, " ").concat(tier), category: 'Artefatos', tier: tier, enchantment: '0' });
        }
    });
    SPEAR_TYPES.forEach(function (spear) {
        if (spear.artifact) {
            var artifactId = "".concat(tier, "_ARTIFACT_").concat(spear.artifact);
            exports.ITEMS.push({ id: artifactId, name: "Artefato de ".concat(spear.name, " ").concat(tier), category: 'Artefatos', tier: tier, enchantment: '0' });
        }
    });
    SWORD_TYPES.forEach(function (sword) {
        if (sword.artifact) {
            var artifactId = "".concat(tier, "_ARTIFACT_").concat(sword.artifact);
            exports.ITEMS.push({ id: artifactId, name: "Artefato de ".concat(sword.name, " ").concat(tier), category: 'Artefatos', tier: tier, enchantment: '0' });
        }
    });
    BOW_TYPES.forEach(function (bow) {
        if (bow.artifact) {
            var artifactId = "".concat(tier, "_ARTIFACT_").concat(bow.artifact);
            exports.ITEMS.push({ id: artifactId, name: "Artefato de ".concat(bow.name, " ").concat(tier), category: 'Artefatos', tier: tier, enchantment: '0' });
        }
    });
    DAGGER_TYPES.forEach(function (dagger) {
        if (dagger.artifact) {
            var artifactId = "".concat(tier, "_ARTIFACT_").concat(dagger.artifact);
            exports.ITEMS.push({ id: artifactId, name: "Artefato de ".concat(dagger.name, " ").concat(tier), category: 'Artefatos', tier: tier, enchantment: '0' });
        }
    });
    CLOTH_SHOE_TYPES.forEach(function (shoe) { if (shoe.artifact)
        exports.ITEMS.push({ id: "".concat(tier, "_ARTIFACT_SHOES_CLOTH_").concat(shoe.artifact), name: "Artefato de ".concat(shoe.name, " ").concat(tier), category: 'Artefatos', tier: tier, enchantment: '0' }); });
    LEATHER_SHOE_TYPES.forEach(function (shoe) { if (shoe.artifact)
        exports.ITEMS.push({ id: "".concat(tier, "_ARTIFACT_SHOES_LEATHER_").concat(shoe.artifact), name: "Artefato de ".concat(shoe.name, " ").concat(tier), category: 'Artefatos', tier: tier, enchantment: '0' }); });
    AXE_TYPES.forEach(function (axe) { if (axe.artifact)
        exports.ITEMS.push({ id: "".concat(tier, "_ARTIFACT_").concat(axe.artifact), name: "Artefato de ".concat(axe.name, " ").concat(tier), category: 'Artefatos', tier: tier, enchantment: '0' }); });
    MACE_TYPES.forEach(function (mace) { if (mace.artifact)
        exports.ITEMS.push({ id: "".concat(tier, "_ARTIFACT_").concat(mace.artifact), name: "Artefato de ".concat(mace.name, " ").concat(tier), category: 'Artefatos', tier: tier, enchantment: '0' }); });
    HAMMER_TYPES.forEach(function (hammer) { if (hammer.artifact)
        exports.ITEMS.push({ id: "".concat(tier, "_ARTIFACT_").concat(hammer.artifact), name: "Artefato de ".concat(hammer.name, " ").concat(tier), category: 'Artefatos', tier: tier, enchantment: '0' }); });
    QUARTERSTAFF_TYPES.forEach(function (qstaff) { if (qstaff.artifact)
        exports.ITEMS.push({ id: "".concat(tier, "_ARTIFACT_").concat(qstaff.artifact), name: "Artefato de ".concat(qstaff.name, " ").concat(tier), category: 'Artefatos', tier: tier, enchantment: '0' }); });
    CROSSBOW_TYPES.forEach(function (cbow) { if (cbow.artifact)
        exports.ITEMS.push({ id: "".concat(tier, "_ARTIFACT_").concat(cbow.artifact), name: "Artefato de ".concat(cbow.name, " ").concat(tier), category: 'Artefatos', tier: tier, enchantment: '0' }); });
    FIRE_STAFF_TYPES.forEach(function (staff) { if (staff.artifact)
        exports.ITEMS.push({ id: "".concat(tier, "_ARTIFACT_").concat(staff.artifact), name: "Artefato de ".concat(staff.name, " ").concat(tier), category: 'Artefatos', tier: tier, enchantment: '0' }); });
    HOLY_STAFF_TYPES.forEach(function (staff) { if (staff.artifact)
        exports.ITEMS.push({ id: "".concat(tier, "_ARTIFACT_").concat(staff.artifact), name: "Artefato de ".concat(staff.name, " ").concat(tier), category: 'Artefatos', tier: tier, enchantment: '0' }); });
    NATURE_STAFF_TYPES.forEach(function (staff) { if (staff.artifact)
        exports.ITEMS.push({ id: "".concat(tier, "_ARTIFACT_").concat(staff.artifact), name: "Artefato de ".concat(staff.name, " ").concat(tier), category: 'Artefatos', tier: tier, enchantment: '0' }); });
    FROST_STAFF_TYPES.forEach(function (staff) { if (staff.artifact)
        exports.ITEMS.push({ id: "".concat(tier, "_ARTIFACT_").concat(staff.artifact), name: "Artefato de ".concat(staff.name, " ").concat(tier), category: 'Artefatos', tier: tier, enchantment: '0' }); });
    CURSED_STAFF_TYPES.forEach(function (staff) { if (staff.artifact)
        exports.ITEMS.push({ id: "".concat(tier, "_ARTIFACT_").concat(staff.artifact), name: "Artefato de ".concat(staff.name, " ").concat(tier), category: 'Artefatos', tier: tier, enchantment: '0' }); });
    SHIELD_TYPES.forEach(function (shield) { if (shield.artifact)
        exports.ITEMS.push({ id: "".concat(tier, "_ARTIFACT_").concat(shield.artifact), name: "Artefato de ".concat(shield.name, " ").concat(tier), category: 'Artefatos', tier: tier, enchantment: '0' }); });
});
// Generate Resources, Robes and Shoes
TIERS.forEach(function (tier) {
    ENCHANTMENTS.forEach(function (ench) {
        var enchSuffix = ench === '0' ? '' : "_LEVEL".concat(ench, "@").concat(ench);
        // Cloth
        var clothId = "".concat(tier, "_CLOTH").concat(enchSuffix);
        exports.ITEMS.push({ id: clothId, name: "Tecido ".concat(tier, ".").concat(ench), category: 'Recursos Refinados', tier: tier, enchantment: ench });
        // Metal Bars
        var barId = "".concat(tier, "_METALBAR").concat(enchSuffix);
        exports.ITEMS.push({ id: barId, name: "Barra de Metal ".concat(tier, ".").concat(ench), category: 'Recursos Refinados', tier: tier, enchantment: ench });
        // Planks
        var plankId = "".concat(tier, "_PLANKS").concat(enchSuffix);
        exports.ITEMS.push({ id: plankId, name: "T\u00E1bua ".concat(tier, ".").concat(ench), category: 'Recursos Refinados', tier: tier, enchantment: ench });
        // Leather
        var leatherId = "".concat(tier, "_LEATHER").concat(enchSuffix);
        exports.ITEMS.push({ id: leatherId, name: "Couro ".concat(tier, ".").concat(ench), category: 'Recursos Refinados', tier: tier, enchantment: ench });
        var itemEnchSuffix = ench === '0' ? '' : "@".concat(ench);
        // Robes
        ROBE_TYPES.forEach(function (robe) {
            var robeId = "".concat(tier, "_ARMOR_CLOTH_").concat(robe.id).concat(itemEnchSuffix);
            var robeName = "".concat(robe.name, " ").concat(tier, ".").concat(ench);
            exports.ITEMS.push({ id: robeId, name: robeName, category: 'Armadura de Tecido', tier: tier, enchantment: ench });
            var materials = [{ itemId: clothId, amount: 16 }];
            if (robe.artifact) {
                materials.push({ itemId: "".concat(tier, "_ARTIFACT_ARMOR_CLOTH_").concat(robe.artifact), amount: 1 });
            }
            exports.RECIPES.push({
                itemId: robeId,
                materials: materials,
                fame: TIER_FAME[tier],
                journalId: "".concat(tier, "_JOURNAL_MAGIC_EMPTY"),
                baseFocusCost: TIER_FOCUS[tier],
            });
        });
        // Cloth Cowls
        CLOTH_COWL_TYPES.forEach(function (cowl) {
            var cowlId = "".concat(tier, "_HEAD_CLOTH_").concat(cowl.id).concat(itemEnchSuffix);
            var cowlName = "".concat(cowl.name, " ").concat(tier, ".").concat(ench);
            exports.ITEMS.push({ id: cowlId, name: cowlName, category: 'Capuzes de Tecido', tier: tier, enchantment: ench });
            var materials = [{ itemId: clothId, amount: 8 }];
            if (cowl.artifact) {
                materials.push({ itemId: "".concat(tier, "_ARTIFACT_HEAD_CLOTH_").concat(cowl.artifact), amount: 1 });
            }
            exports.RECIPES.push({
                itemId: cowlId,
                materials: materials,
                fame: TIER_FAME[tier] / 2,
                journalId: "".concat(tier, "_JOURNAL_MAGIC_EMPTY"),
                baseFocusCost: TIER_FOCUS[tier] / 2,
            });
        });
        // Leather Jackets
        LEATHER_JACKET_TYPES.forEach(function (jacket) {
            var jacketId = "".concat(tier, "_ARMOR_LEATHER_").concat(jacket.id).concat(itemEnchSuffix);
            var jacketName = "".concat(jacket.name, " ").concat(tier, ".").concat(ench);
            exports.ITEMS.push({ id: jacketId, name: jacketName, category: 'Casacos de Couro', tier: tier, enchantment: ench });
            var materials = [{ itemId: leatherId, amount: 16 }];
            if (jacket.artifact) {
                materials.push({ itemId: "".concat(tier, "_ARTIFACT_ARMOR_LEATHER_").concat(jacket.artifact), amount: 1 });
            }
            exports.RECIPES.push({
                itemId: jacketId,
                materials: materials,
                fame: TIER_FAME[tier],
                journalId: "".concat(tier, "_JOURNAL_HUNTER_EMPTY"),
                baseFocusCost: TIER_FOCUS[tier],
            });
        });
        // Leather Hoods
        LEATHER_HOOD_TYPES.forEach(function (hood) {
            var hoodId = "".concat(tier, "_HEAD_LEATHER_").concat(hood.id).concat(itemEnchSuffix);
            var hoodName = "".concat(hood.name, " ").concat(tier, ".").concat(ench);
            exports.ITEMS.push({ id: hoodId, name: hoodName, category: 'Capuzes de Couro', tier: tier, enchantment: ench });
            var materials = [{ itemId: leatherId, amount: 8 }];
            if (hood.artifact) {
                materials.push({ itemId: "".concat(tier, "_ARTIFACT_HEAD_LEATHER_").concat(hood.artifact), amount: 1 });
            }
            exports.RECIPES.push({
                itemId: hoodId,
                materials: materials,
                fame: TIER_FAME[tier] / 2,
                journalId: "".concat(tier, "_JOURNAL_HUNTER_EMPTY"),
                baseFocusCost: TIER_FOCUS[tier] / 2,
            });
        });
        // Plate Armors
        PLATE_ARMOR_TYPES.forEach(function (armor) {
            var armorId = "".concat(tier, "_ARMOR_PLATE_").concat(armor.id).concat(itemEnchSuffix);
            var armorName = "".concat(armor.name, " ").concat(tier, ".").concat(ench);
            exports.ITEMS.push({ id: armorId, name: armorName, category: 'Armaduras de Placas', tier: tier, enchantment: ench });
            var materials = [{ itemId: barId, amount: 16 }];
            if (armor.artifact) {
                materials.push({ itemId: "".concat(tier, "_ARTIFACT_ARMOR_PLATE_").concat(armor.artifact), amount: 1 });
            }
            exports.RECIPES.push({
                itemId: armorId,
                materials: materials,
                fame: TIER_FAME[tier],
                journalId: "".concat(tier, "_JOURNAL_WARRIOR_EMPTY"),
                baseFocusCost: TIER_FOCUS[tier],
            });
        });
        // Plate Helmets
        PLATE_HELMET_TYPES.forEach(function (helmet) {
            var helmetId = "".concat(tier, "_HEAD_PLATE_").concat(helmet.id).concat(itemEnchSuffix);
            var helmetName = "".concat(helmet.name, " ").concat(tier, ".").concat(ench);
            exports.ITEMS.push({ id: helmetId, name: helmetName, category: 'Elmos de Placa', tier: tier, enchantment: ench });
            var materials = [{ itemId: barId, amount: 8 }];
            if (helmet.artifact) {
                materials.push({ itemId: "".concat(tier, "_ARTIFACT_HEAD_PLATE_").concat(helmet.artifact), amount: 1 });
            }
            exports.RECIPES.push({
                itemId: helmetId,
                materials: materials,
                fame: TIER_FAME[tier] / 2,
                journalId: "".concat(tier, "_JOURNAL_WARRIOR_EMPTY"),
                baseFocusCost: TIER_FOCUS[tier] / 2,
            });
        });
        // Plate Shoes
        PLATE_SHOE_TYPES.forEach(function (shoe) {
            var shoeId = "".concat(tier, "_SHOES_PLATE_").concat(shoe.id).concat(itemEnchSuffix);
            var shoeName = "".concat(shoe.name, " ").concat(tier, ".").concat(ench);
            exports.ITEMS.push({ id: shoeId, name: shoeName, category: 'Sapatos de Placa', tier: tier, enchantment: ench });
            var materials = [{ itemId: barId, amount: 8 }];
            if (shoe.artifact) {
                materials.push({ itemId: "".concat(tier, "_ARTIFACT_SHOES_PLATE_").concat(shoe.artifact), amount: 1 });
            }
            exports.RECIPES.push({
                itemId: shoeId,
                materials: materials,
                fame: TIER_FAME[tier] / 2, // Shoes are 1/2 fame of armor
                journalId: "".concat(tier, "_JOURNAL_WARRIOR_EMPTY"),
                baseFocusCost: TIER_FOCUS[tier] / 2, // Shoes are 1/2 focus of armor
            });
        });
        // Spears
        SPEAR_TYPES.forEach(function (spear) {
            var spearId = "".concat(tier, "_").concat(spear.id).concat(itemEnchSuffix);
            var spearName = "".concat(spear.name, " ").concat(tier, ".").concat(ench);
            exports.ITEMS.push({ id: spearId, name: spearName, category: 'Lanças', tier: tier, enchantment: ench });
            var materials = [
                { itemId: plankId, amount: spear.resources.planks },
                { itemId: barId, amount: spear.resources.bars }
            ];
            if (spear.artifact) {
                materials.push({ itemId: "".concat(tier, "_ARTIFACT_").concat(spear.artifact), amount: 1 });
            }
            var totalResources = spear.resources.planks + spear.resources.bars;
            var resourceMultiplier = totalResources / 16;
            exports.RECIPES.push({
                itemId: spearId,
                materials: materials,
                fame: TIER_FAME[tier] * resourceMultiplier,
                journalId: "".concat(tier, "_JOURNAL_HUNTER_EMPTY"),
                baseFocusCost: TIER_FOCUS[tier] * resourceMultiplier,
            });
        });
        // Swords
        SWORD_TYPES.forEach(function (sword) {
            var swordId = "".concat(tier, "_").concat(sword.id).concat(itemEnchSuffix);
            var swordName = "".concat(sword.name, " ").concat(tier, ".").concat(ench);
            exports.ITEMS.push({ id: swordId, name: swordName, category: 'Espadas', tier: tier, enchantment: ench });
            var materials = [
                { itemId: plankId, amount: sword.resources.planks },
                { itemId: barId, amount: sword.resources.bars }
            ];
            if (sword.artifact) {
                materials.push({ itemId: "".concat(tier, "_ARTIFACT_").concat(sword.artifact), amount: 1 });
            }
            var totalResources = sword.resources.planks + sword.resources.bars;
            var resourceMultiplier = totalResources / 16;
            exports.RECIPES.push({
                itemId: swordId,
                materials: materials,
                fame: TIER_FAME[tier] * resourceMultiplier,
                journalId: "".concat(tier, "_JOURNAL_WARRIOR_EMPTY"),
                baseFocusCost: TIER_FOCUS[tier] * resourceMultiplier,
            });
        });
        // Bows
        BOW_TYPES.forEach(function (bow) {
            var bowId = "".concat(tier, "_").concat(bow.id).concat(itemEnchSuffix);
            var bowName = "".concat(bow.name, " ").concat(tier, ".").concat(ench);
            exports.ITEMS.push({ id: bowId, name: bowName, category: 'Arcos', tier: tier, enchantment: ench });
            var materials = [
                { itemId: plankId, amount: bow.resources.planks }
            ];
            if (bow.artifact) {
                materials.push({ itemId: "".concat(tier, "_ARTIFACT_").concat(bow.artifact), amount: 1 });
            }
            var totalResources = bow.resources.planks + bow.resources.bars;
            var resourceMultiplier = totalResources / 16;
            exports.RECIPES.push({
                itemId: bowId,
                materials: materials,
                fame: TIER_FAME[tier] * resourceMultiplier,
                journalId: "".concat(tier, "_JOURNAL_HUNTER_EMPTY"),
                baseFocusCost: TIER_FOCUS[tier] * resourceMultiplier,
            });
        });
        // Daggers
        DAGGER_TYPES.forEach(function (dagger) {
            var daggerId = "".concat(tier, "_").concat(dagger.id).concat(itemEnchSuffix);
            var daggerName = "".concat(dagger.name, " ").concat(tier, ".").concat(ench);
            exports.ITEMS.push({ id: daggerId, name: daggerName, category: 'Adagas', tier: tier, enchantment: ench });
            var materials = [
                { itemId: leatherId, amount: dagger.resources.leather },
                { itemId: barId, amount: dagger.resources.bars }
            ];
            if (dagger.artifact) {
                materials.push({ itemId: "".concat(tier, "_ARTIFACT_").concat(dagger.artifact), amount: 1 });
            }
            var totalResources = dagger.resources.leather + dagger.resources.bars;
            var resourceMultiplier = totalResources / 16;
            exports.RECIPES.push({
                itemId: daggerId,
                materials: materials,
                fame: TIER_FAME[tier] * resourceMultiplier,
                journalId: "".concat(tier, "_JOURNAL_HUNTER_EMPTY"),
                baseFocusCost: TIER_FOCUS[tier] * resourceMultiplier,
            });
        });
    });
});
exports.SPEC_NODES = [
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
];
