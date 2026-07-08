import re
with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace('<form onSubmit={handleAddEntry} className="space-y-6">', '<div className="space-y-6">')
content = content.replace('</form>', '</div>')
content = content.replace('type="submit"', 'type="button" onClick={handleAddEntry}')
# also we need to handle e.preventDefault() if e is not present
content = content.replace('const handleAddEntry = async (e: FormEvent) => {', 'const handleAddEntry = async (e?: any) => {')
content = content.replace('e.preventDefault();', 'if (e) e.preventDefault();')

with open('src/App.tsx', 'w') as f:
    f.write(content)
