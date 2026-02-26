import React from 'react';
import { useAppContext } from '../context/AppContext';
import { ITEMS, RECIPES } from '../constants';
import { Trash2, TrendingUp, TrendingDown, Clock, Zap, Percent, RefreshCw, Info } from 'lucide-react';
import { CraftConfig } from '../types';

export const Dashboard: React.FC = () => {
  const { state, removeFavorite, syncPrices, isSyncing, syncMessage } = useAppContext();

  const handleSyncAllFavorites = () => {
    const itemIdsToSync = new Set<string>();
    state.favorites.forEach(fav => {
      const recipe = RECIPES.find(r => r.itemId === fav.itemId);
      if (recipe) {
        itemIdsToSync.add(recipe.itemId);
        recipe.materials.forEach(m => itemIdsToSync.add(m.itemId));
        if (recipe.journalId) {
          itemIdsToSync.add(recipe.journalId);
          itemIdsToSync.add(recipe.journalId.replace('_EMPTY', '_FULL'));
        }
      }
    });
    syncPrices(Array.from(itemIdsToSync));
  };

  const calculateFavoriteProfit = (fav: CraftConfig) => {
    const recipe = RECIPES.find(r => r.itemId === fav.itemId);
    const item = ITEMS.find(i => i.id === fav.itemId);
    
    if (!recipe || !item) return null;

    // Handle old favorites that might not have configSnapshot yet
    const config = fav.configSnapshot || {
      rrr: (fav as any).rrr || 0,
      useFocus: (fav as any).useFocus || false,
      usageFee: (fav as any).usageFee || 0,
      focusCost: (fav as any).focusCost || 0,
      prices: {}
    };

    const { rrr, useFocus, usageFee, prices } = config;
    const currentRrr = rrr / 100;
    
    let totalMaterialCost = 0;
    recipe.materials.forEach(mat => {
      // Use current state prices for real-time tracking, fallback to snapshot if 0
      const currentPrice = state.prices[mat.itemId]?.buy;
      const price = currentPrice > 0 ? currentPrice : (prices[mat.itemId]?.buy || 0);
      const effectiveAmount = mat.amount * (1 - currentRrr);
      totalMaterialCost += effectiveAmount * price;
    });

    const feeCost = usageFee;
    
    let journalProfit = 0;
    if (recipe.journalId) {
      const currentEmptyPrice = state.prices[recipe.journalId]?.buy;
      const emptyPrice = currentEmptyPrice > 0 ? currentEmptyPrice : (prices[recipe.journalId]?.buy || 0);
      
      const fullId = recipe.journalId.replace('_EMPTY', '_FULL');
      const currentFullPrice = state.prices[fullId]?.sell;
      const fullPrice = currentFullPrice > 0 ? currentFullPrice : (prices[fullId]?.sell || 0);
      
      const journalCapacity = recipe.fame * 10;
      const journalsFilled = recipe.fame / journalCapacity;
      journalProfit = journalsFilled * (fullPrice - emptyPrice);
    }

    const currentItemSellPrice = state.prices[item.id]?.sell;
    const itemSellPrice = currentItemSellPrice > 0 ? currentItemSellPrice : (prices[item.id]?.sell || 0);
    const grossRevenue = itemSellPrice;
    const taxCost = grossRevenue * 0.065; // 6.5% tax
    const netRevenue = grossRevenue - taxCost;
    
    const totalCost = totalMaterialCost + feeCost;
    const netProfit = netRevenue - totalCost + journalProfit;
    const roi = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;
    const focusCost = config.focusCost || 0;
    const silverPerFocus = useFocus && focusCost > 0 ? netProfit / focusCost : 0;

    return {
      item,
      rrr,
      useFocus,
      netProfit,
      revenue: netRevenue,
      cost: totalCost,
      roi,
      focusCost,
      silverPerFocus,
      timestamp: fav.timestamp || Date.now()
    };
  };

  return (
    <div className="space-y-6 relative">
      {/* Sync Toast Notification */}
      {syncMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-zinc-900 border border-amber-500/50 text-amber-100 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          {isSyncing ? (
            <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />
          ) : (
            <Info className="w-5 h-5 text-amber-400" />
          )}
          <span className="font-medium">{syncMessage}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Visão do Diretor</h2>
          <p className="text-zinc-400 mt-1">Acompanhe a rentabilidade dos seus crafts favoritos em tempo real.</p>
        </div>
        {state.favorites.length > 0 && (
          <button 
            onClick={handleSyncAllFavorites}
            disabled={isSyncing}
            className="w-full sm:w-auto bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-zinc-950 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20"
          >
            <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
            Sincronizar Preços
          </button>
        )}
      </div>

      {state.favorites.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center flex flex-col items-center justify-center">
          <Clock className="w-12 h-12 text-zinc-600 mb-4" />
          <h3 className="text-lg font-semibold text-zinc-300 mb-2">Nenhum craft favoritado</h3>
          <p className="text-zinc-500 max-w-sm">Vá até a aba Calculadora, configure um craft lucrativo e clique em Favoritar para acompanhá-lo aqui.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.favorites.map(fav => {
            const calc = calculateFavoriteProfit(fav);
            if (!calc) return null;

            const isProfitable = calc.netProfit > 0;
            const margin = calc.roi;
            
            let statusColor = 'bg-zinc-800 text-zinc-400';
            if (margin > 20) statusColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
            else if (margin > 0) statusColor = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
            else statusColor = 'bg-red-500/20 text-red-400 border-red-500/30';

            return (
              <div key={fav.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm relative group overflow-hidden">
                <div className={`absolute top-0 left-0 w-1 h-full ${margin > 20 ? 'bg-emerald-500' : margin > 0 ? 'bg-amber-500' : 'bg-red-500'}`} />
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-zinc-100">{calc.item.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-zinc-500 flex items-center gap-1">
                        <Percent className="w-3 h-3" /> {calc.rrr}% RRR
                      </span>
                      {calc.useFocus && (
                        <span className="text-xs text-amber-500 flex items-center gap-1">
                          <Zap className="w-3 h-3" /> Foco
                        </span>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFavorite(fav.id)}
                    className="text-zinc-600 hover:text-red-400 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-xs text-zinc-500 uppercase font-semibold tracking-wider block mb-1">Lucro Líquido</span>
                      <div className="flex items-center gap-2">
                        {isProfitable ? <TrendingUp className="w-5 h-5 text-emerald-500" /> : <TrendingDown className="w-5 h-5 text-red-500" />}
                        <span className={`text-2xl font-mono font-bold ${isProfitable ? 'text-emerald-400' : 'text-red-400'}`}>
                          {Math.round(calc.netProfit).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-bold border ${statusColor}`}>
                      {margin.toFixed(1)}% ROI
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-4 border-t border-zinc-800/50">
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase font-semibold tracking-wider block">Custo</span>
                      <span className="text-sm font-mono text-zinc-300">{Math.round(calc.cost).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase font-semibold tracking-wider block">Receita</span>
                      <span className="text-sm font-mono text-zinc-300">{Math.round(calc.revenue).toLocaleString()}</span>
                    </div>
                    {calc.useFocus && calc.silverPerFocus > 0 && (
                      <div className="col-span-2 mt-1">
                        <span className="text-[10px] text-zinc-500 uppercase font-semibold tracking-wider block">Prata / Foco</span>
                        <span className="text-sm font-mono text-amber-400">{calc.silverPerFocus.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-[10px] text-zinc-600 text-right mt-2">
                    Salvo em: {new Date(calc.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
