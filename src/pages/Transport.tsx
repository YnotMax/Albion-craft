import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { ITEMS, RECIPES } from '../constants';
import { RefreshCw, Search, Info, TrendingUp, AlertTriangle, PackageSearch, Clock } from 'lucide-react';

const TRANSACTION_TAX_PREMIUM = 0.040; // 4% transaction
const TRANSACTION_TAX_NON_PREMIUM = 0.080; // 8% transaction
const SETUP_FEE = 0.025; // 2.5% setup

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
  buyUpdatedAt: string;
  sellUpdatedAt: string;
  isUpgrade?: boolean;
  baseItemPrice?: number;
  runePrice?: number;
  runeNeeded?: number;
}

interface LiquidityData {
  avgDaily: number;
  totalWeek: number;
  loading: boolean;
}

const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => (
  <div className="group relative flex items-center">
    {children}
    <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity w-max max-w-xs bg-surface-container-highest text-on-surface text-[10px] p-2.5 rounded-lg shadow-xl z-50 border border-outline-variant/30 whitespace-pre-wrap">
      {text}
    </div>
  </div>
);

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
  const [tradeMode, setTradeMode] = useState<'instant' | 'order'>('instant');
  const [includeHighQuality, setIncludeHighQuality] = useState(false);
  const [showUpgradeFlips, setShowUpgradeFlips] = useState(false);
  const [liquidityMap, setLiquidityMap] = useState<Record<string, LiquidityData>>({});
  const [progress, setProgress] = useState({ text: '', percent: 0 });

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
    if (results.length > 0) {
      localStorage.setItem('albion_craft_transport_cache', JSON.stringify({
        results,
        lastUpdated
      }));
    }
  }, [results, lastUpdated]);

  const nonArtifactCategories = useMemo(() => {
    // Collect all artifact item IDs
    const artifactCategoryNames = ['Artefatos'];
    const artifactItems = ITEMS.filter(i => artifactCategoryNames.includes(i.category)).map(i => i.id);

    // Identify non-artifact equipment recipes
    const validRecipes = RECIPES.filter(r => {
      // Recipe must not contain any artifact material
      return !r.materials.some(m => artifactItems.includes(m.itemId));
    });

    const validItemIds = new Set(validRecipes.map(r => r.itemId));

    // Get categories of these valid items
    const equipmentCategories = Array.from(new Set(
      ITEMS.filter(i => 
        validItemIds.has(i.id) && 
        !i.category.includes('Recursos') && 
        !i.category.includes('Diários') &&
        !i.category.includes('Artefatos')
      ).map(i => i.category)
    ));

    return equipmentCategories.sort((a, b) => a.localeCompare(b));
  }, []);

  const handleAnalyze = async () => {
    if (selectedTiers.length === 0) return;
    setIsLoading(true);

    try {
      // Find items matching criteria (Non-artifact, selected tiers, selected category)
      // First find items that use artifacts to exclude them
      const artifactIds = ITEMS.filter(i => i.category === 'Artefatos').map(i => i.id);
      const artifactDependentItemIds = new Set(
        RECIPES.filter(r => r.materials.some(m => artifactIds.includes(m.itemId))).map(r => r.itemId)
      );

      let targetItems = ITEMS.filter(i => {
        if (!selectedTiers.includes(i.tier)) return false;
        if (selectedCategory !== 'all' && i.category !== selectedCategory) return false;
        if (selectedCategory === 'all' && !nonArtifactCategories.includes(i.category)) return false;
        if (artifactDependentItemIds.has(i.id)) return false;
        return true;
      });

      const itemIds = targetItems.map(i => i.id);
      
      if (itemIds.length === 0) {
        setProgress({ text: 'Nenhum item válido encontrado nos filtros.', percent: 100 });
        setIsLoading(false);
        return;
      }

      setProgress({ text: `Filtrados ${itemIds.length} itens. Preparando busca...`, percent: 10 });

      // Fetch from API in chunks
      const chunkSize = 100;
      const chunks = [];
      for (let i = 0; i < itemIds.length; i += chunkSize) {
        chunks.push(itemIds.slice(i, i + chunkSize));
      }

      const qualities = includeHighQuality ? "1,2,3,4,5" : "1,2,3"; 
      const serverPrefix = state.server === 'west' ? 'west' : state.server;
      
      let allResults: TransportResult[] = [];
      const apiSellCity = sellCity === 'Caerleon' ? 'Black Market' : sellCity;

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        
        const pct = 10 + Math.round((i / chunks.length) * 80);
        setProgress({ text: `Consultando API (${i+1}/${chunks.length}). Lote com ${chunk.length} itens...`, percent: pct });

        const url = `https://${serverPrefix}.albion-online-data.com/api/v2/stats/prices/${chunk.join(',')}?locations=${buyCity},${apiSellCity}&qualities=${qualities}`;
        const response = await fetch(url);
        if (!response.ok) continue;
        const data = await response.json();

        // Process data
        // Group by item_id and quality
        const itemDataMap: Record<string, Record<number, any>> = {};
        
        data.forEach((entry: any) => {
          if (!itemDataMap[entry.item_id]) itemDataMap[entry.item_id] = {};
          if (!itemDataMap[entry.item_id][entry.quality]) {
            itemDataMap[entry.item_id][entry.quality] = { buyCityData: null, sellCityData: null };
          }
          
          if (entry.city === buyCity) {
            itemDataMap[entry.item_id][entry.quality].buyCityData = entry;
          } else if (entry.city === sellCity || (sellCity === 'Caerleon' && entry.city === 'Black Market')) {
            // Treat Caerleon and Black Market as same for sell city if Caerleon is selected
            if (sellCity === 'Caerleon' && entry.city === 'Black Market') {
               // Black market is preferred for Caerleon sell
               itemDataMap[entry.item_id][entry.quality].sellCityData = entry;
            } else if (!itemDataMap[entry.item_id][entry.quality].sellCityData) {
               itemDataMap[entry.item_id][entry.quality].sellCityData = entry;
            }
          }
        });

        // Get Rune prices if upgrade flips are enabled
        let runePrices: Record<string, number> = {};
        if (showUpgradeFlips) {
          const runeIds = ["T4_RUNE", "T5_RUNE", "T6_RUNE", "T7_RUNE", "T8_RUNE", "T4_SOUL", "T5_SOUL", "T6_SOUL", "T7_SOUL", "T8_SOUL", "T4_RELIC", "T5_RELIC", "T6_RELIC", "T7_RELIC", "T8_RELIC"];
          const runeUrl = `https://${serverPrefix}.albion-online-data.com/api/v2/stats/prices/${runeIds.join(',')}?locations=${buyCity}`;
          try {
            const rResp = await fetch(runeUrl);
            if (rResp.ok) {
              const rData = await rResp.json();
              rData.forEach((r: any) => { runePrices[r.item_id] = r.sell_price_min > 0 ? r.sell_price_min : r.buy_price_max; });
            }
          } catch (e) { console.error("Rune fetch error", e); }
        }

        Object.keys(itemDataMap).forEach(itemId => {
          const itemBase = ITEMS.find(i => i.id === itemId);
          if (!itemBase) return;

          Object.keys(itemDataMap[itemId]).forEach(qualityStr => {
            const quality = parseInt(qualityStr);
            const entryPairs = itemDataMap[itemId][quality];
            
            if (entryPairs && entryPairs.buyCityData && entryPairs.sellCityData) {
              const buyPrice = entryPairs.buyCityData.sell_price_min; 
              
              let sellPrice = 0;
              if (tradeMode === 'instant') {
                sellPrice = entryPairs.sellCityData.buy_price_max;
              } else {
                sellPrice = entryPairs.sellCityData.sell_price_min > 0 
                  ? entryPairs.sellCityData.sell_price_min 
                  : entryPairs.sellCityData.buy_price_max * 1.1;
              }

              if (buyPrice > 0 && sellPrice > 0) {
                const baseTaxRate = isPremium ? TRANSACTION_TAX_PREMIUM : TRANSACTION_TAX_NON_PREMIUM;
                const totalTaxRate = tradeMode === 'instant' ? baseTaxRate : baseTaxRate + SETUP_FEE;
                const profit = (sellPrice * (1 - totalTaxRate)) - buyPrice;
                const margin = (profit / buyPrice) * 100;

                if (margin >= minProfitMargin) {
                  allResults.push({
                    itemId,
                    name: itemBase.name,
                    tier: itemBase.tier,
                    enchantment: itemBase.enchantment,
                    quality,
                    buyCity,
                    sellCity: entryPairs.sellCityData.city,
                    buyPrice,
                    sellPrice,
                    profit,
                    margin,
                    buyUpdatedAt: entryPairs.buyCityData.sell_price_min_date + "Z",
                    sellUpdatedAt: entryPairs.sellCityData.buy_price_max_date + "Z"
                  });
                }
              }

              // UPGRADE FLIP LOGIC
              if (showUpgradeFlips && itemBase.enchantment === '0') {
                const encLevels = ['1', '2', '3'];
                encLevels.forEach(level => {
                  const targetId = itemId + "@" + level;
                  const targetEntry = itemDataMap[targetId]?.[quality];
                  if (!targetEntry || !targetEntry.sellCityData) return;

                  const runeType = level === '1' ? 'RUNE' : level === '2' ? 'SOUL' : 'RELIC';
                  const runeId = `${itemBase.tier}_${runeType}`;
                  const rPrice = runePrices[runeId] || 0;
                  
                  const recipe = RECIPES.find(r => r.itemId.startsWith(itemId));
                  const baseResources = recipe ? recipe.materials.reduce((acc, m) => acc + m.amount, 0) : 24;
                  const runesNeeded = baseResources;

                  if (rPrice > 0 && buyPrice > 0) {
                    const upgradeCost = buyPrice + (rPrice * runesNeeded);
                    const tSellPrice = tradeMode === 'instant' ? targetEntry.sellCityData.buy_price_max : targetEntry.sellCityData.sell_price_min;
                    
                    if (tSellPrice > 0) {
                      const baseTaxRate = isPremium ? TRANSACTION_TAX_PREMIUM : TRANSACTION_TAX_NON_PREMIUM;
                      const totalTaxRate = tradeMode === 'instant' ? baseTaxRate : baseTaxRate + SETUP_FEE;
                      const uProfit = (tSellPrice * (1 - totalTaxRate)) - upgradeCost;
                      const uMargin = (uProfit / upgradeCost) * 100;

                      if (uMargin >= minProfitMargin) {
                        allResults.push({
                          itemId: targetId,
                          name: itemBase.name + " (UPGRADE)",
                          tier: itemBase.tier,
                          enchantment: level,
                          quality,
                          buyCity,
                          sellCity: targetEntry.sellCityData.city,
                          buyPrice: upgradeCost,
                          sellPrice: tSellPrice,
                          profit: uProfit,
                          margin: uMargin,
                          buyUpdatedAt: entryPairs.buyCityData.sell_price_min_date + "Z",
                          sellUpdatedAt: targetEntry.sellCityData.buy_price_max_date + "Z",
                          isUpgrade: true,
                          baseItemPrice: buyPrice,
                          runePrice: rPrice,
                          runeNeeded: runesNeeded
                        });
                      }
                    }
                  }
                });
              }
            }
          });
        });
      }

      // Sort by best margin descending
      setProgress({ text: 'Processando rentabilidade e organizando resultados...', percent: 95 });
      allResults.sort((a, b) => b.margin - a.margin);
      
      setResults(allResults);
      setLastUpdated(new Date());
      setProgress({ text: 'Concluído!', percent: 100 });

    } catch (e) {
      console.error("Error fetching transport data", e);
      setProgress({ text: 'Erro ao buscar dados.', percent: 0 });
    } finally {
      setTimeout(() => setIsLoading(false), 500); // Give user time to read "Concluído"
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
    if (minDiff < 60) return `${minDiff}m`;
    const hs = Math.floor(minDiff / 60);
    return `${hs}h`;
  };

  const getFreshnessColor = (dateStr: string, isSellSide: boolean) => {
    const minDiff = Math.max(0, Math.round((new Date().getTime() - new Date(dateStr).getTime()) / 60000));
    const limit = isSellSide ? 45 : 120; // 45m for Black Market, 2h for Royals
    if (minDiff <= limit) return 'text-green-400';
    if (minDiff <= limit * 2) return 'text-yellow-400';
    return 'text-red-400 animate-pulse';
  };

  const getHazardLevel = () => {
    const hour = new Date().getUTCHours();
    if (hour >= 10 && hour <= 12) return { text: 'BAIXO (Reset)', color: 'text-green-400', desc: 'Pós-manutenção. Geralmente mais seguro.' };
    if (hour >= 18 || hour <= 2) return { text: 'CRÍTICO (Prime)', color: 'text-red-500', desc: 'Horário de pico. Gankers em todo lugar!' };
    return { text: 'MÉDIO', color: 'text-yellow-400', desc: 'Atividade normal nas Red Zones.' };
  };

  const fetchLiquidity = async (itemId: string) => {
    setLiquidityMap(prev => ({ ...prev, [itemId]: { avgDaily: 0, totalWeek: 0, loading: true } }));
    try {
      const serverPrefix = state.server === 'west' ? 'west' : state.server;
      const url = `https://${serverPrefix}.albion-online-data.com/api/v2/stats/history/${itemId}?locations=Black Market&qualities=1,2,3`;
      const resp = await fetch(url);
      if (resp.ok) {
        const data = await resp.json();
        const last7Days = data[0]?.data?.slice(-7) || [];
        const total = last7Days.reduce((acc: number, d: any) => acc + d.item_count, 0);
        setLiquidityMap(prev => ({ ...prev, [itemId]: { avgDaily: Math.round(total / 7), totalWeek: total, loading: false } }));
      }
    } catch (e) {
      setLiquidityMap(prev => ({ ...prev, [itemId]: { avgDaily: 0, totalWeek: 0, loading: false } }));
    }
  };

  const toggleTier = (t: string) => {
    setSelectedTiers(prev => 
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    );
  };

  return (
    <div className="space-y-6 font-['Inter'] pb-10">
      <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-on-surface flex items-center gap-3">
              <TrendingUp className="text-primary w-8 h-8" />
              Transporte & Flip (Mercado Negro)
            </h1>
            <p className="text-on-surface-variant text-sm mt-1">
              Análise de arbitragem avançada com projeção de encantamentos e Risco-Brasil Albion.
            </p>
          </div>
          <div className="bg-surface-container-high/50 p-3 rounded-lg border border-outline-variant/20 flex items-center gap-4">
            <div className="flex flex-col">
              <Tooltip text="Indica a probabilidade de encontrar gankers (PKs) nas red zones baseada no fuso-horário UTC. Horários de Prime Time (18-02h UTC) são os mais perigosos pois os servidores estão cheios.">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase flex items-center gap-1 cursor-help w-max">
                  Risco de Gank (UTC) <Info className="w-3 h-3" />
                </span>
              </Tooltip>
              <span className={`text-sm font-black ${getHazardLevel().color}`}>{getHazardLevel().text}</span>
            </div>
            <div className="h-8 w-[1px] bg-outline-variant/30" />
            <p className="text-[10px] text-on-surface-variant max-w-[150px] leading-tight">
              {getHazardLevel().desc}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {/* Cidades */}
          <div className="space-y-3">
            <div>
              <label className="text-xs uppercase font-bold text-on-surface-variant block mb-1">Origem (Comprar)</label>
              <select 
                value={buyCity} 
                onChange={e => setBuyCity(e.target.value)}
                className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-4 py-3 text-sm font-bold text-on-surface focus:border-primary outline-none"
              >
                {['Fort Sterling', 'Lymhurst', 'Bridgewatch', 'Martlock', 'Thetford', 'Brecilien', 'Arthurs Rest', 'Caerleon'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase font-bold text-on-surface-variant block mb-1">Destino (Vender)</label>
              <select 
                value={sellCity} 
                onChange={e => setSellCity(e.target.value)}
                className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-4 py-3 text-sm font-bold text-on-surface focus:border-red-500 outline-none"
              >
                <option value="Caerleon">Caerleon (Mercado Negro)</option>
                {/* Fallback to other cities if user wants to flip elsewhere */}
                {['Fort Sterling', 'Lymhurst', 'Bridgewatch', 'Martlock', 'Thetford'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Filtros de Item */}
          <div className="space-y-3">
            <div>
              <Tooltip text="Filtra itens 'Vanilla', ou seja, que não exigem artefatos para serem craftados. São recomendados para o Mercado Negro pois possuem alta liquidez.">
                <label className="text-xs uppercase font-bold text-on-surface-variant flex items-center gap-1 mb-1 cursor-help w-max">
                  Categoria (Sem Art.) <Info className="w-3 h-3" />
                </label>
              </Tooltip>
              <select 
                value={selectedCategory} 
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-4 py-3 text-sm font-bold text-on-surface focus:border-primary outline-none"
              >
                <option value="all">Todas as Categorias</option>
                {nonArtifactCategories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-xs uppercase font-bold text-on-surface-variant block mb-2">Tiers</label>
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
              <Tooltip text="Oportunidades com lucro percentual abaixo deste valor não aparecem na tabela. Ajuda a excluir lucros pequenos demais para o tempo gasto.">
                <label className="text-xs uppercase font-bold text-on-surface-variant flex items-center gap-1 mb-1 cursor-help w-max">
                  Marg. Mínima (%) <Info className="w-3 h-3" />
                </label>
              </Tooltip>
              <input 
                type="number" 
                value={minProfitMargin} 
                onChange={e => setMinProfitMargin(Number(e.target.value))}
                className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-4 py-3 text-sm font-bold text-on-surface focus:border-primary outline-none"
              />
            </div>
            
            <div className="pt-2 flex flex-col gap-2">
              <div>
                <Tooltip text="Venda Rápida: Vende imediatamente p/ Compra Direta (só 4/8% taxa). Ordem: Você cria ordem de venda, demora mais, mas paga taxa normal + 2.5% de Setup Fee.">
                  <label className="text-xs uppercase font-bold text-on-surface-variant flex items-center gap-1 mb-1 cursor-help w-max">
                    Modo de Trade <Info className="w-3 h-3" />
                  </label>
                </Tooltip>
                <div className="flex bg-surface-container-high rounded-lg p-1">
                  <button 
                    onClick={() => setTradeMode('instant')}
                    className={`flex-1 py-1.5 px-2 rounded-md text-[10px] font-bold transition-colors ${tradeMode === 'instant' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                  >
                    Venda Rápida
                  </button>
                  <button 
                    onClick={() => setTradeMode('order')}
                    className={`flex-1 py-1.5 px-2 rounded-md text-[10px] font-bold transition-colors ${tradeMode === 'order' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                  >
                    Ordem de Venda
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-1">
                <Tooltip text="Busca qualidades Excelente (4) e Obra-Prima (5). Tem menos saída, mas lucros são picos.">
                  <label className="flex items-center gap-2 cursor-pointer w-max">
                    <input 
                      type="checkbox" 
                      checked={includeHighQuality} 
                      onChange={e => setIncludeHighQuality(e.target.checked)}
                      className="w-4 h-4 rounded text-primary bg-surface-container border-outline-variant/30 focus:ring-primary focus:ring-offset-surface"
                    />
                    <span className="text-xs font-bold text-on-surface">Qual. 4 e 5</span>
                  </label>
                </Tooltip>
                
                <Tooltip text="Mostra lucro de comprar o item cru (.0) e encantar com Runas/Almas antes de vender. Adiciona (UPGRADE) se for viável.">
                  <label className="flex items-center gap-2 cursor-pointer w-max -ml-2">
                    <input 
                      type="checkbox" 
                      checked={showUpgradeFlips} 
                      onChange={e => setShowUpgradeFlips(e.target.checked)}
                      className="w-4 h-4 rounded text-primary bg-surface-container border-outline-variant/30 focus:ring-primary focus:ring-offset-surface"
                    />
                    <span className="text-xs font-bold text-on-surface">Upgrade Flip</span>
                  </label>
                </Tooltip>
              </div>

              <div className="text-[10px] text-on-surface-variant leading-tight">
                Taxa aplicada: <span className="font-bold text-primary">{(tradeMode === 'instant' ? (isPremium ? 4 : 8) : (isPremium ? 6.5 : 10.5))}%</span>
                {tradeMode === 'instant' ? ' (Sem setup fee)' : ' (Inclui 2.5% setup)'}
              </div>
            </div>
          </div>

          {/* Botão de Busca */}
          <div className="flex flex-col justify-end pb-1 gap-2">
            <button 
              onClick={handleAnalyze}
              disabled={isLoading || selectedTiers.length === 0}
              className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-on-primary font-black py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="animate-spin w-5 h-5" />
                  Cancelando Buscas Anteriores / Analisando...
                </>
              ) : (
                <>
                  <PackageSearch className="w-5 h-5" />
                  Analisar Oportunidades
                </>
              )}
            </button>
            {isLoading && (
              <div className="w-full space-y-1 mt-1">
                <div className="text-[10px] font-bold text-on-surface-variant flex justify-between">
                  <span>{progress.text}</span>
                  <span>{progress.percent}%</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress.percent}%` }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>



      {/* Tabela de Resultados */}
      <div className="bg-surface-container-low rounded-xl border border-outline-variant/10 shadow-xl overflow-x-auto">
        <div className="p-4 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-high/50">
          <h2 className="text-lg font-black text-on-surface flex items-center gap-2">
            Resultados Encontrados ({results.length})
          </h2>
          {lastUpdated && (
            <div className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5 bg-surface-container p-2 rounded-lg">
              <Clock className="w-4 h-4" />
              Última busca: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>

        {results.length > 0 ? (
          <table className="w-full text-left whitespace-nowrap min-w-[1000px]">
            <thead>
              <tr className="bg-surface-container-high text-[10px] uppercase text-on-surface-variant font-bold border-b border-outline-variant/20">
                <th className="px-4 py-3 sticky left-0 bg-surface-container-high z-10 w-64 shadow-[2px_0_5px_rgba(0,0,0,0.1)]">Item</th>
                <th className="px-4 py-3 text-center">Qualidade</th>
                <th className="px-4 py-3 text-right">Compra / Custo</th>
                <th className="px-4 py-3 text-right">Venda Destino</th>
                <th className="px-4 py-3 text-center">
                  <Tooltip text="Consulta vendas dos últimos 7 dias.\nAbaixo de 5/dia: Ruim.\nAcima de 20/dia: Excelente.">
                    <span className="cursor-help flex justify-center items-center gap-1 w-max mx-auto">Liq. Histórica <Info className="w-3 h-3"/></span>
                  </Tooltip>
                </th>
                <th className="px-4 py-3 text-right">Lucro</th>
                <th className="px-4 py-3 text-center">Margem</th>
                <th className="px-4 py-3 text-center">
                  <Tooltip text="Org: Idade do dado na cidade de quem vende.\nDes: Idade na cidade de destino.\nVermelho pulsante = risco altíssimo de preço errado.">
                    <span className="cursor-help flex justify-center items-center gap-1 w-max mx-auto">Idade Atualização <Info className="w-3 h-3"/></span>
                  </Tooltip>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {results.map((r, idx) => (
                <tr key={`${r.itemId}_${r.quality}_${idx}`} className="hover:bg-surface-container-highest/10 transition-colors group">
                  <td className="px-4 py-3 sticky left-0 bg-surface-container-low z-10 shadow-[2px_0_5px_rgba(0,0,0,0.1)] group-hover:bg-surface-container-highest/70 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={`https://render.albiononline.com/v1/item/${r.itemId}.png`} alt={r.name} className="w-10 h-10 rounded bg-black/40" />
                        <span className="absolute -bottom-1 -right-1 bg-surface-container-highest border border-outline-variant/30 text-[9px] font-black px-1 rounded text-on-surface">{r.tier}.{r.enchantment}</span>
                      </div>
                      <div>
                        <div className="text-sm font-black text-on-surface truncate max-w-[200px]" title={r.name}>{r.name}</div>
                        <div className="text-[10px] text-on-surface-variant max-w-[200px] truncate">{r.itemId}</div>
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
                    <div className="text-sm font-bold text-red-100">{r.buyPrice.toLocaleString()}</div>
                    {r.isUpgrade && (
                      <div className="text-[9px] text-on-surface-variant leading-tight">
                        Item:{r.baseItemPrice?.toLocaleString()} + {r.runeNeeded}x{r.runePrice}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right align-middle">
                    <div className="text-sm font-bold text-green-400">{r.sellPrice.toLocaleString()}</div>
                  </td>
                  <td className="px-4 py-3 text-center align-middle">
                    {liquidityMap[r.itemId] ? (
                      liquidityMap[r.itemId].loading ? (
                        <RefreshCw className="animate-spin w-3 h-3 mx-auto opacity-50" />
                      ) : (
                        <div className="text-[10px] font-bold text-on-surface leading-tight">
                          ~{liquidityMap[r.itemId].avgDaily}/dia
                          <div className="text-[8px] text-on-surface-variant">sem: {liquidityMap[r.itemId].totalWeek}</div>
                        </div>
                      )
                    ) : (
                      <button 
                        onClick={() => fetchLiquidity(r.itemId)}
                        className="text-[9px] font-black text-primary hover:underline"
                      >
                        CHECA VOL
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right align-middle">
                    <div className="text-sm font-black text-amber-400">+{r.profit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                  </td>
                  <td className="px-4 py-3 text-center align-middle">
                    <div className="inline-flex items-center justify-center bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-black">
                      {r.margin.toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center align-middle">
                    <div className="flex flex-col items-center gap-0.5">
                      <span className={`text-[9px] font-bold ${getFreshnessColor(r.buyUpdatedAt, false)}`}>Org: {getTimeAgo(r.buyUpdatedAt)}</span>
                      <span className={`text-[9px] font-bold ${getFreshnessColor(r.sellUpdatedAt, true)}`}>Des: {getTimeAgo(r.sellUpdatedAt)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-16 text-center flex flex-col items-center justify-center opacity-60">
            <PackageSearch className="w-12 h-12 text-on-surface-variant mb-4" />
            <h3 className="text-lg font-bold text-on-surface">Nenhuma oportunidade encontrada</h3>
            <p className="text-sm text-on-surface-variant mt-1 max-w-md">
              Ajuste seus filtros, verifique os tiers e categorias, e certifique-se de que selecionou cidades diferentes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
