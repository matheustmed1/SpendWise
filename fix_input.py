import re
with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace('type="number"\n                      step="0.01"', 'type="text"\n                      inputMode="decimal"')

with open('src/App.tsx', 'w') as f:
    f.write(content)
