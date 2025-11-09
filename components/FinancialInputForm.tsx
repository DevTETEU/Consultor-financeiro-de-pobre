
import React, { useState } from 'react';
import type { Expense } from '../types';
import { PlusCircleIcon } from './icons/PlusCircleIcon';
import { TrashIcon } from './icons/TrashIcon';
import { WalletIcon } from './icons/WalletIcon';
import { ReceiptPercentIcon } from './icons/ReceiptPercentIcon';

interface FinancialInputFormProps {
  income: number;
  setIncome: (income: number) => void;
  expenses: Expense[];
  setExpenses: (expenses: Expense[]) => void;
}

const presetExpenses = [
  'Aluguel', 'Contas (luz, água)', 'Supermercado', 'Transporte', 'Lazer', 'Dívidas', 'Internet/Celular', 'Saúde'
];

export const FinancialInputForm: React.FC<FinancialInputFormProps> = ({ income, setIncome, expenses, setExpenses }) => {
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState<number | string>('');

  const addExpense = () => {
    const amount = typeof newExpenseAmount === 'string' ? parseFloat(newExpenseAmount) : newExpenseAmount;
    if (newExpenseName.trim() && amount > 0) {
      const newExpense: Expense = {
        id: new Date().toISOString(),
        name: newExpenseName.trim(),
        amount: amount,
      };
      setExpenses([...expenses, newExpense]);
      setNewExpenseName('');
      setNewExpenseAmount('');
    }
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };
  
  const handlePresetClick = (name: string) => {
    setNewExpenseName(name);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-700">
          <WalletIcon className="w-6 h-6"/>
          1. Qual é a sua renda mensal?
        </h2>
        <p className="text-slate-600 mb-4">Informe seu salário ou qualquer outra fonte de renda principal que você recebe por mês.</p>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">R$</span>
          <input
            type="number"
            value={income || ''}
            onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
            placeholder="Ex: 1500.00"
            className="w-full pl-9 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-700">
          <ReceiptPercentIcon className="w-6 h-6"/>
          2. Quais são suas despesas mensais?
        </h2>
        <p className="text-slate-600 mb-4">Adicione seus gastos fixos e variáveis. Seja o mais detalhado possível.</p>
        
        <div className="mb-4">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Sugestões de despesas:</h3>
          <div className="flex flex-wrap gap-2">
            {presetExpenses.map(preset => (
              <button 
                key={preset}
                onClick={() => handlePresetClick(preset)}
                className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm hover:bg-indigo-100 hover:text-indigo-700 transition"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 items-end">
          <div className="md:col-span-3">
            <label htmlFor="expenseName" className="block text-sm font-medium text-slate-700">Nome da Despesa</label>
            <input
              id="expenseName"
              type="text"
              value={newExpenseName}
              onChange={(e) => setNewExpenseName(e.target.value)}
              placeholder="Ex: Aluguel"
              className="mt-1 w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="md:col-span-2 relative">
             <label htmlFor="expenseAmount" className="block text-sm font-medium text-slate-700">Valor (R$)</label>
            <span className="absolute top-8 left-0 flex items-center pl-3 text-slate-500">R$</span>
            <input
              id="expenseAmount"
              type="number"
              value={newExpenseAmount}
              onChange={(e) => setNewExpenseAmount(e.target.value)}
              placeholder="Ex: 800.00"
              className="mt-1 w-full p-2 pl-9 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        <button
          onClick={addExpense}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusCircleIcon className="w-5 h-5"/>
          Adicionar Despesa
        </button>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-slate-700">Lista de Despesas</h3>
          {expenses.length === 0 ? (
            <p className="text-slate-500 mt-2">Nenhuma despesa adicionada ainda.</p>
          ) : (
            <ul className="mt-2 divide-y divide-slate-200">
              {expenses.map(exp => (
                <li key={exp.id} className="py-3 flex justify-between items-center">
                  <span className="text-slate-800">{exp.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-slate-900">R$ {exp.amount.toFixed(2)}</span>
                    <button onClick={() => removeExpense(exp.id)} className="text-red-500 hover:text-red-700">
                      <TrashIcon className="w-5 h-5"/>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
