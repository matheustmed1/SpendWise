import re
with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace("console.error('Failed to save expense', err);", "console.error('Failed to save expense', err); alert('Error: ' + err.message);")
content = content.replace("console.error('Failed to save income', err);", "console.error('Failed to save income', err); alert('Error: ' + err.message);")

with open('src/App.tsx', 'w') as f:
    f.write(content)
