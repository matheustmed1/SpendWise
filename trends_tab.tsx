            {activeTab === 'trends' && (
              <div className="space-y-10 pb-20">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">{t.trends || 'Trends'}</h2>
                      <p className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-1">
                        {language === 'en' ? 'Budget vs Actual' : language === 'pt' ? 'Orçamento vs Real' : 'Presupuesto vs Real'}
                      </p>
                    </div>
                  </div>

                  <div className="glass-card p-6 rounded-[32px]">
                    <div className="h-[400px] w-full">
                      {(() => {
                        const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
                        const data = [];
                        const now = new Date();
                        for (let i = 5; i >= 0; i--) {
                          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                          const monthStr = d.toLocaleString(locale, { month: 'short', year: 'numeric' });
                          const yearMonth = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
                          const monthExpenses = expenses.filter(e => e.date.startsWith(yearMonth));
                          const totalSpent = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
                          data.push({
                            name: monthStr,
                            spent: useSecondaryCurrency ? totalSpent * exchangeRate : totalSpent,
                            budget: useSecondaryCurrency ? totalBudget * exchangeRate : totalBudget,
                            rawSpent: totalSpent
                          });
                        }
                        const currentCurrency = useSecondaryCurrency ? secondaryCurrency : currency;
                        return (
                          <ResponsiveContainer width="100%" height="100%">
                            <ReLineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-zinc-200 dark:text-zinc-800" />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'currentColor', fontSize: 12 }} className="text-zinc-500" dy={10} />
                              <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: 'currentColor', fontSize: 12 }} 
                                className="text-zinc-500"
                                tickFormatter={(val) => new Intl.NumberFormat(locale, { notation: 'compact', compactDisplay: 'short', currency: currentCurrency, style: 'currency' }).format(val)}
                              />
                              <Tooltip 
                                content={({ active, payload, label }) => {
                                  if (active && payload && payload.length) {
                                    return (
                                      <div className="bg-white dark:bg-zinc-800 p-4 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-700/50">
                                        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-2">{label}</p>
                                        <div className="space-y-1">
                                          {payload.map((entry: any, index: number) => {
                                            const isSpent = entry.name === (language === 'en' ? 'Spent' : language === 'pt' ? 'Gasto' : 'Gastado');
                                            return (
                                              <div key={index} className="flex items-center justify-between gap-4">
                                                <span className="text-xs text-zinc-500 dark:text-zinc-400 capitalize">{entry.name}:</span>
                                                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100" style={{ color: entry.color }}>
                                                  {formatCurrency(isSpent ? entry.payload.rawSpent : totalBudget)}
                                                </span>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    );
                                  }
                                  return null;
                                }}
                              />
                              <Legend wrapperStyle={{ paddingTop: '20px' }} />
                              <Line 
                                type="monotone" 
                                dataKey="spent" 
                                name={language === 'en' ? 'Spent' : language === 'pt' ? 'Gasto' : 'Gastado'}
                                stroke="#ff9f1c" 
                                strokeWidth={3} 
                                dot={{ fill: '#ff9f1c', strokeWidth: 2, r: 4 }} 
                                activeDot={{ r: 6, strokeWidth: 0 }}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="budget" 
                                name={language === 'en' ? 'Budget' : language === 'pt' ? 'Orçamento' : 'Presupuesto'}
                                stroke="#10b981" 
                                strokeWidth={3} 
                                strokeDasharray="5 5"
                                dot={false} 
                              />
                            </ReLineChart>
                          </ResponsiveContainer>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            )}
