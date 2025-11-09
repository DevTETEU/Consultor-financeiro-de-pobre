
import React, { useState } from 'react';
import { FinancialInputForm } from './components/FinancialInputForm';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { Header } from './components/Header';
import { getFinancialAdvice } from './services/geminiService';
import type { Expense, FinancialData } from './types';
import { RocketLaunchIcon } from './components/icons/RocketLaunchIcon';

type View = 'input' | 'analysis';

const App: React.FC = () => {
  const [view, setView] = useState<View>('input');
  const [income, setIncome] = useState<number>(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    setAnalysis('');

    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    if (income <= 0) {
      setError('Por favor, insira um valor de renda válido para continuar.');
      setIsLoading(false);
      return;
    }
     if (totalExpenses <= 0) {
      setError('Por favor, adicione pelo menos uma despesa para análise.');
      setIsLoading(false);
      return;
    }


    const financialData: FinancialData = {
      income,
      expenses,
    };

    try {
      const advice = await getFinancialAdvice(financialData);
      setAnalysis(advice);
      setView('analysis');
    } catch (err) {
      console.error('Error fetching financial advice:', err);
      setError('Desculpe, não consegui gerar sua análise. Verifique sua conexão ou tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setView('input');
    setError(null);
  };
  
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const balance = income - totalExpenses;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Header />
      <main className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
        {view === 'input' && (
          <>
            <FinancialInputForm
              income={income}
              setIncome={setIncome}
              expenses={expenses}
              setExpenses={setExpenses}
            />
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-transform transform hover:scale-105 disabled:bg-indigo-300 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analisando...
                  </>
                ) : (
                  <>
                    <RocketLaunchIcon className="w-6 h-6" />
                    Gerar Análise Financeira
                  </>
                )}
              </button>
            </div>
            {error && <p className="mt-4 text-center text-red-600 font-medium bg-red-100 p-3 rounded-md">{error}</p>}
          </>
        )}
        {view === 'analysis' && (
          <AnalysisDisplay
            financialData={{ income, expenses }}
            balance={balance}
            analysis={analysis}
            onBack={handleBack}
          />
        )}
      </main>
      <footer className="text-center p-4 text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Grana na Mão. Feito com ❤️ para ajudar você.</p>
      </footer>
    </div>
  );
};

export default App;
