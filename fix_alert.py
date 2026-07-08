import re
with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace("alert('API Error: ' + errorText);", "")
content = content.replace("alert('Error: ' + err.message);", "")

with open('src/App.tsx', 'w') as f:
    f.write(content)
