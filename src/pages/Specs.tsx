import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { SPEC_NODES } from '../constants';
import { ChevronDown, ChevronRight, Star, Info } from 'lucide-react';

export const Specs: React.FC = () => {
  const { state, updateSpec } = useAppContext();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const baseNodes = SPEC_NODES.filter((n) => !n.baseNodeId);

  const calculateFCE = (baseId: string, specId: string) => {
    const baseLevel = state.specs[baseId] || 0;
    const specificNodes = SPEC_NODES.filter((n) => n.baseNodeId === baseId);
    
    let totalFCE = baseLevel * 30;
    specificNodes.forEach((node) => {
      const level = state.specs[node.id] || 0;
      if (node.id === specId) {
        totalFCE += level * 250;
      } else {
        const crossBonus = node.isArtifact ? 15 : 30;
        totalFCE += level * crossBonus;
      }
    });
    
    return totalFCE;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100">Painel de Especialização</h2>
        <p className="text-zinc-400 mt-1">Configure seus níveis da Árvore do Destino para calcular a Eficiência de Custo de Foco.</p>
      </div>

      <div className="bg-amber-950/20 border border-amber-900/30 rounded-xl p-4 flex gap-4 items-start">
        <div className="p-2 bg-amber-500/10 rounded-lg shrink-0">
          <Info className="w-5 h-5 text-amber-500" />
        </div>
        <div>
          <h3 className="text-amber-400 font-semibold mb-1">O que é FCE (Focus Cost Efficiency)?</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            É a matemática que define o seu lucro real. Quanto maior sua spec, menos Foco você gasta.
            <br />
            <strong className="text-zinc-300">A cada 10.000 de eficiência, o custo de foco cai pela metade.</strong>
            <br />
            Seus níveis aqui atualizam automaticamente o custo na aba Calculadora.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {baseNodes.map((baseNode) => {
          const isExpanded = expanded[baseNode.id];
          const specificNodes = SPEC_NODES.filter((n) => n.baseNodeId === baseNode.id);
          
          return (
            <div key={baseNode.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
              <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-800/50 transition-colors"
                onClick={() => toggleExpand(baseNode.id)}
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? <ChevronDown className="w-5 h-5 text-zinc-400" /> : <ChevronRight className="w-5 h-5 text-zinc-400" />}
                  <div>
                    <h3 className="font-semibold text-zinc-100">{baseNode.name}</h3>
                    <div className="text-xs text-zinc-500 font-medium mt-0.5">
                      Nível Base (+30 FCE para todos)
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <label className="text-xs text-zinc-500 uppercase font-semibold">Nível</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={state.specs[baseNode.id] || 0}
                    onChange={(e) => updateSpec(baseNode.id, parseInt(e.target.value) || 0)}
                    className="w-16 bg-zinc-950 border border-zinc-700 rounded-lg py-1 px-2 text-center text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {isExpanded && (
                <div className="bg-zinc-950/50 p-4 border-t border-zinc-800 space-y-3">
                  {specificNodes.map((specNode) => {
                    const itemFCE = calculateFCE(baseNode.id, specNode.id);
                    return (
                      <div key={specNode.id} className="flex items-center justify-between pl-8">
                        <div>
                          <span className="text-sm text-zinc-300 block">{specNode.name}</span>
                          <span className="text-[10px] text-amber-500 font-medium flex items-center gap-1 mt-0.5">
                            <Star className="w-3 h-3" /> FCE: {itemFCE.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={state.specs[specNode.id] || 0}
                            onChange={(e) => updateSpec(specNode.id, parseInt(e.target.value) || 0)}
                            className="w-16 bg-zinc-900 border border-zinc-700 rounded-lg py-1 px-2 text-center text-zinc-100 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
