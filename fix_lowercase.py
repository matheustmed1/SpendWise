import re
with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace("e.description.toLowerCase()", "(e.description || '').toLowerCase()")
content = content.replace("e.category.toLowerCase()", "(e.category || '').toLowerCase()")
content = content.replace("e.subcategory.toLowerCase()", "(e.subcategory || '').toLowerCase()")
content = content.replace("i.source.toLowerCase()", "(i.source || '').toLowerCase()")
content = content.replace("s.name.toLowerCase()", "(s.name || '').toLowerCase()")

with open('src/App.tsx', 'w') as f:
    f.write(content)
