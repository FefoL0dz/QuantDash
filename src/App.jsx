import React from 'react';
import Dashboard from './pages/Dashboard';
import { FilterProvider } from './context/FilterContext';

const App = () => {
  return (
    <FilterProvider>
      <Dashboard />
    </FilterProvider>
  );
};

export default App;
