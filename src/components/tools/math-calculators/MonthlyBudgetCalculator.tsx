'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface BudgetItem {
  id: string;
  name: string;
  amount: string;
  category: string;
}

/**
 * MonthlyBudgetCalculator - Track income vs expenses with category breakdown.
 */
export default function MonthlyBudgetCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [incomes, setIncomes] = useState<BudgetItem[]>([{ id: '1', name: '', amount: '', category: 'salary' }]);
  const [expenses, setExpenses] = useState<BudgetItem[]>([{ id: '1', name: '', amount: '', category: 'housing' }]);

  const incomeCategories = ['salary', 'freelance', 'investments', 'other'];
  const expenseCategories = ['housing', 'food', 'transport', 'utilities', 'entertainment', 'healthcare', 'savings', 'other'];

  const addIncome = () => setIncomes([...incomes, { id: Date.now().toString(), name: '', amount: '', category: 'salary' }]);
  const addExpense = () => setExpenses([...expenses, { id: Date.now().toString(), name: '', amount: '', category: 'housing' }]);

  const updateIncome = (id: string, field: keyof BudgetItem, value: string) => {
    setIncomes(incomes.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const updateExpense = (id: string, field: keyof BudgetItem, value: string) => {
    setExpenses(expenses.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const removeIncome = (id: string) => setIncomes(incomes.filter(i => i.id !== id));
  const removeExpense = (id: string) => setExpenses(expenses.filter(e => e.id !== id));

  const totalIncome = incomes.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const balance = totalIncome - totalExpenses;

  const expenseByCategory = expenseCategories.map(cat => ({
    category: cat,
    total: expenses.filter(e => e.category === cat).reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0),
  })).filter(c => c.total > 0);

  const hasData = totalIncome > 0 || totalExpenses > 0;

  const copyText = hasData
    ? `Monthly Budget Summary\nTotal Income: $${totalIncome.toFixed(2)}\nTotal Expenses: $${totalExpenses.toFixed(2)}\nBalance: $${balance.toFixed(2)}\n\nExpense Breakdown:\n${expenseByCategory.map(c => `  ${c.category}: $${c.total.toFixed(2)} (${((c.total / totalExpenses) * 100).toFixed(1)}%)`).join('\n')}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Income Sources</label>
            <button onClick={addIncome} className="text-xs text-blue-600 hover:text-blue-800">+ Add Income</button>
          </div>
          {incomes.map((item) => (
            <div key={item.id} className="flex gap-2 mb-2">
              <input
                type="text"
                value={item.name}
                onChange={(e) => updateIncome(item.id, 'name', e.target.value)}
                placeholder="Source name"
                aria-label={`Income source name for ${toolName}`}
                className="input-field flex-1"
              />
              <input
                type="text"
                inputMode="decimal"
                value={item.amount}
                onChange={(e) => updateIncome(item.id, 'amount', e.target.value)}
                placeholder="Amount"
                aria-label={`Income amount for ${toolName}`}
                className="input-field w-28"
              />
              <select
                value={item.category}
                onChange={(e) => updateIncome(item.id, 'category', e.target.value)}
                aria-label={`Income category for ${toolName}`}
                className="input-field w-32"
              >
                {incomeCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {incomes.length > 1 && (
                <button onClick={() => removeIncome(item.id)} className="text-red-500 hover:text-red-700 px-2" aria-label="Remove income">×</button>
              )}
            </div>
          ))}
        </InputArea>

        <InputArea>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Expenses</label>
            <button onClick={addExpense} className="text-xs text-blue-600 hover:text-blue-800">+ Add Expense</button>
          </div>
          {expenses.map((item) => (
            <div key={item.id} className="flex gap-2 mb-2">
              <input
                type="text"
                value={item.name}
                onChange={(e) => updateExpense(item.id, 'name', e.target.value)}
                placeholder="Expense name"
                aria-label={`Expense name for ${toolName}`}
                className="input-field flex-1"
              />
              <input
                type="text"
                inputMode="decimal"
                value={item.amount}
                onChange={(e) => updateExpense(item.id, 'amount', e.target.value)}
                placeholder="Amount"
                aria-label={`Expense amount for ${toolName}`}
                className="input-field w-28"
              />
              <select
                value={item.category}
                onChange={(e) => updateExpense(item.id, 'category', e.target.value)}
                aria-label={`Expense category for ${toolName}`}
                className="input-field w-32"
              >
                {expenseCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {expenses.length > 1 && (
                <button onClick={() => removeExpense(item.id)} className="text-red-500 hover:text-red-700 px-2" aria-label="Remove expense">×</button>
              )}
            </div>
          ))}
        </InputArea>
      </div>

      <OutputArea hasContent={hasData}>
        {hasData && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
                <div className="text-xl font-bold text-green-600">${totalIncome.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">Total Income</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-center">
                <div className="text-xl font-bold text-red-600">${totalExpenses.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">Total Expenses</div>
              </div>
              <div className={`p-4 rounded-lg border text-center ${balance >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'}`}>
                <div className={`text-xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>${balance.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">Balance</div>
              </div>
            </div>
            {expenseByCategory.length > 0 && (
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="text-sm font-medium text-gray-700 mb-2">Expense Breakdown</div>
                {expenseByCategory.map(c => (
                  <div key={c.category} className="flex justify-between text-sm py-1">
                    <span className="capitalize text-gray-600">{c.category}</span>
                    <span className="font-mono">${c.total.toFixed(2)} ({((c.total / totalExpenses) * 100).toFixed(1)}%)</span>
                  </div>
                ))}
              </div>
            )}
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
