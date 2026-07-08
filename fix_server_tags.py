import re

with open('server.ts', 'r') as f:
    code = f.read()

# Fix POST /api/expenses
code = code.replace(
    '''      isInstallment ? 1 : 0,
      installmentsCount || 0
    );''',
    '''      isInstallment ? 1 : 0,
      installmentsCount || 0,
      tags ? JSON.stringify(tags) : '[]'
    );'''
)

# Fix PUT /api/expenses/:id
code = code.replace(
    '''      isInstallment ? 1 : 0,
      installmentsCount || 0,
      id
    );''',
    '''      isInstallment ? 1 : 0,
      installmentsCount || 0,
      tags ? JSON.stringify(tags) : '[]',
      id
    );'''
)

# Fix PUT /api/income/:id
code = code.replace(
    "const result = stmt.run(amount, source, account, date, user || 'Me', isRecurring ? 1 : 0, frequency || null, nextOccurrence, notes || null, paymentMethod || null, id);",
    "const result = stmt.run(amount, source, account, date, user || 'Me', isRecurring ? 1 : 0, frequency || null, nextOccurrence, notes || null, paymentMethod || null, tags ? JSON.stringify(tags) : '[]', id);"
)

with open('server.ts', 'w') as f:
    f.write(code)
