import re
with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace('<div className="space-y-6">\n                <div>\n                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 block">\n                    {activeTab === \'investments\' ? t.initial : t.amount}', '<form onSubmit={handleAddEntry} className="space-y-6">\n                <div>\n                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 block">\n                    {activeTab === \'investments\' ? t.initial : t.amount}')
content = content.replace('                <button\n                  type="button" onClick={handleAddEntry}\n                  disabled={isSubmitting}', '                <button\n                  type="submit"\n                  disabled={isSubmitting}')
content = content.replace('                </button>\n              </div>\n            </motion.div>', '                </button>\n              </form>\n            </motion.div>')

with open('src/App.tsx', 'w') as f:
    f.write(content)
