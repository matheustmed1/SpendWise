import re
with open('src/App.tsx', 'r') as f:
    content = f.read()

def replacer(match):
    return """  const handleAddEntry = async (e: FormEvent) => {
    e.preventDefault();
    console.log('handleAddEntry called', activeTab, amount);
    const cleanAmount = amount.replace(',', '.');
    if (!cleanAmount || isNaN(Number(cleanAmount))) {
      setAmountError(language === 'en' ? 'Amount is required' : language === 'pt' ? 'Valor é obrigatório' : 'El monto es requerido');
      return;
    }
    if (Number(cleanAmount) <= 0) {
      setAmountError(language === 'en' ? 'Amount must be positive' : language === 'pt' ? 'O valor deve ser positive' : 'El monto debe ser positivo');
      return;
    }
    setAmountError('');

    if (activeTab === 'expenses' || activeTab === 'home') {
      const expenseData = {
        amount: Number(cleanAmount),
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
        } else {
          console.error('API Error:', res.status, await res.text());
        }
      } catch (err) {
        console.error('Failed to save expense', err);
      }
    } else if (activeTab === 'income') {
      const incomeData = {
        amount: Number(cleanAmount),
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
        } else {
          console.error('API Error:', res.status, await res.text());
        }
      } catch (err) {
        console.error('Failed to save income', err);
      }
    } else if (activeTab === 'investments') {
      const investmentData = {
        name: investmentName || 'New Investment',
        symbol: investmentSymbol || null,
        initialAmount: Number(cleanAmount),
        currentValue: Number(cleanAmount), // Default current value to initial amount
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
        } else {
          console.error('API Error:', res.status, await res.text());
        }
      } catch (err) {
        console.error('Failed to save investment', err);
      }
    } else if (activeTab === 'budget') {
      try {
        await handleUpdateBudget(category, subcategory, Number(cleanAmount));
        resetForm();
      } catch (err) {
        console.error('Failed to update budget', err);
      }
    }
  };"""

content = re.sub(r"  const handleAddEntry = async \(e: FormEvent\) => \{.*?\n  \};\n", replacer, content, flags=re.DOTALL)

with open('src/App.tsx', 'w') as f:
    f.write(content)
