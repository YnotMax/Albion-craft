import React, { useState, useEffect } from 'react';

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  className?: string;
  placeholder?: string;
  variant?: 'default' | 'minimal';
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({ value, onChange, label, className = '', placeholder = '0', variant = 'default' }) => {
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    if (value === 0 && displayValue === '') {
      return;
    }
    setDisplayValue(formatNumber(value));
  }, [value]);

  const formatNumber = (num: number) => {
    if (num === 0) return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const parseNumber = (str: string) => {
    const parsed = parseInt(str.replace(/\./g, ''), 10);
    return isNaN(parsed) ? 0 : parsed;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits and dots
    const rawValue = e.target.value.replace(/[^\d.]/g, '');
    
    // Remove dots for parsing
    const cleanValue = rawValue.replace(/\./g, '');
    
    if (cleanValue === '') {
      setDisplayValue('');
      onChange(0);
      return;
    }

    const numValue = parseInt(cleanValue, 10);
    if (!isNaN(numValue)) {
      setDisplayValue(formatNumber(numValue));
      onChange(numValue);
    }
  };

  if (variant === 'minimal') {
    return (
      <input
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={`bg-transparent outline-none w-full ${className}`}
      />
    );
  }

  return (
    <div className={`flex flex-col ${className}`}>
      {label && <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">{label}</label>}
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg py-2 px-3 text-zinc-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
        />
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <span className="text-zinc-500 text-sm font-medium">Prata</span>
        </div>
      </div>
    </div>
  );
};
