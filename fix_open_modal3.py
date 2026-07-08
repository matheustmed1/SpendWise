import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

code = code.replace(
    '''                      <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-zinc-900/20 dark:shadow-zinc-100/10"
                      >''',
    '''                      <button
                        onClick={handleOpenAddModal}
                        className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-zinc-900/20 dark:shadow-zinc-100/10"
                      >'''
)

with open('src/App.tsx', 'w') as f:
    f.write(code)
