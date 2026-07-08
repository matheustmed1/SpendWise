import re
with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace("e.preventDefault();", "e.preventDefault();\n    console.log('handleAddEntry called', activeTab, amount);")

with open('src/App.tsx', 'w') as f:
    f.write(content)
