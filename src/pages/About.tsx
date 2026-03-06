import React from 'react';
import { Github, Linkedin, Instagram, Code2, Database, Zap, Target, Users, Briefcase, ChevronRight, ExternalLink, Cpu, Layers } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-6 border border-emerald-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Status: Online & Evoluindo
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-500 tracking-tight mb-6 leading-tight">
            Albion Crafting <br />
            <span className="text-amber-500">Intelligence</span>
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-400 leading-relaxed mb-8 max-w-2xl">
            Uma ferramenta analítica avançada desenvolvida para dominar a economia do Albion Online. 
            Transformando dados complexos em decisões lucrativas através de tecnologia de ponta.
          </p>

          <div className="flex flex-wrap gap-4">
            <a href="https://github.com/YnotMax" target="_blank" rel="noopener noreferrer" 
               className="flex items-center gap-2 px-6 py-3 bg-zinc-100 text-zinc-900 rounded-xl font-bold hover:bg-white transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              <Github className="w-5 h-5" />
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/tony-max-da-silva-costa/" target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-2 px-6 py-3 bg-[#0A66C2] text-white rounded-xl font-bold hover:bg-[#0077b5] transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(10,102,194,0.4)]">
              <Linkedin className="w-5 h-5" />
              LinkedIn
            </a>
            <a href="https://www.instagram.com/tony_max_silva/" target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white rounded-xl font-bold hover:opacity-90 transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(253,29,29,0.4)]">
              <Instagram className="w-5 h-5" />
              Instagram
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Para Leigos */}
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-3xl p-8 backdrop-blur-sm hover:bg-zinc-900 transition-colors group">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-400 group-hover:scale-110 transition-transform duration-500">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-zinc-100">Para Jogadores</h2>
              <p className="text-zinc-500">O que é e como ajuda?</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="mt-1 bg-zinc-800 p-2 rounded-full h-fit text-zinc-400"><Target className="w-4 h-4" /></div>
              <div>
                <h3 className="text-lg font-bold text-zinc-200 mb-2">O Problema</h3>
                <p className="text-zinc-400 leading-relaxed">
                  No jogo Albion Online, a economia é 100% controlada pelos jogadores. Criar itens (crafting) pode dar muito lucro, mas exige cálculos matemáticos complexos envolvendo taxas, devolução de recursos, uso de foco e preços de mercado que mudam a todo momento.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="mt-1 bg-emerald-500/20 p-2 rounded-full h-fit text-emerald-400"><Zap className="w-4 h-4" /></div>
              <div>
                <h3 className="text-lg font-bold text-zinc-200 mb-2">A Solução</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Esta aplicação automatiza tudo. Ela se conecta aos dados do jogo em tempo real, calcula exatamente quanto custa fazer um item, quanto de material você recebe de volta, e te diz na hora se vale a pena ou não fabricar aquele item. É como ter um contador e analista financeiro pessoal dentro do jogo.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Para Recrutadores */}
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-3xl p-8 backdrop-blur-sm hover:bg-zinc-900 transition-colors group">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-amber-500/10 rounded-2xl text-amber-400 group-hover:scale-110 transition-transform duration-500">
              <Briefcase className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-zinc-100">Para Recrutadores</h2>
              <p className="text-zinc-500">Por baixo do capô</p>
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-zinc-400 leading-relaxed">
              Este projeto demonstra minha capacidade de resolver problemas complexos de negócios (neste caso, economia virtual) através de engenharia de software robusta.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-zinc-950/50 border border-zinc-800/50 p-4 rounded-2xl">
                <Code2 className="w-6 h-6 text-blue-400 mb-3" />
                <h4 className="font-bold text-zinc-200 mb-1">Frontend Moderno</h4>
                <p className="text-sm text-zinc-500">React 18, TypeScript, Tailwind CSS. Arquitetura componentizada e estado global otimizado.</p>
              </div>
              <div className="bg-zinc-950/50 border border-zinc-800/50 p-4 rounded-2xl">
                <Database className="w-6 h-6 text-purple-400 mb-3" />
                <h4 className="font-bold text-zinc-200 mb-1">Integração de API</h4>
                <p className="text-sm text-zinc-500">Consumo da Albion Data Project API com cache, tratamento de erros e fallback de dados.</p>
              </div>
              <div className="bg-zinc-950/50 border border-zinc-800/50 p-4 rounded-2xl">
                <Cpu className="w-6 h-6 text-amber-400 mb-3" />
                <h4 className="font-bold text-zinc-200 mb-1">Lógica Complexa</h4>
                <p className="text-sm text-zinc-500">Algoritmos de cálculo de retorno de recursos (RRR), custo de foco e margens de lucro dinâmicas.</p>
              </div>
              <div className="bg-zinc-950/50 border border-zinc-800/50 p-4 rounded-2xl">
                <Layers className="w-6 h-6 text-emerald-400 mb-3" />
                <h4 className="font-bold text-zinc-200 mb-1">UX/UI Design</h4>
                <p className="text-sm text-zinc-500">Interface responsiva, feedback visual imediato, dark mode nativo e micro-interações.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack Banner */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <h3 className="text-xl font-bold text-zinc-200 mb-6 relative z-10">Tecnologias Utilizadas</h3>
        <div className="flex flex-wrap justify-center gap-3 relative z-10">
          {['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Lucide Icons', 'Context API', 'RESTful APIs'].map((tech) => (
            <span key={tech} className="px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-full text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-colors cursor-default">
              {tech}
            </span>
          ))}
        </div>
      </div>
      
      {/* Footer CTA */}
      <div className="text-center py-8">
        <p className="text-zinc-500 mb-4">Gostou do que viu? Vamos conversar sobre como posso agregar valor ao seu time.</p>
        <a href="https://www.linkedin.com/in/tony-max-da-silva-costa/" target="_blank" rel="noopener noreferrer" 
           className="inline-flex items-center gap-2 text-amber-500 font-bold hover:text-amber-400 transition-colors group">
          Entrar em contato
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </div>
  );
};
