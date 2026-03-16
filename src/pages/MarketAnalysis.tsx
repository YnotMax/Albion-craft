import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { ITEMS, RECIPES } from '../constants';
import { CurrencyInput } from '../components/CurrencyInput';
import { MarketSelector } from '../components/MarketSelector';
import { TrendingUp, TrendingDown, RefreshCw, Book, Info, AlertCircle, ShoppingCart, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';
import { calculateFocusCost } from '../utils/focus';
import { calculateJournalsFilled } from '../utils/journal';

export const MarketAnalysis: React.FC = () => {
  const { state, updatePrice, syncPrices, isSyncing, syncMessage, setBuyCity, setSellCity } = useAppContext();

  // Filter Logic
  const categories = useMemo(() => {
    const cats = Array.from(new Set(RECIPES.map(r => ITEMS.find(i => i.id === r.itemId)?.category).filter(Boolean))) as string[];
    return cats.sort((a, b) => a.localeCompare(b));
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0] || '');

  const availableTiers = useMemo(() => {
    if (!selectedCategory) return [];
    return Array.from(new Set(RECIPES.filter(r => ITEMS.find(i => i.id === r.itemId)?.category === selectedCategory).map(r => ITEMS.find(i => i.id === r.itemId)?.tier).filter(Boolean))).sort() as string[];
  }, [selectedCategory]);

  const [selectedTier, setSelectedTier] = useState<string>(availableTiers[0] || '');

  const availableEnchantments = useMemo(() => {
    if (!selectedCategory || !selectedTier) return [];
    return Array.from(new Set(RECIPES.filter(r => {
      const item = ITEMS.find(i => i.id === r.itemId);
      return item?.category === selectedCategory && item?.tier === selectedTier;
    }).map(r => ITEMS.find(i => i.id === r.itemId)?.enchantment).filter(Boolean))).sort() as string[];
  }, [selectedCategory, selectedTier]);

  const [selectedEnchantment, setSelectedEnchantment] = useState<string>(availableEnchantments[0] || '');

  // Usage Config
  const [usageFee, setUsageFee] = useState<number>(500);
  const [rrr, setRrr] = useState<number>(15.2);
  const [useFocus, setUseFocus] = useState<boolean>(false);

  // Sorting
  const [sortBy, setSortBy] = useState<'profit' | 'roi' | 'name'>('profit');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Sync Logic
  const handleSync = async () => {
    const recipes = RECIPES.filter(r => {
      const item = ITEMS.find(i => i.id === r.itemId);
      return item?.category === selectedCategory && item?.tier === selectedTier && item?.enchantment === selectedEnchantment;
    });
    
    const itemIds = new Set<string>();
    recipes.forEach(r => {
      itemIds.add(r.itemId);
      r.materials.forEach(m => itemIds.add(m.itemId));
      if (r.journalId) {
        itemIds.add(r.journalId.replace('_EMPTY', '_FULL'));
        itemIds.add(r.journalId);
      }
    });

    await syncPrices(Array.from(itemIds));
  };

  // Calculations
  const analysisData = useMemo(() => {
    const itemsInTier = RECIPES.filter(r => {
      const item = ITEMS.find(i => i.id === r.itemId);
      return item?.category === selectedCategory && item?.tier === selectedTier && item?.enchantment === selectedEnchantment;
    });

    const results = itemsInTier.map(recipe => {
      const item = ITEMS.find(i => i.id === recipe.itemId)!;
      const prices = state.prices[item.id] || { buy: 0, sell: 0 };
      
      const materials = recipe.materials.filter(m => !m.itemId.includes('ARTIFACT'));
      const artifact = recipe.materials.find(m => m.itemId.includes('ARTIFACT'));
      
      let baseMaterialCost = 0;
      materials.forEach(mat => {
        const matPrice = state.prices[mat.itemId]?.buy || 0;
        baseMaterialCost += (matPrice * mat.amount);
      });

      const artifactPrice = artifact ? (state.prices[artifact.itemId]?.buy || 0) : 0;
      const initialMaterialCost = baseMaterialCost + artifactPrice;

      // Calculate RRR material savings (artifact is NOT returned)
      const materialCostAfterRRR = (baseMaterialCost * (1 - rrr / 100)) + artifactPrice;
      
      const totalMaterials = materials.reduce((sum, m) => sum + m.amount, 0);
      const feeCost = (totalMaterials / 10) * 0.11 * usageFee;
      
      // Journal Profit
      let journalProfit = 0;
      if (recipe.journalId) {
        const fullId = recipe.journalId.replace('_EMPTY', '_FULL');
        const emptyPrice = state.prices[recipe.journalId]?.buy || 0;
        const fullPrice = state.prices[fullId]?.sell || 0;
        const profitPerJournal = fullPrice - emptyPrice;
        
        const journalsFilled = calculateJournalsFilled(recipe, item);
        journalProfit = journalsFilled * profitPerJournal;
      }

      const totalCost = materialCostAfterRRR + feeCost;
      const netSale = prices.sell * (1 - 0.065);
      const profit = netSale - totalCost + journalProfit;
      const roi = totalCost > 0 ? (profit / totalCost) * 100 : 0;

      return {
        ...recipe,
        item,
        totalCost,
        netSale,
        profit,
        roi,
        prices,
        journalProfit
      };
    });

    return results.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'profit') comparison = a.profit - b.profit;
      else if (sortBy === 'roi') comparison = a.roi - b.roi;
      else comparison = a.item.name.localeCompare(b.item.name);
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [selectedCategory, selectedTier, selectedEnchantment, state.prices, rrr, useFocus, usageFee, sortBy, sortOrder]);

  const uniqueMaterials = useMemo(() => {
    const matIds = new Set<string>();
    analysisData.forEach(res => {
      res.materials.forEach(m => {
        if (!m.itemId.includes('ARTIFACT')) matIds.add(m.itemId);
      });
    });
    return Array.from(matIds);
  }, [analysisData]);

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar: Filters & Global Info */}
        <aside className="w-full lg:w-80 space-y-6 shrink-0">
          <div className="bg-surface-container-low rounded-2xl border border-outline-variant/10 p-5 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-2 mb-4">
              <ShoppingCart className="w-4 h-4 text-primary" />
              Seleção de Tier
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-on-surface-variant/70 ml-1">Categoria</label>
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-surface-container-high border border-outline-variant/20 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 ring-primary"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="flex gap-4">
                <div className="flex-1 space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-on-surface-variant/70 ml-1">Tier</label>
                  <select 
                    value={selectedTier}
                    onChange={(e) => setSelectedTier(e.target.value)}
                    className="w-full bg-surface-container-high border border-outline-variant/20 rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:ring-1 ring-primary"
                  >
                    {availableTiers.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="flex-1 space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-on-surface-variant/70 ml-1">Encant.</label>
                  <select 
                    value={selectedEnchantment}
                    onChange={(e) => setSelectedEnchantment(e.target.value)}
                    className="w-full bg-surface-container-high border border-outline-variant/20 rounded-xl px-4 py-2 text-sm font-bold text-primary focus:outline-none focus:ring-1 ring-primary"
                  >
                    {availableEnchantments.map(e => <option key={e} value={e}>.{e}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low rounded-2xl border border-outline-variant/10 p-5 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-2 mb-4">
              <Info className="w-4 h-4 text-primary" />
              Configuração Global
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-on-surface-variant">Tipo de Análise</span>
                <span className="font-bold text-primary">Por Tier</span>
              </div>
              
              <MarketSelector 
                label="Compra de Materiais"
                value={state.buyCity}
                onChange={setBuyCity}
              />

              <MarketSelector 
                label="Venda do Item"
                value={state.sellCity}
                onChange={setSellCity}
              />

              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] font-bold text-on-surface-variant/70 uppercase ml-1">% Retorno (RRR)</label>
                  <span className="text-xs font-bold text-primary">{rrr}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="50" 
                  step="0.1"
                  value={rrr}
                  onChange={(e) => setRrr(Number(e.target.value))}
                  className="w-full accent-primary h-1.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-on-surface-variant font-medium pt-1 px-1">
                  <span>0%</span>
                  <span>15.2% (Cidade)</span>
                  <span>47% (Foco)</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Section */}
        <main className="flex-1 min-w-0 space-y-6">
          
          {/* Prices for Materials in this Tier */}
          <div className="bg-surface-container-low rounded-2xl border border-outline-variant/10 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-on-surface-variant">Materiais de Base ({selectedTier}.{selectedEnchantment})</h3>
              <button 
                onClick={handleSync}
                disabled={isSyncing}
                className="flex items-center gap-2 px-4 py-1.5 bg-secondary text-on-secondary rounded-lg text-xs font-bold hover:opacity-90 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Buscando...' : 'Sincronizar API'}
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {uniqueMaterials.map(matId => {
                const item = ITEMS.find(i => i.id === matId);
                const price = state.prices[matId]?.buy || 0;
                return (
                  <div key={matId} className="space-y-1">
                    <label className="text-[10px] font-bold text-on-surface-variant/60 uppercase truncate block">
                      {item ? item.name.replace(` ${selectedTier}.${selectedEnchantment}`, '') : matId}
                    </label>
                    <CurrencyInput 
                      value={price}
                      onChange={(val) => updatePrice(matId, val, state.prices[matId]?.sell || 0)}
                      className="text-xs"
                    />
                  </div>
                );
              })}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-on-surface-variant/60 uppercase block">Taxa Nutrição</label>
                <CurrencyInput 
                  value={usageFee}
                  onChange={setUsageFee}
                  className="text-xs"
                />
              </div>
            </div>
            {syncMessage && (
              <div className="mt-4 p-2 bg-primary/10 border border-primary/20 rounded-lg text-[10px] text-primary flex items-center gap-2">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {syncMessage}
              </div>
            )}
          </div>

          {/* Analysis Table */}
          <div className="bg-surface-container-low rounded-2xl border border-outline-variant/10 shadow-sm overflow-hidden">
             <div className="overflow-x-auto no-scrollbar">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-surface-container-high/50 border-b border-outline-variant/10">
                      <th className="p-4 text-[10px] font-black uppercase text-on-surface-variant/60 tracking-widest">
                        <button onClick={() => { setSortBy('name'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }} className="flex items-center gap-1 hover:text-primary transition-colors">
                          Item a Craftar {sortBy === 'name' && (sortOrder === 'asc' ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>)}
                        </button>
                      </th>
                      <th className="p-4 text-[10px] font-black uppercase text-on-surface-variant/60 tracking-widest min-w-[120px]">Artefato / Especial</th>
                      <th className="p-4 text-[10px] font-black uppercase text-on-surface-variant/60 tracking-widest min-w-[140px]">Preço Venda</th>
                      <th className="p-4 text-[10px] font-black uppercase text-on-surface-variant/60 tracking-widest">
                        <button onClick={() => { setSortBy('profit'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }} className="flex items-center gap-1 hover:text-primary transition-colors">
                          Lucro Estimado {sortBy === 'profit' && (sortOrder === 'asc' ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>)}
                        </button>
                      </th>
                      <th className="p-4 text-[10px] font-black uppercase text-on-surface-variant/60 tracking-widest">
                        <button onClick={() => { setSortBy('roi'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }} className="flex items-center gap-1 hover:text-primary transition-colors">
                          ROI % {sortBy === 'roi' && (sortOrder === 'asc' ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>)}
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {analysisData.map((res) => {
                      const artifactMat = res.materials.find(m => m.itemId.includes('ARTIFACT'));
                      const artifactItem = artifactMat ? ITEMS.find(i => i.id === artifactMat.itemId) : null;
                      const artifactPrice = artifactMat ? (state.prices[artifactMat.itemId]?.buy || 0) : 0;

                      return (
                        <tr key={res.itemId} className={`hover:bg-surface-container-high/30 transition-colors ${res.profit < 0 ? 'bg-error/5' : ''}`}>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img 
                                src={`https://render.albiononline.com/v1/item/${res.item.id}.png`} 
                                className="w-10 h-10 rounded border border-outline-variant/10 bg-surface-container" 
                                alt={res.item.name} 
                              />
                              <div>
                                <div className="text-sm font-bold text-on-surface">{res.item.name}</div>
                                <div className="text-[9px] text-on-surface-variant font-medium">Recursos: {res.materials.filter(m => !m.itemId.includes('ARTIFACT')).map(m => m.amount).join(' + ')} un.</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            {artifactMat ? (
                              <div className="space-y-1">
                                <label className="text-[9px] text-on-surface-variant uppercase font-bold truncate block">{artifactItem?.name.split(' ').slice(2).join(' ') || 'Artefato'}</label>
                                <CurrencyInput 
                                  value={artifactPrice}
                                  onChange={(val) => updatePrice(artifactMat.itemId, val, state.prices[artifactMat.itemId]?.sell || 0)}
                                  className="text-[11px] h-7"
                                />
                              </div>
                            ) : (
                              <span className="text-[10px] text-on-surface-variant opacity-40 uppercase tracking-widest font-black italic">Comum</span>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              <label className="text-[9px] text-on-surface-variant uppercase font-bold block">Preço Final</label>
                              <CurrencyInput 
                                value={res.prices.sell}
                                onChange={(val) => updatePrice(res.item.id, state.prices[res.item.id]?.buy || 0, val)}
                                className="text-[11px] h-7"
                              />
                            </div>
                          </td>
                          <td className="p-4 text-right">
                             <div className={`text-sm font-bold ${res.profit > 0 ? 'text-green-500' : 'text-error'}`}>
                               {res.profit > 0 ? '+' : ''}{Math.round(res.profit).toLocaleString()}
                             </div>
                             <div className="text-[9px] text-on-surface-variant opacity-70">Custo: {Math.round(res.totalCost).toLocaleString()}</div>
                             {res.journalProfit > 0 && (
                               <div className="text-[8px] text-secondary font-bold">+ Diários: {Math.round(res.journalProfit).toLocaleString()}</div>
                             )}
                          </td>
                          <td className="p-4">
                             <div className={`text-xs font-black inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${
                               res.roi > 20 ? 'bg-green-500/20 text-green-500' : 
                               res.roi > 0 ? 'bg-primary/10 text-primary' : 
                               'bg-error/10 text-error'
                             }`}>
                                {res.roi > 0 ? <TrendingUp className="w-3 h-3"/> : <TrendingDown className="w-3 h-3"/>}
                                {res.roi.toFixed(1)}%
                             </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
             </div>
          </div>
        </main>
      </div>
    </div>
  );
};
