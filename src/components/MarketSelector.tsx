import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Globe, MapPin } from 'lucide-react';

export const MarketSelector: React.FC = () => {
  const { state, setServer, setBuyCity, setSellCity } = useAppContext();
  
  const servers = [
    { id: 'west', name: 'Américas (West)' },
    { id: 'east', name: 'Ásia (East)' },
    { id: 'europe', name: 'Europa (Europe)' }
  ];
  
  const cities = ['Caerleon', 'Black Market', 'Bridgewatch', 'Fort Sterling', 'Lymhurst', 'Martlock', 'Thetford', 'Brecilien'];

  return (
    <div className="flex flex-wrap gap-4 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/50">
      <div className="flex items-center gap-2">
        <Globe className="w-4 h-4 text-zinc-400" />
        <select 
          value={state.server} 
          onChange={(e) => setServer(e.target.value as any)}
          className="bg-zinc-950 border border-zinc-700 rounded-md py-1.5 px-3 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
        >
          {servers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-zinc-400" />
        <div className="flex flex-col sm:flex-row gap-2">
          <select 
            value={state.buyCity} 
            onChange={(e) => setBuyCity(e.target.value)}
            className="bg-zinc-950 border border-zinc-700 rounded-md py-1.5 px-3 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
            title="Cidade de Compra (Materiais)"
          >
            <option disabled value="">Comprar em...</option>
            {cities.map(c => <option key={`buy-${c}`} value={c}>Comprar: {c}</option>)}
          </select>
          <select 
            value={state.sellCity} 
            onChange={(e) => setSellCity(e.target.value)}
            className="bg-zinc-950 border border-zinc-700 rounded-md py-1.5 px-3 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
            title="Cidade de Venda (Item Final)"
          >
            <option disabled value="">Vender em...</option>
            {cities.map(c => <option key={`sell-${c}`} value={c}>Vender: {c}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
};
