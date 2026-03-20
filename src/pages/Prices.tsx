import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { ITEMS } from '../constants';
import { RefreshCw, Search, Info } from 'lucide-react';
import { CurrencyInput } from '../components/CurrencyInput';
import { MarketSelector } from '../components/MarketSelector';

export const Prices: React.FC = () => {
  const { state, updatePrice, syncPrices, isSyncing, syncMessage, setBuyCity, setSellCity } = useAppContext();
  
  const [priceType, setPriceType] = useState<'sell'|'buy'>('sell');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [syncQuality, setSyncQuality] = useState<number>(0);

  const tiers = ['T4', 'T5', 'T6', 'T7', 'T8'];
  const enchantments = ['0', '1', '2', '3', '4'];

  const categories = useMemo(() => {
    const cats = Array.from(new Set(ITEMS.map(i => i.category).filter(Boolean)));
    return cats.sort((a, b) => a.localeCompare(b));
  }, []);

  // Initialize selected category if empty
  React.useEffect(() => {
    if (!categoryFilter && categories.length > 0) {
      setCategoryFilter(categories[0]);
    }
  }, [categories, categoryFilter]);

  const groupedItems = useMemo(() => {
    if (!categoryFilter) return [];
    
    const itemsInCategory = ITEMS.filter(i => i.category === categoryFilter);
    const groups: Record<string, {
        baseName: string;
        imageItemId: string;
        items: Record<string, Record<string, any>>
    }> = {};

    itemsInCategory.forEach(item => {
        const parts = item.name.split(' T');
        const baseName = parts.length > 1 ? parts.slice(0, -1).join(' T') : item.name;
        
        if (!groups[baseName]) {
            groups[baseName] = { baseName, imageItemId: item.id, items: {} };
        }
        
        // Tenta usar a foto do T4 Normal como capa do grupo
        if (item.tier === 'T4' && item.enchantment === '0') {
            groups[baseName].imageItemId = item.id;
        }

        if (!groups[baseName].items[item.tier]) {
            groups[baseName].items[item.tier] = {};
        }
        groups[baseName].items[item.tier][item.enchantment] = item;
    });

    return Object.values(groups).sort((a, b) => a.baseName.localeCompare(b.baseName));
  }, [categoryFilter]);

  const handlePriceChange = (id: string, val: number) => {
    const currentPrice = state.prices[id] || { buy: 0, sell: 0 };
    if (priceType === 'buy') {
      updatePrice(id, val, currentPrice.sell);
    } else {
      updatePrice(id, currentPrice.buy, val);
    }
  };

  const handleSyncGroup = (group: any) => {
      const idsToSync: string[] = [];
      Object.values(group.items).forEach((tierMap: any) => {
          Object.values(tierMap).forEach((item: any) => {
              idsToSync.push(item.id);
          });
      });
      if (idsToSync.length > 0) {
          syncPrices(idsToSync, syncQuality > 0 ? syncQuality : undefined);
      }
  };

  return (
    <div className="space-y-4 relative font-['Inter']">
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

      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-surface-container-low p-4 rounded-xl border border-outline-variant/10 shadow-lg gap-4">
        <div>
          <h1 className="text-xl font-black text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">monitor_weight</span>
            Painel de Cotações: {categoryFilter}
          </h1>
          <p className="text-on-surface-variant text-xs mt-1">Grade de Dados Avançada (Analytics)</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-col">
            <label className="text-[9px] uppercase font-bold text-on-surface-variant ml-1 mb-0.5">Editar</label>
            <select 
              value={priceType}
              onChange={(e) => setPriceType(e.target.value as 'buy'|'sell')}
              className="bg-surface-container-high border border-outline-variant/30 rounded-lg px-3 py-2 text-xs font-bold text-on-surface focus:border-primary outline-none"
            >
              <option value="sell">Preço de Venda</option>
              <option value="buy">Preço de Compra</option>
            </select>
          </div>
          
          <div className="flex flex-col">
            <label className="text-[9px] uppercase font-bold text-on-surface-variant ml-1 mb-0.5">Sincronizar c/ Qualidade</label>
            <select 
              value={syncQuality}
              onChange={(e) => setSyncQuality(Number(e.target.value))}
              className="bg-surface-container-high border border-outline-variant/30 rounded-lg px-3 py-2 text-xs font-bold text-amber-500 focus:border-amber-500 outline-none"
            >
              <option value={0}>Padrão (Misto)</option>
              <option value={1}>1 - Normal</option>
              <option value={2}>2 - Bom</option>
              <option value={3}>3 - Excepcional</option>
              <option value={4}>4 - Excelente</option>
              <option value={5}>5 - Obra-prima</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-[9px] uppercase font-bold text-on-surface-variant ml-1 mb-0.5">Categoria</label>
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-surface-container-high border border-outline-variant/30 rounded-lg px-3 py-2 text-xs font-bold text-on-surface focus:border-primary outline-none"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 bg-surface-container-low p-4 rounded-xl border border-outline-variant/10 shadow-sm">
        <MarketSelector 
          label="Cidade de Compra" 
          value={state.buyCity} 
          onChange={setBuyCity} 
        />
        <MarketSelector 
          label="Cidade de Venda" 
          value={state.sellCity} 
          onChange={setSellCity} 
        />
      </div>

      {/* Data Grid */}
      <div className="bg-surface-container-low rounded-xl border border-outline-variant/10 shadow-xl overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap min-w-[1000px]">
          <thead>
            <tr className="bg-surface-container-high text-[10px] uppercase text-on-surface-variant font-bold border-b border-outline-variant/20">
              <th className="px-4 py-3 sticky left-0 bg-surface-container-high z-10 shadow-[2px_0_5px_rgba(0,0,0,0.1)]">Item Base</th>
              {tiers.map(t => (
                 <th key={t} className="px-4 py-3 border-l border-outline-variant/10 text-center w-[200px]">{t}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {groupedItems.map((group, idx) => (
              <tr key={idx} className="hover:bg-surface-container-highest/10 transition-colors">
                {/* Fixed Left Column */}
                <td className="px-4 py-3 sticky left-0 bg-surface-container-low z-10 shadow-[2px_0_5px_rgba(0,0,0,0.2)]">
                  <div className="flex items-center justify-between gap-3 w-48">
                    <div className="flex items-center gap-3">
                      <img src={`https://render.albiononline.com/v1/item/${group.imageItemId}.png`} alt={group.baseName} className="w-8 h-8 rounded bg-black/40" />
                      <div>
                        <div className="text-xs font-black text-on-surface truncate pr-2 max-w-[110px]" title={group.baseName}>{group.baseName}</div>
                        <div className="text-[9px] text-on-surface-variant uppercase font-bold tracking-wider">{categoryFilter}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleSyncGroup(group)}
                      disabled={isSyncing}
                      className="p-1.5 bg-surface-container-high hover:bg-surface-container-highest disabled:opacity-50 rounded-md text-on-surface-variant hover:text-primary transition-colors shrink-0 shadow-sm"
                      title={`Sincronizar todos os Tiers de ${group.baseName}`}
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </td>
                
                {/* Tier Cells */}
                {tiers.map(tier => {
                   const tierItems = group.items[tier];
                   if (!tierItems) {
                     return (
                      <td key={tier} className="px-3 py-2 border-l border-outline-variant/10 align-middle text-center opacity-30">
                        <span className="material-symbols-outlined text-on-surface-variant block mb-1">remove</span>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">Sem dados</span>
                      </td>
                     );
                   }

                   return (
                     <td key={tier} className="px-3 py-2 border-l border-outline-variant/10 align-top">
                        <div className="grid grid-cols-2 gap-1.5">
                          {enchantments.map(ench => {
                             const item = tierItems[ench];
                             if (!item) return null;
                             
                             const priceData = state.prices[item.id] || { buy: 0, sell: 0 };
                             const priceVal = priceType === 'sell' ? priceData.sell : priceData.buy;

                             // Color variants based on enchantment
                             let enchColor = 'text-zinc-500';
                             let hoverBorder = 'hover:border-zinc-700';
                             let title = '.0 Normal';
                             if (ench === '1') { enchColor = 'text-primary'; hoverBorder = 'hover:border-primary'; title = '.1 Incomum'; }
                             if (ench === '2') { enchColor = 'text-blue-400'; hoverBorder = 'hover:border-blue-500'; title = '.2 Raro'; }
                             if (ench === '3') { enchColor = 'text-purple-400'; hoverBorder = 'hover:border-purple-500'; title = '.3 Excepcional'; }
                             if (ench === '4') { enchColor = 'text-amber-500'; hoverBorder = 'hover:border-amber-500'; title = '.4 Pristino'; }

                             const isPristine = ench === '4';

                             return (
                               <div key={ench} title={title} className={`bg-surface-container-highest/30 p-1.5 rounded flex justify-between items-center group cursor-pointer border border-transparent transition-all overflow-hidden ${hoverBorder} ${isPristine ? 'col-span-2 mt-0.5' : ''}`}>
                                 <span className={`text-[9px] font-bold ${enchColor} shrink-0 pr-1.5`}>.{ench} {isPristine && 'Pristino'}</span>
                                 <CurrencyInput
                                    value={priceVal}
                                    onChange={(v) => handlePriceChange(item.id, v)}
                                    variant="minimal"
                                    className={`text-xs font-black text-right bg-transparent w-full min-w-[50px] outline-none text-on-surface group-hover:${enchColor}`}
                                 />
                               </div>
                             );
                          })}
                        </div>
                     </td>
                   );
                })}

              </tr>
            ))}

            {groupedItems.length === 0 && (
                <tr>
                    <td colSpan={6} className="text-center py-10 opacity-50">
                        <p className="text-sm font-bold">Nenhum item encontrado nesta categoria.</p>
                    </td>
                </tr>
            )}
            
          </tbody>
        </table>
      </div>
{/* Custom Scrollbars applied via global css or tailwind plugins usually. We'll rely on browser native for now or simple styling */}
    </div>
  );
};
