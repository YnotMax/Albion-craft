import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { state, setServer } = useAppContext();
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  const tabs = [
    { id: 'calculator', label: 'Calculadora', icon: 'calculate' },
    { id: 'dashboard', label: 'Favoritos', icon: 'star' },
    { id: 'market', label: 'Análise de Mercado', icon: 'analytics' },
    { id: 'specs', label: 'Especializações', icon: 'military_tech' },
    { id: 'prices', label: 'Preços', icon: 'payments' },
    { id: 'about', label: 'Sobre o Projeto', icon: 'info' },
  ];

  const activeLabel = tabs.find(t => t.id === activeTab)?.label || 'Calculadora de Craft';

  return (
    <div className="bg-surface text-on-surface overflow-hidden flex h-screen font-sans">
      {/* SideNavBar (Desktop) */}
      <aside className={`hidden md:flex bg-surface-container-low flex-col border-r border-outline-variant/10 shrink-0 transition-all duration-300 ${isSidebarMinimized ? 'w-[88px]' : 'w-64'}`}>
        <div className={`p-6 flex items-center ${isSidebarMinimized ? 'justify-center px-4' : 'gap-3'} h-20 shrink-0`}>
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>fort</span>
          </div>
          {!isSidebarMinimized && (
            <div className="truncate">
              <h1 className="text-on-surface font-bold text-lg leading-tight tight-tracking">Slate Forge</h1>
              <p className="text-on-surface-variant text-[10px] uppercase tracking-wider font-semibold">Albion Crafting Hub</p>
            </div>
          )}
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto no-scrollbar">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center ${isSidebarMinimized ? 'justify-center p-3' : 'gap-3 px-3 py-2.5'} rounded-lg transition-colors text-left ${
                  isActive 
                    ? 'bg-surface-container-high text-primary' 
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
                title={isSidebarMinimized ? tab.label : undefined}
              >
                <span className="material-symbols-outlined shrink-0" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                  {tab.icon}
                </span>
                {!isSidebarMinimized && <span className="text-sm font-medium truncate">{tab.label}</span>}
              </button>
            )
          })}
        </nav>
        
        <div className="p-4 mt-auto space-y-2">
          {/* Recolher Menu Toggle */}
          <button 
             onClick={() => setIsSidebarMinimized(!isSidebarMinimized)}
             className={`w-full flex items-center ${isSidebarMinimized ? 'justify-center p-2' : 'gap-3 px-3 py-2'} rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors`}
             title={isSidebarMinimized ? "Expandir Menu" : "Recolher Menu"}
          >
             <span className="material-symbols-outlined shrink-0">
               {isSidebarMinimized ? 'menu' : 'menu_open'}
             </span>
             {!isSidebarMinimized && <span className="text-sm font-medium">Recolher</span>}
          </button>

          <div className={`bg-surface-container rounded-xl flex items-center ${isSidebarMinimized ? 'justify-center p-2' : 'p-4 gap-3'}`}>
            <div className="w-10 h-10 rounded-full bg-surface-bright flex items-center justify-center overflow-hidden shrink-0">
               <span className="material-symbols-outlined text-on-surface-variant">person</span>
            </div>
            {!isSidebarMinimized && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">Crafteiro Albion</p>
                  <p className="text-xs text-primary font-medium">Player</p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant text-sm cursor-pointer hover:text-on-surface shrink-0">settings</span>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-surface relative">
        {/* TopNavBar */}
        <header className="h-16 flex items-center justify-between px-4 md:px-8 bg-surface border-b border-outline-variant/10 shrink-0">
          <div className="flex items-center gap-4 md:gap-6">
            <h2 className="text-lg md:text-xl font-bold tight-tracking text-on-surface truncate hidden sm:block">{activeLabel}</h2>
            <div className="flex items-center gap-2 bg-surface-container pl-3 pr-2 py-1.5 rounded-lg border border-outline-variant/20 relative group hover:border-primary/50 transition-colors">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0"></span>
              <select 
                value={state.server}
                onChange={(e) => setServer(e.target.value as 'west'|'east'|'europe')}
                className="bg-transparent text-xs font-semibold text-on-surface-variant group-hover:text-on-surface focus:outline-none appearance-none pr-5 cursor-pointer"
              >
                <option value="west">Americas</option>
                <option value="europe">Europe</option>
                <option value="east">Asia</option>
              </select>
              <span className="material-symbols-outlined text-[14px] text-on-surface-variant absolute right-1 pointer-events-none group-hover:text-primary transition-colors">arrow_drop_down</span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto w-full no-scrollbar relative z-0">
           {children}
        </div>
        
        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden border-t border-outline-variant/10 bg-surface-container-low shrink-0 h-16 flex justify-around items-center px-2">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                  isActive ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <div className={`p-1 rounded-xl transition-all duration-300 flex items-center justify-center ${isActive ? 'bg-primary/10' : ''}`}>
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                    {tab.icon}
                  </span>
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-wider ${isActive ? 'opacity-100 text-primary' : 'opacity-70 text-on-surface-variant'}`}>
                  {tab.label}
                </span>
              </button>
            )
          })}
        </nav>
      </main>
    </div>
  );
};
