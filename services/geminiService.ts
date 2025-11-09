
import { GoogleGenAI } from "@google/genai";
import type { FinancialData } from '../types';

const getGeminiApiKey = () => {
    // In a real-world scenario, the API key is expected to be in the environment variables.
    // For this context, we'll assume `process.env.API_KEY` is populated.
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API_KEY environment variable not set");
    }
    return apiKey;
};

const ai = new GoogleGenAI({ apiKey: getGeminiApiKey() });

const createPrompt = (data: FinancialData): string => {
  const { income, expenses } = data;
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const balance = income - totalExpenses;

  const expenseList = expenses.map(e => `- ${e.name}: R$ ${e.amount.toFixed(2)}`).join('\n');

  return `
    Aja como um consultor financeiro amigável, empático e extremamente prático, especializado em ajudar pessoas de baixa renda no Brasil. Você NUNCA deve sugerir investimentos complexos como ações, fundos imobiliários ou criptomoedas. O foco é em sobrevivência financeira, organização e pequenas melhorias realistas.

    O usuário forneceu os seguintes dados financeiros:
    - Renda Mensal: R$ ${income.toFixed(2)}
    - Despesas Mensais:
    ${expenseList}
    - Total de Despesas: R$ ${totalExpenses.toFixed(2)}
    - Saldo (Renda - Despesas): R$ ${balance.toFixed(2)}

    Com base nesses dados, forneça conselhos em etapas, usando uma linguagem muito simples e direta. Organize sua resposta da seguinte forma, usando markdown:

    1.  **Diagnóstico Rápido:** Comece com uma frase curta e encorajadora sobre a situação financeira atual (boa, apertada ou preocupante), baseada no saldo. Use um emoji que represente o sentimento (ex: ✅, ⚠️, 🚨).

    2.  **Pontos de Atenção:** Analise a lista de despesas. Se alguma despesa parecer desproporcionalmente alta em relação à renda (por exemplo, 'Lazer' ou 'Outros' com um saldo negativo), aponte isso de forma gentil, sem julgamento. Ex: "Percebi que seus gastos com Lazer estão um pouco altos para o seu orçamento atual. Que tal explorarmos algumas opções gratuitas na sua cidade?".

    3.  **Dicas Práticas para Melhorar:** Dê de 3 a 5 dicas ACIONÁVEIS e REALISTAS para a realidade de quem ganha pouco. As dicas devem ser focadas nas categorias de despesa informadas.
        *   Se houver gastos com 'Alimentação', sugira fazer compras com lista, pesquisar preços, aproveitar feiras livres no final do dia.
        *   Se houver 'Dívidas', sugira tentar renegociar com o credor ou focar em pagar a dívida com juros mais altos primeiro, se possível.
        *   Se houver gastos com 'Contas', dê dicas de como economizar energia elétrica ou água.
        *   Seja criativo e específico para o contexto brasileiro.

    4.  **Seu Próximo Passo:** Termine com UMA sugestão clara e pequena sobre o que a pessoa pode fazer HOJE ou esta semana. Algo como: "Seu próximo passo: anote TODOS os seus pequenos gastos por uma semana em um caderno. Isso vai te dar uma clareza incrível!".

    Use emojis para deixar o texto mais leve e amigável (💡, 💰, 🎯). Formate a resposta usando markdown para melhor legibilidade (títulos com **negrito**, listas com hífens). O tom deve ser de apoio, nunca de julgamento.
  `;
};

export const getFinancialAdvice = async (data: FinancialData): Promise<string> => {
  const prompt = createPrompt(data);
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get financial advice from the AI model.");
  }
};
