import re
with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace amount checking logic to handle commas
bad_logic = """    if (!amount || isNaN(Number(amount))) {
      setAmountError(language === 'en' ? 'Amount is required' : language === 'pt' ? 'Valor é obrigatório' : 'El monto es requerido');
      return;
    }
    if (Number(amount) <= 0) {"""

good_logic = """    const cleanAmount = amount.replace(',', '.');
    if (!cleanAmount || isNaN(Number(cleanAmount))) {
      setAmountError(language === 'en' ? 'Amount is required' : language === 'pt' ? 'Valor é obrigatório' : 'El monto es requerido');
      return;
    }
    if (Number(cleanAmount) <= 0) {"""

content = content.replace(bad_logic, good_logic)
content = content.replace("Number(amount)", "Number(cleanAmount)")

with open('src/App.tsx', 'w') as f:
    f.write(content)
