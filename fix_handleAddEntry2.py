import re
with open('src/App.tsx', 'r') as f:
    content = f.read()

bad2 = """        if (res.ok) {
          await fetchAllData();
          resetForm();
        }"""
good2 = """        if (res.ok) {
          await fetchAllData();
          resetForm();
        } else {
          console.error('API Error:', res.status, await res.text());
        }"""
content = content.replace(bad2, good2)

with open('src/App.tsx', 'w') as f:
    f.write(content)
