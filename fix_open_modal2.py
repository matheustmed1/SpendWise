import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

# Fix handleOpenAddModal
code = code.replace(
    '''  const handleOpenAddModal = () => {
    resetForm();
    if (categories.length > 0) {
      setCategory(categories[0].name);
      const subs = subcategories.filter(s => s.categoryId === categories[0].id);
      if (subs.length > 0) setSubcategory(subs[0].name);
    }
    setAccount(accounts[0]?.name || 'Bank');
    handleOpenAddModal();
  };''',
    '''  const handleOpenAddModal = () => {
    resetForm();
    if (categories.length > 0) {
      setCategory(categories[0].name);
      const subs = subcategories.filter(s => s.categoryId === categories[0].id);
      if (subs.length > 0) setSubcategory(subs[0].name);
    }
    setAccount(accounts[0]?.name || 'Bank');
    setIsAdding(true);
  };'''
)

# Fix edits
code = code.replace(
    '''    setTags(expense.tags || []);
    handleOpenAddModal();
  };''',
    '''    setTags(expense.tags || []);
    setIsAdding(true);
  };'''
)

code = code.replace(
    '''    setTags(income.tags || []);
    handleOpenAddModal();
  };''',
    '''    setTags(income.tags || []);
    setIsAdding(true);
  };'''
)

code = code.replace(
    '''    setAccount(inv.account);
    handleOpenAddModal();
  };''',
    '''    setAccount(inv.account);
    setIsAdding(true);
  };'''
)

with open('src/App.tsx', 'w') as f:
    f.write(code)
