import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState, CraftConfig } from '../types';

interface AppContextType {
  state: AppState;
  updateSpec: (nodeId: string, level: number) => void;
  updatePrice: (itemId: string, buy: number, sell: number) => void;
  addFavorite: (config: CraftConfig) => void;
  removeFavorite: (configId: string) => void;
  addGroup: (name: string) => void;
  removeGroup: (name: string) => void;
  updateFavoriteGroup: (favId: string, groupName: string | undefined) => void;
  setServer: (server: 'west' | 'east' | 'europe') => void;
  setBuyCity: (city: string) => void;
  setSellCity: (city: string) => void;
  setCalculatorState: (calcState: any) => void;
  syncPrices: (itemIds: string[]) => Promise<void>;
  isSyncing: boolean;
  syncMessage: string | null;
}

const defaultState: AppState = {
  specs: {
    baseCrafter: 100,
    SET1: 100,
    SET2: 100,
    SET3: 95,
    KEEPER: 28,
    HELL: 24,
    UNDEAD: 16,
    AVALON: 45,
    FEY: 22
  },
  prices: {},
  favorites: [
    {
      id: 'fav_1',
      itemId: 'T4_ARMOR_CLOTH_SET2',
      timestamp: Date.now(),
      configSnapshot: {
        usageFee: 500,
        rrr: 15.2,
        useFocus: false,
        focusCost: 0,
        quantity: 1,
        prices: {}
      }
    },
    {
      id: 'fav_2',
      itemId: 'T5_ARMOR_CLOTH_SET1',
      timestamp: Date.now(),
      configSnapshot: {
        usageFee: 500,
        rrr: 24.8,
        useFocus: true,
        focusCost: 0,
        quantity: 1,
        prices: {}
      }
    }
  ],
  groups: ['Geral', 'Robes', 'Botas'],
  server: 'west',
  buyCity: 'Caerleon',
  sellCity: 'Caerleon'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('albion_craft_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.server) parsed.server = 'west';
        if (parsed.city) {
          parsed.buyCity = parsed.city;
          parsed.sellCity = parsed.city;
          delete parsed.city;
        }
        if (!parsed.buyCity) parsed.buyCity = 'Caerleon';
        if (!parsed.sellCity) parsed.sellCity = 'Caerleon';
        if (!parsed.groups) parsed.groups = ['Geral', 'Robes', 'Botas'];
        if (parsed.calculatorState && parsed.calculatorState.quantity === undefined) {
          parsed.calculatorState.quantity = 1;
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse saved state', e);
      }
    }
    return defaultState;
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('albion_craft_state', JSON.stringify(state));
  }, [state]);

  const updateSpec = (nodeId: string, level: number) => {
    setState((prev) => ({
      ...prev,
      specs: { ...prev.specs, [nodeId]: level },
    }));
  };

  const updatePrice = (itemId: string, buy: number, sell: number) => {
    setState((prev) => ({
      ...prev,
      prices: { ...prev.prices, [itemId]: { buy, sell, updatedAt: new Date().toISOString() } },
    }));
  };

  const addFavorite = (config: CraftConfig) => {
    setState((prev) => ({
      ...prev,
      favorites: [...prev.favorites.filter((f) => f.id !== config.id), config],
    }));
  };

  const removeFavorite = (configId: string) => {
    setState((prev) => ({
      ...prev,
      favorites: prev.favorites.filter((f) => f.id !== configId),
    }));
  };

  const addGroup = (name: string) => {
    setState((prev) => ({
      ...prev,
      groups: prev.groups.includes(name) ? prev.groups : [...prev.groups, name],
    }));
  };

  const removeGroup = (name: string) => {
    setState((prev) => ({
      ...prev,
      groups: prev.groups.filter((g) => g !== name),
      favorites: prev.favorites.map(f => f.group === name ? { ...f, group: undefined } : f)
    }));
  };

  const updateFavoriteGroup = (favId: string, groupName: string | undefined) => {
    setState((prev) => ({
      ...prev,
      favorites: prev.favorites.map(f => f.id === favId ? { ...f, group: groupName } : f)
    }));
  };

  const setServer = (server: 'west' | 'east' | 'europe') => {
    setState((prev) => ({ ...prev, server }));
  };

  const setBuyCity = (city: string) => {
    setState((prev) => ({ ...prev, buyCity: city }));
  };

  const setSellCity = (city: string) => {
    setState((prev) => ({ ...prev, sellCity: city }));
  };

  const setCalculatorState = (calcState: any) => {
    setState((prev) => ({ ...prev, calculatorState: calcState }));
  };

  const syncPrices = async (itemIds: string[]) => {
    if (!itemIds.length) return;
    setIsSyncing(true);
    setSyncMessage(`Iniciando sincronização de ${itemIds.length} itens...`);

    const chunkSize = 50;
    const chunks = [];
    for (let i = 0; i < itemIds.length; i += chunkSize) {
      chunks.push(itemIds.slice(i, i + chunkSize));
    }

    const newPrices = { ...state.prices };
    let updatedCount = 0;
    let errorCount = 0;

    try {
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        setSyncMessage(`Buscando lote ${i + 1} de ${chunks.length}...`);

        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

          const serverPrefix = state.server === 'west' ? 'west' : state.server;
          // Fetch qualities 1 and 3 (Outstanding)
          const url = `https://${serverPrefix}.albion-online-data.com/api/v2/stats/prices/${chunk.join(',')}?locations=${state.buyCity},${state.sellCity}&qualities=1,3`;

          const response = await fetch(url, { signal: controller.signal });
          clearTimeout(timeoutId);

          if (!response.ok) {
            console.error(`HTTP Error: ${response.status}`);
            errorCount++;
            continue;
          }

          const data = await response.json();

          // Group by item_id
          const itemDataMap: Record<string, any[]> = {};
          data.forEach((item: any) => {
            if (!itemDataMap[item.item_id]) itemDataMap[item.item_id] = [];
            itemDataMap[item.item_id].push(item);
          });

          Object.keys(itemDataMap).forEach(itemId => {
            const itemEntries = itemDataMap[itemId];
            const current = newPrices[itemId] || { buy: 0, sell: 0 };
            let newBuy = current.buy;
            let newSell = current.sell;
            let latestDate = current.updatedAt || new Date().toISOString();
            let changed = false;

            // Process Buy City data (we want buy_price_max, prefer quality 1 for resources, but take what's available)
            const buyCityEntries = itemEntries.filter(e => e.city === state.buyCity);
            if (buyCityEntries.length > 0) {
              // Prefer quality 1 for buying materials, fallback to 3
              let bestBuyEntry = buyCityEntries.find(e => e.quality === 1 && (e.buy_price_max > 0 || e.sell_price_min > 0))
                || buyCityEntries.find(e => e.quality === 3 && (e.buy_price_max > 0 || e.sell_price_min > 0));

              if (bestBuyEntry) {
                const useBuyPrice = bestBuyEntry.buy_price_max > 0;
                newBuy = useBuyPrice ? bestBuyEntry.buy_price_max : bestBuyEntry.sell_price_min;

                let dateStr = null;
                if (useBuyPrice && bestBuyEntry.buy_price_max_date && !bestBuyEntry.buy_price_max_date.startsWith("0001-01-01")) {
                  dateStr = bestBuyEntry.buy_price_max_date + "Z";
                } else if (!useBuyPrice && bestBuyEntry.sell_price_min_date && !bestBuyEntry.sell_price_min_date.startsWith("0001-01-01")) {
                  dateStr = bestBuyEntry.sell_price_min_date + "Z";
                }

                if (dateStr) latestDate = dateStr;
                changed = true;
              }
            }

            // Process Sell City data (we want sell_price_min, prefer quality 3 for crafted items, fallback to 1)
            const sellCityEntries = itemEntries.filter(e => e.city === state.sellCity);
            if (sellCityEntries.length > 0) {
              // Prefer quality 3 for selling crafted items, fallback to 1
              let bestSellEntry = sellCityEntries.find(e => e.quality === 3 && (e.sell_price_min > 0 || e.buy_price_max > 0))
                || sellCityEntries.find(e => e.quality === 1 && (e.sell_price_min > 0 || e.buy_price_max > 0));

              if (bestSellEntry) {
                const useSellPrice = bestSellEntry.sell_price_min > 0;
                newSell = useSellPrice ? bestSellEntry.sell_price_min : bestSellEntry.buy_price_max;

                let dateStr = null;
                if (useSellPrice && bestSellEntry.sell_price_min_date && !bestSellEntry.sell_price_min_date.startsWith("0001-01-01")) {
                  dateStr = bestSellEntry.sell_price_min_date + "Z";
                } else if (!useSellPrice && bestSellEntry.buy_price_max_date && !bestSellEntry.buy_price_max_date.startsWith("0001-01-01")) {
                  dateStr = bestSellEntry.buy_price_max_date + "Z";
                }

                if (dateStr) {
                  // If we already updated latestDate from buy, take the newer one
                  if (changed) {
                    latestDate = new Date(dateStr) > new Date(latestDate) ? dateStr : latestDate;
                  } else {
                    latestDate = dateStr;
                  }
                }
                changed = true;
              }
            }

            if (changed && (newBuy !== current.buy || newSell !== current.sell || current.buy === 0)) {
              newPrices[itemId] = {
                buy: newBuy,
                sell: newSell,
                updatedAt: latestDate
              };
              updatedCount++;
            }
          });
        } catch (error: any) {
          console.error("Failed to fetch prices", error);
          errorCount++;
          if (error.name === 'AbortError') {
            setSyncMessage(`Erro: Tempo limite excedido no lote ${i + 1}.`);
            await new Promise(resolve => setTimeout(resolve, 2000)); // Show error briefly
          }
        }
      }

      if (updatedCount > 0) {
        setState(prev => ({ ...prev, prices: newPrices }));
      }

      if (errorCount > 0) {
        setSyncMessage(`Concluído com erros. ${updatedCount} preços atualizados.`);
      } else {
        setSyncMessage(`Sucesso! ${updatedCount} preços atualizados.`);
      }
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncMessage(null), 4000);
    }
  };

  return (
    <AppContext.Provider value={{
      state,
      updateSpec,
      updatePrice,
      addFavorite,
      removeFavorite,
      addGroup,
      removeGroup,
      updateFavoriteGroup,
      setServer,
      setBuyCity,
      setSellCity,
      setCalculatorState,
      syncPrices,
      isSyncing,
      syncMessage
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
