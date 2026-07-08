with open('src/App.tsx', 'r') as f:
    code = f.read()

code = code.replace(
    "import { useState, useEffect, useMemo, FormEvent, ReactNode, DragEvent } from 'react';",
    "import { useState, useEffect, useMemo, FormEvent, ReactNode, DragEvent } from 'react';\nimport { useAddEntry } from './hooks/useAddEntry';"
)

with open('src/App.tsx', 'w') as f:
    f.write(code)
