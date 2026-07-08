import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

code = code.replace(
    '''  const resetForm = () => {''',
    '''  const handleOpenAddModal = () => {
    resetForm();
    if (categories.length > 0) {
      setCategory(categories[0].name);
      const subs = subcategories.filter(s => s.categoryId === categories[0].id);
      if (subs.length > 0) setSubcategory(subs[0].name);
    }
    setAccount(accounts[0]?.name || 'Bank');
    setIsAdding(true);
  };

  const resetForm = () => {'''
)

code = code.replace(
    'setIsAdding(true);',
    'handleOpenAddModal();'
)

with open('src/App.tsx', 'w') as f:
    f.write(code)
