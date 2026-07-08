import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

bad_snippet = """                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                { (activeTab === 'expenses' || activeTab === 'home' || activeTab === 'income') && ("""

good_snippet = """                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                        </div>
                      </div>
                    </>
                  ) : activeTab === 'investments' ? (
                    <>
                      <div className="order-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 block">Investment Name</label>
                        <input type="text" value={investmentName} onChange={(e) => setInvestmentName(e.target.value)} placeholder="e.g. S&P 500" className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm font-medium text-zinc-900 dark:text-zinc-100 outline-none border border-transparent focus:border-zinc-200 dark:focus:border-zinc-700 transition-all" required />
                      </div>
                      <div className="order-2">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 block">Symbol</label>
                        <input type="text" value={investmentSymbol} onChange={(e) => setInvestmentSymbol(e.target.value)} placeholder="e.g. SPY" className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm font-medium text-zinc-900 dark:text-zinc-100 outline-none border border-transparent focus:border-zinc-200 dark:focus:border-zinc-700 transition-all" />
                      </div>
                      <div className="order-3">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 block">Target Amount</label>
                        <input type="number" step="0.01" value={investmentTargetAmount} onChange={(e) => setInvestmentTargetAmount(e.target.value)} placeholder="0.00" className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm font-medium text-zinc-900 dark:text-zinc-100 outline-none border border-transparent focus:border-zinc-200 dark:focus:border-zinc-700 transition-all" />
                      </div>
                      <div className="order-4">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 block">Target Date</label>
                        <input type="date" value={investmentTargetDate} onChange={(e) => setInvestmentTargetDate(e.target.value)} className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm font-medium text-zinc-900 dark:text-zinc-100 outline-none border border-transparent focus:border-zinc-200 dark:focus:border-zinc-700 transition-all" />
                      </div>
                    </>
                  ) : null}
                </div>
                { (activeTab === 'expenses' || activeTab === 'home' || activeTab === 'income') && ("""

content = content.replace(bad_snippet, good_snippet)

with open('src/App.tsx', 'w') as f:
    f.write(content)
