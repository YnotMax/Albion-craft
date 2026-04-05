/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Specs } from './pages/Specs';
import { Prices } from './pages/Prices';
import { Calculator } from './pages/Calculator';
import { MarketAnalysis } from './pages/MarketAnalysis';
import { About } from './pages/About';
import { Transport } from './pages/Transport';

export default function App() {
  const [activeTab, setActiveTab] = useState('calculator');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'market':
        return <MarketAnalysis />;
      case 'specs':
        return <Specs />;
      case 'prices':
        return <Prices />;
      case 'transport':
        return <Transport />;
Expected ")" but found "{"
        555 |
          556 |
          557 | {/* Tabela de Resultados */ }
          |        ^
          558 | <div className="bg-surface-container-low rounded-xl border border-outline-variant/10 shadow-xl overflow-x-auto">
            559|          <div className="p-4 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-high/50">
              case 'calculator':
              return <Calculator />;
              case 'about':
              return <About />;
              default:
              return <Dashboard />;
    }
  };

              return (
              <AppProvider>
                <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
                  {renderContent()}
                </Layout>
              </AppProvider>
              );
}
