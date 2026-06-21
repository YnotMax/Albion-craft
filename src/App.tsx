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
import { CapeCalculator } from './pages/CapeCalculator';
import { CapeMarketAnalysis } from './pages/CapeMarketAnalysis';
import { RefiningCalculator } from './pages/RefiningCalculator';

import { Toaster } from 'react-hot-toast';

export default function App() {
  const [activeTab, setActiveTab] = useState('calculator');

  return (
    <AppProvider>
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#333', color: '#fff' } }} />
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        <div className={activeTab === 'dashboard' ? 'block' : 'hidden'}><Dashboard /></div>
        <div className={activeTab === 'market' ? 'block' : 'hidden'}><MarketAnalysis /></div>
        <div className={activeTab === 'refining' ? 'block' : 'hidden'}><RefiningCalculator /></div>
        <div className={activeTab === 'specs' ? 'block' : 'hidden'}><Specs /></div>
        <div className={activeTab === 'prices' ? 'block' : 'hidden'}><Prices /></div>
        <div className={activeTab === 'transport' ? 'block' : 'hidden'}><Transport /></div>
        <div className={activeTab === 'calculator' ? 'block' : 'hidden'}><Calculator /></div>
        <div className={activeTab === 'capes' ? 'block' : 'hidden'}><CapeCalculator /></div>
        <div className={activeTab === 'cape_market' ? 'block' : 'hidden'}><CapeMarketAnalysis /></div>
        <div className={activeTab === 'about' ? 'block' : 'hidden'}><About /></div>
      </Layout>
    </AppProvider>
  );
}
