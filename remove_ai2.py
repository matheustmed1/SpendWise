import re
with open('src/App.tsx', 'r') as f:
    content = f.read()

# Remove Sparkles Suggestion
content = re.sub(
    r"                        <AnimatePresence>.*?Suggestion: .*?</motion\.button>\n                          \)}\n                        </AnimatePresence>",
    "",
    content,
    flags=re.DOTALL
)

# Remove fetchLivePrice
content = re.sub(
    r"\s+fetchLivePrice\(inv\.id, inv\.symbol\);\n",
    "\n",
    content,
    flags=re.DOTALL
)

content = re.sub(
    r"\s+fetchLivePrice: \(id: string, symbol: string\) => void;\n",
    "\n",
    content,
    flags=re.DOTALL
)

content = re.sub(
    r"\s+fetchLivePrice,\n",
    "\n",
    content,
    flags=re.DOTALL
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
