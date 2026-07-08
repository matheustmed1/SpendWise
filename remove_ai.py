import re
with open('src/App.tsx', 'r') as f:
    content = f.read()

# Remove fetchLivePrice function
content = re.sub(
    r"  const fetchLivePrice = async \(id: string, symbol: string\) => \{.*?    \} finally \{\n      setUpdatingInvestments\(prev => \(\{ \.\.\.prev, \[id\]: false \}\)\);\n    \}\n  \};\n",
    "",
    content,
    flags=re.DOTALL
)

# Remove the refresh button for live price
content = re.sub(
    r"            <button\s+onClick=\{\(\) => fetchLivePrice\(inv\.id, inv\.symbol!\)\}\s+disabled=\{isUpdating\}\s+className=\"p-2\.5 text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors disabled:opacity-30\"\s+>\s+<RefreshCw className=\{`w-4 h-4 \$\{isUpdating \? 'animate-spin' : ''\}`\} />\s+</button>",
    "",
    content,
    flags=re.DOTALL
)

# Remove Sparkles Suggestion
content = re.sub(
    r"                        <AnimatePresence>\s+<motion\.button.*?<Sparkles.*?Suggestion:.*?</motion\.button>\s+</AnimatePresence>",
    "",
    content,
    flags=re.DOTALL
)

# Remove the suggestedCategory state
content = re.sub(
    r"  const \[suggestedCategory, setSuggestedCategory\] = useState<.*?null>\(null\);\n",
    "",
    content,
    flags=re.DOTALL
)

# Remove the useEffect that sets suggestedCategory
content = re.sub(
    r"  useEffect\(\(\) => \{\n    if \(description\.length >= 3\) \{.*?  \}, \[description, expenses\]\);\n",
    "",
    content,
    flags=re.DOTALL
)

with open('src/App.tsx', 'w') as f:
    f.write(content)

# server.ts remove /api/gemini/live-price
with open('server.ts', 'r') as f:
    server_content = f.read()

server_content = re.sub(
    r"  app\.post\(\"/api/gemini/live-price\", async \(req, res\) => \{.*?\n  \}\);\n",
    "",
    server_content,
    flags=re.DOTALL
)

with open('server.ts', 'w') as f:
    f.write(server_content)
