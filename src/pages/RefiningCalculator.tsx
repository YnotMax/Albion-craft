import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';

const REFINING_RESOURCES = [
  { id: 'WOOD', name: 'Madeira', rawPrefix: 'WOOD', refinedPrefix: 'PLANKS' },
  { id: 'ORE', name: 'Minério', rawPrefix: 'ORE', refinedPrefix: 'METALBAR' },
  { id: 'FIBER', name: 'Fibra', rawPrefix: 'FIBER', refinedPrefix: 'CLOTH' },
  { id: 'HIDE', name: 'Couro', rawPrefix: 'HIDE', refinedPrefix: 'LEATHER' }
];

const TIERS = ['T4', 'T5', 'T6', 'T7', 'T8'];
const ENCHANTS = ['0', '1', '2', '3', '4'];

const REFINING_COST_RAW: Record<string, number> = {
  'T4': 2,
  'T5': 3,
  'T6': 4,
  'T7': 5,
  'T8': 5
};

export const RefiningCalculator: React.FC = () => {
  const { state, updatePrice } = useAppContext();
  const [selectedRes, setSelectedRes] = useState(REFINING_RESOURCES[0].id);
  const [selectedTier, setSelectedTier] = useState('T4');
  const [selectedEnch, setSelectedEnch] = useState('0');
  
  const [rrr, setRrr] = useState<number>(15.2); // Base no focus
  const [usageFee, setUsageFee] = useState<number>(500);

  const res = REFINING_RESOURCES.find(r => r.id === selectedRes)!;
  
  // Generating IDs based on standard Albion schema
  const rawId = `${selectedTier}_${res.rawPrefix}${selectedEnch !== '0' ? '@' + selectedEnch : ''}`;
  const refinedId = `${selectedTier}_${res.refinedPrefix}${selectedEnch !== '0' ? '@' + selectedEnch : ''}`;
  
  // Previous tier refined material is required
  const prevTier = selectedTier === 'T4' ? 'T3' : `T${parseInt(selectedTier[1]) - 1}`;
  const prevRefinedId = `${prevTier}_${res.refinedPrefix}${selectedEnch !== '0' ? '@' + selectedEnch : ''}`;

  const rawPrice = state.prices[rawId] || { buy: 0, sell: 0 };
  const prevRefinedPrice = state.prices[prevRefinedId] || { buy: 0, sell: 0 };
  const refinedPrice = state.prices[refinedId] || { buy: 0, sell: 0 };

  const rawAmount = REFINING_COST_RAW[selectedTier] || 2;
  const prevRefinedAmount = 1;

  // Basic math: Calculate total cost
  const totalCost = (rawPrice.sell * rawAmount) + (prevRefinedPrice.sell * prevRefinedAmount);
  // Apply Return Rate
  const returnFactor = 1 - (rrr / 100);
  const costAfterReturn = totalCost * returnFactor;
  // Item value (approximate base)
  const baseItemValue = 100; // placeholder
  const tax = (baseItemValue * 0.1125 * (usageFee / 100));
  
  const finalCost = costAfterReturn + tax;
  const sellValue = refinedPrice.buy * 0.935; // tax 6.5%
  
  const profit = sellValue - finalCost;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto font-['Inter']">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-on-surface">Calculadora de Refino</h1>
          <p className="text-sm text-on-surface-variant mt-1">Calcule o lucro de transformar material bruto em material refinado.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/20 shadow-sm flex flex-col">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Recurso</label>
          <select value={selectedRes} onChange={e => setSelectedRes(e.target.value)} className="bg-surface text-on-surface p-2.5 rounded-lg border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-semibold">
            {REFINING_RESOURCES.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
        <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/20 shadow-sm flex flex-col">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Tier</label>
          <select value={selectedTier} onChange={e => setSelectedTier(e.target.value)} className="bg-surface text-on-surface p-2.5 rounded-lg border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-semibold">
            {TIERS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/20 shadow-sm flex flex-col">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Encantamento</label>
          <select value={selectedEnch} onChange={e => setSelectedEnch(e.target.value)} className="bg-surface text-on-surface p-2.5 rounded-lg border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-semibold">
            {ENCHANTS.map(e => <option key={e} value={e}>.{e}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/20 shadow-sm">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 block">Retorno de Recursos (RRR %)</label>
          <input type="number" step="0.1" value={rrr} onChange={e => setRrr(Number(e.target.value))} className="w-full bg-surface text-on-surface p-2.5 rounded-lg border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-semibold" />
        </div>
        <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/20 shadow-sm">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 block">Taxa da Barraca</label>
          <input type="number" value={usageFee} onChange={e => setUsageFee(Number(e.target.value))} className="w-full bg-surface text-on-surface p-2.5 rounded-lg border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-semibold" />
        </div>
      </div>

      <div className="bg-surface-container rounded-xl p-6 border border-outline-variant/20 shadow-sm mt-6">
        <h3 className="text-lg font-bold text-on-surface mb-4">Resultado do Refino ({refinedId})</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-surface flex flex-col">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Custo Bruto (Sem RRR)</span>
            <span className="text-lg font-bold text-error">{Math.round(totalCost).toLocaleString()}</span>
          </div>
          <div className="p-4 rounded-lg bg-surface flex flex-col">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Custo Final</span>
            <span className="text-lg font-bold text-error">{Math.round(finalCost).toLocaleString()}</span>
          </div>
          <div className="p-4 rounded-lg bg-surface flex flex-col">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Valor Venda Líquida</span>
            <span className="text-lg font-bold text-success">{Math.round(sellValue).toLocaleString()}</span>
          </div>
          <div className={`p-4 rounded-lg ${profit > 0 ? 'bg-primary/10 border-primary/30' : 'bg-error/10 border-error/30'} border flex flex-col`}>
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Lucro por Unidade</span>
            <span className={`text-xl font-bold ${profit > 0 ? 'text-primary' : 'text-error'}`}>{Math.round(profit).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
