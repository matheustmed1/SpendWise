import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

# Add amountError state
code = code.replace(
    "const [amount, setAmount] = useState('');",
    "const [amount, setAmount] = useState('');\n  const [amountError, setAmountError] = useState('');"
)

# Reset amountError
code = code.replace(
    "setAmount('');\n    setCategory('');",
    "setAmount('');\n    setAmountError('');\n    setCategory('');"
)

# Update handleAddEntry
code = code.replace(
    "if (!amount || isNaN(Number(amount))) return;",
    """if (!amount || isNaN(Number(amount))) {
      setAmountError(language === 'en' ? 'Amount is required' : language === 'pt' ? 'Valor é obrigatório' : 'El monto es requerido');
      return;
    }
    if (Number(amount) <= 0) {
      setAmountError(language === 'en' ? 'Amount must be positive' : language === 'pt' ? 'O valor deve ser positivo' : 'El monto debe ser positivo');
      return;
    }
    setAmountError('');"""
)

# Render error message
code = code.replace(
    """                      placeholder="0.00"
                      className="w-full pl-8 py-2 text-4xl font-light tracking-tight text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-100 outline-none transition-colors placeholder:text-zinc-100 dark:placeholder:text-zinc-800"
                      required
                    />
                  </div>
                </div>""",
    """                      placeholder="0.00"
                      className={`w-full pl-8 py-2 text-4xl font-light tracking-tight text-zinc-900 dark:text-zinc-100 border-b ${amountError ? 'border-red-500 focus:border-red-500' : 'border-zinc-100 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-100'} outline-none transition-colors placeholder:text-zinc-100 dark:placeholder:text-zinc-800`}
                      required
                    />
                  </div>
                  {amountError && (
                    <p className="mt-2 text-xs font-medium text-red-500">{amountError}</p>
                  )}
                </div>"""
)

with open('src/App.tsx', 'w') as f:
    f.write(code)
