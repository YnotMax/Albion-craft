import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ITEMS } from '../constants';
import { CurrencyInput } from '../components/CurrencyInput';
import { MarketSelector } from '../components/MarketSelector';
import { formatTimeAgo } from '../utils/format';
import { Search, Filter, RefreshCw, Clock, Info } from 'lucide-react';

export const Prices: React.FC = () => {
  const { state, updatePrice, syncPrices, isSyncing, syncMessage } = useAppContext();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [tierFilter, setTierFilter] = useState('All');
  const [enchantmentFilter, setEnchantmentFilter] = useState('All');
  const [displayLimit, setDisplayLimit] = useState(24);

  // Reset limit when filters change
  React.useEffect(() => {
    setDisplayLimit(24);
  }, [search, categoryFilter, tierFilter, enchantmentFilter]);

  const categories = ['All', ...Array.from(new Set(ITEMS.map(i => i.category)))];
  const tiers = ['All', 'T4', 'T5', 'T6', 'T7', 'T8'];
  const enchantments = ['All', '0', '1', '2', '3', '4'];

  const filteredItems = ITEMS.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesTier = tierFilter === 'All' || item.tier === tierFilter;
    const matchesEnchantment = enchantmentFilter === 'All' || item.enchantment === enchantmentFilter;
    return matchesSearch && matchesCategory && matchesTier && matchesEnchantment;
  });

  const visibleItems = filteredItems.slice(0, displayLimit);

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
          <h2 className="text-2xl font-bold text-zinc-100">Central de Preços</h2>
          <p className="text-zinc-400 mt-1">Gerencie os preços de compra e venda dos itens.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <MarketSelector />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 bg-zinc-900 p-4 rounded-xl border border-zinc-800">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg py-2 pl-10 pr-4 text-zinc-100 focus:outline-none focus:border-amber-500"
          />
        </div>
        <div className="flex flex-wrap gap-4 lg:w-auto">
          <div className="relative w-full md:w-auto md:min-w-[180px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg py-2 pl-10 pr-4 text-zinc-100 focus:outline-none focus:border-amber-500 appearance-none"
            >
              {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'Todas Categorias' : c}</option>)}
            </select>
          </div>
          <div className="relative w-full md:w-auto md:min-w-[120px]">
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg py-2 px-4 text-zinc-100 focus:outline-none focus:border-amber-500 appearance-none"
            >
              {tiers.map(t => <option key={t} value={t}>{t === 'All' ? 'Todos Tiers' : t}</option>)}
            </select>
          </div>
          <div className="relative w-full md:w-auto md:min-w-[140px]">
            <select
              value={enchantmentFilter}
              onChange={(e) => setEnchantmentFilter(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg py-2 px-4 text-zinc-100 focus:outline-none focus:border-amber-500 appearance-none"
            >
              {enchantments.map(e => <option key={e} value={e}>{e === 'All' ? 'Todos Encantamentos' : `Encantamento .${e}`}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleItems.map(item => {
          const price = state.prices[item.id] || { buy: 0, sell: 0 };
          
          let borderColor = 'border-zinc-800';
          let bgColor = 'bg-zinc-900';
          let accentColor = 'bg-zinc-700';
          
          if (item.category === 'Recursos Refinados') {
            borderColor = 'border-amber-900/30';
            bgColor = 'bg-amber-950/10';
            accentColor = 'bg-amber-500';
          } else if (item.category === 'Armadura de Tecido') {
            borderColor = 'border-emerald-900/30';
            bgColor = 'bg-emerald-950/10';
            accentColor = 'bg-emerald-500';
          } else if (item.category === 'Sapatos de Placa') {
            borderColor = 'border-blue-900/30';
            bgColor = 'bg-blue-950/10';
            accentColor = 'bg-blue-500';
          } else if (item.category === 'Diários') {
            borderColor = 'border-purple-900/30';
            bgColor = 'bg-purple-950/10';
            accentColor = 'bg-purple-500';
          } else if (item.category === 'Artefatos') {
            borderColor = 'border-red-900/30';
            bgColor = 'bg-red-950/10';
            accentColor = 'bg-red-500';
          }

          return (
            <div key={item.id} className={`${bgColor} border ${borderColor} rounded-xl p-4 shadow-sm hover:border-zinc-700 transition-all relative group overflow-hidden`}>
              <div className={`absolute top-0 left-0 w-1 h-full ${accentColor} opacity-50 group-hover:opacity-100 transition-opacity`} />
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-zinc-100 pr-8 leading-tight">{item.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                      item.category === 'Recursos Refinados' ? 'bg-amber-500/20 text-amber-500' :
                      item.category === 'Armadura de Tecido' ? 'bg-emerald-500/20 text-emerald-500' :
                      item.category === 'Sapatos de Placa' ? 'bg-blue-500/20 text-blue-500' :
                      item.category === 'Diários' ? 'bg-purple-500/20 text-purple-500' :
                      'bg-zinc-800 text-zinc-400'
                    }`}>
                      {item.category}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-bold">{item.tier}</span>
                  </div>
                </div>
                <button 
                  onClick={() => syncPrices([item.id])}
                  disabled={isSyncing}
                  className="p-1.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 rounded-md text-zinc-400 hover:text-amber-400 transition-colors shrink-0"
                  title="Sincronizar este item"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <div className="space-y-3 flex-1">
                <CurrencyInput
                  label="Ordem de Compra"
                  value={price.buy}
                  onChange={(val) => updatePrice(item.id, val, price.sell)}
                  placeholder="0"
                />
                <CurrencyInput
                  label="Ordem de Venda"
                  value={price.sell}
                  onChange={(val) => updatePrice(item.id, price.buy, val)}
                  placeholder="0"
                />
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-800/50 flex items-center gap-1.5 text-xs text-zinc-500">
                <Clock className="w-3.5 h-3.5" />
                Atualizado: {formatTimeAgo(price.updatedAt)}
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length > displayLimit && (
        <div className="flex justify-center pt-8 pb-12">
          <button
            onClick={() => setDisplayLimit(prev => prev + 24)}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold py-3 px-8 rounded-xl border border-zinc-700 transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            Carregar mais itens ({filteredItems.length - displayLimit} restantes)
          </button>
        </div>
      )}
    </div>
  );
};
