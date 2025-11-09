
import React from 'react';
import type { FinancialData } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface AnalysisDisplayProps {
  financialData: FinancialData;
  balance: number;
  analysis: string;
  onBack: () => void;
}

const COLORS = ['#4f46e5', '#7c3aed', '#a78bfa', '#c4b5fd', '#60a5fa', '#38bdf8', '#22d3ee', '#67e8f9'];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow-lg">
          <p className="label">{`${payload[0].name} : R$ ${payload[0].value.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };

const renderMarkdown = (text: string) => {
    let html = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
        .replace(/\n\s*-\s/g, '\n<li class="ml-5 list-disc">') 
        .replace(/(\n<li.*)/g, '<ul class="mt-2 mb-4">$1</ul>')
        .replace(/<\/ul>\n<ul>/g, '')
        .replace(/\n/g, '<br />');

    // Clean up lists
    html = html.replace(/<br \/>(<ul|<li)/g, '$1');
    html = html.replace(/(<\/li>)<br \/>/g, '$1');

    return { __html: html };
};

export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ financialData, balance, analysis, onBack }) => {
  const { income, expenses } = financialData;
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const chartData = expenses.map(exp => ({
    name: exp.name,
    value: exp.amount,
  }));
  
  const balanceColor = balance >= 0 ? (balance > income * 0.1 ? 'text-green-600' : 'text-amber-600') : 'text-red-600';

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 animate-fade-in">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700">Sua Análise Financeira</h2>
        <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition"
        >
            <ArrowLeftIcon className="w-5 h-5"/>
            Voltar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <p className="text-sm text-green-700">Renda Mensal</p>
            <p className="text-2xl font-bold text-green-800">R$ {income.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
            <p className="text-sm text-red-700">Despesas Totais</p>
            <p className="text-2xl font-bold text-red-800">R$ {totalExpenses.toFixed(2)}</p>
        </div>
        <div className={`p-4 rounded-lg text-center ${balance >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'}`}>
            <p className={`text-sm ${balance >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>Saldo Restante</p>
            <p className={`text-2xl font-bold ${balanceColor}`}>R$ {balance.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4 text-slate-800">Distribuição das Despesas</h3>
          {expenses.length > 0 ? (
            <div className="w-full h-80">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
             <div className="flex items-center justify-center h-full bg-slate-50 rounded-lg">
                <p className="text-slate-500">Sem dados de despesas para exibir o gráfico.</p>
             </div>
          )}
        </div>
        <div className="prose prose-slate max-w-none prose-headings:text-indigo-700 prose-strong:text-slate-900 prose-li:marker:text-indigo-400">
            <h3 className="text-xl font-semibold mb-2 text-slate-800">💡 Conselhos do Assistente IA</h3>
            <div 
              className="text-slate-700"
              dangerouslySetInnerHTML={renderMarkdown(analysis)} 
            />
        </div>
      </div>
    </div>
  );
};
