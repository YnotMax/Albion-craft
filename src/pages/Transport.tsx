import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { ITEMS, RECIPES } from '../constants';
import { RefreshCw, Search, Info, TrendingUp, AlertTriangle, PackageSearch, Clock } from 'lucide-react';

const PREMIUM_TAX = 0.065; // 2.5% setup + 4% transaction
const NON_PREMIUM_TAX = 0.105; // 2.5% setup + 8% transaction

interface TransportResult {
  itemId: string;
  name: string;
  tier: string;
  enchantment: string;
  quality: number;
  buyCity: string;
  sellCity: string;
  buyPrice: number;
  sellPrice: number;
  profit: number;
  margin: number;
  updatedAt: string;
}

export const Transport: React.FC = () => {
  const { state } = useAppContext();
  
  const [buyCity, setBuyCity] = useState(state.buyCity !== 'Caerleon' ? state.buyCity : 'Fort Sterling');
  const [sellCity, setSellCity] = useState('Caerleon'); // Black Market is in Caerleon
  const [selectedTiers, setSelectedTiers] = useState<string[]>(['T4', 'T5']);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isPremium, setIsPremium] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<TransportResult[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [minProfitMargin, setMinProfitMargin] = useState<number>(10); // Minimum 10% profit

  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');

  // Load cached transport results on mount
  useEffect(() => {
    const cached = localStorage.getItem('albion_craft_transport_cache');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setResults(parsed.results || []);
        if (parsed.lastUpdated) {
          setLastUpdated(new Date(parsed.lastUpdated));
        }
      } catch (e) {
        console.error('Error parsing transport cache', e);
      }
    }
  }, []);

  // Save results to cache when updated
  useEffect(() => {
    if (results.length > 0 && lastUpdated) {
      localStorage.setItem('albion_craft_transport_cache', JSON.stringify({
        results,
        lastUpdated
      }));
    }
  }, [results, lastUpdated]);

  const nonArtifactCategories = useMemo(() => {
    const artifactNames = ['Artefatos', 'Recursos', 'Diários'];
    const artifactItems = ITEMS.filter(i => artifactNames.some(name => i.category.includes(name))).map(i => i.id);

    // Filter recipes that don't use artifacts
    const validRecipes = RECIPES.filter(r => !r.materials.some(m => artifactItems.includes(m.itemId)));
    const validItemIds = new Set(validRecipes.map(r => r.itemId));

    const equipmentCategories = Array.from(new Set(
      ITEMS.filter(i => 
        validItemIds.has(i.id) && 
        !artifactNames.some(name => i.category.includes(name))
      ).map(i => i.category)
    ));

    return equipmentCategories.sort((a, b) => a.localeCompare(b));
  }, []);

  const handleAnalyze = async () => {
    if (selectedTiers.length === 0) return;
    setIsLoading(true);
    setProgress(5);
    setResults([]);
    setStatusMessage('Filtrando base de dados...');

    try {
      const artifactNames = ['Artefatos'];
      const artifactIds = ITEMS.filter(i => artifactNames.some(name => i.category.includes(name))).map(i => i.id);
      const artifactDependentItemIds = new Set(
        RECIPES.filter(r => r.materials.some(m => artifactIds.includes(m.itemId))).map(r => r.itemId)
      );

      let targetItems = ITEMS.filter(i => {
        if (!selectedTiers.includes(i.tier)) return false;
        if (selectedCategory !== 'all' && i.category !== selectedCategory) return false;
        // If "all" is selected, only show equipment categories (no resources/artifacts)
        if (selectedCategory === 'all' && !nonArtifactCategories.includes(i.category)) return false;
        if (artifactDependentItemIds.has(i.id)) return false;
        return true;
      });

      const itemIds = targetItems.map(i => i.id);
      
      if (itemIds.length === 0) {
        setStatusMessage('Nenhum item encontrado nos filtros selecionados.');
        setIsLoading(false);
        return;
      }

      setStatusMessage(`Encontrados ${itemIds.length} itens. Buscando preços...`);

      const chunkSize = 150;
      const chunks = [];
      for (let i = 0; i < itemIds.length; i += chunkSize) {
        chunks.push(itemIds.slice(i, i + chunkSize));
      }

      const qualities = "1,2,3"; 
      const serverPrefix = state.server === 'west' ? 'west' : state.server;
      
      let allResults: TransportResult[] = [];
      const taxRate = isPremium ? PREMIUM_TAX : NON_PREMIUM_TAX;

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const currentProgress = 10 + Math.floor((i / chunks.length) * 85);
        setProgress(currentProgress);
        setStatusMessage(`Processando lote ${i+1}/${chunks.length} (${chunk.length} itens)...`);

        const url = `https://${serverPrefix}.albion-online-data.com/api/v2/stats/prices/${chunk.join(',')}?locations=${buyCity},Caerleon,Black+Market&qualities=${qualities}`;
        
        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error('API Error');
          const data = await response.json();

          const itemDataMap: Record<string, Record<number, { buyCity?: any, bm?: any }>> = {};
          
          data.forEach((entry: any) => {
            if (!itemDataMap[entry.item_id]) itemDataMap[entry.item_id] = {};
            if (!itemDataMap[entry.item_id][entry.quality]) itemDataMap[entry.item_id][entry.quality] = {};
            
            if (entry.city === buyCity) {
              itemDataMap[entry.item_id][entry.quality].buyCity = entry;
            } else if (entry.city === 'Black Market' || entry.city === 'BlackMarket' || (sellCity === 'Caerleon' && entry.city === 'Caerleon')) {
              // Prefer Black Market specifically if available
              if (entry.city.includes('Black')) {
                itemDataMap[entry.item_id][entry.quality].bm = entry;
              } else if (!itemDataMap[entry.item_id][entry.quality].bm) {
                itemDataMap[entry.item_id][entry.quality].bm = entry;
              }
            }
          });

          Object.keys(itemDataMap).forEach(itemId => {
            const itemBase = ITEMS.find(it => it.id === itemId);
            if (!itemBase) return;

            Object.keys(itemDataMap[itemId]).forEach(qStr => {
              const q = parseInt(qStr);
              const info = itemDataMap[itemId][q];
              
              if (info.buyCity && info.bm) {
                // Instant buy: sell_price_min on Royal City
                const buyPrice = info.buyCity.sell_price_min;
                // Instant sell: buy_price_max on Black Market
                const sellPrice = info.bm.buy_price_max;

                if (buyPrice > 0 && sellPrice > 0) {
                  const profit = (sellPrice * (1 - taxRate)) - buyPrice;
                  const margin = (profit / buyPrice) * 100;

                  if (margin >= minProfitMargin) {
                    const d1 = new Date(info.buyCity.sell_price_min_date + "Z");
                    const d2 = new Date(info.bm.buy_price_max_date + "Z");
                    const latest = d1 > d2 ? d1 : d2;

                    allResults.push({
                      itemId, name: itemBase.name, tier: itemBase.tier, enchantment: itemBase.enchantment,
                      quality: q, buyCity, sellCity: info.bm.city, buyPrice, sellPrice, profit, margin,
                      updatedAt: latest.toISOString()
                    });
                  }
                }
              }
            });
          });
        } catch (err) {
          console.error("Chunk failed", err);
        }
      }

      allResults.sort((a, b) => b.margin - a.margin);
      setResults(allResults);
      setLastUpdated(new Date());
      setProgress(100);
      setStatusMessage(allResults.length > 0 ? `Sucesso! Encontradas ${allResults.length} oportunidades.` : 'Busca concluída, mas nenhuma oportunidade atende aos critérios.');

    } catch (e) {
      console.error("Error", e);
      setStatusMessage('Erro fatal na análise. Verifique o console.');
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 1500);
    }
  };

  const getQualityName = (q: number) => {
    switch (q) {
      case 1: return 'Normal';
      case 2: return 'Bom';
      case 3: return 'Excepcional';
      case 4: return 'Excelente';
      case 5: return 'Obra-prima';
      default: return 'Desconhecido';
    }
  };

  const getTimeAgo = (dateStr: string) => {
    const minDiff = Math.max(0, Math.round((new Date().getTime() - new Date(dateStr).getTime()) / 60000));
    if (minDiff < 60) return `${minDiff} min atrás`;
    const hs = Math.floor(minDiff / 60);
    return `${hs}h atrás`;
  };

  const toggleTier = (t: string) => {
    setSelectedTiers(prev => 
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    );
  };

  return (
    <div className="space-y-6 font-['Inter'] pb-10">
      <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10 shadow-lg">
        <h1 className="text-2xl font-black text-on-surface flex items-center gap-3">
          <TrendingUp className="text-primary w-8 h-8" />
          Transporte & Flip (Mercado Negro)
        </h1>
        <p className="text-on-surface-variant text-sm mt-2">
          Analise em tempo real as melhores oportunidades de "Flip" para o Mercado Negro.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {/* Cidades */}
          <div className="space-y-3">
            <div>
              <label className="text-xs uppercase font-bold text-on-surface-variant block mb-1">Origem (Royal City)</label>
              <select 
                value={buyCity} 
                onChange={e => setBuyCity(e.target.value)}
                className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-4 py-3 text-sm font-bold text-on-surface focus:border-primary outline-none"
              >
                {['Fort Sterling', 'Lymhurst', 'Bridgewatch', 'Martlock', 'Thetford', 'Brecilien'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase font-bold text-on-surface-variant block mb-1">Destino</label>
              <div className="w-full bg-surface-container/50 border border-outline-variant/10 rounded-lg px-4 py-3 text-sm font-bold text-on-surface-variant opacity-70">
                Caerleon (Black Market)
              </div>
            </div>
          </div>

          {/* Filtros de Item */}
          <div className="space-y-3">
            <div>
              <label className="text-xs uppercase font-bold text-on-surface-variant block mb-1">Categoria (Filtro)</label>
              <select 
                value={selectedCategory} 
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-4 py-3 text-sm font-bold text-on-surface focus:border-primary outline-none"
              >
                <option value="all">Todas (+ Venda rápida)</option>
                {nonArtifactCategories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-xs uppercase font-bold text-on-surface-variant block mb-2">Tiers Desejados</label>
              <div className="flex gap-2">
                {['T4', 'T5', 'T6', 'T7', 'T8'].map(t => (
                  <button
                    key={t}
                    onClick={() => toggleTier(t)}
                    className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-colors ${
                      selectedTiers.includes(t) 
                        ? 'bg-primary text-on-primary' 
                        : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Configurações Adicionais */}
          <div className="space-y-3">
            <div>
              <label className="text-xs uppercase font-bold text-on-surface-variant block mb-1">Margem Mínima (%)</label>
              <input 
                type="number" 
                value={minProfitMargin} 
                onChange={e => setMinProfitMargin(Number(e.target.value))}
                className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-4 py-3 text-sm font-bold text-on-surface focus:border-primary outline-none"
              />
            </div>
            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isPremium} 
                  onChange={e => setIsPremium(e.target.checked)}
                  className="w-4 h-4 rounded text-primary bg-surface-container border-outline-variant/30 focus:ring-primary"
                />
                <span className="text-sm font-bold text-on-surface">Taxa Premium (6.5%)</span>
              </label>
            </div>
          </div>

          {/* Botão de Busca */}
          <div className="flex flex-col justify-end space-y-2">
            <button 
              onClick={handleAnalyze}
              disabled={isLoading || selectedTiers.length === 0}
              className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-on-primary font-black py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <RefreshCw className="animate-spin w-5 h-5" />
              ) : (
                <PackageSearch className="w-5 h-5" />
              )}
              {isLoading ? 'Analisando...' : 'Analisar Oportunidades'}
            </button>
          </div>
        </div>

        {/* Progress Bar Container */}
        {isLoading && (
          <div className="mt-6 space-y-2">
            <div className="flex justify-between items-center text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">
              <span>{statusMessage}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Tabela de Resultados */}
      <div className="bg-surface-container-low rounded-xl border border-outline-variant/10 shadow-xl overflow-x-auto">
        <div className="p-4 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-high/50">
          <h2 className="text-lg font-black text-on-surface flex items-center gap-2">
            Oportunidades Ativas ({results.length})
          </h2>
          {lastUpdated && (
            <div className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5 bg-surface-container p-2 rounded-lg">
              <Clock className="w-4 h-4" />
              Cache: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>

        {results.length > 0 ? (
          <table className="w-full text-left whitespace-nowrap min-w-[1000px]">
            <thead>
              <tr className="bg-surface-container-high text-[10px] uppercase text-on-surface-variant font-bold border-b border-outline-variant/20">
                <th className="px-4 py-3 sticky left-0 bg-surface-container-high z-10 w-64 shadow-[2px_0_5px_rgba(0,0,0,0.1)]">Item</th>
                <th className="px-4 py-3 text-center">Qualidade</th>
                <th className="px-4 py-3 text-right">Compra Royale</th>
                <th className="px-4 py-3 text-right">Venda BM (Instant)</th>
                <th className="px-4 py-3 text-right">Lucro Estimado</th>
                <th className="px-4 py-3 text-center">Margem</th>
                <th className="px-4 py-3 text-center w-32">Age (Data)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {results.map((r, idx) => (
                <tr key={`${r.itemId}_${r.quality}_${idx}`} className="hover:bg-surface-container-highest/10 transition-colors group">
                  <td className="px-4 py-3 sticky left-0 bg-surface-container-low z-10 shadow-[2px_0_5px_rgba(0,0,0,0.1)] group-hover:bg-surface-container-highest transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={`https://render.albiononline.com/v1/item/${r.itemId}.png`} alt={r.name} className="w-10 h-10 rounded bg-black/40" />
                        <span className="absolute -bottom-1 -right-1 bg-surface-container-highest border border-outline-variant/30 text-[9px] font-black px-1 rounded text-on-surface">{r.tier}.{r.enchantment}</span>
                      </div>
                      <div>
                        <div className="text-sm font-black text-on-surface truncate max-w-[200px]" title={r.name}>{r.name}</div>
                        <div className="text-[10px] text-on-surface-variant font-medium">#{r.itemId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center align-middle">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      r.quality === 1 ? 'bg-zinc-800 text-zinc-300' :
                      r.quality === 2 ? 'bg-blue-900/30 text-blue-400' :
                      'bg-purple-900/30 text-purple-400'
                    }`}>
                      {getQualityName(r.quality)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right align-middle">
                    <div className="text-sm font-bold text-on-surface">{r.buyPrice.toLocaleString()}</div>
                    <div className="text-[10px] text-on-surface-variant uppercase font-bold">{buyCity}</div>
                  </td>
                  <td className="px-4 py-3 text-right align-middle">
                    <div className="text-sm font-bold text-on-surface">{r.sellPrice.toLocaleString()}</div>
                    <div className="text-[10px] text-primary uppercase font-bold">Black Market</div>
                  </td>
                  <td className="px-4 py-3 text-right align-middle">
                    <div className="text-sm font-black text-green-400">+{Math.floor(r.profit).toLocaleString()}</div>
                  </td>
                  <td className="px-4 py-3 text-center align-middle">
                    <div className="inline-flex items-center justify-center bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-black">
                      {r.margin.toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center align-middle">
                    <div className={`text-xs font-bold ${
                      new Date().getTime() - new Date(r.updatedAt).getTime() > 3600000 ? 'text-red-400' : 'text-on-surface-variant'
                    }`}>
                      {getTimeAgo(r.updatedAt)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-20 text-center flex flex-col items-center justify-center opacity-40">
            <PackageSearch className="w-16 h-16 mb-4" />
            <h3 className="text-xl font-bold">Aguardando Análise</h3>
            <p className="text-sm mt-2 max-w-sm">
              Clique em "Analisar Oportunidades" para comparar os preços entre {buyCity} e o Mercado Negro.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
