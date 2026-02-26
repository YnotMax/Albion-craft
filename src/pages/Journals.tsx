import React from 'react';
import { useAppContext } from '../context/AppContext';
import { ITEMS } from '../constants';
import { CurrencyInput } from '../components/CurrencyInput';
import { BookOpen } from 'lucide-react';

export const Journals: React.FC = () => {
  const { state, updatePrice } = useAppContext();
  
  const journals = ITEMS.filter(i => i.category === 'Diários' && i.id.endsWith('_EMPTY'));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100">Gestão de Diários</h2>
        <p className="text-zinc-400 mt-1">Gerencie os preços de compra e venda dos diários para trabalhadores.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {journals.map(emptyJournal => {
          const fullJournalId = emptyJournal.id.replace('_EMPTY', '_FULL');
          const fullJournal = ITEMS.find(i => i.id === fullJournalId);
          
          if (!fullJournal) return null;

          const emptyPrice = state.prices[emptyJournal.id] || { buy: 0, sell: 0 };
          const fullPrice = state.prices[fullJournal.id] || { buy: 0, sell: 0 };
          
          const profit = fullPrice.sell - emptyPrice.buy;

          return (
            <div key={emptyJournal.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-zinc-800 rounded-lg">
                  <BookOpen className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-100">{emptyJournal.name.replace(' (Vazio)', '')}</h3>
                  <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium">{emptyJournal.tier}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <CurrencyInput
                  label="Comprar Vazio"
                  value={emptyPrice.buy}
                  onChange={(val) => updatePrice(emptyJournal.id, val, emptyPrice.sell)}
                  placeholder="0"
                />
                <CurrencyInput
                  label="Vender Cheio"
                  value={fullPrice.sell}
                  onChange={(val) => updatePrice(fullJournal.id, fullPrice.buy, val)}
                  placeholder="0"
                />
              </div>

              <div className={`p-4 rounded-lg border flex justify-between items-center ${profit >= 0 ? 'bg-emerald-950/30 border-emerald-900/50' : 'bg-red-950/30 border-red-900/50'}`}>
                <span className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Lucro por Diário</span>
                <span className={`text-xl font-mono font-bold ${profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {profit > 0 ? '+' : ''}{profit.toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
