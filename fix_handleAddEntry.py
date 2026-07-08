import re
with open('src/App.tsx', 'r') as f:
    content = f.read()

bad = """        if (res.ok) {
          await fetchAllData();
          resetForm();
        }"""
good = """        if (res.ok) {
          await fetchAllData();
          resetForm();
        } else {
          console.error('Failed to save expense', res.status, await res.text());
        }"""
content = content.replace(bad, good)

with open('src/App.tsx', 'w') as f:
    f.write(content)
