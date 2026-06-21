import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { ITEMS, RECIPES } from '../constants';
import { CurrencyInput } from '../components/CurrencyInput';
import { MarketSelector } from '../components/MarketSelector';
import { TrendingUp, TrendingDown, RefreshCw, Info, AlertCircle, ShoppingCart, ChevronDown, ChevronUp, Layers } from 'lucide-react';
import { formatTimeAgo } from '../utils/format';

export const CapeMarketAnalysis: React.FC = () => {
  const { state, updatePrice, syncPrices, isSyncing, syncMessage, setBuyCity, setSellCity } = useAppContext();

  const factionCapes = useMemo(() => ITEMS.filter(i => i.category === 'Capas de Facção' || i.category === 'Capas de Artefato'), []);
  const availableTiers = useMemo(() => Array.from(new Set(factionCapes.map(c => c.tier))).sort(), [factionCapes]);
  const [selectedTier, setSelectedTier] = useState<string>(availableTiers[0] || 'T4');
  const availableEnchantments = useMemo(() => Array.from(new Set(factionCapes.filter(c => c.tier === selectedTier).map(c => c.enchantment))).sort(), [factionCapes, selectedTier]);
  const [selectedEnchantment, setSelectedEnchantment] = useState<string>(availableEnchantments[0] || '0');

  const [buyBaseCape, setBuyBaseCape] = useState<boolean>(true);
  const [brecilienRrr, setBrecilienRrr] = useState<number>(15.2);
  const [royalRrr, setRoyalRrr] = useState<number>(15.2);
  const [brecilienFee, setBrecilienFee] = useState<number>(500);
  const [royalFee, setRoyalFee] = useState<number>(500);
  const [marketTax, setMarketTax] = useState<number>(0.065);

  const [sortBy, setSortBy] = useState<'profit' | 'roi' | 'name'>('profit');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handlePriceChange = (id: string, type: 'buy' | 'sell', val: number) => {
    const currentPrice = state.prices[id] || { buy: 0, sell: 0 };
    if (type === 'buy') updatePrice(id, val, currentPrice.sell);
    else updatePrice(id, currentPrice.buy, val);
  };

  const handleSync = async () => {
    const recipes = RECIPES.filter(r => {
      const item = factionCapes.find(i => i.id === r.itemId);
      return item?.tier === selectedTier && item?.enchantment === selectedEnchantment;
    });
    
    const itemIds = new Set<string>();
    recipes.forEach(r => {
      itemIds.add(r.itemId);
      r.materials.forEach(m => {
        itemIds.add(m.itemId);
        // Add normal cape materials if we need to craft it
        if (!buyBaseCape && m.itemId.includes('_CAPE') && !m.itemId.includes('CAPEITEM')) {
          const normalRecipe = RECIPES.find(nr => nr.itemId === m.itemId);
          normalRecipe?.materials.forEach(nm => itemIds.add(nm.itemId));
        }
      });
    });

    await syncPrices(Array.from(itemIds));
  };

  const analysisData = useMemo(() => {
    const itemsInTier = RECIPES.filter(r => {
      const item = factionCapes.find(i => i.id === r.itemId);
      return item?.tier === selectedTier && item?.enchantment === selectedEnchantment;
    });

    const results = itemsInTier.map(recipe => {
      const item = factionCapes.find(i => i.id === recipe.itemId)!;
      const prices = state.prices[item.id] || { buy: 0, sell: 0 };
      
      const normalCapeRef = recipe.materials.find(m => m.itemId.includes('_CAPE') && !m.itemId.includes('CAPEITEM') && !m.itemId.includes('ARTIFACT'));
      const normalCapeRecipe = RECIPES.find(r => r.itemId === normalCapeRef?.itemId);
      
      let baseCapeCost = 0;
      if (buyBaseCape) {
        baseCapeCost = state.prices[normalCapeRef?.itemId || '']?.buy || 0;
      } else {
        let baseMatCost = 0;
        normalCapeRecipe?.materials.forEach(m => {
          baseMatCost += m.amount * (state.prices[m.itemId]?.buy || 0) * (1 - (brecilienRrr / 100));
        });
        baseCapeCost = baseMatCost + brecilienFee;
      }

      let factionMaterialsCost = 0;
      let crestRef = null;
      let heartRef = null;

      recipe.materials.forEach(m => {
        if (m.itemId === normalCapeRef?.itemId) return;
        const matItem = ITEMS.find(i => i.id === m.itemId);
        if (matItem?.category.includes('Artefato') || matItem?.category.includes('Brasão') || matItem?.category.includes('Ornamento')) crestRef = m;
        if (matItem?.category.includes('Coraç')) heartRef = m;

        factionMaterialsCost += m.amount * (state.prices[m.itemId]?.buy || 0) * (1 - (royalRrr / 100));
      });

      const totalCost = baseCapeCost + factionMaterialsCost + royalFee;
      const netSale = prices.sell * (1 - marketTax);
      const profit = netSale - totalCost;
      const roi = totalCost > 0 ? (profit / totalCost) * 100 : 0;

      return {
        ...recipe,
        item,
        crestRef,
        heartRef,
        normalCapeRef,
        baseCapeCost,
        factionMaterialsCost,
        totalCost,
        netSale,
        profit,
        roi,
        prices
      };
    });

    return results.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'profit') comparison = a.profit - b.profit;
      else if (sortBy === 'roi') comparison = a.roi - b.roi;
      else comparison = a.item.name.localeCompare(b.item.name);
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [selectedTier, selectedEnchantment, state.prices, brecilienRrr, royalRrr, buyBaseCape, brecilienFee, royalFee, marketTax, sortBy, sortOrder, factionCapes]);

  const uniqueMaterials = useMemo(() => {
    const matIds = new Set<string>();
    analysisData.forEach(res => {
       if (res.normalCapeRef?.itemId) {
         if (buyBaseCape) {
            matIds.add(res.normalCapeRef.itemId);
         } else {
            const recipe = RECIPES.find(r => r.itemId === res.normalCapeRef?.itemId);
            recipe?.materials.forEach(m => matIds.add(m.itemId));
         }
       }
       if (res.crestRef) matIds.add(res.crestRef.itemId);
       if (res.heartRef) matIds.add(res.heartRef.itemId);
    });
    return Array.from(matIds);
  }, [analysisData, buyBaseCape]);

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full lg:w-80 space-y-6 shrink-0">
          <div className="bg-surface-container-low rounded-2xl border border-outline-variant/10 p-5 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-primary" />
              Seleção de Lote
            </h2>
            
            <div className="space-y-4">
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
              Configuração Logística
            </h2>
            
            <div className="space-y-4">
              <MarketSelector label="Compra de Materiais" value={state.buyCity} onChange={setBuyCity} />
              <MarketSelector label="Venda de Capas" value={state.sellCity} onChange={setSellCity} />

              <div className="pt-2 border-t border-outline-variant/10"></div>

              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase text-primary">Capa Base Pronta</label>
                <div className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${buyBaseCape ? 'bg-primary/20 border-primary/30' : 'bg-surface-container-highest border-outline-variant/30'} border`} onClick={() => setBuyBaseCape(!buyBaseCape)}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full shadow-sm transition-all ${buyBaseCape ? 'right-0.5 bg-primary' : 'left-0.5 bg-on-surface-variant'}`}></div>
                </div>
              </div>

              {!buyBaseCape && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-bold text-on-surface-variant/70 uppercase">RRR Brecilien</label>
                    <span className="text-xs font-bold text-primary">{brecilienRrr}%</span>
                  </div>
                  <input type="range" min="0" max="70" step="0.1" value={brecilienRrr} onChange={(e) => setBrecilienRrr(Number(e.target.value))} className="w-full accent-primary h-1.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer" />
                  <label className="text-[10px] font-bold text-on-surface-variant/70 uppercase block mt-2">Taxa Brecilien</label>
                  <CurrencyInput value={brecilienFee} onChange={setBrecilienFee} className="text-xs" />
                </div>
              )}

              <div className="space-y-1.5 pt-2 border-t border-outline-variant/10">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] font-bold text-on-surface-variant/70 uppercase">RRR Cidade Real</label>
                  <span className="text-xs font-bold text-secondary">{royalRrr}%</span>
                </div>
                <input type="range" min="0" max="70" step="0.1" value={royalRrr} onChange={(e) => setRoyalRrr(Number(e.target.value))} className="w-full accent-secondary h-1.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer" />
                <label className="text-[10px] font-bold text-on-surface-variant/70 uppercase block mt-2">Taxa Cidade Real</label>
                <CurrencyInput value={royalFee} onChange={setRoyalFee} className="text-xs" />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Section */}
        <main className="flex-1 min-w-0 space-y-6">
          <div className="bg-surface-container-low rounded-2xl border border-outline-variant/10 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-on-surface-variant">Materiais ({selectedTier}.{selectedEnchantment})</h3>
              <button onClick={handleSync} disabled={isSyncing} className="flex items-center gap-2 px-4 py-1.5 bg-secondary text-on-secondary rounded-lg text-xs font-bold hover:opacity-90 transition-all disabled:opacity-50">
                <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Buscando...' : 'Sincronizar API'}
              </button>
            </div>

            {(()=>{
              const baseMats = uniqueMaterials.filter(matId => {
                const item = ITEMS.find(i => i.id === matId);
                return !item?.category.includes('Ornamento') && !item?.category.includes('Coraç');
              });
              const hearts = uniqueMaterials.filter(matId => {
                const item = ITEMS.find(i => i.id === matId);
                return item?.category.includes('Coraç');
              });
              const crests = uniqueMaterials.filter(matId => {
                const item = ITEMS.find(i => i.id === matId);
                return item?.category.includes('Ornamento');
              });

              const renderMaterial = (matId: string) => {
                const item = ITEMS.find(i => i.id === matId);
                const price = state.prices[matId]?.buy || 0;
                const name = item ? item.name.replace(` ${selectedTier}.${selectedEnchantment}`, '').replace(` ${selectedTier}`, '') : matId;
                
                let colorClass = 'text-on-surface-variant/60';
                if (item?.category.includes('Coraç')) {
                  if (name.includes('Fera')) colorClass = 'text-orange-400';
                  else if (name.includes('Árvore')) colorClass = 'text-green-500';
                  else if (name.includes('Vinha')) colorClass = 'text-purple-500';
                  else if (name.includes('Montanha')) colorClass = 'text-sky-200';
                  else if (name.includes('Pedra')) colorClass = 'text-blue-500';
                  else if (name.includes('Sombras')) colorClass = 'text-rose-500';
                  else if (name.includes('Fátuo')) colorClass = 'text-fuchsia-400';
                  else if (name.includes('Avaloniana')) colorClass = 'text-amber-400';
                }

                return (
                  <div key={matId} className="space-y-1">
                    <label className={`text-[9px] font-bold uppercase truncate block ${colorClass}`} title={item?.name}>
                      {name}
                    </label>
                    <CurrencyInput value={price} onChange={(val) => handlePriceChange(matId, 'buy', val)} className="text-xs" />
                  </div>
                );
              };

              return (
                <div className="max-h-[320px] overflow-y-auto pr-2 no-scrollbar space-y-4">
                  {baseMats.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold uppercase text-primary border-b border-outline-variant/10 pb-1">Base</h4>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {baseMats.map(renderMaterial)}
                      </div>
                    </div>
                  )}
                  {hearts.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold uppercase text-secondary border-b border-outline-variant/10 pb-1">Corações & Magia</h4>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {hearts.map(renderMaterial)}
                      </div>
                    </div>
                  )}
                  {crests.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold uppercase text-on-surface-variant border-b border-outline-variant/10 pb-1">Ornamentos</h4>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {crests.map(renderMaterial)}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
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
                          Capa {sortBy === 'name' && (sortOrder === 'asc' ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>)}
                        </button>
                      </th>
                      <th className="p-4 text-[10px] font-black uppercase text-on-surface-variant/60 tracking-widest">Custo Peças</th>
                      <th className="p-4 text-[10px] font-black uppercase text-on-surface-variant/60 tracking-widest min-w-[120px]">Preço Venda</th>
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
                      const crestItem = ITEMS.find(i => i.id === res.crestRef?.itemId);
                      return (
                        <tr key={res.item.id} className={`hover:bg-surface-container-high/30 transition-colors ${res.profit < 0 ? 'bg-error/5' : ''}`}>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img src={`https://render.albiononline.com/v1/item/${res.item.id}.png`} className="w-10 h-10 rounded border border-outline-variant/10 bg-surface-container" alt={res.item.name} />
                              <div>
                                <div className="text-sm font-bold text-on-surface">{res.item.name}</div>
                                <div className="text-[9px] text-on-surface-variant font-medium uppercase">{crestItem?.name.replace(` ${selectedTier}`, '')}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-0.5">
                              <div className="text-[10px] text-on-surface-variant">Base: <span className="font-bold text-on-surface">{Math.round(res.baseCapeCost).toLocaleString()}</span></div>
                              <div className="text-[10px] text-on-surface-variant">Specs: <span className="font-bold text-on-surface">{Math.round(res.factionMaterialsCost).toLocaleString()}</span></div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              <CurrencyInput value={res.prices.sell} onChange={(val) => handlePriceChange(res.item.id, 'sell', val)} className="text-[11px] h-7" />
                              <div className="text-[8px] text-on-surface-variant opacity-60">
                                {res.prices.updatedAt ? `Atual: ${formatTimeAgo(res.prices.updatedAt)}` : 'S/ Dados'}
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                             <div className={`text-sm font-bold ${res.profit > 0 ? 'text-green-500' : 'text-error'}`}>
                               {res.profit > 0 ? '+' : ''}{Math.round(res.profit).toLocaleString()}
                             </div>
                             <div className="text-[9px] text-on-surface-variant opacity-70">Custo Total: {Math.round(res.totalCost).toLocaleString()}</div>
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
