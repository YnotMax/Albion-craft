import React, { useState } from 'react';
import { Book, Calculator, Coins, LayoutDashboard, Settings, ChevronLeft, ChevronRight, Github, Linkedin, Instagram, ExternalLink, Info } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'specs', label: 'Especialização', icon: Book },
    { id: 'prices', label: 'Preços', icon: Coins },
    { id: 'calculator', label: 'Calculadora', icon: Calculator },
    { id: 'about', label: 'Sobre o Projeto', icon: Info },
  ];

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <nav className={`hidden md:flex flex-col bg-zinc-900 border-r border-zinc-800 shrink-0 transition-all duration-300 ease-in-out z-20 ${isExpanded ? 'w-64' : 'w-20'}`}>
        <div className="h-16 flex items-center justify-center border-b border-zinc-800 px-4 shrink-0">
          <div className={`flex items-center gap-3 w-full ${isExpanded ? 'justify-start' : 'justify-center'}`}>
            <div className="p-1.5 bg-amber-500/10 rounded-lg shrink-0">
              <Calculator className="w-6 h-6 text-amber-500" />
            </div>
            {isExpanded && <span className="font-bold text-emerald-400 tracking-tight truncate animate-in fade-in duration-300">Albion Crafting</span>}
          </div>
        </div>

        <div className={`flex-1 py-6 flex flex-col gap-2 px-3 no-scrollbar ${isExpanded ? 'overflow-y-auto' : 'overflow-y-hidden'}`}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <div key={tab.id} className="relative group flex w-full">
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 w-full ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-500 shadow-sm shadow-amber-900/20'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                  } ${isExpanded ? 'justify-start' : 'justify-center'}`}
                >
                  <Icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-amber-500' : 'text-zinc-400 group-hover:text-zinc-200'}`} />
                  {isExpanded && <span className="text-sm font-medium truncate">{tab.label}</span>}
                </button>
                
                {/* Tooltip for collapsed state */}
                {!isExpanded && (
                  <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-2 bg-zinc-800 text-zinc-200 text-xs font-medium rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 border border-zinc-700 whitespace-nowrap flex items-center">
                    {tab.label}
                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-zinc-700"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-zinc-800 flex flex-col gap-4 shrink-0">
          {isExpanded && (
            <div className="flex flex-col gap-3 px-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Desenvolvido por</span>
              <span className="text-sm font-bold text-zinc-200">Tony Max</span>
              <div className="flex items-center gap-3">
                <a href="https://github.com/YnotMax" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
                  <Github className="w-4 h-4" />
                </a>
                <a href="https://www.linkedin.com/in/tony-max-da-silva-costa/" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-blue-400 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="https://www.instagram.com/tony_max_silva/" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-pink-400 transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors w-full flex justify-center group"
            title={isExpanded ? "Minimizar menu" : "Expandir menu"}
          >
            {isExpanded ? 
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" /> : 
              <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            }
          </button>
        </div>
      </nav>

      {/* Mobile Layout Wrapper */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-zinc-900 border-b border-zinc-800 p-4 shadow-md z-10 shrink-0">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-emerald-400 tracking-tight flex items-center gap-2">
              <div className="p-1.5 bg-amber-500/10 rounded-lg">
                <Calculator className="w-5 h-5 text-amber-500" />
              </div>
              Albion Crafting
            </h1>
            <div className="flex items-center gap-3">
              <a href="https://github.com/YnotMax" target="_blank" rel="noopener noreferrer" className="text-zinc-500">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 bg-zinc-950 relative">
          <div className="max-w-7xl mx-auto w-full h-full animate-in fade-in duration-500">
            {children}
          </div>
        </main>

        {/* Bottom Navigation (Mobile) */}
        <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-md border-t border-zinc-800 md:hidden z-20">
          <div className="flex justify-around items-center h-16 px-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                    isActive ? 'text-amber-500' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <div className={`p-1.5 rounded-xl transition-all duration-300 ${isActive ? 'bg-amber-500/10 scale-110' : ''}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-medium uppercase tracking-wider transition-all ${isActive ? 'opacity-100' : 'opacity-70'}`}>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};
