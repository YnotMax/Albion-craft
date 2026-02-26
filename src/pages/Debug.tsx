import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ITEMS } from '../constants';
import { Search, RefreshCw, AlertCircle } from 'lucide-react';

export const Debug: React.FC = () => {
  const { state } = useAppContext();
  const [itemId, setItemId] = useState('');
  const [rawResponse, setRawResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTestApi = async () => {
    if (!itemId) return;
    setLoading(true);
    setError(null);
    setRawResponse(null);

    try {
      const serverPrefix = state.server === 'west' ? 'west' : state.server;
      const url = `https://${serverPrefix}.albion-online-data.com/api/v2/stats/prices/${itemId}?locations=${state.buyCity},${state.sellCity}&qualities=1,3`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      
      const data = await response.json();
      setRawResponse(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectExisting = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemId(e.target.value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100">Debug da API</h2>
        <p className="text-zinc-400 mt-1">Teste requisições diretamente para o Albion Data Project para verificar IDs e preços.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Selecionar Item do Sistema</label>
            <select 
              onChange={handleSelectExisting}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg py-2 px-3 text-zinc-100 focus:outline-none focus:border-amber-500"
              value=""
            >
              <option value="" disabled>Selecione um item...</option>
              {ITEMS.map(item => (
                <option key={item.id} value={item.id}>{item.name} ({item.id})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Ou Digite o ID Manualmente</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={itemId}
                onChange={(e) => setItemId(e.target.value)}
                placeholder="Ex: T4_ARTIFACT_ARMOR_CLOTH_KEEPER"
                className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg py-2 px-3 text-zinc-100 focus:outline-none focus:border-amber-500 font-mono text-sm"
              />
              <button
                onClick={handleTestApi}
                disabled={loading || !itemId}
                className="bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-zinc-950 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Testar
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400 bg-zinc-950 p-3 rounded-lg border border-zinc-800">
          <div><strong>Servidor:</strong> {state.server}</div>
          <div><strong>Cidade Compra:</strong> {state.buyCity}</div>
          <div><strong>Cidade Venda:</strong> {state.sellCity}</div>
        </div>

        {error && (
          <div className="p-4 bg-red-900/30 border border-red-900/50 rounded-lg flex items-start gap-3 text-red-400">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {rawResponse && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-zinc-300">Resposta Raw da API:</h3>
            <pre className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 overflow-x-auto text-xs font-mono text-zinc-300">
              {JSON.stringify(rawResponse, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
