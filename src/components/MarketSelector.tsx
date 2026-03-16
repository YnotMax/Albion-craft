import React from 'react';
import { MapPin } from 'lucide-react';

interface MarketSelectorProps {
  label: string;
  value: string;
  onChange: (city: string) => void;
}

export const MarketSelector: React.FC<MarketSelectorProps> = ({ label, value, onChange }) => {
  const cities = ['Caerleon', 'Black Market', 'Bridgewatch', 'Fort Sterling', 'Lymhurst', 'Martlock', 'Thetford', 'Brecilien'];

  return (
    <div className="space-y-1.5">
      <label className="text-[10px] uppercase font-bold text-on-surface-variant/70 ml-1 flex items-center gap-1">
        <MapPin className="w-3 h-3" />
        {label}
      </label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-surface-container-high border border-outline-variant/20 rounded-xl px-4 py-2 text-sm text-on-surface focus:outline-none focus:ring-1 ring-primary transition-all cursor-pointer"
      >
        <option disabled value="">Selecione a cidade...</option>
        {cities.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
    </div>
  );
};
