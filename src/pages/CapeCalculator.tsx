import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { ITEMS, RECIPES } from '../constants';
import { CurrencyInput } from '../components/CurrencyInput';
import { formatTimeAgo } from '../utils/format';
import { RefreshCw } from 'lucide-react';

export const CapeCalculator: React.FC = () => {
  const { state, updatePrice, syncPrices, isSyncing } = useAppContext();

  // Filter only Faction Capes
  const factionCapes = useMemo(() => ITEMS.filter(i => i.category === 'Capas de Facção' || i.category === 'Capas de Artefato'), []);
  
  const availableTiers = useMemo(() => Array.from(new Set(factionCapes.map(c => c.tier))).sort(), [factionCapes]);
  const [selectedTier, setSelectedTier] = useState<string>(availableTiers[0] || 'T4');

  const availableEnchantments = useMemo(() => Array.from(new Set(factionCapes.filter(c => c.tier === selectedTier).map(c => c.enchantment))).sort(), [factionCapes, selectedTier]);
  const [selectedEnchantment, setSelectedEnchantment] = useState<string>(availableEnchantments[0] || '0');

  const availableRecipes = useMemo(() => RECIPES.filter(r => {
    const item = factionCapes.find(i => i.id === r.itemId);
    return item?.tier === selectedTier && item?.enchantment === selectedEnchantment;
  }), [factionCapes, selectedTier, selectedEnchantment]);

  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(availableRecipes[0]?.itemId || '');

  useEffect(() => {
    if (availableRecipes.length > 0 && !availableRecipes.find(r => r.itemId === selectedRecipeId)) {
      setSelectedRecipeId(availableRecipes[0].itemId);
    }
  }, [availableRecipes, selectedRecipeId]);

  const [quantity, setQuantity] = useState<number>(1);
  const [brecilienFee, setBrecilienFee] = useState<number>(500);
  const [royalFee, setRoyalFee] = useState<number>(500);
  const [brecilienRrr, setBrecilienRrr] = useState<number>(15.2);
  const [royalRrr, setRoyalRrr] = useState<number>(15.2);
  const [buyBaseCape, setBuyBaseCape] = useState<boolean>(false);
  const [marketTax, setMarketTax] = useState<number>(0.065);

  const recipe = availableRecipes.find(r => r.itemId === selectedRecipeId);
  const item = factionCapes.find(i => i.id === selectedRecipeId);

  const calculations = useMemo(() => {
    if (!recipe || !item) return null;

    // Faction cape recipe usually has: Normal Cape, Crest, Hearts
    const normalCapeRef = recipe.materials.find(m => m.itemId.includes('_CAPE') && !m.itemId.includes('CAPEITEM'));
    const normalCapeItem = ITEMS.find(i => i.id === normalCapeRef?.itemId);
    
    // Normal cape recipe
    const normalCapeRecipe = RECIPES.find(r => r.itemId === normalCapeRef?.itemId);
    
    // Step 1: Base Cape in Brecilien
    let baseCapeCost = 0;
    let baseMaterialsCost = 0;
    const baseMaterialsDetails = [];
    
    if (normalCapeRecipe && !buyBaseCape) {
      normalCapeRecipe.materials.forEach(mat => {
        const matItem = ITEMS.find(i => i.id === mat.itemId);
        const price = state.prices[mat.itemId]?.buy || 0;
        const effectiveAmount = mat.amount * (1 - (brecilienRrr / 100)) * quantity;
        const cost = effectiveAmount * price;
        baseMaterialsCost += cost;
        baseMaterialsDetails.push({ ...mat, name: matItem?.name, price, effectiveAmount, cost });
      });
      baseCapeCost = baseMaterialsCost + (brecilienFee * quantity);
    } else {
      // Buying base cape directly
      const price = state.prices[normalCapeRef?.itemId || '']?.buy || 0;
      baseCapeCost = price * quantity;
    }

    // Step 2: Faction Cape in Royal City
    let factionMaterialsCost = 0;
    const factionMaterialsDetails = [];
    
    recipe.materials.forEach(mat => {
      if (mat.itemId === normalCapeRef?.itemId) return; // Handled as baseCapeCost
      
      const matItem = ITEMS.find(i => i.id === mat.itemId);
      const price = state.prices[mat.itemId]?.buy || 0;
      const effectiveAmount = mat.amount * (1 - (royalRrr / 100)) * quantity;
      const cost = effectiveAmount * price;
      factionMaterialsCost += cost;
      factionMaterialsDetails.push({ ...mat, name: matItem?.name, price, effectiveAmount, cost });
    });

    const totalCost = baseCapeCost + factionMaterialsCost + (royalFee * quantity);

    const sellPrice = state.prices[item.id]?.sell || 0;
    const grossRevenue = sellPrice * quantity;
    const taxCost = grossRevenue * marketTax;
    const netRevenue = grossRevenue - taxCost;
    
    const netProfit = netRevenue - totalCost;
    const roi = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;

    return {
      baseMaterialsDetails,
      baseCapeCost,
      factionMaterialsDetails,
      factionMaterialsCost,
      totalCost,
      grossRevenue,
      taxCost,
      netProfit,
      roi,
      normalCapeId: normalCapeRef?.itemId
    };
  }, [recipe, item, quantity, brecilienFee, royalFee, brecilienRrr, royalRrr, buyBaseCape, marketTax, state.prices]);

  const handlePriceChange = (id: string, type: 'buy' | 'sell', val: number) => {
    const currentPrice = state.prices[id] || { buy: 0, sell: 0 };
    if (type === 'buy') updatePrice(id, val, currentPrice.sell);
    else updatePrice(id, currentPrice.buy, val);
  };

  const handleSyncPrices = () => {
    if (!recipe || !calculations) return;
    const itemIds = [recipe.itemId, calculations.normalCapeId, ...recipe.materials.map(m => m.itemId)];
    const baseRecipe = RECIPES.find(r => r.itemId === calculations.normalCapeId);
    if (baseRecipe) itemIds.push(...baseRecipe.materials.map(m => m.itemId));
    
    // remove undefined/nulls
    syncPrices(Array.from(new Set(itemIds.filter(Boolean))) as string[]);
  };

  if (!recipe || !calculations || !item) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
        <p className="text-zinc-400">Carregando Capas...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-surface-container-low/50 p-6 rounded-2xl border border-outline-variant/10">
        <div>
          <h3 className="text-2xl md:text-4xl font-black tight-tracking text-on-surface flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl md:text-4xl">inventory_2</span>
            Logística de Capas
          </h3>
          <p className="text-on-surface-variant text-sm md:text-base mt-2 font-medium">
            Simule o craft duplo: Brecilien (Capa Base) + Cidade Real (Facção)
          </p>
        </div>
        <button 
           onClick={handleSyncPrices}
           disabled={isSyncing}
           className="flex items-center justify-center gap-2 bg-surface-container-high hover:bg-surface-container-highest px-5 py-3 rounded-xl text-sm font-bold border border-outline-variant/30 hover:border-primary/50 transition-all disabled:opacity-50"
        >
           <span className={`material-symbols-outlined text-lg ${isSyncing ? 'animate-spin' : ''}`}>sync</span>
           <span>Atualizar Preços</span>
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-3 space-y-6">
          <section className="bg-surface-container rounded-xl p-6 space-y-5">
            <h4 className="font-bold text-sm tracking-wide uppercase text-secondary">Configuração do Lote</h4>
            <div className="flex gap-2">
              <div className="flex-1 space-y-1.5">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase">Tier</label>
                <select value={selectedTier} onChange={(e) => setSelectedTier(e.target.value)} className="w-full bg-surface-container-lowest border-none rounded-lg text-sm py-2 px-3 text-on-surface outline-none">
                  {availableTiers.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex-1 space-y-1.5">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase">Encantamento</label>
                <select value={selectedEnchantment} onChange={(e) => setSelectedEnchantment(e.target.value)} className="w-full bg-surface-container-lowest border-none rounded-lg text-sm py-2 px-3 text-on-surface outline-none">
                  {availableEnchantments.map(e => <option key={e} value={e}>.{e}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase">Capa Final</label>
              <select value={selectedRecipeId} onChange={(e) => setSelectedRecipeId(e.target.value)} className="w-full bg-surface-container-lowest border-none rounded-lg text-sm py-2 px-3 text-on-surface outline-none">
                {availableRecipes.map(r => {
                  const i = factionCapes.find(item => item.id === r.itemId);
                  return <option key={r.itemId} value={r.itemId}>{i?.name}</option>;
                })}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase">Quantidade</label>
              <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(Number(e.target.value) || 1)} className="w-full bg-surface-container-lowest border-none rounded-lg text-sm py-2 px-4 text-on-surface outline-none" />
            </div>
          </section>

          <section className="bg-surface-container rounded-xl p-6 space-y-5">
             <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm tracking-wide uppercase text-primary">Capa Base</h4>
                <div className="flex items-center gap-2">
                   <input type="checkbox" id="buyBase" checked={buyBaseCape} onChange={e => setBuyBaseCape(e.target.checked)} className="accent-primary" />
                   <label htmlFor="buyBase" className="text-xs font-bold cursor-pointer text-on-surface-variant">Comprar Pronta</label>
                </div>
             </div>
             {!buyBaseCape && (
               <>
                 <div className="space-y-3">
                   <div className="flex justify-between text-[11px] font-bold text-on-surface-variant uppercase"><label>RRR Brecilien</label><span>{brecilienRrr}%</span></div>
                   <input type="range" min="0" max="70" step="0.1" value={brecilienRrr} onChange={(e) => setBrecilienRrr(Number(e.target.value))} className="w-full accent-primary h-1.5 bg-surface-container-lowest rounded-lg appearance-none cursor-pointer" />
                 </div>
                 <div className="space-y-1.5">
                   <label className="text-[11px] font-bold text-on-surface-variant uppercase">Taxa Brecilien (Prata/Item)</label>
                   <input type="number" value={brecilienFee} onChange={(e) => setBrecilienFee(Number(e.target.value) || 0)} className="w-full bg-surface-container-lowest border-none rounded-lg text-sm py-2 px-4 text-on-surface outline-none" />
                 </div>
               </>
             )}
          </section>

          <section className="bg-surface-container rounded-xl p-6 space-y-5">
             <h4 className="font-bold text-sm tracking-wide uppercase text-secondary">Cidade Real (Facção)</h4>
             <div className="space-y-3">
               <div className="flex justify-between text-[11px] font-bold text-on-surface-variant uppercase"><label>RRR Cidade</label><span>{royalRrr}%</span></div>
               <input type="range" min="0" max="70" step="0.1" value={royalRrr} onChange={(e) => setRoyalRrr(Number(e.target.value))} className="w-full accent-secondary h-1.5 bg-surface-container-lowest rounded-lg appearance-none cursor-pointer" />
             </div>
             <div className="space-y-1.5">
               <label className="text-[11px] font-bold text-on-surface-variant uppercase">Taxa Cidade Real (Prata/Item)</label>
               <input type="number" value={royalFee} onChange={(e) => setRoyalFee(Number(e.target.value) || 0)} className="w-full bg-surface-container-lowest border-none rounded-lg text-sm py-2 px-4 text-on-surface outline-none" />
             </div>
          </section>
        </div>

        <div className="col-span-12 xl:col-span-9 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="bg-surface-container rounded-2xl p-4 md:p-6 h-32 md:h-36 border-b-2 border-outline-variant/20 flex flex-col justify-between">
                <span className="text-[10px] md:text-[11px] font-bold text-on-surface-variant uppercase">Custo Total ({quantity}x)</span>
                <div>
                   <span className="text-xl md:text-2xl font-bold text-error">{Math.round(calculations.totalCost).toLocaleString()}</span>
                   <span className="text-xs text-on-surface-variant ml-1 font-medium">Silver</span>
                </div>
             </div>
             <div className="bg-surface-container rounded-2xl p-4 md:p-6 h-32 md:h-36 border-b-2 border-outline-variant/20 flex flex-col justify-between">
                <span className="text-[10px] md:text-[11px] font-bold text-on-surface-variant uppercase">Receita Bruta</span>
                <div>
                   <span className="text-xl md:text-2xl font-bold text-on-surface">{Math.round(calculations.grossRevenue).toLocaleString()}</span>
                </div>
             </div>
             <div className={`bg-surface-container rounded-2xl p-4 md:p-6 h-32 md:h-36 border-b-2 ${calculations.netProfit >= 0 ? 'border-primary/40' : 'border-error/40'} flex flex-col justify-between`}>
                <span className={`text-[10px] md:text-[11px] font-bold uppercase ${calculations.netProfit >= 0 ? 'text-primary' : 'text-error'}`}>Lucro Líquido</span>
                <span className={`text-xl md:text-2xl font-bold ${calculations.netProfit >= 0 ? 'text-primary' : 'text-error'}`}>
                   {calculations.netProfit >= 0 ? '+' : ''}{Math.round(calculations.netProfit).toLocaleString()}
                </span>
             </div>
             <div className="bg-surface-container rounded-2xl p-4 md:p-6 h-32 md:h-36 border-b-2 border-secondary/40 flex flex-col justify-between">
                <span className="text-[10px] md:text-[11px] font-bold text-secondary uppercase">ROI %</span>
                <span className={`text-2xl md:text-3xl font-bold ${calculations.roi > 0 ? 'text-secondary' : 'text-error'}`}>
                   {calculations.roi.toFixed(1)}%
                </span>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Passo 1: Capa Base */}
             <div className="bg-surface-container-low p-6 rounded-2xl space-y-4">
                <h4 className="font-bold text-lg text-primary flex items-center gap-2"><span className="material-symbols-outlined">looks_one</span> Obter Capa Base</h4>
                
                {buyBaseCape ? (
                   <div className="bg-surface-container p-4 rounded-xl flex items-center justify-between border-l-4 border-primary">
                      <div>
                         <p className="text-xs font-bold">Comprar Capa Normal</p>
                         <p className="text-[10px] text-on-surface-variant">Qtd: {quantity}</p>
                      </div>
                      <div className="text-right">
                         <CurrencyInput value={state.prices[calculations.normalCapeId!]?.buy || 0} onChange={(val) => handlePriceChange(calculations.normalCapeId!, 'buy', val)} className="bg-surface-container-lowest w-28 text-right px-2 py-1 rounded text-sm font-bold text-primary outline-none" />
                      </div>
                   </div>
                ) : (
                   <div className="space-y-2">
                     {calculations.baseMaterialsDetails.map((mat, idx) => (
                       <div key={idx} className="bg-surface-container p-3 rounded-xl flex items-center justify-between">
                         <div>
                            <p className="text-xs font-bold">{mat.name}</p>
                            <p className="text-[10px] text-on-surface-variant">Qtd RRR: {Math.ceil(mat.effectiveAmount)}</p>
                         </div>
                         <CurrencyInput value={mat.price} onChange={(val) => handlePriceChange(mat.itemId, 'buy', val)} className="bg-surface-container-lowest w-24 text-right px-2 py-1 rounded text-sm font-bold text-secondary outline-none" />
                       </div>
                     ))}
                     <div className="flex justify-between items-center px-2 pt-2 border-t border-outline-variant/10">
                        <span className="text-xs font-bold text-on-surface-variant">Custo Capa Base</span>
                        <span className="text-sm font-bold text-error">{Math.round(calculations.baseCapeCost).toLocaleString()}</span>
                     </div>
                   </div>
                )}
             </div>

             {/* Passo 2: Capa de Facção */}
             <div className="bg-surface-container-low p-6 rounded-2xl space-y-4">
                <h4 className="font-bold text-lg text-secondary flex items-center gap-2"><span className="material-symbols-outlined">looks_two</span> Craft Facção</h4>
                
                <div className="space-y-2">
                  {calculations.factionMaterialsDetails.map((mat, idx) => (
                    <div key={idx} className="bg-surface-container p-3 rounded-xl flex items-center justify-between">
                      <div>
                         <p className="text-xs font-bold">{mat.name}</p>
                         <p className="text-[10px] text-on-surface-variant">Qtd RRR: {Math.ceil(mat.effectiveAmount)}</p>
                      </div>
                      <CurrencyInput value={mat.price} onChange={(val) => handlePriceChange(mat.itemId, 'buy', val)} className="bg-surface-container-lowest w-24 text-right px-2 py-1 rounded text-sm font-bold text-secondary outline-none" />
                    </div>
                  ))}
                  <div className="flex justify-between items-center px-2 pt-2 border-t border-outline-variant/10">
                     <span className="text-xs font-bold text-on-surface-variant">Custo Adicional (S/ Capa Base)</span>
                     <span className="text-sm font-bold text-error">{Math.round(calculations.factionMaterialsCost + (royalFee * quantity)).toLocaleString()}</span>
                  </div>
                </div>
             </div>
          </div>

          <div className="bg-surface-container-low p-6 rounded-2xl border-2 border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
             <div>
                <h4 className="text-sm font-black uppercase text-primary tracking-widest flex items-center gap-2">
                   <span className="material-symbols-outlined">sell</span>
                   Venda Final
                </h4>
                <p className="text-[11px] text-on-surface-variant mt-1">{item.name}</p>
             </div>
             <CurrencyInput 
                value={state.prices[item.id]?.sell || 0} 
                onChange={(val) => handlePriceChange(item.id, 'sell', val)} 
                className="bg-surface-container-lowest text-2xl font-black text-primary px-4 py-3 rounded-xl text-right outline-none w-full sm:w-64" 
             />
          </div>

        </div>
      </div>
    </div>
  );
};
