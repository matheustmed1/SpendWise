import { useState } from 'react';

interface AddEntryOptions {
  activeTab: string;
  editingEntryId: string | null;
  amount: string;
  category: string;
  subcategory: string;
  account: string;
  date: string;
  description: string;
  user: string;
  isRecurring: boolean;
  frequency: string;
  nextOccurrence: string;
  isInstallment: boolean;
  installmentsCount: string;
  tags: string[];
  source: string;
  notes: string;
  paymentMethod: string;
  investmentName: string;
  investmentSymbol: string;
  investmentTargetAmount: string;
  investmentTargetDate: string;
  onSuccess: () => void;
  language: string;
}

export function useAddEntry() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [amountError, setAmountError] = useState('');

  const submitEntry = async (options: AddEntryOptions) => {
    const {
      activeTab, editingEntryId, amount, category, subcategory, account, date, description, user,
      isRecurring, frequency, nextOccurrence, isInstallment, installmentsCount, tags,
      source, notes, paymentMethod,
      investmentName, investmentSymbol, investmentTargetAmount, investmentTargetDate,
      onSuccess, language
    } = options;

    if (!amount || isNaN(Number(amount))) {
      setAmountError(language === 'en' ? 'Amount is required' : language === 'pt' ? 'Valor é obrigatório' : 'El monto es requerido');
      return false;
    }
    if (Number(amount) <= 0) {
      setAmountError(language === 'en' ? 'Amount must be positive' : language === 'pt' ? 'O valor deve ser positivo' : 'El monto debe ser positivo');
      return false;
    }
    setAmountError('');
    setIsSubmitting(true);
    setError(null);

    let url = '';
    let method = editingEntryId ? 'PUT' : 'POST';
    let data: any = {};

    if (activeTab === 'expenses' || activeTab === 'home') {
      url = editingEntryId ? `/api/expenses/${editingEntryId}` : '/api/expenses';
      data = {
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
    } else if (activeTab === 'income') {
      url = editingEntryId ? `/api/income/${editingEntryId}` : '/api/income';
      data = {
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
    } else if (activeTab === 'investments') {
      url = editingEntryId ? `/api/investments/${editingEntryId}` : '/api/investments';
      data = {
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
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to save entry');
      }

      onSuccess();
      return true;
    } catch (err: any) {
      console.error('Failed to save entry', err);
      setError(err.message || 'An error occurred while saving the entry');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitEntry, isSubmitting, error, amountError, setAmountError };
}
