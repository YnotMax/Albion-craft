import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { ITEMS, RECIPES, SPEC_NODES } from '../constants';
import { CurrencyInput } from '../components/CurrencyInput';
import { MarketSelector } from '../components/MarketSelector';
import { formatTimeAgo } from '../utils/format';
import { Calculator as CalcIcon, Save, Star, TrendingUp, TrendingDown, Settings, CheckCircle2, RefreshCw, Clock, Info } from 'lucide-react';

import { calculateFocusCost } from '../utils/focus';

export const Calculator: React.FC = () => {
  const { state, updatePrice, addFavorite, syncPrices, isSyncing, syncMessage, addGroup, setCalculatorState } = useAppContext();

  const categories = useMemo(() => Array.from(new Set(RECIPES.map(r => ITEMS.find(i => i.id === r.itemId)?.category).filter(Boolean))) as string[], []);

  // Load initial state from AppContext
  const initialCalcState = state.calculatorState || {
    selectedCategory: categories[0] || '',
    selectedTier: '',
    selectedEnchantment: '',
    selectedRecipeId: '',
    usageFee: 500,
    rrr: 15.2,
    useFocus: false
  };

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCalcState.selectedCategory);

  const availableTiers = useMemo(() => {
    return Array.from(new Set(RECIPES.filter(r => ITEMS.find(i => i.id === r.itemId)?.category === selectedCategory).map(r => ITEMS.find(i => i.id === r.itemId)?.tier).filter(Boolean))).sort() as string[];
  }, [selectedCategory]);

  const [selectedTier, setSelectedTier] = useState<string>(initialCalcState.selectedTier || availableTiers[0] || '');

  const availableEnchantments = useMemo(() => {
    return Array.from(new Set(RECIPES.filter(r => {
      const item = ITEMS.find(i => i.id === r.itemId);
      return item?.category === selectedCategory && item?.tier === selectedTier;
    }).map(r => ITEMS.find(i => i.id === r.itemId)?.enchantment).filter(Boolean))).sort() as string[];
  }, [selectedCategory, selectedTier]);

  const [selectedEnchantment, setSelectedEnchantment] = useState<string>(initialCalcState.selectedEnchantment || availableEnchantments[0] || '');

  const availableRecipes = useMemo(() => {
    return RECIPES.filter(r => {
      const item = ITEMS.find(i => i.id === r.itemId);
      return item?.category === selectedCategory && item?.tier === selectedTier && item?.enchantment === selectedEnchantment;
    });
  }, [selectedCategory, selectedTier, selectedEnchantment]);

  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(initialCalcState.selectedRecipeId || availableRecipes[0]?.itemId || '');

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
      // Effective amount considering RRR and quantity
      const baseAmount = mat.amount * quantity;
      const effectiveAmount = baseAmount * (1 - currentRrr);
      const cost = effectiveAmount * price;
      totalMaterialCost += cost;
      return { ...mat, name: matItem?.name, price, effectiveAmount, cost, baseAmount };
    });

    // Usage fee
    const feeCost = usageFee * quantity;

    // Journal calculation
    let journalProfit = 0;
    let journalsFilled = 0;
    if (recipe.journalId) {
      const emptyPrice = state.prices[recipe.journalId]?.buy || 0;
      const fullId = recipe.journalId.replace('_EMPTY', '_FULL');
      const fullPrice = state.prices[fullId]?.sell || 0;

      const journalCapacity = recipe.fame * 10;
      journalsFilled = (recipe.fame * quantity) / journalCapacity;

      journalProfit = journalsFilled * (fullPrice - emptyPrice);
    }

    const itemSellPrice = state.prices[item.id]?.sell || 0;
    const grossRevenue = itemSellPrice * quantity;
    const taxCost = grossRevenue * marketTax;
    const netRevenue = grossRevenue - taxCost;

    const totalCost = totalMaterialCost + feeCost;
    const grossProfit = grossRevenue - totalCost + journalProfit;
    const netProfit = netRevenue - totalCost + journalProfit;

    const totalFocusCost = focusCost * quantity;
    const silverPerFocus = useFocus && totalFocusCost > 0 ? netProfit / totalFocusCost : 0;
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
      netProfit,
      silverPerFocus,
      roi,
      journalsFilled,
      totalFocusCost
    };
  }, [recipe, item, rrr, useFocus, state.prices, usageFee, marketTax, focusCost, quantity]);

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

  const [resourceInventory, setResourceInventory] = useState<Record<string, number>>({});

  const maxCraftable = useMemo(() => {
    if (!recipe) return 0;
    let minItems = Infinity;
    recipe.materials.forEach(mat => {
      const available = resourceInventory[mat.itemId] || 0;
      if (available === 0) {
        minItems = 0;
      } else {
        const canCraft = Math.floor(available / mat.amount);
        minItems = Math.min(minItems, canCraft);
      }
    });
    return minItems === Infinity ? 0 : minItems;
  }, [recipe, resourceInventory]);

  if (!recipe || !calculations) return <div>Carregando...</div>;

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-emerald-900 border border-emerald-500 text-emerald-100 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="font-medium">Configuração salva no Dashboard!</span>
        </div>
      )}

      {/* Sync Toast Notification */}
      {syncMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-zinc-900 border border-amber-500/50 text-amber-100 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-in fade-in slide-in-from-top-4 duration-300 mt-16">
          {isSyncing ? (
            <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />
          ) : (
            <Info className="w-5 h-5 text-amber-400" />
          )}
          <span className="font-medium">{syncMessage}</span>
        </div>
      )}

      {/* RRR Toast Notification */}
      {rrrToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-zinc-900 border border-amber-500 text-amber-100 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Info className="w-5 h-5 text-amber-400" />
          <span className="font-medium">{rrrToast}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Calculadora de Craft</h2>
          <p className="text-zinc-400 mt-1">Simule lucros e otimize o uso do seu foco.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 group/pasta relative">
            <label className="text-[10px] text-zinc-500 uppercase font-bold">Pasta:</label>
            {isAddingGroup ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="bg-zinc-950 border border-zinc-600 rounded px-2 py-0.5 text-xs text-zinc-100 w-24 focus:outline-none focus:border-amber-500"
                  placeholder="Nome..."
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleAddGroup()}
                />
                <button onClick={handleAddGroup} className="text-emerald-500 hover:text-emerald-400 text-xs font-bold">OK</button>
                <button onClick={() => setIsAddingGroup(false)} className="text-red-500 hover:text-red-400 text-xs font-bold">X</button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="bg-transparent text-xs text-zinc-100 font-semibold focus:outline-none cursor-pointer"
                >
                  {state.groups.map(g => <option key={g} value={g} className="bg-zinc-900">{g}</option>)}
                </select>
                <button
                  onClick={() => setIsAddingGroup(true)}
                  className="text-zinc-500 hover:text-amber-500 transition-colors"
                  title="Nova Pasta"
                >
                  <CalcIcon className="w-3 h-3" />
                </button>
              </div>
            )}
            {/* Tooltip Pasta */}
            <div className="absolute top-full left-0 mt-2 w-48 p-2 bg-zinc-900 border border-zinc-700 rounded shadow-xl text-[10px] text-zinc-400 opacity-0 invisible group-hover/pasta:opacity-100 group-hover/pasta:visible transition-all z-50 pointer-events-none">
              Escolha em qual pasta do Dashboard este craft será salvo.
            </div>
          </div>
          <MarketSelector />
          <div className="relative group/fav w-full sm:w-auto">
            <button
              onClick={handleSaveFavorite}
              className={`w-full sm:w-auto font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 border ${isFavorited
                ? 'bg-amber-500/20 text-amber-500 border-amber-500/50 hover:bg-amber-500/30'
                : 'bg-zinc-800 hover:bg-zinc-700 text-amber-500 border-zinc-700'
                }`}
            >
              <Star className={`w-5 h-5 ${isFavorited ? 'fill-amber-500' : ''}`} />
              {isFavorited ? 'Favoritado' : 'Favoritar'}
            </button>
            {/* Tooltip Favoritar */}
            <div className="absolute top-full right-0 mt-2 w-48 p-2 bg-zinc-900 border border-zinc-700 rounded shadow-xl text-[10px] text-zinc-400 opacity-0 invisible group-hover/fav:opacity-100 group-hover/fav:visible transition-all z-50 pointer-events-none text-right">
              {isFavorited ? 'Atualizar as configurações deste item no Dashboard.' : 'Salva esta configuração no Dashboard para acompanhar o lucro em tempo real.'}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configurações */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-zinc-400" />
              Configurações
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1 block">Categoria</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg py-2 px-3 text-zinc-100 focus:outline-none focus:border-amber-500"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1 block">Tier</label>
                  <select
                    value={selectedTier}
                    onChange={(e) => setSelectedTier(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg py-2 px-3 text-zinc-100 focus:outline-none focus:border-amber-500"
                  >
                    {availableTiers.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1 block">Encantamento</label>
                  <select
                    value={selectedEnchantment}
                    onChange={(e) => setSelectedEnchantment(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg py-2 px-3 text-zinc-100 focus:outline-none focus:border-amber-500"
                  >
                    {availableEnchantments.map(e => <option key={e} value={e}>.{e}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-1">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1 block">Quantidade</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg py-2 px-3 text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1 block">Item para Craftar</label>
                  <select
                    value={selectedRecipeId}
                    onChange={(e) => setSelectedRecipeId(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg py-2 px-3 text-zinc-100 focus:outline-none focus:border-amber-500"
                  >
                    {availableRecipes.map(r => {
                      const i = ITEMS.find(item => item.id === r.itemId);
                      const isFav = state.favorites.some(f => f.itemId === r.itemId);
                      return <option key={r.itemId} value={r.itemId}>{isFav ? '★ ' : ''}{i?.name}</option>;
                    })}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-1 group/rrr relative">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block flex items-center gap-1">
                    Taxa de Retorno (RRR %)
                    <Info className="w-3 h-3 text-zinc-600" />
                  </label>
                  {/* Tooltip RRR */}
                  <div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-zinc-900 border border-zinc-700 rounded shadow-xl text-[10px] text-zinc-400 opacity-0 invisible group-hover/rrr:opacity-100 group-hover/rrr:visible transition-all z-50 pointer-events-none">
                    Porcentagem de recursos que voltam para você após o craft. Cidades com bônus e o uso de Foco aumentam este valor.
                  </div>
                </div>
                <div className="relative mb-2">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={rrr}
                    onChange={(e) => setRrr(parseFloat(e.target.value) || 0)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg py-2 px-3 pr-8 text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">%</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {rrrPresets.map(preset => (
                    <div key={preset.value} className="relative group">
                      <button
                        onClick={() => handleRrrClick(preset)}
                        className={`text-[11px] font-medium bg-zinc-800 hover:bg-zinc-700 ${preset.color} px-2.5 py-1.5 rounded-md border border-zinc-700 transition-colors`}
                      >
                        {preset.label}
                      </button>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] px-2.5 py-1.5 bg-zinc-800 text-zinc-200 text-xs rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 border border-zinc-700 pointer-events-none text-center">
                        {preset.desc}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-700"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="group/fee relative">
                <CurrencyInput
                  label="Taxa da Estação (Prata)"
                  value={usageFee}
                  onChange={setUsageFee}
                />
                {/* Tooltip Taxa */}
                <div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-zinc-900 border border-zinc-700 rounded shadow-xl text-[10px] text-zinc-400 opacity-0 invisible group-hover/fee:opacity-100 group-hover/fee:visible transition-all z-50 pointer-events-none">
                  Custo cobrado pela loja (estação de craft) por cada item fabricado.
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-zinc-950 rounded-lg border border-zinc-800 group/focus relative">
                <div>
                  <span className="text-sm font-semibold text-zinc-100 block flex items-center gap-1">
                    Usar Foco
                    <Info className="w-3 h-3 text-zinc-600" />
                  </span>
                  <span className="text-xs text-zinc-500">Custo: {calculations.totalFocusCost} foco</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={useFocus} onChange={(e) => setUseFocus(e.target.checked)} />
                  <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
                {/* Tooltip Foco */}
                <div className="absolute bottom-full right-0 mb-2 w-64 p-2 bg-zinc-900 border border-zinc-700 rounded shadow-xl text-[10px] text-zinc-400 opacity-0 invisible group-hover/focus:opacity-100 group-hover/focus:visible transition-all z-50 pointer-events-none text-right">
                  O uso de Foco aumenta drasticamente a Taxa de Retorno (RRR), economizando recursos valiosos.
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-zinc-400" />
                Preços Rápidos
              </h3>
              <button
                onClick={handleSyncRecipePrices}
                disabled={isSyncing}
                className="text-xs flex items-center gap-1.5 bg-amber-600/20 text-amber-500 hover:bg-amber-600/30 py-1.5 px-3 rounded-md transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                Sincronizar
              </button>
            </div>

            <div className="space-y-4">
              {/* Item Final */}
              <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-amber-500">{item?.name}</span>
                  <span className="text-xs text-zinc-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {formatTimeAgo(state.prices[recipe.itemId]?.updatedAt)}</span>
                </div>
                <CurrencyInput
                  label="Preço de Venda"
                  value={state.prices[recipe.itemId]?.sell || 0}
                  onChange={(val) => updatePrice(recipe.itemId, state.prices[recipe.itemId]?.buy || 0, val)}
                  placeholder="0"
                />
              </div>

              {/* Materiais */}
              {recipe.materials.map(mat => {
                const matItem = ITEMS.find(i => i.id === mat.itemId);
                return (
                  <div key={mat.itemId} className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-zinc-300">{matItem?.name}</span>
                      <span className="text-xs text-zinc-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {formatTimeAgo(state.prices[mat.itemId]?.updatedAt)}</span>
                    </div>
                    <CurrencyInput
                      label="Preço de Compra"
                      value={state.prices[mat.itemId]?.buy || 0}
                      onChange={(val) => updatePrice(mat.itemId, val, state.prices[mat.itemId]?.sell || 0)}
                      placeholder="0"
                    />
                  </div>
                );
              })}

              {/* Diários */}
              {recipe.journalId && (
                <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-zinc-300">Diários</span>
                    <span className="text-xs text-zinc-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {formatTimeAgo(state.prices[recipe.journalId]?.updatedAt)}</span>
                  </div>
                  <CurrencyInput
                    label="Comprar Vazio"
                    value={state.prices[recipe.journalId]?.buy || 0}
                    onChange={(val) => updatePrice(recipe.journalId!, val, state.prices[recipe.journalId!]?.sell || 0)}
                    placeholder="0"
                  />
                  <CurrencyInput
                    label="Vender Cheio"
                    value={state.prices[recipe.journalId.replace('_EMPTY', '_FULL')]?.sell || 0}
                    onChange={(val) => updatePrice(recipe.journalId!.replace('_EMPTY', '_FULL'), state.prices[recipe.journalId!.replace('_EMPTY', '_FULL')]?.buy || 0, val)}
                    placeholder="0"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-zinc-100 mb-6 flex items-center gap-2">
              <CalcIcon className="w-6 h-6 text-emerald-500" />
              Resultados do Craft ({quantity}x)
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
                <span className="text-xs text-zinc-500 uppercase font-semibold tracking-wider block mb-1">Custo Total</span>
                <span className="text-2xl font-mono text-red-400">{Math.round(calculations.totalCost).toLocaleString()}</span>
              </div>
              <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
                <span className="text-xs text-zinc-500 uppercase font-semibold tracking-wider block mb-1">Receita Bruta</span>
                <span className="text-2xl font-mono text-zinc-100">{Math.round(calculations.grossRevenue).toLocaleString()}</span>
              </div>
              <div className={`col-span-2 p-5 rounded-lg border ${calculations.netProfit >= 0 ? 'bg-emerald-950/30 border-emerald-900/50' : 'bg-red-950/30 border-red-900/50'}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xs text-zinc-400 uppercase font-semibold tracking-wider block mb-1">Lucro Líquido</span>
                    <div className="flex items-center gap-2">
                      {calculations.netProfit >= 0 ? <TrendingUp className="w-6 h-6 text-emerald-500" /> : <TrendingDown className="w-6 h-6 text-red-500" />}
                      <span className={`text-4xl font-mono font-bold ${calculations.netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {Math.round(calculations.netProfit).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-6 text-right">
                    <div className="group/roi relative">
                      <span className="text-xs text-zinc-400 uppercase font-semibold tracking-wider block mb-1 flex items-center gap-1 justify-end">
                        ROI
                        <Info className="w-3 h-3 text-zinc-600" />
                      </span>
                      <span className={`text-2xl font-mono font-bold ${calculations.roi > 20 ? 'text-emerald-400' : calculations.roi > 0 ? 'text-amber-400' : 'text-red-400'}`}>
                        {calculations.roi.toFixed(1)}%
                      </span>
                      {/* Tooltip ROI */}
                      <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-zinc-900 border border-zinc-700 rounded shadow-xl text-[10px] text-zinc-400 opacity-0 invisible group-hover/roi:opacity-100 group-hover/roi:visible transition-all z-50 pointer-events-none text-right">
                        Retorno sobre Investimento. Quanto você ganha para cada 100 pratas gastas.
                      </div>
                    </div>
                    {useFocus && (
                      <div className="group/spf relative">
                        <span className="text-xs text-zinc-400 uppercase font-semibold tracking-wider block mb-1 flex items-center gap-1 justify-end">
                          Prata / Foco
                          <Info className="w-3 h-3 text-zinc-600" />
                        </span>
                        <span className="text-2xl font-mono text-amber-400">{calculations.silverPerFocus.toFixed(2)}</span>
                        {/* Tooltip SPF */}
                        <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-zinc-900 border border-zinc-700 rounded shadow-xl text-[10px] text-zinc-400 opacity-0 invisible group-hover/spf:opacity-100 group-hover/spf:visible transition-all z-50 pointer-events-none text-right">
                          Eficiência do seu Foco. Quanto de prata você lucra para cada ponto de foco gasto.
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Save className="w-4 h-4 text-amber-500" />
                Lista de Compras de Recursos
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {calculations.materialsCostDetails.map(mat => (
                  <div key={mat.itemId} className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium text-zinc-100">{mat.name}</div>
                      <div className="text-[10px] text-zinc-500 uppercase font-bold">Total: {Math.round(mat.baseAmount)} un</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono text-zinc-300">{Math.round(mat.cost).toLocaleString()} Prata</div>
                      <div className="text-[10px] text-zinc-500">c/ {Math.round(rrr)}% RRR</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-2">Detalhamento</h4>

              {calculations.journalsFilled > 0 && (
                <div className="flex justify-between text-sm py-2 border-b border-zinc-800/50 bg-zinc-950/50 px-3 rounded-lg mb-4">
                  <span className="text-zinc-300 font-medium">Diários Preenchidos</span>
                  <span className="font-mono text-amber-400 font-bold">{calculations.journalsFilled.toFixed(2)} un</span>
                </div>
              )}

              <div className="flex justify-between text-sm py-2 border-b border-zinc-800/50">
                <span className="text-zinc-400">Materiais (c/ {Math.round(calculations.rrr * 100)}% RRR)</span>
                <span className="font-mono text-red-400">-{Math.round(calculations.totalMaterialCost).toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-sm py-2 border-b border-zinc-800/50">
                <span className="text-zinc-400">Taxa da Estação</span>
                <span className="font-mono text-red-400">-{Math.round(calculations.feeCost).toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-sm py-2 border-b border-zinc-800/50">
                <span className="text-zinc-400">Taxa de Mercado ({(marketTax * 100).toFixed(1)}%)</span>
                <span className="font-mono text-red-400">-{Math.round(calculations.taxCost).toLocaleString()}</span>
              </div>

              {calculations.journalProfit > 0 && (
                <div className="flex justify-between text-sm py-2 border-b border-zinc-800/50">
                  <span className="text-zinc-400">Lucro com Diários</span>
                  <span className="font-mono text-emerald-400">+{Math.round(calculations.journalProfit).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Cálculo Inverso */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm mt-6">
            <h3 className="text-lg font-bold text-zinc-100 mb-4 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-amber-500" />
              Cálculo Inverso (Provisão)
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              Informe quantos recursos você já possui para saber quantos itens pode fabricar.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {recipe.materials.map(mat => {
                const matItem = ITEMS.find(i => i.id === mat.itemId);
                return (
                  <div key={mat.itemId}>
                    <label className="text-[10px] font-semibold text-zinc-500 uppercase mb-1 block">{matItem?.name}</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="Qtd. disponível..."
                      value={resourceInventory[mat.itemId] || ''}
                      onChange={(e) => setResourceInventory(prev => ({ ...prev, [mat.itemId]: parseInt(e.target.value) || 0 }))}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg py-1.5 px-3 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                );
              })}
            </div>

            {maxCraftable > 0 ? (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-amber-500 uppercase font-bold block">Você pode fabricar:</span>
                  <span className="text-2xl font-bold text-amber-400">{maxCraftable} {item?.name}s</span>
                </div>
                <button
                  onClick={() => setQuantity(maxCraftable)}
                  className="bg-amber-500 hover:bg-amber-600 text-zinc-900 text-xs font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  Usar esta Qtd.
                </button>
              </div>
            ) : (
              <div className="text-center py-4 text-zinc-500 text-sm border border-zinc-800 border-dashed rounded-lg">
                Insira a quantidade de recursos para calcular.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
