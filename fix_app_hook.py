import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

# Add import
code = code.replace(
    "import React, { useState, useEffect, useMemo, FormEvent } from 'react';",
    "import React, { useState, useEffect, useMemo, FormEvent } from 'react';\nimport { useAddEntry } from './hooks/useAddEntry';"
)

# Use hook in App
code = code.replace(
    "const [amountError, setAmountError] = useState('');",
    "const { submitEntry, isSubmitting, error: submitError, amountError, setAmountError } = useAddEntry();"
)

# Refactor handleAddEntry
old_handle_add_entry = """  const handleAddEntry = async (e: FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) {
      setAmountError(language === 'en' ? 'Amount is required' : language === 'pt' ? 'Valor é obrigatório' : 'El monto es requerido');
      return;
    }
    if (Number(amount) <= 0) {
      setAmountError(language === 'en' ? 'Amount must be positive' : language === 'pt' ? 'O valor deve ser positivo' : 'El monto debe ser positivo');
      return;
    }
    setAmountError('');

    if (activeTab === 'expenses' || activeTab === 'home') {
      const expenseData = {
        amount: Number(amount),
        category,
        subcategory,
        account,
        date,
        description: description || subcategory || category,
        user,
        isRecurring,
        frequency: isRecurring ? frequency : undefined,
        nextOccurrence: isRecurring && nextOccurrence ? nextOccurrence : undefined,
        isInstallment,
        installmentsCount: (isInstallment || isRecurring) ? Number(installmentsCount) : 0,
        tags,
      };

      try {
        const url = editingEntryId ? `/api/expenses/${editingEntryId}` : '/api/expenses';
        const method = editingEntryId ? 'PUT' : 'POST';
        
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(expenseData),
        });
        if (res.ok) {
          await fetchAllData();
          resetForm();
        }
      } catch (err) {
        console.error('Failed to save expense', err);
      }
    } else if (activeTab === 'income') {
      const incomeData = {
        amount: Number(amount),
        source: source || 'General',
        account,
        date,
        user,
        isRecurring,
        frequency: isRecurring ? frequency : undefined,
        nextOccurrence: isRecurring && nextOccurrence ? nextOccurrence : undefined,
        installmentsCount: isRecurring ? Number(installmentsCount) : 0,
        notes: notes || undefined,
        paymentMethod: paymentMethod || undefined,
        tags,
      };

      try {
        const url = editingEntryId ? `/api/income/${editingEntryId}` : '/api/income';
        const method = editingEntryId ? 'PUT' : 'POST';

        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(incomeData),
        });
        if (res.ok) {
          await fetchAllData();
          resetForm();
        }
      } catch (err) {
        console.error('Failed to save income', err);
      }
    } else if (activeTab === 'investments') {
      const investmentData = {
        name: investmentName || 'New Investment',
        symbol: investmentSymbol || null,
        initialAmount: Number(amount),
        currentValue: Number(amount), // Default current value to initial amount
        targetAmount: investmentTargetAmount ? Number(investmentTargetAmount) : null,
        targetDate: investmentTargetDate || null,
        date,
        user,
        account,
      };

      try {
        const url = editingEntryId ? `/api/investments/${editingEntryId}` : '/api/investments';
        const method = editingEntryId ? 'PUT' : 'POST';

        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(investmentData),
        });
        if (res.ok) {
          await fetchAllData();
          resetForm();
        }
      } catch (err) {
        console.error('Failed to save investment', err);
      }
    }
  };"""

new_handle_add_entry = """  const handleAddEntry = async (e: FormEvent) => {
    e.preventDefault();
    await submitEntry({
      activeTab, editingEntryId, amount, category, subcategory, account, date, description, user,
      isRecurring, frequency, nextOccurrence, isInstallment, installmentsCount, tags,
      source, notes, paymentMethod,
      investmentName, investmentSymbol, investmentTargetAmount, investmentTargetDate,
      onSuccess: async () => {
        await fetchAllData();
        resetForm();
      },
      language
    });
  };"""

code = code.replace(old_handle_add_entry, new_handle_add_entry)

# Update submit button to be disabled and show error if any
code = code.replace(
    '''                <button
                  type="submit"
                  className="w-full py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl font-semibold shadow-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all active:scale-[0.98] mt-4"
                >''',
    '''                {submitError && (
                  <p className="mt-2 text-xs font-medium text-red-500">{submitError}</p>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl font-semibold shadow-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all active:scale-[0.98] mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >'''
)

code = code.replace(
    "{editingEntryId ? t.save : t.addEntry}",
    "{isSubmitting ? '...' : (editingEntryId ? t.save : t.addEntry)}"
)

with open('src/App.tsx', 'w') as f:
    f.write(code)
