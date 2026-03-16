import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { ITEMS, RECIPES, SPEC_NODES } from '../constants';
import { CurrencyInput } from '../components/CurrencyInput';
import { MarketSelector } from '../components/MarketSelector';
import { formatTimeAgo } from '../utils/format';
import { Calculator as CalcIcon, Save, Star, TrendingUp, TrendingDown, Settings, CheckCircle2, RefreshCw, Clock, Info, AlertCircle, Book } from 'lucide-react';

import { calculateFocusCost } from '../utils/focus';
import { calculateJournalsFilled } from '../utils/journal';

export const Calculator: React.FC = () => {
  const { state, updatePrice, addFavorite, syncPrices, isSyncing, syncMessage, addGroup, setCalculatorState } = useAppContext();
  
  const categories = useMemo(() => {
    const cats = Array.from(new Set(RECIPES.map(r => ITEMS.find(i => i.id === r.itemId)?.category).filter(Boolean))) as string[];
    return cats.sort((a, b) => a.localeCompare(b));
  }, []);
  
  // Load initial state from AppContext
  const initialCalcState = state.calculatorState || {
    selectedCategory: categories[0] || '',
    selectedTier: '',
    selectedEnchantment: '',
    selectedRecipeId: '',
    usageFee: 500,
    rrr: 15.2,
    useFocus: false,
    quantity: 1
  };

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCalcState.selectedCategory || categories[0] || '');
  
  const availableTiers = useMemo(() => {
    if (!selectedCategory) return [];
    return Array.from(new Set(RECIPES.filter(r => ITEMS.find(i => i.id === r.itemId)?.category === selectedCategory).map(r => ITEMS.find(i => i.id === r.itemId)?.tier).filter(Boolean))).sort() as string[];
  }, [selectedCategory]);
  
  const [selectedTier, setSelectedTier] = useState<string>(initialCalcState.selectedTier || availableTiers[0] || '');

  const availableEnchantments = useMemo(() => {
    if (!selectedCategory || !selectedTier) return [];
    return Array.from(new Set(RECIPES.filter(r => {
      const item = ITEMS.find(i => i.id === r.itemId);
      return item?.category === selectedCategory && item?.tier === selectedTier;
    }).map(r => ITEMS.find(i => i.id === r.itemId)?.enchantment).filter(Boolean))).sort() as string[];
  }, [selectedCategory, selectedTier]);

  const [selectedEnchantment, setSelectedEnchantment] = useState<string>(initialCalcState.selectedEnchantment || availableEnchantments[0] || '');

  const availableRecipes = useMemo(() => {
    if (!selectedCategory || !selectedTier || !selectedEnchantment) return [];
    return RECIPES.filter(r => {
      const item = ITEMS.find(i => i.id === r.itemId);
      return item?.category === selectedCategory && item?.tier === selectedTier && item?.enchantment === selectedEnchantment;
    });
  }, [selectedCategory, selectedTier, selectedEnchantment]);

  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(initialCalcState.selectedRecipeId || availableRecipes[0]?.itemId || '');

  useEffect(() => {
    if (categories.length > 0 && !categories.includes(selectedCategory)) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  useEffect(() => {
    if (availableTiers.length > 0 && !availableTiers.includes(selectedTier)) {
      setSelectedTier(availableTiers[0]);
    }
  }, [availableTiers, selectedTier]);

  useEffect(() => {
    if (availableEnchantments.length > 0 && !availableEnchantments.includes(selectedEnchantment)) {
      setSelectedEnchantment(availableEnchantments[0]);
    }
  }, [availableEnchantments, selectedEnchantment]);

  useEffect(() => {
    if (availableRecipes.length > 0 && !availableRecipes.find(r => r.itemId === selectedRecipeId)) {
      setSelectedRecipeId(availableRecipes[0].itemId);
    }
  }, [availableRecipes, selectedRecipeId]);

  const [usageFee, setUsageFee] = useState<number>(initialCalcState.usageFee);
  const [rrr, setRrr] = useState<number>(initialCalcState.rrr);
  const [useFocus, setUseFocus] = useState<boolean>(initialCalcState.useFocus);
  const [quantity, setQuantity] = useState<number>(initialCalcState.quantity || 1);

  // Save state to AppContext on change
  useEffect(() => {
    setCalculatorState({
      selectedCategory,
      selectedTier,
      selectedEnchantment,
      selectedRecipeId,
      usageFee,
      rrr,
      useFocus,
      quantity
    });
  }, [selectedCategory, selectedTier, selectedEnchantment, selectedRecipeId, usageFee, rrr, useFocus, quantity]);
  const [marketTax, setMarketTax] = useState<number>(0.065); // 6.5% default
  const [showToast, setShowToast] = useState(false);
  const [rrrToast, setRrrToast] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string>(state.groups[0] || 'Geral');
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  const rrrPresets = [
    { value: 15.2, label: '15.2%', desc: 'Cidade sem bônus', color: 'text-zinc-300' },
    { value: 24.8, label: '24.8%', desc: 'Cidade com bônus', color: 'text-amber-400' },
    { value: 35.2, label: '35.2%', desc: 'Cidade bônus + Dia bônus', color: 'text-emerald-400' },
    { value: 43.5, label: '43.5%', desc: 'Foco sem bônus', color: 'text-blue-400' },
    { value: 47.9, label: '47.9%', desc: 'Foco com bônus', color: 'text-purple-400' },
    { value: 53.9, label: '53.9%', desc: 'Foco + Cidade bônus + Dia bônus', color: 'text-pink-400' },
  ];

  const handleRrrClick = (preset: typeof rrrPresets[0]) => {
    setRrr(preset.value);
    setRrrToast(`Taxa definida para ${preset.label} (${preset.desc})`);
    setTimeout(() => setRrrToast(null), 3000);
  };

  const recipe = RECIPES.find(r => r.itemId === selectedRecipeId);
  const item = ITEMS.find(i => i.id === selectedRecipeId);
  const isFavorited = state.favorites.some(f => f.itemId === selectedRecipeId);

  // Calculate Focus Cost
  const focusCost = useMemo(() => {
    if (!recipe || !item) return 0;
    return calculateFocusCost(recipe, item, state.specs);
  }, [recipe, item, state.specs]);

  // Calculate Costs and Profits
  const calculations = useMemo(() => {
    if (!recipe || !item) return null;

    const currentRrr = rrr / 100;
    
    let totalMaterialCost = 0;
    const materialsCostDetails = recipe.materials.map(mat => {
      const matItem = ITEMS.find(i => i.id === mat.itemId);
      const price = state.prices[mat.itemId]?.buy || 0;
      // Effective amount considering RRR
      const effectiveAmount = mat.amount * (1 - currentRrr) * quantity;
      const cost = effectiveAmount * price;
      totalMaterialCost += cost;
      return { ...mat, name: matItem?.name, price, effectiveAmount, cost };
    });

    // Usage fee is based on item value, but for MVP we'll just use a flat fee per item crafted
    const feeCost = usageFee * quantity;
    
    // Journal calculation
    let journalProfit = 0;
    let journalsFilled = 0;
    if (recipe.journalId) {
      const emptyPrice = state.prices[recipe.journalId]?.buy || 0;
      const fullId = recipe.journalId.replace('_EMPTY', '_FULL');
      const fullPrice = state.prices[fullId]?.sell || 0;
      
      journalsFilled = calculateJournalsFilled(recipe, item);
      
      journalProfit = journalsFilled * (fullPrice - emptyPrice) * quantity;
    }

    const itemSellPrice = state.prices[item.id]?.sell || 0;
    const grossRevenue = itemSellPrice * quantity;
    const taxCost = grossRevenue * marketTax;
    const netRevenue = grossRevenue - taxCost;
    
    const totalCost = totalMaterialCost + feeCost;
    const grossProfit = grossRevenue - totalCost + journalProfit;
    const netProfit = netRevenue - totalCost + journalProfit;
    
    const silverPerFocus = useFocus && focusCost > 0 ? netProfit / focusCost : 0;
    const roi = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;

    return {
      rrr: currentRrr,
      materialsCostDetails,
      totalMaterialCost,
      feeCost,
      journalProfit,
      grossRevenue,
      taxCost,
      totalCost,
      grossProfit,
      netProfit,
      silverPerFocus,
      roi,
      journalsFilled: journalsFilled * quantity,
      totalFocusCost: focusCost * quantity
    };
  }, [recipe, item, rrr, useFocus, quantity, state.prices, usageFee, marketTax, focusCost]);

  const handleSaveFavorite = () => {
    if (!recipe) return;
    
    const snapshotPrices: Record<string, { buy: number; sell: number }> = {};
    
    // Save item price
    if (state.prices[recipe.itemId]) snapshotPrices[recipe.itemId] = { ...state.prices[recipe.itemId] };
    
    // Save material prices
    recipe.materials.forEach(mat => {
      if (state.prices[mat.itemId]) snapshotPrices[mat.itemId] = { ...state.prices[mat.itemId] };
    });
    
    // Save journal prices
    if (recipe.journalId) {
      const fullId = recipe.journalId.replace('_EMPTY', '_FULL');
      if (state.prices[recipe.journalId]) snapshotPrices[recipe.journalId] = { ...state.prices[recipe.journalId] };
      if (state.prices[fullId]) snapshotPrices[fullId] = { ...state.prices[fullId] };
    }

    const existingFavorite = state.favorites.find(f => f.itemId === recipe.itemId);
    
    addFavorite({
      id: existingFavorite ? existingFavorite.id : `${recipe.itemId}-${Date.now()}`,
      itemId: recipe.itemId,
      timestamp: Date.now(),
      group: selectedGroup,
      configSnapshot: {
        usageFee,
        rrr,
        useFocus,
        focusCost,
        quantity,
        prices: snapshotPrices
      }
    });
    
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSyncRecipePrices = () => {
    if (!recipe) return;
    const itemIdsToSync = [recipe.itemId, ...recipe.materials.map(m => m.itemId)];
    if (recipe.journalId) {
      itemIdsToSync.push(recipe.journalId);
      itemIdsToSync.push(recipe.journalId.replace('_EMPTY', '_FULL'));
    }
    syncPrices(itemIdsToSync);
  };

  const handleAddGroup = () => {
    if (newGroupName.trim()) {
      addGroup(newGroupName.trim());
      setSelectedGroup(newGroupName.trim());
      setNewGroupName('');
      setIsAddingGroup(false);
    }
  };

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
        <p className="text-zinc-400">Carregando dados do sistema...</p>
      </div>
    );
  }

  if (!recipe || !calculations) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <AlertCircle className="w-8 h-8 text-amber-500" />
        <p className="text-zinc-400">Selecione um item para começar os cálculos.</p>
        <div className="flex gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded-lg py-2 px-3 text-zinc-100"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
    );
  }
