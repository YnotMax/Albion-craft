import { Item, Recipe } from '../types';
import { SPEC_NODES } from '../constants';

export const calculateFocusCost = (recipe: Recipe, item: Item, specs: Record<string, number>): number => {
  const categoryBaseNodeMap: Record<string, string> = {
    'Armadura de Tecido': 'baseClothArmor',
    'Sandálias de Tecido': 'baseClothShoes',
    'Capuzes de Tecido': 'baseClothCowl', // Assuming this might be added later, fallback uses basic split
    'Casacos de Couro': 'baseLeatherJacket',
    'Sapatos de Couro': 'baseLeatherShoes',
    'Capuzes de Couro': 'baseLeatherHood',
    'Armaduras de Placas': 'basePlateArmor',
    'Sapatos de Placa': 'basePlateShoes',
    'Elmos de Placa': 'basePlateHelmet',
    'Lanças': 'baseSpear',
    'Espadas': 'baseSword',
    'Arcos': 'baseBow',
    'Adagas': 'baseDagger',
    'Machados': 'baseAxe',
    'Maças': 'baseMace',
    'Martelos': 'baseHammer',
    'Bordões': 'baseQuarterstaff',
    'Bestas': 'baseCrossbow',
    'Cajados de Fogo': 'baseFireStaff',
    'Cajados Sagrados': 'baseHolyStaff',
    'Cajados da Natureza': 'baseNatureStaff',
    'Cajados de Gelo': 'baseFrostStaff',
    'Cajados Amaldiçoados': 'baseCursedStaff',
    'Escudos': 'baseShield',
  };

  const baseNodeId = categoryBaseNodeMap[item.category] || 'baseClothArmor';

  // Extract specific node ID. Example: 'T4_MAIN_SPEAR' -> 'MAIN_SPEAR', or 'T4_SHOES_PLATE_SET1' -> 'PLATE_SET1'
  let specNodeId = item.id.replace(/^T\d_/, '').split('@')[0];

  // Special exception for Plate Shoes as initially defined:
  if (item.category === 'Sapatos de Placa' && focusCostPlateException(specNodeId)) {
    specNodeId = 'PLATE_' + (item.id.split('_').pop()?.split('@')[0] || '');
  }

  function focusCostPlateException(id: string) {
    if (id.includes("SHOES_PLATE")) return true;
    return false;
  }

  const baseLevel = specs[baseNodeId] || 0;

  // Base node gives +30 to all items in the tree
  let totalFCE = baseLevel * 30;

  // Add bonuses from all specific nodes in the same tree
  SPEC_NODES.filter(n => n.baseNodeId === baseNodeId).forEach(node => {
    const level = specs[node.id] || 0;
    if (node.id === specNodeId) {
      // The specific node for the item being crafted gives +250
      totalFCE += level * 250;
    } else {
      // Other nodes give a cross-bonus (+30 for non-artifact, +15 for artifact)
      const crossBonus = node.isArtifact ? 15 : 30;
      totalFCE += level * crossBonus;
    }
  });

  // Focus cost halves every 10,000 FCE
  const cost = recipe.baseFocusCost * Math.pow(0.5, totalFCE / 10000);

  return Math.round(cost);
};
