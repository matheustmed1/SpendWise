import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

code = code.replace(
    '''body: JSON.stringify(editingEntryId ? expenseData : { ...expenseData, id: crypto.randomUUID() }),''',
    '''body: JSON.stringify(expenseData),'''
)
code = code.replace(
    '''body: JSON.stringify(editingEntryId ? incomeData : { ...incomeData, id: crypto.randomUUID() }),''',
    '''body: JSON.stringify(incomeData),'''
)
code = code.replace(
    '''body: JSON.stringify(editingEntryId ? investmentData : { ...investmentData, id: crypto.randomUUID() }),''',
    '''body: JSON.stringify(investmentData),'''
)

with open('src/App.tsx', 'w') as f:
    f.write(code)