// Helper Component for Detalhamento (to reuse in different positions)
const DetailsBlock: React.FC<{
  quantity: number;
  calculations: any;
  marketTax: number;
  selectedRecipeId: string;
  state: any;
  updatePrice: (id: string, type: 'buy' | 'sell', val: number) => void;
  useFocus: boolean;
}> = ({ quantity, calculations, marketTax, selectedRecipeId, state, updatePrice, useFocus }) => (
  <div className="bg-surface-container-low rounded-xl p-6 space-y-6 border border-outline-variant/10 shadow-lg relative overflow-hidden">
    {/* Background flare */}
    <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

    <h5 className="text-sm font-bold uppercase tracking-widest flex items-center justify-between gap-2 relative z-10">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-secondary text-sm">analytics</span>
        Detalhamento
      </div>
      <div className="text-[10px] bg-secondary/20 text-secondary px-2 py-0.5 rounded font-bold">LOTE ({quantity}x)</div>
    </h5>
    
    <div className="space-y-4 relative z-10">
      {calculations.journalsFilled > 0 && (
          <div className="flex justify-between items-center text-xs">
          <span className="text-on-surface-variant">Diários Preenchidos</span>
          <span className="font-bold text-primary">{Math.abs(calculations.journalsFilled).toFixed(2)} un</span>
        </div>
      )}

      <div className="flex justify-between items-center text-xs">
        <span className="text-on-surface-variant">Materiais (c/ RRR)</span>
        <span className="font-bold text-error">- {Math.round(calculations.totalMaterialCost).toLocaleString()}</span>
      </div>
      
      <div className="flex justify-between items-center text-xs">
        <span className="text-on-surface-variant">Taxa de Estação</span>
        <span className="font-bold text-error">- {Math.round(calculations.feeCost).toLocaleString()}</span>
      </div>
      
      <div className="flex justify-between items-center text-xs">
        <span className="text-on-surface-variant">Taxa de Mercado ({(marketTax * 100).toFixed(1)}%)</span>
        <span className="font-bold text-error">- {Math.round(calculations.taxCost).toLocaleString()}</span>
      </div>

      <div className="pt-4 border-t border-outline-variant/20 flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase text-secondary">Lucro com Diários</span>
          <span className="text-[10px] text-on-surface-variant">{calculations.journalProfit >= 0 ? 'Total ganho' : 'Prejuízo na revenda'}</span>
        </div>
        <span className={`text-lg font-bold ${calculations.journalProfit >= 0 ? 'text-primary' : 'text-error'}`}>
          {calculations.journalProfit >= 0 ? '+' : ''}{Math.round(calculations.journalProfit).toLocaleString()}
        </span>
      </div>
    </div>

    <div className="space-y-3 pt-4 border-t border-outline-variant/20 relative z-10">
      <div className="flex flex-col gap-2 bg-surface-container-highest/30 p-4 rounded-2xl border-2 border-primary/20 shadow-lg shadow-primary/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10">
            <span className="material-symbols-outlined text-4xl text-primary">sell</span>
          </div>
          <label className="text-[10px] font-black text-primary uppercase ml-1 tracking-tighter flex items-center gap-1.5 grayscale opacity-70">
            <span className="material-symbols-outlined text-sm">sell</span>
            Preço de Venda Final:
          </label>
          <CurrencyInput
            value={state.prices[selectedRecipeId]?.sell || 0}
            onChange={(newValue) => updatePrice(selectedRecipeId, 'sell', newValue)}
            className="bg-surface-container-lowest border border-primary/30 rounded-xl text-2xl font-black w-full text-primary shadow-inner focus:border-primary transition-all px-4 py-3 text-right outline-none ring-offset-2 focus:ring-2 focus:ring-primary/20"
          />
      </div>
    </div>
    
  </div>
);

