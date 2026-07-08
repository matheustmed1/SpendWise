  const handleAddEntry = async (e: FormEvent) => {
    e.preventDefault();
    console.log('handleAddEntry called', activeTab, amount);
    const cleanAmount = amount.replace(',', '.');
    if (!cleanAmount || isNaN(Number(cleanAmount))) {
      setAmountError(language === 'en' ? 'Amount is required' : language === 'pt' ? 'Valor é obrigatório' : 'El monto es requerido');
      return;
    }
    if (Number(cleanAmount) <= 0) {
      setAmountError(language === 'en' ? 'Amount must be positive' : language === 'pt' ? 'O valor deve ser positivo' : 'El monto debe ser positivo');
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
          console.error('Failed to save expense', res.status, await res.text());
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
  };

  const handleOpenAddModal = () => {
    resetForm();
    if (categories.length > 0) {
      setCategory(categories[0].name);
      const subs = subcategories.filter(s => s.categoryId === categories[0].id);
      if (subs.length > 0) setSubcategory(subs[0].name);
    }
    setAccount(accounts[0]?.name || 'Bank');
    setIsAdding(true);
  };

  const resetForm = () => {
    setIsAdding(false);
    setIsAddingSubcategory(false);
