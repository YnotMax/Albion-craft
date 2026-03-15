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
import { Journals } from './pages/Journals';
import { Debug } from './pages/Debug';
import { About } from './pages/About';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'specs':
        return <Specs />;
      case 'prices':
        return <Prices />;
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