const InverseCalculationBlock: React.FC<{
    recipe: any;
    calculations: any;
    ITEMS: any;
}> = ({ recipe, calculations, ITEMS }) => (
    <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-tertiary">inventory_2</span>
            <h5 className="text-sm font-bold uppercase tracking-widest text-on-surface">Cálculo Inverso (Provisão)</h5>
        </div>
        <p className="text-[11px] text-on-surface-variant mb-6 italic">Informe quantos recursos você já possui no inventário para simular a capacidade máxima de fabricação.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
            {recipe.materials.map((mat: any, idx: number) => {
                const matItem = ITEMS.find((i: any) => i.id === mat.itemId);
                const resourcesNeededPerItem = mat.amount * (1 - calculations.rrr);
                return (
                <div key={idx} className="space-y-1.5">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase ml-1">{matItem?.name} em Inventário</label>
                    <input 
                    type="number" 
                    min="0" 
                    placeholder="Ex: 500" 
                    className="w-full bg-surface-container-lowest border-none rounded-lg text-sm py-2.5 px-4 focus:ring-1 focus:ring-tertiary text-on-surface outline-none"
                    onChange={(e) => {
                        const available = parseInt(e.target.value) || 0;
                        const maxItems = Math.floor(available / resourcesNeededPerItem);
                        const resultEl = document.getElementById(`inverse-result-${idx}`);
                        const topResultEl = document.getElementById('inverse-result-top');
                        if (resultEl) resultEl.innerText = `Rende: ~${maxItems} crafts`;
                        
                        // Check all inputs to find limiting factor
                        let limit = Infinity;
                        recipe.materials.forEach((m: any, i: number) => {
                        const inputEl = document.querySelectorAll('input[placeholder="Ex: 500"]')[i] as HTMLInputElement;
                        if (inputEl) {
                            const val = parseInt(inputEl.value) || 0;
                            const req = m.amount * (1 - calculations.rrr);
                            limit = Math.min(limit, Math.floor(val / req));
                        }
                        });
                        const topElement = document.getElementById('inverse-result-top');
                        if (topElement && limit !== Infinity) topElement.innerText = `${limit}`;
                    }}
                    />
                    <p id={`inverse-result-${idx}`} className="text-[10px] text-tertiary font-bold ml-1 mt-1 block"></p>
                </div>
                )
            })}
            </div>
            
            <div className="bg-surface-container-high border border-outline-variant/20 flex flex-col items-center justify-center rounded-2xl p-6">
            <div className="text-center">
                <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Capacidade de Craft</p>
                <p className="text-4xl font-bold text-tertiary tight-tracking flex items-baseline justify-center gap-2">
                    <span id="inverse-result-top">0</span> 
                    <span className="text-base font-normal opacity-70">Itens</span>
                </p>
                <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-on-surface-variant bg-surface-container-lowest px-3 py-1.5 rounded-full border border-outline-variant/10 max-w-[200px] mx-auto text-center">
                <span className="material-symbols-outlined text-[14px]">info</span>
                Limitado pelo recurso que preencher primeiro.
                </div>
            </div>
            </div>
        </div>
    </div>
);
  return (
    <div className="p-4 md:p-8 space-y-8 md:space-y-10 max-w-[1600px] mx-auto relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-inverse-primary border border-primary text-on-primary px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <span className="material-symbols-outlined text-on-primary">check_circle</span>
          <span className="font-medium">Configuração salva no Dashboard!</span>
        </div>
      )}

      {/* Sync Toast Notification */}
      {syncMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-surface-container-highest border border-secondary text-secondary px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-in fade-in slide-in-from-top-4 duration-300 mt-16">
          {isSyncing ? (
            <span className="material-symbols-outlined text-secondary animate-spin">refresh</span>
          ) : (
            <span className="material-symbols-outlined text-primary">check_circle</span>
          )}
          <span className="font-medium">{syncMessage}</span>
        </div>
      )}

      {/* Hero Title & Actions Header */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-surface-container-low/50 p-6 rounded-2xl border border-outline-variant/10">
          <div>
            <h3 className="text-2xl md:text-4xl font-black tight-tracking text-on-surface flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-3xl md:text-4xl">calculate</span>
              Calculadora de Craft
            </h3>
            <p className="text-on-surface-variant text-sm md:text-base mt-2 font-medium">
              Simule lucros e otimize o uso do seu foco em tempo real.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            {/* Unified Action Group */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-surface-container rounded-xl p-2 border border-outline-variant/20 shadow-inner">
              
              <div className="flex items-center gap-2 px-2 py-1">
                <span className="material-symbols-outlined text-on-surface-variant text-lg">folder</span>
                <div className="relative">
                  <select
                    value={selectedGroup}
                    onChange={(e) => {
                      if (e.target.value === 'novo') {
                        setIsAddingGroup(true);
                      } else {
                        setSelectedGroup(e.target.value);
                        setIsAddingGroup(false);
                      }
                    }}
                    className="bg-transparent border-none outline-none text-sm font-bold text-on-surface focus:ring-0 cursor-pointer pr-6 appearance-none"
                  >
                    {state.groups.map(g => (
                      <option key={g} value={g} className="bg-surface-container-high text-on-surface">{g}</option>
                    ))}
                    <option value="novo" className="bg-surface-container-high text-primary font-bold">+ Novo Grupo</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-sm">expand_more</span>
                </div>
              </div>

              {isAddingGroup && (
                <div className="flex items-center gap-1 bg-surface-container-highest px-3 py-1.5 rounded-lg border border-primary/30">
                  <input
                    type="text"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Nome do grupo..."
                    className="w-24 md:w-32 bg-transparent outline-none border-none text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddGroup();
                      if (e.key === 'Escape') setIsAddingGroup(false);
                    }}
                  />
                  <button onClick={handleAddGroup} className="bg-primary text-on-primary rounded p-0.5 hover:bg-primary/90 transition-colors">
                     <span className="material-symbols-outlined text-[18px]">add</span>
                  </button>
                </div>
              )}

              <div className="h-6 w-px bg-outline-variant/20 hidden sm:block mx-1"></div>

              <button 
                onClick={handleSaveFavorite}
                className="cta-gradient px-6 py-2.5 rounded-lg font-black text-on-primary text-xs uppercase tracking-wider shadow-lg shadow-primary/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                Salvar nos Favoritos
              </button>
            </div>

            <button 
               onClick={handleSyncRecipePrices}
               disabled={isSyncing}
               title="Os preços são atualizados pela API de Albion Online Markets"
               className="flex items-center justify-center gap-2 bg-surface-container-high hover:bg-surface-container-highest px-5 py-3 rounded-xl text-sm font-bold border border-outline-variant/30 hover:border-primary/50 transition-all disabled:opacity-50 shadow-sm"
            >
               <span className={`material-symbols-outlined text-lg ${isSyncing ? 'animate-spin' : ''}`}>sync</span>
               <span>Atualizar Preço</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 md:gap-8 mt-6">
        {/* Left Panel: Configurações */}
        <div className="col-span-12 xl:col-span-3 space-y-6">
          <section className="bg-surface-container rounded-xl p-6 space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-secondary">tune</span>
              <h4 className="font-bold text-sm tracking-wide uppercase text-secondary">Configurações</h4>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase ml-1">Categoria</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-surface-container-lowest border-none rounded-lg text-sm py-2.5 focus:ring-1 focus:ring-secondary text-on-surface px-3 outline-none"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="flex gap-2">
                <div className="flex-1 space-y-1.5">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase ml-1">Tier</label>
                  <select
                    value={selectedTier}
                    onChange={(e) => setSelectedTier(e.target.value)}
                    className="w-full bg-surface-container-lowest border-none rounded-lg text-sm py-2.5 focus:ring-1 focus:ring-secondary text-on-surface px-3 outline-none"
                  >
                    {availableTiers.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="flex-1 space-y-1.5">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase ml-1">Encantamento</label>
                  <select
                    value={selectedEnchantment}
                    onChange={(e) => setSelectedEnchantment(e.target.value)}
                    className="w-full bg-surface-container-lowest border-none rounded-lg text-sm py-2.5 focus:ring-1 focus:ring-secondary text-on-surface px-3 outline-none"
                  >
                    {availableEnchantments.map(e => <option key={e} value={e}>.{e}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase ml-1">Item a Fabricar</label>
                <select
                  value={selectedRecipeId}
                  onChange={(e) => setSelectedRecipeId(e.target.value)}
                  className="w-full bg-surface-container-lowest border-none rounded-lg text-sm py-2.5 focus:ring-1 focus:ring-secondary text-on-surface px-3 outline-none"
                >
                  {availableRecipes.map(r => {
                    const i = ITEMS.find(item => item.id === r.itemId);
                    return <option key={r.itemId} value={r.itemId}>{i?.name}</option>;
                  })}
                </select>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-outline-variant/10">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase ml-1">Quantity (Batch Size)</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                  className="w-full bg-surface-container-lowest border-none rounded-lg text-sm py-2.5 px-4 focus:ring-1 focus:ring-secondary font-bold text-on-surface outline-none"
                />
              </div>

              <div className="bg-surface-container-high p-4 rounded-xl flex items-center gap-4 border border-primary/20">
                <div className="w-12 h-12 bg-surface-container-lowest rounded-lg flex items-center justify-center relative overflow-hidden shrink-0">
                  <img src={`https://render.albiononline.com/v1/item/${selectedRecipeId}.png`} alt={item.name} className="w-10 h-10 z-10" />
                  <div className="absolute bottom-0 right-0 bg-secondary px-1 text-[8px] font-bold text-on-secondary-fixed">{item.tier}.{item.enchantment}</div>
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold leading-tight truncate">{item.name}</p>
                  <p className="text-[10px] text-on-surface-variant truncate">{item.category}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-surface-container rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setUseFocus(!useFocus)}>
              <div className="flex flex-col">
                <label className="text-xs font-bold uppercase tracking-wider cursor-pointer">Use Focus</label>
                <p className="text-[10px] text-primary font-medium">Cost: {Math.round(calculations.totalFocusCost).toLocaleString()} focus</p>
              </div>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${useFocus ? 'bg-primary/20 border-primary/30' : 'bg-surface-container-highest border-outline-variant/30'} border`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full shadow-sm transition-all ${useFocus ? 'right-0.5 bg-primary' : 'left-0.5 bg-on-surface-variant'}`}></div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase">Return Rate (RRR%)</label>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                {rrrPresets.slice(0, 3).map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => handleRrrClick(preset)}
                    className={`text-[10px] py-1.5 rounded border transition-all truncate px-1 ${
                      rrr === preset.value
                        ? 'bg-primary/10 border-primary/50 text-primary'
                        : 'bg-surface-container-high border-outline-variant/30 hover:border-primary/30 text-on-surface-variant'
                    }`}
                    title={preset.desc}
                  >
                    {preset.value}%
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  value={rrr}
                  onChange={(e) => setRrr(Number(e.target.value) || 0)}
                  className="w-full bg-surface-container-lowest border-none rounded-lg text-sm py-2.5 px-4 focus:ring-1 focus:ring-secondary text-on-surface outline-none"
                />
                <span className="text-on-surface-variant font-bold text-sm">%</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase">Station Tax (Silver/Item)</label>
              <input
                type="number"
                value={usageFee}
                onChange={(e) => setUsageFee(Number(e.target.value) || 0)}
                className="w-full bg-surface-container-lowest border-none rounded-lg text-sm py-2.5 px-4 focus:ring-1 focus:ring-secondary text-on-surface outline-none"
              />
            </div>
          </section>
        </div>

        {/* Middle + Right Panel: Resultados */}
        <div className="col-span-12 xl:col-span-9 space-y-6 md:space-y-8">
          {/* High-Fidelity Results Grid (Scaled for Batch) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-surface-container rounded-2xl p-4 md:p-6 flex flex-col justify-between h-32 md:h-36 relative overflow-hidden border-b-2 border-outline-variant/20">
              <span className="text-[10px] md:text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Custo Total ({quantity}x)</span>
              <div>
                <span className="text-xl md:text-2xl font-bold tight-tracking text-error">{Math.round(calculations.totalCost).toLocaleString()}</span>
                <span className="text-xs md:text-sm text-on-surface-variant ml-1 font-medium">Silver</span>
              </div>
            </div>
            <div className="bg-surface-container rounded-2xl p-4 md:p-6 flex flex-col justify-between h-32 md:h-36 relative overflow-hidden border-b-2 border-outline-variant/20">
              <span className="text-[10px] md:text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Receita Bruta ({quantity}x)</span>
              <div>
                <span className="text-xl md:text-2xl font-bold tight-tracking text-on-surface">{Math.round(calculations.grossRevenue).toLocaleString()}</span>
                <span className="text-xs md:text-sm text-on-surface-variant ml-1 font-medium">Silver</span>
              </div>
            </div>
            <div className={`bg-surface-container rounded-2xl p-4 md:p-6 flex flex-col justify-between h-32 md:h-36 relative overflow-hidden border-b-2 ${calculations.netProfit >= 0 ? 'border-primary/40' : 'border-error/40'}`}>
              <div className="flex justify-between items-start">
                <span className={`text-[10px] md:text-[11px] font-bold uppercase tracking-widest ${calculations.netProfit >= 0 ? 'text-primary' : 'text-error'}`}>Lucro Líquido</span>
                <span className={`material-symbols-outlined ${calculations.netProfit >= 0 ? 'text-primary' : 'text-error'}`}>
                  {calculations.netProfit >= 0 ? 'trending_up' : 'trending_down'}
                </span>
              </div>
              <div>
                <span className={`text-xl md:text-2xl font-bold tight-tracking ${calculations.netProfit >= 0 ? 'text-primary' : 'text-error'}`}>
                  {calculations.netProfit >= 0 ? '+ ' : '- '}{Math.abs(Math.round(calculations.netProfit)).toLocaleString()}
                </span>
                <p className="text-[10px] text-on-surface-variant mt-1">Estimativa de mercado atual</p>
              </div>
            </div>
            <div className="bg-surface-container rounded-2xl p-4 md:p-6 flex flex-col justify-between h-32 md:h-36 relative overflow-hidden border-b-2 border-secondary/40">
              <div className="flex justify-between items-start">
                <span className="text-[10px] md:text-[11px] font-bold text-secondary uppercase tracking-widest">ROI %</span>
                <div className={`px-2 py-0.5 rounded font-bold text-[8px] md:text-[10px] ${calculations.roi > 30 ? 'bg-secondary/10 text-secondary' : calculations.roi > 0 ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error'}`}>
                  {calculations.roi > 30 ? 'EXCELENTE' : calculations.roi > 0 ? 'NO VERDE' : 'PREJUÍZO'}
                </div>
              </div>
              <div>
                <span className={`text-2xl md:text-3xl font-bold tight-tracking ${calculations.roi > 0 ? 'text-secondary' : 'text-error'}`}>
                  {calculations.roi.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Main Work Area */}
          <div className="grid grid-cols-12 gap-6">
            
            {/* Left Column (Buying List + Details on Mobile) */}
            <div className="col-span-12 xl:col-span-8 flex flex-col gap-6">
              
              {/* Buying List - Always First */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h5 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">shopping_cart</span>
                    Lista de Compras (Lote)
                  </h5>
                   <button 
                    onClick={handleSyncRecipePrices} 
                    disabled={isSyncing} 
                    title="Os preços são atualizados pela API de Albion Online Markets"
                    className="hidden md:flex text-[10px] font-bold text-on-surface-variant hover:text-primary uppercase items-center gap-1 disabled:opacity-50 transition-colors"
                  >
                    <span className={`material-symbols-outlined text-sm ${isSyncing ? 'animate-spin' : ''}`}>sync</span> Atualizar Preço
                  </button>
                </div>
                
                <div className="space-y-2">
                  {calculations.materialsCostDetails.map((mat, idx) => (
                    <div key={idx} className="bg-surface-container-low hover:bg-surface-container-high transition-colors p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-surface-container-lowest rounded-lg p-1 shrink-0 flex items-center justify-center">
                          <img src={`https://render.albiononline.com/v1/item/${mat.itemId}.png`} alt={mat.name} className="max-w-full max-h-full" />
                        </div>
                        <div>
                          <p className="text-xs font-bold">{mat.name}</p>
                          <p className="text-[10px] text-on-surface-variant font-medium">Qtd RRR: {Math.ceil(mat.effectiveAmount)} unidades</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-8 bg-surface-container sm:bg-transparent p-3 sm:p-0 rounded-lg">
                        <div className="text-left sm:text-right bg-surface-container-highest/30 p-3 rounded-xl border border-outline-variant/10">
                          <p className="text-[10px] text-on-surface-variant uppercase font-black mb-1.5 tracking-tighter">Custo Unitário</p>
                          <CurrencyInput
                            value={mat.price}
                            onChange={(newValue) => updatePrice(mat.itemId, 'buy', newValue)}
                            className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-lg font-black w-full min-w-[120px] sm:w-[180px] text-secondary shadow-sm focus:border-secondary transition-all px-3 py-2 text-right outline-none"
                          />
                        </div>
                        <div className="text-right w-24">
                          <p className="text-[10px] text-on-surface-variant uppercase font-bold mb-1">Custo Total</p>
                          <p className="text-sm font-bold text-secondary">{Math.round(mat.cost).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Journal Input Row */}
                  {recipe.journalId && (
                    <div className="bg-surface-container-low hover:bg-surface-container-high transition-all p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-2 border-amber-500/20 shadow-lg shadow-amber-900/5">
                      <div className="flex items-center gap-5 border-l-4 border-amber-500 pl-4">
                        <div className="w-14 h-14 bg-surface-container-lowest rounded-xl p-2 shrink-0 flex items-center justify-center shadow-inner">
                          <img src={`https://render.albiononline.com/v1/item/${recipe.journalId}.png`} alt="Journal" className="max-w-full max-h-full" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-amber-500 uppercase tracking-tighter italic">Diário (Vazio)</p>
                          <p className="text-xs text-on-surface-variant font-bold mt-0.5">Requeridos: <span className="text-amber-400">{Math.ceil(calculations.journalsFilled)}</span> unidades</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-4 bg-surface-container-highest/20 sm:bg-transparent p-4 sm:p-0 rounded-xl w-full sm:w-auto">
                         <div className="text-right">
                          <p className="text-[10px] text-on-surface-variant uppercase font-black mb-1.5 tracking-tighter">Preço Compra</p>
                          <CurrencyInput
                            value={state.prices[recipe.journalId]?.buy || 0}
                            onChange={(newValue) => updatePrice(recipe.journalId, 'buy', newValue)}
                            className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-lg font-black w-full min-w-[120px] sm:w-[150px] text-amber-500 shadow-sm focus:border-amber-400 transition-all px-3 py-2 text-right outline-none"
                          />
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-on-surface-variant uppercase font-black mb-1.5 tracking-tighter">Valor Cheio</p>
                          <CurrencyInput
                             value={state.prices[recipe.journalId.replace('_EMPTY', '_FULL')]?.sell || 0}
                             onChange={(newValue) => updatePrice(recipe.journalId.replace('_EMPTY', '_FULL'), 'sell', newValue)}
                             className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-lg font-black w-full min-w-[120px] sm:w-[150px] text-primary shadow-sm focus:border-primary transition-all px-3 py-2 text-right outline-none"
                           />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Detalhamento Block - Only visible here for Mobile, hidden on XL here */}
              <div className="xl:hidden">
                <DetailsBlock quantity={quantity} calculations={calculations} marketTax={marketTax} selectedRecipeId={selectedRecipeId} state={state} updatePrice={updatePrice} useFocus={useFocus} />
              </div>

              {/* Inverse Calculation - Full width on bottom of Left Column for Desktop/XL context */}
              <div className="hidden xl:block">
                 <InverseCalculationBlock recipe={recipe} calculations={calculations} ITEMS={ITEMS} />
              </div>
            </div>

            {/* Right Column (Details on Desktop) */}
            <div className="hidden xl:flex xl:col-span-4 flex-col gap-6">
               <DetailsBlock quantity={quantity} calculations={calculations} marketTax={marketTax} selectedRecipeId={selectedRecipeId} state={state} updatePrice={updatePrice} useFocus={useFocus} />
            </div>

            {/* Inverse Calculation - Visible here for mobile as last item */}
            <div className="col-span-12 xl:hidden">
              <InverseCalculationBlock recipe={recipe} calculations={calculations} ITEMS={ITEMS} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
