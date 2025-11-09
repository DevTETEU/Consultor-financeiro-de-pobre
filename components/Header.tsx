
import React from 'react';
import { CurrencyDollarIcon } from './icons/CurrencyDollarIcon';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-4 flex items-center gap-4">
        <div className="bg-indigo-600 p-3 rounded-full text-white">
          <CurrencyDollarIcon className="w-8 h-8"/>
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Grana na Mão</h1>
          <p className="text-sm sm:text-base text-slate-500">Seu consultor financeiro pessoal e inteligente</p>
        </div>
      </div>
    </header>
  );
};
