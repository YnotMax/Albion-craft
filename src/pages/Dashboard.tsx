import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { ITEMS, RECIPES } from '../constants';
import { Trash2, TrendingUp, TrendingDown, Clock, Zap, Percent, RefreshCw, Info, Folder, Plus, X, BarChart3, ArrowUpDown } from 'lucide-react';
import { CraftConfig } from '../types';

import { calculateFocusCost } from '../utils/focus';

export const Dashboard: React.FC = () => {
  const { state, removeFavorite, syncPrices, isSyncing, syncMessage, addGroup, removeGroup, updateFavoriteGroup } = useAppContext();
  const [activeGroup, setActiveGroup] = useState<string>(state.groups[0] || 'Geral');
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [sortBy, setSortBy] = useState<'profit' | 'roi' | 'recent'>('profit');

  const handleAddGroup = () => {
    if (newGroupName.trim()) {
      addGroup(newGroupName.trim());
      setActiveGroup(newGroupName.trim());
      setNewGroupName('');
      setIsAddingGroup(false);
    }
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
      quantity: (fav as any).quantity || 1,
      prices: {}
    };

    const { rrr, useFocus, usageFee, prices, quantity = 1 } = config;
    const currentRrr = rrr / 100;

    let totalMaterialCost = 0;
    recipe.materials.forEach(mat => {
      const currentPrice = state.prices[mat.itemId]?.buy;
      const price = currentPrice > 0 ? currentPrice : (prices[mat.itemId]?.buy || 0);
      const effectiveAmount = mat.amount * quantity * (1 - currentRrr);
      totalMaterialCost += effectiveAmount * price;
    });

    const feeCost = usageFee * quantity;

    let journalProfit = 0;
    if (recipe.journalId) {
      const currentEmptyPrice = state.prices[recipe.journalId]?.buy;
      const emptyPrice = currentEmptyPrice > 0 ? currentEmptyPrice : (prices[recipe.journalId]?.buy || 0);

      const fullId = recipe.journalId.replace('_EMPTY', '_FULL');
      const currentFullPrice = state.prices[fullId]?.sell;
      const fullPrice = currentFullPrice > 0 ? currentFullPrice : (prices[fullId]?.sell || 0);

      const journalCapacity = recipe.fame * 10;
      const journalsFilled = (recipe.fame * quantity) / journalCapacity;
      journalProfit = journalsFilled * (fullPrice - emptyPrice);
    }

    const currentItemSellPrice = state.prices[item.id]?.sell;
    const itemSellPrice = currentItemSellPrice > 0 ? currentItemSellPrice : (prices[item.id]?.sell || 0);
    const grossRevenue = itemSellPrice * quantity;
    const taxCost = grossRevenue * 0.065; // 6.5% tax
    const netRevenue = grossRevenue - taxCost;

    const totalCost = totalMaterialCost + feeCost;
    const netProfit = netRevenue - totalCost + journalProfit;
    const roi = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;
    const unitFocusCost = calculateFocusCost(recipe, item, state.specs);
    const totalFocusCost = unitFocusCost * quantity;
    const silverPerFocus = useFocus && totalFocusCost > 0 ? netProfit / totalFocusCost : 0;

    return {
      id: fav.id,
      item,
      rrr,
      useFocus,
      netProfit,
      revenue: netRevenue,
      cost: totalCost,
      roi,
      focusCost: totalFocusCost,
      silverPerFocus,
      quantity,
      timestamp: fav.timestamp || Date.now(),
      group: fav.group || 'Geral'
    };
  };

  const filteredFavorites = useMemo(() => {
    const calcs = state.favorites
      .map(calculateFavoriteProfit)
      .filter((c): c is NonNullable<ReturnType<typeof calculateFavoriteProfit>> => c !== null)
      .filter(c => c.group === activeGroup);

    return calcs.sort((a, b) => {
      if (sortBy === 'profit') return b.netProfit - a.netProfit;
      if (sortBy === 'roi') return b.roi - a.roi;
      return b.timestamp - a.timestamp;
    });
  }, [state.favorites, activeGroup, sortBy, state.prices]);

  const groupStats = useMemo(() => {
    if (filteredFavorites.length === 0) return null;
    const totalProfit = filteredFavorites.reduce((sum, f) => sum + f.netProfit, 0);
    const avgRoi = filteredFavorites.reduce((sum, f) => sum + f.roi, 0) / filteredFavorites.length;
    const profitableCount = filteredFavorites.filter(f => f.netProfit > 0).length;

    // Find best items
    const bestProfitItem = [...filteredFavorites].sort((a, b) => b.netProfit - a.netProfit)[0];
    const bestRoiItem = [...filteredFavorites].sort((a, b) => b.roi - a.roi)[0];

    return { totalProfit, avgRoi, profitableCount, bestProfitItem, bestRoiItem };
  }, [filteredFavorites]);

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
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1">
            <button
              onClick={() => setSortBy('profit')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${sortBy === 'profit' ? 'bg-amber-500 text-zinc-950 shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Lucro
            </button>
            <button
              onClick={() => setSortBy('roi')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${sortBy === 'roi' ? 'bg-amber-500 text-zinc-950 shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              ROI
            </button>
            <button
              onClick={() => setSortBy('recent')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${sortBy === 'recent' ? 'bg-amber-500 text-zinc-950 shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Recentes
            </button>
          </div>
        </div>
      </div>

      {/* Group Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {state.groups.map(group => (
          <div key={group} className="relative group/tab">
            <button
              onClick={() => setActiveGroup(group)}
              className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all flex items-center gap-2 whitespace-nowrap ${activeGroup === group
                ? 'bg-amber-500/10 border-amber-500 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                }`}
            >
              <Folder className={`w-4 h-4 ${activeGroup === group ? 'text-amber-500' : 'text-zinc-600'}`} />
              {group}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeGroup === group ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 text-zinc-500'}`}>
                {state.favorites.filter(f => (f.group || 'Geral') === group).length}
              </span>
            </button>
            {group !== 'Geral' && (
              <button
                onClick={(e) => { e.stopPropagation(); removeGroup(group); if (activeGroup === group) setActiveGroup('Geral'); }}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover/tab:opacity-100 transition-opacity shadow-lg"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        ))}

        {isAddingGroup ? (
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-1.5">
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="bg-transparent border-none text-sm text-zinc-100 focus:outline-none w-24"
              placeholder="Nova pasta..."
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleAddGroup()}
            />
            <button onClick={handleAddGroup} className="text-emerald-500 hover:text-emerald-400"><Plus className="w-4 h-4" /></button>
            <button onClick={() => setIsAddingGroup(false)} className="text-red-500 hover:text-red-400"><X className="w-4 h-4" /></button>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingGroup(true)}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-amber-500 hover:border-amber-500/50 transition-all"
            title="Adicionar Pasta"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Summary Stats for Active Group */}
      {groupStats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block">Lucro Total Pasta</span>
              <span className="text-xl font-mono font-bold text-emerald-400">{Math.round(groupStats.totalProfit).toLocaleString()}</span>
            </div>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-lg">
              <BarChart3 className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block">ROI Médio</span>
              <span className="text-xl font-mono font-bold text-amber-400">{groupStats.avgRoi.toFixed(1)}%</span>
            </div>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Zap className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block">Itens Lucrativos</span>
              <span className="text-xl font-mono font-bold text-blue-400">{groupStats.profitableCount} / {filteredFavorites.length}</span>
            </div>
          </div>
        </div>
      )}

      {filteredFavorites.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center flex flex-col items-center justify-center">
          <Folder className="w-12 h-12 text-zinc-600 mb-4" />
          <h3 className="text-lg font-semibold text-zinc-300 mb-2">Nenhum craft nesta pasta</h3>
          <p className="text-zinc-500 max-w-sm">Vá até a aba Calculadora e salve novos itens selecionando a pasta "{activeGroup}".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFavorites.map(calc => {
            const isProfitable = calc.netProfit > 0;
            const margin = calc.roi;

            let statusColor = 'bg-zinc-800 text-zinc-400';
            if (margin > 20) statusColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
            else if (margin > 0) statusColor = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
            else statusColor = 'bg-red-500/20 text-red-400 border-red-500/30';

            let categoryAccent = 'bg-zinc-700';
            if (calc.item.category === 'Armadura de Tecido') categoryAccent = 'bg-emerald-500';
            else if (calc.item.category === 'Sapatos de Placa') categoryAccent = 'bg-blue-500';
            else if (calc.item.category === 'Lanças') categoryAccent = 'bg-amber-500';

            const isBestProfit = groupStats?.bestProfitItem?.id === calc.id && calc.netProfit > 0;
            const isBestRoi = groupStats?.bestRoiItem?.id === calc.id && calc.roi > 0;

            return (
              <div key={calc.id} className={`bg-zinc-900 border rounded-xl p-5 shadow-sm relative group overflow-hidden hover:border-zinc-700 transition-all ${isBestProfit || isBestRoi ? 'ring-1 ring-amber-500/30' : 'border-zinc-800'}`}>
                <div className={`absolute top-0 left-0 w-1 h-full ${categoryAccent}`} />

                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-zinc-100">
                        {calc.item.name}
                        <span className="text-zinc-500 ml-1 text-xs">({calc.quantity}x)</span>
                      </h3>
                      {isBestProfit && <span className="text-[9px] bg-emerald-500 text-zinc-950 px-1.5 py-0.5 rounded font-bold uppercase">Melhor Lucro</span>}
                      {isBestRoi && <span className="text-[9px] bg-amber-500 text-zinc-950 px-1.5 py-0.5 rounded font-bold uppercase">Melhor ROI</span>}
                    </div>
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
                  <div className="flex items-center gap-1">
                    <select
                      value={calc.group}
                      onChange={(e) => updateFavoriteGroup(calc.id, e.target.value)}
                      className="text-[10px] bg-zinc-800 border border-zinc-700 rounded px-1 py-0.5 text-zinc-400 focus:outline-none"
                    >
                      {state.groups.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                    <button
                      onClick={() => removeFavorite(calc.id)}
                      className="text-zinc-600 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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

                  <div className="text-[10px] text-zinc-600 text-right mt-2 flex justify-between items-center">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(calc.timestamp).toLocaleDateString()}</span>
                    <span>ID: {calc.id.split('-')[0]}</span>
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
