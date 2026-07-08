import re
with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace("console.error('API Error:', res.status, await res.text());", "const errorText = await res.text(); console.error('API Error:', res.status, errorText); alert('API Error: ' + errorText);")

with open('src/App.tsx', 'w') as f:
    f.write(content)
