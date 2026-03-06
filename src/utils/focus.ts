import { Item, Recipe } from '../types';
import { SPEC_NODES } from '../constants';

export const calculateFocusCost = (recipe: Recipe, item: Item, specs: Record<string, number>): number => {
  let baseNodeId = 'baseClothArmor';
  let specNodeId = '';

  if (item.category === 'Sapatos de Placa') {
    baseNodeId = 'basePlateShoes';
    specNodeId = 'PLATE_' + (item.id.split('_').pop()?.split('@')[0] || '');
  } else if (item.category === 'Lanças') {
    baseNodeId = 'baseSpear';
    specNodeId = item.id.replace(/^T\d_/, '').split('@')[0];
  } else if (item.category === 'Espadas') {
    baseNodeId = 'baseSword';
    specNodeId = item.id.replace(/^T\d_/, '').split('@')[0];
  } else if (item.category === 'Arcos') {
    baseNodeId = 'baseBow';
    specNodeId = item.id.replace(/^T\d_/, '').split('@')[0];
  } else if (item.category === 'Adagas') {
    baseNodeId = 'baseDagger';
    specNodeId = item.id.replace(/^T\d_/, '').split('@')[0];
  } else {
    // Default to Cloth Armor
    specNodeId = item.id.split('_').pop()?.split('@')[0] || '';
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
