/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, FormEvent, ReactNode, DragEvent } from 'react';
import { useAddEntry } from './hooks/useAddEntry';
import { Plus, Trash2, Edit2, Wallet, CreditCard, Banknote, Calendar, Tag, ChevronRight, ChevronLeft, PieChart, ArrowUpRight, ArrowDownLeft, TrendingUp, Target, List, LineChart, Settings, PlusCircle, Activity, Bell, AlertTriangle, X, Search, Filter, Home, Sun, Moon, ChevronDown, Check, RefreshCw, Palette, LayoutDashboard, User, Sparkles, Lightbulb, Pin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart as ReBarChart,
  Bar,
  ComposedChart,
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend,
  Area,
  LabelList,
  ReferenceLine,
  Brush
} from 'recharts';
import { Expense, Account, Income, Budget, Investment, InvestmentHistory, CategoryInfo, SubcategoryInfo, Frequency, Notification, AccountInfo } from './types';

const USERS = ['Matheus', 'Mariana', 'Nenem', 'Tchuca', 'Casa'];
const CHART_COLORS = ['#18181b', '#3f3f46', '#71717a', '#a1a1aa', '#d4d4d8', '#e4e4e7', '#f4f4f5', '#fafafa'];
const CHART_COLORS_DARK = ['#f4f4f5', '#e4e4e7', '#d4d4d8', '#a1a1aa', '#71717a', '#3f3f46', '#27272a', '#18181b'];

const CURRENCIES = ['USD', 'EUR', 'GBP', 'BRL', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR'];
const COMMON_SYMBOLS = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corp.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'META', name: 'Meta Platforms Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.' },
  { symbol: 'NFLX', name: 'Netflix Inc.' },
  { symbol: 'DIS', name: 'Walt Disney Co.' },
  { symbol: 'PYPL', name: 'PayPal Holdings Inc.' },
  { symbol: 'V', name: 'Visa Inc.' },
  { symbol: 'MA', name: 'Mastercard Inc.' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.' },
  { symbol: 'BAC', name: 'Bank of America Corp.' },
  { symbol: 'KO', name: 'Coca-Cola Co.' },
  { symbol: 'PEP', name: 'PepsiCo Inc.' },
  { symbol: 'WMT', name: 'Walmart Inc.' },
  { symbol: 'COST', name: 'Costco Wholesale Corp.' },
  { symbol: 'SBUX', name: 'Starbucks Corp.' },
  { symbol: 'MCD', name: 'McDonald\'s Corp.' },
  { symbol: 'NKE', name: 'NIKE Inc.' },
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'ETH', name: 'Ethereum' },
  { symbol: 'SOL', name: 'Solana' },
  { symbol: 'ADA', name: 'Cardano' },
  { symbol: 'DOT', name: 'Polkadot' },
  { symbol: 'DOGE', name: 'Dogecoin' },
  { symbol: 'XRP', name: 'XRP' },
  { symbol: 'BNB', name: 'Binance Coin' },
  { symbol: 'USDC', name: 'USD Coin' },
  { symbol: 'USDT', name: 'Tether' },
  { symbol: 'AVAX', name: 'Avalanche' },
  { symbol: 'LINK', name: 'Chainlink' },
  { symbol: 'UNI', name: 'Uniswap' },
  { symbol: 'MATIC', name: 'Polygon' },
  { symbol: 'LTC', name: 'Litecoin' },
  { symbol: 'BCH', name: 'Bitcoin Cash' },
  { symbol: 'ALGO', name: 'Algorand' },
  { symbol: 'ATOM', name: 'Cosmos' },
  { symbol: 'NEAR', name: 'NEAR Protocol' },
  { symbol: 'FTM', name: 'Fantom' },
];
const LOCALES = [
  { code: 'en-US', name: 'English (US)' },
  { code: 'en-GB', name: 'English (UK)' },
  { code: 'pt-BR', name: 'Português (Brasil)' },
  { code: 'es-ES', name: 'Español (España)' },
  { code: 'es-MX', name: 'Español (México)' },
  { code: 'fr-FR', name: 'Français (France)' },
  { code: 'de-DE', name: 'Deutsch (Deutschland)' },
  { code: 'it-IT', name: 'Italiano (Italia)' },
  { code: 'ja-JP', name: '日本語 (日本)' },
];

type Tab = 'home' | 'expenses' | 'income' | 'budget' | 'investments' | 'trends' | 'settings';
type Language = 'en' | 'pt' | 'es';

interface PinnedMetric {
  id: string;
  type: 'netWorth' | 'monthlyIncome' | 'monthlyExpenses' | 'savingsRate' | 'category' | 'totalInvestments';
  categoryId?: string;
}

const TRANSLATIONS = {
  en: {
    home: 'Home',
    expenses: 'Expenses',
    income: 'Income',
    investments: 'Investments',
    budget: 'Budget',
    trends: 'Trends',
    insights: 'Insights',
    settings: 'Settings',
    appearance: 'Appearance',
    darkMode: 'Dark Mode',
    language: 'Language',
    accounts: 'Accounts',
    categories: 'Categories & Subcategories',
    manageCategories: 'Manage Categories',
    totalBalance: 'Net Worth',
    savingsRate: 'Savings Rate',
    activeAssets: 'active assets',
    sourcesThisMonth: 'sources this month',
    transactionsThisMonth: 'transactions this month',
    spendingByCategory: 'Spending by Category',
    budgetAlerts: 'Budget Alerts',
    monthlyTrend: 'Monthly Trend',
    topExpenses: 'Top Expenses',
    recentTransactions: 'Recent Transactions',
    viewAll: 'View All',
    manage: 'Manage',
    addAcc: 'Add Acc',
    currency: 'Currency',
    locale: 'Locale',
    exp: 'Exp',
    inc: 'Inc',
    inv: 'Inv',
    bud: 'Bud',
    tre: 'Tre',
    ins: 'Ins',
    set: 'Set',
    recurringExpenses: 'Recurring Expenses',
    thisMonth: 'This Month',
    last3Months: 'Last 3 Months',
    last6Months: 'Last 6 Months',
    last12Months: 'Last 12 Months',
    custom: 'Custom Range',
    startDate: 'Start Date',
    endDate: 'End Date',
    editBudget: 'Edit Budget',
    totalBudget: 'Total Budget',
    subcategoryBudgets: 'Subcategory Budgets',
    remaining: 'Remaining',
    goalProgress: 'Goal Progress',
    targetDate: 'Target Date',
    daysLeft: 'days left',
    homeSummary: 'Overview of your financial health and quick actions.',
    expensesSummary: 'Track and manage your daily spending.',
    incomeSummary: 'Monitor your earnings and revenue streams.',
    investmentsSummary: 'Manage your portfolio and track growth goals.',
    budgetSummary: 'Plan your spending and stay within limits.',
    settingsSummary: 'Customize your app experience and manage data.',
    summaryCenter: 'Summary Center',
    confirmDeleteTitle: 'Confirm Delete',
    confirmDeleteMessage: 'Are you sure you want to delete this item? This action cannot be undone.',
    spent: 'Spent',
    overBudget: 'Over Budget',
    expensesThisMonth: 'Expenses This Month',
    incomeThisMonth: 'Income This Month',
    totalInvested: 'Total Invested',
    totalBudgeted: 'Total Budgeted',
    netWorth: 'Net Worth',
    cashFlow: 'Cash Flow',
    activeTheme: 'Active Theme',
    accentColor: 'Accent Color',
    onTrack: 'On Track',
    behind: 'Behind',
    goalReached: 'Goal Reached',
    timeProgress: 'Time Progress',
    expired: 'Expired',
    add_subcategory: "Add Subcategory",
    new_subcategory_name: "New Subcategory Name",
    quick_add: "Quick Add",
    next: "Next",
    back: "Back",
    performance: 'Performance',
    category: 'Category',
    subcategory: 'Subcategory',
    account: 'Account',
    date: 'Date',
    recurring: 'Recurring',
    description: 'Description',
    addEntry: 'Add Entry',
    save: 'Save',
    addNew: 'Add New',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    noData: 'No Data',
    installmentsCount: 'Installments Count',
    amount: 'Amount',
    initial: 'Initial Amount',
  },
  pt: {
    home: 'Início',
    expenses: 'Despesas',
    income: 'Receitas',
    investments: 'Investimentos',
    budget: 'Orçamento',
    trends: 'Tendências',
    insights: 'Análises',
    settings: 'Configurações',
    appearance: 'Aparência',
    darkMode: 'Modo Escuro',
    language: 'Idioma',
    accounts: 'Contas',
    categories: 'Categorias e Subcategorias',
    manageCategories: 'Gerenciar Categorias',
    totalBalance: 'Patrimônio Líquido',
    savingsRate: 'Taxa de Poupança',
    activeAssets: 'ativos ativos',
    sourcesThisMonth: 'fontes este mês',
    transactionsThisMonth: 'transações este mês',
    spendingByCategory: 'Gastos por Categoria',
    budgetAlerts: 'Alertas de Orçamento',
    monthlyTrend: 'Tendência Mensal',
    topExpenses: 'Principais Despesas',
    recentTransactions: 'Transações Recentes',
    viewAll: 'Ver Tudo',
    manage: 'Gerenciar',
    addAcc: 'Add Conta',
    currency: 'Moeda',
    locale: 'Localidade',
    exp: 'Desp',
    inc: 'Rec',
    inv: 'Inv',
    bud: 'Orç',
    tre: 'Ten',
    ins: 'Anál',
    set: 'Conf',
    recurringExpenses: 'Despesas Recorrentes',
    thisMonth: 'Este Mês',
    last3Months: 'Últimos 3 Meses',
    last6Months: 'Últimos 6 Meses',
    last12Months: 'Último Ano',
    custom: 'Intervalo Personalizado',
    startDate: 'Data Inicial',
    endDate: 'Data Final',
    editBudget: 'Editar Orçamento',
    totalBudget: 'Orçamento Total',
    subcategoryBudgets: 'Orçamentos de Subcategorias',
    remaining: 'Restante',
    goalProgress: 'Progresso da Meta',
    targetDate: 'Data Alvo',
    daysLeft: 'dias restantes',
    homeSummary: 'Visão geral da sua saúde financeira e ações rápidas.',
    expensesSummary: 'Acompanhe e gerencie seus gastos diários.',
    incomeSummary: 'Monitore seus ganhos e fluxos de receita.',
    investmentsSummary: 'Gerencie seu portfólio e acompanhe metas de crescimento.',
    budgetSummary: 'Planeje seus gastos e mantenha-se dentro dos limites.',
    settingsSummary: 'Personalize sua experiência no app e gerencie dados.',
    summaryCenter: 'Central de Resumo',
    confirmDeleteTitle: 'Confirmar Exclusão',
    confirmDeleteMessage: 'Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.',
    spent: 'Gasto',
    overBudget: 'Acima do Orçamento',
    expensesThisMonth: 'Despesas Este Mês',
    incomeThisMonth: 'Receita Este Mês',
    totalInvested: 'Total Investido',
    totalBudgeted: 'Total Orçado',
    netWorth: 'Patrimônio Líquido',
    cashFlow: 'Fluxo de Caixa',
    activeTheme: 'Tema Ativo',
    accentColor: 'Cor de Destaque',
    onTrack: 'No Caminho',
    behind: 'Atrasado',
    goalReached: 'Meta Atingida',
    timeProgress: 'Progresso do Tempo',
    expired: 'Expirado',
    add_subcategory: "Adicionar Subcategoria",
    new_subcategory_name: "Nome da Nova Subcategoria",
    quick_add: "Adição Rápida",
    next: "Próximo",
    back: "Voltar",
    performance: 'Desempenho',
    category: 'Categoria',
    subcategory: 'Subcategoria',
    account: 'Conta',
    date: 'Data',
    recurring: 'Recorrente',
    description: 'Descrição',
    addEntry: 'Adicionar',
    save: 'Salvar',
    addNew: 'Adicionar Novo',
    cancel: 'Cancelar',
    delete: 'Excluir',
    edit: 'Editar',
    noData: 'Sem Dados',
    installmentsCount: 'Número de Parcelas',
    amount: 'Valor',
    initial: 'Valor Inicial',
  },
  es: {
    home: 'Inicio',
    expenses: 'Gastos',
    income: 'Ingresos',
    investments: 'Inversiones',
    budget: 'Presupuesto',
    trends: 'Tendencias',
    insights: 'Análisis',
    settings: 'Ajustes',
    appearance: 'Apariencia',
    darkMode: 'Modo Oscuro',
    language: 'Idioma',
    accounts: 'Cuentas',
    categories: 'Categorías y Subcategorías',
    manageCategories: 'Gestionar Categorías',
    totalBalance: 'Patrimonio Neto',
    savingsRate: 'Tasa de Ahorro',
    activeAssets: 'activos activos',
    sourcesThisMonth: 'fuentes este mes',
    transactionsThisMonth: 'transacciones este mes',
    spendingByCategory: 'Gastos por Categoría',
    budgetAlerts: 'Alertas de Presupuesto',
    monthlyTrend: 'Tendencia Mensual',
    topExpenses: 'Gastos Principales',
    recentTransactions: 'Transacciones Recientes',
    viewAll: 'Ver Todo',
    manage: 'Gestionar',
    addAcc: 'Añadir Cta',
    currency: 'Moneda',
    locale: 'Localidad',
    exp: 'Gas',
    inc: 'Ing',
    inv: 'Inv',
    bud: 'Pre',
    tre: 'Ten',
    ins: 'Aná',
    set: 'Aju',
    recurringExpenses: 'Gastos Recurrentes',
    thisMonth: 'Este Mes',
    last3Months: 'Últimos 3 Meses',
    last6Months: 'Últimos 6 Meses',
    last12Months: 'Último Año',
    custom: 'Rango Personalizado',
    startDate: 'Fecha Inicial',
    endDate: 'Fecha Final',
    editBudget: 'Editar Presupuesto',
    totalBudget: 'Presupuesto Total',
    subcategoryBudgets: 'Presupuestos de Subcategorías',
    remaining: 'Restante',
    goalProgress: 'Progreso de la Meta',
    targetDate: 'Fecha Objetivo',
    daysLeft: 'días restantes',
    homeSummary: 'Visión general de su salud financiera y acciones rápidas.',
    expensesSummary: 'Rastree y gestione sus gastos diarios.',
    incomeSummary: 'Monitoree sus ganancias y flujos de ingresos.',
    investmentsSummary: 'Gestione su cartera y rastree metas de crecimiento.',
    budgetSummary: 'Planifique sus gastos y manténgase dentro de los límites.',
    settingsSummary: 'Personalice su experiencia en la aplicación y gestione datos.',
    summaryCenter: 'Centro de Resumen',
    confirmDeleteTitle: 'Confirmar Eliminación',
    confirmDeleteMessage: '¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.',
    spent: 'Gastado',
    overBudget: 'Excedido',
    expensesThisMonth: 'Gastos Este Mes',
    incomeThisMonth: 'Ingresos Este Mes',
    totalInvested: 'Total Invertido',
    totalBudgeted: 'Total Presupuestado',
    netWorth: 'Patrimonio Neto',
    cashFlow: 'Flujo de Caja',
    activeTheme: 'Tema Activo',
    accentColor: 'Color de Acento',
    onTrack: 'En Camino',
    behind: 'Atrasado',
    goalReached: 'Meta Alcanzada',
    timeProgress: 'Progreso del Tiempo',
    expired: 'Expirado',
    add_subcategory: "Añadir Subcategoría",
    new_subcategory_name: "Nombre de la Nueva Subcategoría",
    quick_add: "Adición Rápida",
    next: "Siguiente",
    back: "Atrás",
    performance: 'Rendimiento',
    category: 'Categoría',
    subcategory: 'Subcategoría',
    account: 'Cuenta',
    date: 'Fecha',
    recurring: 'Recurrente',
    description: 'Descripción',
    addEntry: 'Añadir',
    save: 'Guardar',
    addNew: 'Añadir Nuevo',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    noData: 'Sin Datos',
    installmentsCount: 'Número de Cuotas',
    amount: 'Monto',
    initial: 'Monto Inicial',
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [insightsRange, setInsightsRange] = useState<'thisMonth' | 'last3Months' | 'last6Months' | 'last12Months' | 'custom'>('thisMonth');
  const [showMoMComparison, setShowMoMComparison] = useState(false);
  const [insightsStartDate, setInsightsStartDate] = useState<string>(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10));
  const [insightsEndDate, setInsightsEndDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [heroMonthOffset, setHeroMonthOffset] = useState<number>(0);
  const [editingBudgetCategory, setEditingBudgetCategory] = useState<CategoryInfo | null>(null);
  const [tempBudgets, setTempBudgets] = useState<Record<string, number>>({});
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [income, setIncome] = useState<Income[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoryInfo[]>([]);
  const [accounts, setAccounts] = useState<AccountInfo[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isManagingCategories, setIsManagingCategories] = useState(false);
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);
  const [quickSubcategoryName, setQuickSubcategoryName] = useState('');
  const [updatingInvestments, setUpdatingInvestments] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  // Pinned Metrics Dashboard State
  const [pinnedMetrics, setPinnedMetrics] = useState<PinnedMetric[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pinnedMetrics');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
      return [
        { id: '1', type: 'netWorth' },
        { id: '2', type: 'monthlyIncome' },
        { id: '3', type: 'monthlyExpenses' }
      ];
    }
    return [];
  });
  const [isAddMetricModalOpen, setIsAddMetricModalOpen] = useState(false);
  const [metricTypeToAdd, setMetricTypeToAdd] = useState<PinnedMetric['type']>('netWorth');
  const [metricCategoryToAdd, setMetricCategoryToAdd] = useState('');
  const [draggedMetricIndex, setDraggedMetricIndex] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem('pinnedMetrics', JSON.stringify(pinnedMetrics));
  }, [pinnedMetrics]);

  // Form state
  const [amount, setAmount] = useState('');
  const { submitEntry, isSubmitting, error: submitError, amountError, setAmountError } = useAddEntry();
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [account, setAccount] = useState<Account>('Bank');
  const [user, setUser] = useState(USERS[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [source, setSource] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [investmentName, setInvestmentName] = useState('');
  const [investmentSymbol, setInvestmentSymbol] = useState('');
  const [investmentTargetAmount, setInvestmentTargetAmount] = useState('');
  const [investmentTargetDate, setInvestmentTargetDate] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<Frequency>('Monthly');
  const [isInstallment, setIsInstallment] = useState(false);
  const [installmentsCount, setInstallmentsCount] = useState('1');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [nextOccurrence, setNextOccurrence] = useState('');
  const [isUpdatingValueModalOpen, setIsUpdatingValueModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedInvestmentHistory, setSelectedInvestmentHistory] = useState<InvestmentHistory[]>([]);
  const [investmentHistories, setInvestmentHistories] = useState<Record<string, InvestmentHistory[]>>({});
  const [investmentTimeRanges, setInvestmentTimeRanges] = useState<Record<string, string>>({});
  const [historyLoading, setHistoryLoading] = useState(false);
  const [updatingInvestmentId, setUpdatingInvestmentId] = useState<string | null>(null);
  const [newValue, setNewValue] = useState('');
  const [updateDate, setUpdateDate] = useState(new Date().toISOString().split('T')[0]);
  const [symbolSuggestions, setSymbolSuggestions] = useState<{symbol: string, name: string}[]>([]);
  const [showSymbolSuggestions, setShowSymbolSuggestions] = useState(false);
  const [showPaymentMethodDropdown, setShowPaymentMethodDropdown] = useState(false);
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Category Management State
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [selectedCategoryIdForSub, setSelectedCategoryIdForSub] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [editingSubcategoryId, setEditingSubcategoryId] = useState<string | null>(null);
  const [editingSubcategoryName, setEditingSubcategoryName] = useState('');
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  const [editingAccountName, setEditingAccountName] = useState('');
  const [editingAccountColor, setEditingAccountColor] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState("All");
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterSubcategory, setFilterSubcategory] = useState('All');
  const [filterAccount, setFilterAccount] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showRecurringOnly, setShowRecurringOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [selectedPattern, setSelectedPattern] = useState<{name: string, desc: string, p: number[], buckets: string[]} | null>(null);
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language');
      return (saved as Language) || 'en';
    }
    return 'en';
  });
  const [currency, setCurrency] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('currency');
      return saved || 'USD';
    }
    return 'USD';
  });
  
  const [secondaryCurrency, setSecondaryCurrency] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('secondaryCurrency') || (currency === 'USD' ? 'EUR' : 'USD');
    }
    return 'EUR';
  });
  
  const [useSecondaryCurrency, setUseSecondaryCurrency] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [isFetchingRate, setIsFetchingRate] = useState(false);

  useEffect(() => {
    if (currency === secondaryCurrency) {
      setExchangeRate(1);
      return;
    }
    setIsFetchingRate(true);
    fetch(`https://api.exchangerate-api.com/v4/latest/${currency}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.rates && data.rates[secondaryCurrency]) {
          setExchangeRate(data.rates[secondaryCurrency]);
        }
      })
      .catch(err => console.error('Failed to fetch exchange rates', err))
      .finally(() => setIsFetchingRate(false));
  }, [currency, secondaryCurrency]);

  const [locale, setLocale] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('locale');
      if (saved) return saved;
      // Default based on language if no saved locale
      const lang = localStorage.getItem('language') || 'en';
      return lang === 'en' ? 'en-US' : lang === 'pt' ? 'pt-BR' : 'es-ES';
    }
    return 'en-US';
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [accentColor, setAccentColor] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('accentColor');
      if (saved === '#6366f1') return '#ff9f1c';
      return saved || '#ff9f1c';
    }
    return '#ff9f1c';
  });

  // Confirmation Modal State
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetType, setDeleteTargetType] = useState<'expense' | 'income' | 'account' | 'category' | 'subcategory' | 'investment' | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState('');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('language', language);
    // Update locale if it hasn't been manually set or if we want it to follow language
    // For now let's just keep it separate but maybe suggest a default
  }, [language]);

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('locale', locale);
  }, [locale]);

  useEffect(() => {
    localStorage.setItem('accentColor', accentColor);
    document.documentElement.style.setProperty('--accent-color', accentColor);
  }, [accentColor]);

  useEffect(() => {
    if (isAdding && !editingEntryId) {
      if (categories.length > 0) {
        const firstCat = categories[0];
        setCategory(firstCat.name);
        const firstSub = subcategories.find(s => s.categoryId === firstCat.id);
        if (firstSub) {
          setSubcategory(firstSub.name);
        } else {
          setSubcategory('');
        }
      }
    }
  }, [isAdding, editingEntryId, categories, subcategories]);

  useEffect(() => {
    setSelectedMonth(null);
  }, [insightsRange, insightsStartDate, insightsEndDate]);

  const t = TRANSLATIONS[language];

  const formatCurrency = (amount: number, forcePrimary = false) => {
    const displayAmount = (!forcePrimary && useSecondaryCurrency) ? amount * exchangeRate : amount;
    const displayCurrency = (!forcePrimary && useSecondaryCurrency) ? secondaryCurrency : currency;
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: displayCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(displayAmount);
  };

  const filterHistoryByRange = (history: InvestmentHistory[], range: string) => {
    if (!history || history.length === 0) return [];
    const now = new Date();
    let cutoff = new Date(now);
    if (range === '1M') cutoff.setMonth(now.getMonth() - 1);
    else if (range === '3M') cutoff.setMonth(now.getMonth() - 3);
    else if (range === '1Y') cutoff.setFullYear(now.getFullYear() - 1);
    else return history;

    return history.filter(h => new Date(h.date) >= cutoff);
  };

  const currencySymbol = useMemo(() => {
    const displayCurrency = useSecondaryCurrency ? secondaryCurrency : currency;
    try {
      const parts = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: displayCurrency,
      }).formatToParts(0);
      return parts.find(p => p.type === 'currency')?.value || '$';
    } catch (e) {
      return '$';
    }
  }, [locale, currency, useSecondaryCurrency, secondaryCurrency]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const endpoints = [
        '/api/expenses',
        '/api/income',
        '/api/budgets',
        '/api/investments',
        '/api/categories',
        '/api/subcategories',
        '/api/accounts'
      ];
      
      const responses = await Promise.all(endpoints.map(url => fetch(url)));
      
      // Check for non-ok responses
      for (const res of responses) {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to fetch ${res.url}: ${res.status} ${errorText}`);
        }
      }

      const [expData, incData, budData, invData, catData, subData, accData] = await Promise.all(
        responses.map(res => res.json())
      );

      setExpenses(expData);
      setIncome(incData);
      setBudgets(budData);
      setInvestments(invData);
      setCategories(catData);
      setSubcategories(subData);
      setAccounts(accData);

      // Fetch history for each investment
      if (invData.length > 0) {
        const historyPromises = invData.map((inv: Investment) => 
          fetch(`/api/investments/${inv.id}/history`).then(res => res.json())
        );
        const histories = await Promise.all(historyPromises);
        const historiesMap: Record<string, InvestmentHistory[]> = {};
        const rangesMap: Record<string, string> = {};
        invData.forEach((inv: Investment, idx: number) => {
          historiesMap[inv.id] = histories[idx];
          rangesMap[inv.id] = '1Y'; // Default to 1 Year
        });
        setInvestmentHistories(historiesMap);
        setInvestmentTimeRanges(rangesMap);
      }
      
      if (catData.length > 0) {
        setCategory(catData[0].name);
        setSelectedCategoryIdForSub(catData[0].id);
        const firstSubs = subData.filter((s: SubcategoryInfo) => s.categoryId === catData[0].id);
        if (firstSubs.length > 0) setSubcategory(firstSubs[0].name);
      }

      if (accData.length > 0) {
        setAccount(accData[0].name);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
      // Optionally show a toast or alert to the user
    } finally {
      setLoading(false);
    }
  };


  const handleSymbolChange = (value: string) => {
    const upperValue = value.toUpperCase();
    setInvestmentSymbol(upperValue);
    
    if (upperValue.length > 0) {
      const filtered = COMMON_SYMBOLS.filter(s => 
        s.symbol.startsWith(upperValue) || 
        (s.name || '').toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setSymbolSuggestions(filtered);
      setShowSymbolSuggestions(filtered.length > 0);
    } else {
      setSymbolSuggestions([]);
      setShowSymbolSuggestions(false);
    }
  };

  const handleSelectSymbol = (suggestion: {symbol: string, name: string}) => {
    setInvestmentSymbol(suggestion.symbol);
    if (!investmentName) {
      setInvestmentName(suggestion.name);
    }
    setShowSymbolSuggestions(false);
  };

  const handleAddCategory = async () => {
    if (!newCategoryName) return;
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName }),
      });
      if (res.ok) {
        const newCat = await res.json();
        setCategories([...categories, newCat]);
        setNewCategoryName('');
      }
    } catch (err) {
      console.error('Failed to add category', err);
    }
  };

  const handleAddSubcategory = async () => {
    if (!newSubcategoryName || !selectedCategoryIdForSub) return;
    await handleAddSubcategoryWithArgs(selectedCategoryIdForSub, newSubcategoryName);
    setNewSubcategoryName('');
  };

  const handleAddSubcategoryWithArgs = async (catId: string, name: string) => {
    try {
      const res = await fetch('/api/subcategories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId: catId, name }),
      });
      if (res.ok) {
        const newSub = await res.json();
        setSubcategories([...subcategories, newSub]);
      }
    } catch (err) {
      console.error('Failed to add subcategory', err);
    }
  };

  const handleEditCategory = async (id: string, newName: string) => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });
      if (res.ok) {
        const updatedCat = await res.json();
        setCategories(categories.map(c => c.id === id ? updatedCat : c));
        setEditingCategoryId(null);
        // Refresh all data to update expenses and budgets with new category name
        fetchAllData();
      }
    } catch (err) {
      console.error('Failed to edit category', err);
    }
  };

  const handleDeleteCategory = (id: string) => {
    const cat = categories.find(c => c.id === id);
    setDeleteTargetId(id);
    setDeleteTargetType('category');
    setDeleteTargetName(cat?.name || '');
    setIsConfirmingDelete(true);
  };

  const handleEditSubcategory = async (id: string, newName: string) => {
    try {
      const res = await fetch(`/api/subcategories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });
      if (res.ok) {
        const updatedSub = await res.json();
        setSubcategories(subcategories.map(s => s.id === id ? updatedSub : s));
        setEditingSubcategoryId(null);
        fetchAllData();
      }
    } catch (err) {
      console.error('Failed to edit subcategory', err);
    }
  };

  const handleDeleteSubcategory = (id: string) => {
    const sub = subcategories.find(s => s.id === id);
    setDeleteTargetId(id);
    setDeleteTargetType('subcategory');
    setDeleteTargetName(sub?.name || '');
    setIsConfirmingDelete(true);
  };

  const handleAddAccount = async (name: string, color: string) => {
    try {
      const res = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, color }),
      });
      if (res.ok) {
        const newAcc = await res.json();
        setAccounts([...accounts, newAcc]);
      }
    } catch (err) {
      console.error('Failed to add account', err);
    }
  };

  const handleEditAccount = async (id: string, name: string, color: string) => {
    try {
      const res = await fetch(`/api/accounts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, color }),
      });
      if (res.ok) {
        const updatedAcc = await res.json();
        setAccounts(accounts.map(a => a.id === id ? updatedAcc : a));
        setEditingAccountId(null);
        fetchAllData();
      }
    } catch (err) {
      console.error('Failed to edit account', err);
    }
  };

  const handleDeleteAccount = (id: string) => {
    const acc = accounts.find(a => a.id === id);
    setDeleteTargetId(id);
    setDeleteTargetType('account');
    setDeleteTargetName(acc?.name || '');
    setIsConfirmingDelete(true);
  };

  const handleStartEditExpense = (expense: Expense) => {
    setEditingEntryId(expense.id);
    setActiveTab('expenses');
    setAmount(expense.amount.toString());
    setCategory(expense.category);
    setSubcategory(expense.subcategory || '');
    setAccount(expense.account);
    setUser(expense.user);
    setDate(expense.date);
    setDescription(expense.description);
    setIsRecurring(expense.isRecurring || false);
    setFrequency(expense.frequency || 'Monthly');
    setNextOccurrence(expense.nextOccurrence || '');
    setIsInstallment(expense.isInstallment || false);
    setInstallmentsCount(expense.installmentsCount?.toString() || '1');
    setTags(expense.tags || []);
    setIsAdding(true);
  };

  const handleStartEditIncome = (income: Income) => {
    setEditingEntryId(income.id);
    setActiveTab('income');
    setAmount(income.amount.toString());
    setSource(income.source);
    setAccount(income.account);
    setUser(income.user);
    setDate(income.date);
    setIsRecurring(!!income.isRecurring);
    setFrequency(income.frequency || 'Monthly');
    setNextOccurrence(income.nextOccurrence || '');
    setInstallmentsCount(income.installmentsCount?.toString() || '1');
    setNotes(income.notes || '');
    setPaymentMethod(income.paymentMethod || '');
    setTags(income.tags || []);
    setIsAdding(true);
  };

  const handleAddEntry = async (e?: any) => {
    if (e) e.preventDefault();
    console.log('handleAddEntry called', activeTab, amount);
    const cleanAmount = amount.replace(',', '.');
    if (!cleanAmount || isNaN(Number(cleanAmount))) {
      setAmountError(language === 'en' ? 'Amount is required' : language === 'pt' ? 'Valor é obrigatório' : 'El monto es requerido');
      return;
    }
    if (Number(cleanAmount) <= 0) {
      setAmountError(language === 'en' ? 'Amount must be positive' : language === 'pt' ? 'O valor deve ser positive' : 'El monto debe ser positivo');
      return;
    }
    setAmountError('');

    if (activeTab === 'expenses' || activeTab === 'home') {
      const expenseData = {
        amount: Number(cleanAmount),
        category,
        subcategory,
        account,
        date,
        description: description || subcategory || category,
        user,
        isRecurring,
        frequency: isRecurring ? frequency : undefined,
        nextOccurrence: isRecurring && nextOccurrence ? nextOccurrence : undefined,
        isInstallment,
        installmentsCount: (isInstallment || isRecurring) ? Number(installmentsCount) : 0,
        tags,
      };

      try {
        const url = editingEntryId ? `/api/expenses/${editingEntryId}` : '/api/expenses';
        const method = editingEntryId ? 'PUT' : 'POST';
        
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(expenseData),
        });
        if (res.ok) {
          await fetchAllData();
          resetForm();
        } else {
          const errorText = await res.text(); console.error('API Error:', res.status, errorText); alert('API Error: ' + errorText);
        }
      } catch (err) {
        console.error('Failed to save expense', err); alert('Error: ' + err.message);
      }
    } else if (activeTab === 'income') {
      const incomeData = {
        amount: Number(cleanAmount),
        source: source || 'General',
        account,
        date,
        user,
        isRecurring,
        frequency: isRecurring ? frequency : undefined,
        nextOccurrence: isRecurring && nextOccurrence ? nextOccurrence : undefined,
        installmentsCount: isRecurring ? Number(installmentsCount) : 0,
        notes: notes || undefined,
        paymentMethod: paymentMethod || undefined,
        tags,
      };

      try {
        const url = editingEntryId ? `/api/income/${editingEntryId}` : '/api/income';
        const method = editingEntryId ? 'PUT' : 'POST';
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(incomeData),
        });
        if (res.ok) {
          await fetchAllData();
          resetForm();
        } else {
          const errorText = await res.text(); console.error('API Error:', res.status, errorText); alert('API Error: ' + errorText);
        }
      } catch (err) {
        console.error('Failed to save income', err); alert('Error: ' + err.message);
      }
    } else if (activeTab === 'investments') {
      const investmentData = {
        name: investmentName || 'New Investment',
        symbol: investmentSymbol || null,
        initialAmount: Number(cleanAmount),
        currentValue: Number(cleanAmount), // Default current value to initial amount
        targetAmount: investmentTargetAmount ? Number(investmentTargetAmount) : null,
        targetDate: investmentTargetDate || null,
        date,
        user,
        account,
      };

      try {
        const url = editingEntryId ? `/api/investments/${editingEntryId}` : '/api/investments';
        const method = editingEntryId ? 'PUT' : 'POST';
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(investmentData),
        });
        if (res.ok) {
          await fetchAllData();
          resetForm();
        } else {
          const errorText = await res.text(); console.error('API Error:', res.status, errorText); alert('API Error: ' + errorText);
        }
      } catch (err) {
        console.error('Failed to save investment', err);
      }
    } else if (activeTab === 'budget') {
      try {
        await handleUpdateBudget(category, subcategory, Number(cleanAmount));
        resetForm();
      } catch (err) {
        console.error('Failed to update budget', err);
      }
    }
  };
  const handleOpenAddModal = () => {
    resetForm();
    if (categories.length > 0) {
      setCategory(categories[0].name);
      const subs = subcategories.filter(s => s.categoryId === categories[0].id);
      if (subs.length > 0) setSubcategory(subs[0].name);
    }
    setAccount(accounts[0]?.name || 'Bank');
    setIsAdding(true);
  };

  const resetForm = () => {
    setIsAdding(false);
    setIsAddingSubcategory(false);
    setQuickSubcategoryName('');
    setEditingEntryId(null);
    setAmount('');
    setAmountError('');
    setCategory('');
    setSubcategory('');
    setDescription('');
    setSource('');
    setNotes('');
    setPaymentMethod('');
    setTags([]);
    setTagInput('');
    setInvestmentName('');
    setInvestmentSymbol('');
    setInvestmentTargetAmount('');
    setInvestmentTargetDate('');
    setIsRecurring(false);
    setFrequency('Monthly');
    setNextOccurrence('');
    setIsInstallment(false);
    setInstallmentsCount('1');
    setSymbolSuggestions([]);
    setShowSymbolSuggestions(false);
  };

  const handleDeleteExpense = (id: string) => {
    setDeleteTargetId(id);
    setDeleteTargetType('expense');
    setIsConfirmingDelete(true);
  };

  const handleDeleteIncome = (id: string) => {
    setDeleteTargetId(id);
    setDeleteTargetType('income');
    setIsConfirmingDelete(true);
  };

  const handleDeleteInvestment = (id: string) => {
    setDeleteTargetId(id);
    setDeleteTargetType('investment');
    setIsConfirmingDelete(true);
  };

  const executeDelete = async () => {
    if (!deleteTargetId || !deleteTargetType) return;

    try {
      let res;
      switch (deleteTargetType) {
        case 'expense':
          res = await fetch(`/api/expenses/${deleteTargetId}`, { method: 'DELETE' });
          if (res.ok) setExpenses(expenses.filter(e => e.id !== deleteTargetId));
          break;
        case 'income':
          res = await fetch(`/api/income/${deleteTargetId}`, { method: 'DELETE' });
          if (res.ok) setIncome(income.filter(i => i.id !== deleteTargetId));
          break;
        case 'account':
          res = await fetch(`/api/accounts/${deleteTargetId}`, { method: 'DELETE' });
          if (res.ok) {
            setAccounts(accounts.filter(a => a.id !== deleteTargetId));
            fetchAllData();
          }
          break;
        case 'category':
          res = await fetch(`/api/categories/${deleteTargetId}`, { method: 'DELETE' });
          if (res.ok) {
            setCategories(categories.filter(c => c.id !== deleteTargetId));
            fetchAllData();
          }
          break;
        case 'subcategory':
          res = await fetch(`/api/subcategories/${deleteTargetId}`, { method: 'DELETE' });
          if (res.ok) {
            setSubcategories(subcategories.filter(s => s.id !== deleteTargetId));
            fetchAllData();
          }
          break;
        case 'investment':
          res = await fetch(`/api/investments/${deleteTargetId}`, { method: 'DELETE' });
          if (res.ok) setInvestments(investments.filter(i => i.id !== deleteTargetId));
          break;
      }
    } catch (err) {
      console.error(`Failed to delete ${deleteTargetType}`, err);
    } finally {
      setIsConfirmingDelete(false);
      setDeleteTargetId(null);
      setDeleteTargetType(null);
      setDeleteTargetName('');
    }
  };

  const handleEditInvestment = (inv: Investment) => {
    setEditingEntryId(inv.id);
    setInvestmentName(inv.name);
    setInvestmentSymbol(inv.symbol || '');
    setAmount(inv.initialAmount.toString());
    setInvestmentTargetAmount(inv.targetAmount?.toString() || '');
    setInvestmentTargetDate(inv.targetDate || '');
    setDate(inv.date);
    setAccount(inv.account);
    setIsAdding(true);
  };

  const handleUpdateInvestmentValue = async (id: string, val: number, date?: string) => {
    try {
      const res = await fetch(`/api/investments/${id}/value`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: val, date }),
      });
      if (res.ok) {
        setInvestments(investments.map(i => i.id === id ? { ...i, currentValue: val } : i));
        
        // Refresh history for this investment
        const histRes = await fetch(`/api/investments/${id}/history`);
        if (histRes.ok) {
          const history = await histRes.json();
          setInvestmentHistories(prev => ({ ...prev, [id]: history }));
        }

        setIsUpdatingValueModalOpen(false);
        setUpdatingInvestmentId(null);
        setNewValue('');
      }
    } catch (err) {
      console.error('Failed to update investment value', err);
    }
  };

  const handleViewHistory = async (id: string) => {
    setHistoryLoading(true);
    setUpdatingInvestmentId(id);
    try {
      const res = await fetch(`/api/investments/${id}/history`);
      if (res.ok) {
        const history = await res.json();
        setSelectedInvestmentHistory(history);
        setIsHistoryModalOpen(true);
      }
    } catch (err) {
      console.error('Failed to fetch investment history', err);
    } finally {
      setHistoryLoading(false);
    }
  };


  const handleUpdateBudget = async (categoryName: string, subcategoryName: string, amount: number) => {
    try {
      const res = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: categoryName, subcategory: subcategoryName, amount }),
      });
      if (res.ok) {
        setBudgets(prev => {
          const filtered = prev.filter(b => !(b.category === categoryName && (b.subcategory || '') === subcategoryName));
          return [...filtered, { category: categoryName, subcategory: subcategoryName, amount }];
        });
      }
    } catch (err) {
      console.error('Failed to update budget', err);
    }
  };

  const handleSaveBudget = async () => {
    if (!editingBudgetCategory) return;
    
    const categoryName = editingBudgetCategory.name;
    const updates = Object.entries(tempBudgets) as [string, number][];
    
    for (const [key, amount] of updates) {
      const subcategoryName = key === 'root' ? '' : key;
      await handleUpdateBudget(categoryName, subcategoryName, amount);
    }
    
    setEditingBudgetCategory(null);
    setTempBudgets({});
  };

  const handleDragStartMetric = (e: DragEvent, index: number) => {
    setDraggedMetricIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // a small trick to hide the ghost image or just let default happen
  };

  const handleDragOverMetric = (e: DragEvent, index: number) => {
    if (e) e.preventDefault();
    console.log('handleAddEntry called', activeTab, amount);
    if (draggedMetricIndex === null || draggedMetricIndex === index) return;
    
    const newMetrics = [...pinnedMetrics];
    const draggedItem = newMetrics[draggedMetricIndex];
    newMetrics.splice(draggedMetricIndex, 1);
    newMetrics.splice(index, 0, draggedItem);
    
    setPinnedMetrics(newMetrics);
    setDraggedMetricIndex(index);
  };

  const handleDragEndMetric = () => {
    setDraggedMetricIndex(null);
  };
  
  const handleAddMetric = () => {
    const newMetric: PinnedMetric = {
      id: Date.now().toString(),
      type: metricTypeToAdd,
      categoryId: metricTypeToAdd === 'category' ? metricCategoryToAdd : undefined
    };
    setPinnedMetrics([...pinnedMetrics, newMetric]);
    setIsAddMetricModalOpen(false);
  };
  
  const handleRemoveMetric = (id: string) => {
    setPinnedMetrics(pinnedMetrics.filter(m => m.id !== id));
  };

  const handleCancelBudget = () => {
    setEditingBudgetCategory(null);
    setTempBudgets({});
  };

  const stats = useMemo(() => {
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);
    const totalInvestments = investments.reduce((sum, i) => sum + i.currentValue, 0);
    const totalInitialInvestments = investments.reduce((sum, i) => sum + i.initialAmount, 0);

    const byAccount = expenses.reduce((acc, e) => {
      acc[e.account] = (acc[e.account] || 0) - e.amount;
      return acc;
    }, {} as Record<Account, number>);
    
    income.forEach(i => {
      byAccount[i.account] = (byAccount[i.account] || 0) + i.amount;
    });

    const spendingByCategory = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {} as Record<string, number>);

    const spendingBySubcategory = expenses.reduce((acc, e) => {
      const key = `${e.category}:${e.subcategory}`;
      acc[key] = (acc[key] || 0) + e.amount;
      return acc;
    }, {} as Record<string, number>);
    
    const date = new Date();
    date.setMonth(date.getMonth() + heroMonthOffset);
    const currentMonth = date.toISOString().slice(0, 7); // YYYY-MM
    const monthlyExpensesList = expenses.filter(e => e.date.startsWith(currentMonth));
    const monthlyExpenses = monthlyExpensesList.reduce((sum, e) => sum + e.amount, 0);
    const monthlyIncome = income.filter(i => i.date.startsWith(currentMonth)).reduce((sum, i) => sum + i.amount, 0);
    const monthlyInvestments = investments.filter(i => i.date.startsWith(currentMonth)).reduce((sum, i) => sum + i.initialAmount, 0);

    const monthlySpendingByCategory = monthlyExpensesList.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {} as Record<string, number>);

    const monthlySpendingBySubcategory = monthlyExpensesList.reduce((acc, e) => {
      const key = `${e.category}:${e.subcategory}`;
      acc[key] = (acc[key] || 0) + e.amount;
      return acc;
    }, {} as Record<string, number>);

    const totalBudget = budgets
      .filter(b => !b.subcategory || b.subcategory === '')
      .reduce((sum, b) => sum + b.amount, 0);

    const netBalance = totalIncome - totalExpenses;
    const monthlyNetBalance = monthlyIncome - monthlyExpenses;
    const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;

    return { 
      totalExpenses, 
      totalIncome, 
      totalInvestments, 
      totalInitialInvestments, 
      byAccount, 
      spendingByCategory, 
      spendingBySubcategory, 
      monthlyExpenses, 
      monthlyIncome, 
      monthlyInvestments,
      monthlySpendingByCategory, 
      monthlySpendingBySubcategory, 
      totalBudget,
      netBalance,
      monthlyNetBalance,
      savingsRate
    };
  }, [expenses, income, investments, budgets, heroMonthOffset]);

  const netWorthTrend = useMemo(() => {
    const trend = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth();
      
      let endDateStr = "";
      const isCurrentMonth = (year === now.getFullYear() && month === now.getMonth());
      if (isCurrentMonth) {
        endDateStr = now.toISOString().split('T')[0];
      } else {
        const lastDay = new Date(year, month + 1, 0);
        endDateStr = lastDay.toISOString().split('T')[0];
      }
      
      const totalInc = income
        .filter(incItem => incItem.date <= endDateStr)
        .reduce((sum, incItem) => sum + incItem.amount, 0);
        
      const totalExp = expenses
        .filter(expItem => expItem.date <= endDateStr)
        .reduce((sum, expItem) => sum + expItem.amount, 0);
        
      const cashBalance = totalInc - totalExp;
      
      let investmentsVal = 0;
      investments.forEach(inv => {
        const history = investmentHistories[inv.id] || [];
        const entriesBeforeOrOn = history.filter(h => h.date <= endDateStr);
        if (entriesBeforeOrOn.length > 0) {
          const latest = entriesBeforeOrOn.reduce((prev, curr) => 
            new Date(curr.date) > new Date(prev.date) ? curr : prev
          );
          investmentsVal += latest.value;
        }
      });
      
      const netWorth = cashBalance + investmentsVal;
      
      const monthName = d.toLocaleDateString(locale, { month: 'short' });
      trend.push({
        month: monthName,
        netWorth,
        cash: cashBalance,
        investments: investmentsVal,
        rawDate: endDateStr,
      });
    }
    
    return trend;
  }, [expenses, income, investments, investmentHistories, locale]);

  const insightsData = useMemo(() => {
    const { start, end } = (() => {
      const now = new Date();
      let s = new Date();
      let e = new Date();
      switch (insightsRange) {
        case 'thisMonth':
          s = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'last3Months':
          s = new Date(now.getFullYear(), now.getMonth() - 2, 1);
          break;
        case 'last6Months':
          s = new Date(now.getFullYear(), now.getMonth() - 5, 1);
          break;
        case 'last12Months':
          s = new Date(now.getFullYear(), now.getMonth() - 11, 1);
          break;
        case 'custom':
          return { start: insightsStartDate, end: insightsEndDate };
      }
      return { 
        start: s.toISOString().slice(0, 10), 
        end: e.toISOString().slice(0, 10) 
      };
    })();

    const filteredExpenses = expenses.filter(e => e.date >= start && e.date <= end);
    const filteredIncome = income.filter(i => i.date >= start && i.date <= end);

    const totalIncome = filteredIncome.reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    const net = totalIncome - totalExpenses;

    // Monthly Trend (Expenses)
    const monthlyExpensesData: Record<string, number> = {};
    filteredExpenses.forEach(e => {
      const month = e.date.slice(0, 7); // YYYY-MM
      monthlyExpensesData[month] = (monthlyExpensesData[month] || 0) + e.amount;
    });

    // Monthly Income
    const monthlyIncomeData: Record<string, number> = {};
    filteredIncome.forEach(i => {
      const month = i.date.slice(0, 7);
      monthlyIncomeData[month] = (monthlyIncomeData[month] || 0) + i.amount;
    });
    
    // Combined Trend Data (for Line Chart and Bar Chart)
    const allMonths: string[] = [];
    const startMonth = new Date(start.slice(0, 7) + '-01');
    const endMonth = new Date(end.slice(0, 7) + '-01');
    let curr = new Date(startMonth);
    
    // Safety break for extremely large ranges
    let iterations = 0;
    while (curr <= endMonth && iterations < 240) {
      const y = curr.getFullYear();
      const m = String(curr.getMonth() + 1).padStart(2, '0');
      allMonths.push(`${y}-${m}`);
      curr.setMonth(curr.getMonth() + 1);
      iterations++;
    }

    const trendData = allMonths.map(month => {
      const [year, m] = month.split('-').map(Number);
      const dateObj = new Date(year, m - 1, 1);
      const incomeVal = monthlyIncomeData[month] || 0;
      const expenseVal = monthlyExpensesData[month] || 0;
      return {
        month: dateObj.toLocaleDateString(language === 'en' ? 'en-US' : language === 'pt' ? 'pt-BR' : 'es-ES', { month: 'short', year: '2-digit' }),
        expenses: expenseVal,
        income: incomeVal,
        net: incomeVal - expenseVal,
        rawMonth: month
      };
    });

    // Subcategory Distribution (Filtered Range)
    const subcatData: Record<string, number> = {};
    const distributionExpenses = selectedMonth 
      ? filteredExpenses.filter(e => e.date.startsWith(selectedMonth))
      : filteredExpenses;

    distributionExpenses.forEach(e => {
      const label = e.subcategory || e.category;
      subcatData[label] = (subcatData[label] || 0) + e.amount;
    });

    const distributionData = Object.entries(subcatData)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);

    // Full Subcategory Breakdown (Filtered Range)
    const subcatOnlyData: Record<string, number> = {};
    distributionExpenses.forEach(e => {
      if (e.subcategory && e.subcategory !== 'Other') {
        subcatOnlyData[e.subcategory] = (subcatOnlyData[e.subcategory] || 0) + e.amount;
      }
    });

    const subcategoryBreakdownData = Object.entries(subcatOnlyData)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 12);

    // Monthly Spending per Category Trend
    const categoryMonthlyData: Record<string, Record<string, number>> = {};
    const uniqueCategories = new Set<string>();
    filteredExpenses.forEach(e => {
      const month = e.date.slice(0, 7); // YYYY-MM
      uniqueCategories.add(e.category);
      if (!categoryMonthlyData[month]) {
        categoryMonthlyData[month] = {};
      }
      categoryMonthlyData[month][e.category] = (categoryMonthlyData[month][e.category] || 0) + e.amount;
    });

    const categoryTrendData = allMonths.map(month => {
      const data: any = {
        month: new Date(month + '-01').toLocaleDateString(language === 'en' ? 'en-US' : language === 'pt' ? 'pt-BR' : 'es-ES', { month: 'short', year: '2-digit' }),
        rawMonth: month
      };
      uniqueCategories.forEach(cat => {
        data[cat] = categoryMonthlyData[month]?.[cat] || 0;
      });
      return data;
    });

    // Monthly Spending per Subcategory Trend
    const subcategoryMonthlyData: Record<string, Record<string, number>> = {};
    const topSubcategories = new Set<string>();
    
    // Get top 8 subcategories by total spending in the range to keep chart clean
    const subcatTotals: Record<string, number> = {};
    filteredExpenses.forEach(e => {
      if (e.subcategory) {
        subcatTotals[e.subcategory] = (subcatTotals[e.subcategory] || 0) + e.amount;
      }
    });
    
    const sortedSubcats = Object.entries(subcatTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(entry => entry[0]);
    
    sortedSubcats.forEach(s => topSubcategories.add(s));

    filteredExpenses.forEach(e => {
      if (!e.subcategory || !topSubcategories.has(e.subcategory)) return;
      const month = e.date.slice(0, 7);
      if (!subcategoryMonthlyData[month]) {
        subcategoryMonthlyData[month] = {};
      }
      subcategoryMonthlyData[month][e.subcategory] = (subcategoryMonthlyData[month][e.subcategory] || 0) + e.amount;
    });

    const subcategoryTrendData = allMonths.map(month => {
      const data: any = {
        month: new Date(month + '-01').toLocaleDateString(language === 'en' ? 'en-US' : language === 'pt' ? 'pt-BR' : 'es-ES', { month: 'short', year: '2-digit' }),
        rawMonth: month
      };
      sortedSubcats.forEach(sub => {
        data[sub] = subcategoryMonthlyData[month]?.[sub] || 0;
      });
      return data;
    });

    // MoM Cumulative Data
    const now = new Date();
    const currYear = now.getFullYear();
    const currMonth = now.getMonth();
    const currMonthPrefix = `${currYear}-${String(currMonth + 1).padStart(2, '0')}`;
    
    let prevYear = currYear;
    let prevMonth = currMonth - 1;
    if (prevMonth < 0) {
      prevMonth = 11;
      prevYear--;
    }
    const prevMonthPrefix = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}`;
    
    const daysInCurrMonth = new Date(currYear, currMonth + 1, 0).getDate();
    const momTrendData = [];
    
    let currCumulative = 0;
    let prevCumulative = 0;
    
    // Calculate cumulative daily totals
    const currDaily = new Array(31).fill(0);
    const prevDaily = new Array(31).fill(0);
    
    expenses.forEach(e => {
      if (e.date.startsWith(currMonthPrefix)) {
        const day = parseInt(e.date.slice(8, 10), 10);
        currDaily[day - 1] += e.amount;
      } else if (e.date.startsWith(prevMonthPrefix)) {
        const day = parseInt(e.date.slice(8, 10), 10);
        prevDaily[day - 1] += e.amount;
      }
    });
    
    for (let i = 1; i <= 31; i++) {
      if (i <= daysInCurrMonth || i <= new Date(prevYear, prevMonth + 1, 0).getDate()) {
        currCumulative += currDaily[i - 1];
        prevCumulative += prevDaily[i - 1];
        
        // Stop adding current month line if it's past today
        const isFutureInCurrMonth = i > now.getDate();
        
        momTrendData.push({
          day: i,
          currentMonth: isFutureInCurrMonth ? null : currCumulative,
          previousMonth: prevCumulative
        });
      }
    }

    return { 
      trendData, 
      distributionData, 
      subcategoryBreakdownData, 
      categoryTrendData, 
      subcategoryTrendData,
      momTrendData,
      topSubcategories: sortedSubcats,
      categories: Array.from(uniqueCategories), 
      totalIncome, 
      totalExpenses, 
      net 
    };
  }, [expenses, income, insightsRange, insightsStartDate, insightsEndDate, language, selectedMonth]);

  const expensesTrendData = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString().slice(0, 10);
    const end = new Date().toISOString().slice(0, 10);

    const filteredExpenses = expenses.filter(e => e.date >= start && e.date <= end);

    const allMonths: string[] = [];
    let curr = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    for (let i = 0; i < 6; i++) {
      const y = curr.getFullYear();
      const m = String(curr.getMonth() + 1).padStart(2, '0');
      allMonths.push(`${y}-${m}`);
      curr.setMonth(curr.getMonth() + 1);
    }

    const categoryMonthlyData: Record<string, Record<string, number>> = {};
    const uniqueCategories = new Set<string>();
    filteredExpenses.forEach(e => {
      const month = e.date.slice(0, 7);
      uniqueCategories.add(e.category);
      if (!categoryMonthlyData[month]) categoryMonthlyData[month] = {};
      categoryMonthlyData[month][e.category] = (categoryMonthlyData[month][e.category] || 0) + e.amount;
    });

    const categoryTrend = allMonths.map(month => {
      const data: any = {
        month: new Date(month + '-01').toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR', { month: 'short' }),
        rawMonth: month
      };
      uniqueCategories.forEach(cat => {
        data[cat] = categoryMonthlyData[month]?.[cat] || 0;
      });
      return data;
    });

    const subcatTotals: Record<string, number> = {};
    filteredExpenses.forEach(e => {
      if (e.subcategory) subcatTotals[e.subcategory] = (subcatTotals[e.subcategory] || 0) + e.amount;
    });
    const topSubcats = Object.entries(subcatTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(e => e[0]);

    const subcategoryMonthlyData: Record<string, Record<string, number>> = {};
    filteredExpenses.forEach(e => {
      if (!e.subcategory || !topSubcats.includes(e.subcategory)) return;
      const month = e.date.slice(0, 7);
      if (!subcategoryMonthlyData[month]) subcategoryMonthlyData[month] = {};
      subcategoryMonthlyData[month][e.subcategory] = (subcategoryMonthlyData[month][e.subcategory] || 0) + e.amount;
    });

    const subcategoryTrend = allMonths.map(month => {
      const data: any = {
        month: new Date(month + '-01').toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR', { month: 'short' }),
        rawMonth: month
      };
      topSubcats.forEach(sub => {
        data[sub] = subcategoryMonthlyData[month]?.[sub] || 0;
      });
      return data;
    });

    return {
      categoryTrend,
      subcategoryTrend,
      categories: Array.from(uniqueCategories),
      topSubcategories: topSubcats
    };
  }, [expenses, language]);

  const notifications = useMemo(() => {
    const alerts: Notification[] = [];
    
    budgets.forEach(b => {
      if (b.amount <= 0) return;
      
      let spent = 0;
      let label = b.category;
      
      if (b.subcategory && b.subcategory !== '') {
        spent = stats.monthlySpendingBySubcategory[`${b.category}:${b.subcategory}`] || 0;
        label = `${b.category} > ${b.subcategory}`;
      } else {
        spent = stats.monthlySpendingByCategory[b.category] || 0;
      }
      
      const percent = (spent / b.amount) * 100;
      
      if (percent >= 100) {
        alerts.push({
          id: `danger-${b.category}-${b.subcategory || 'main'}`,
          type: 'danger',
          message: `Budget exceeded for ${label}!`,
          category: b.category,
          subcategory: b.subcategory,
          percent
        });
      } else if (percent >= 80) {
        alerts.push({
          id: `warning-${b.category}-${b.subcategory || 'main'}`,
          type: 'warning',
          message: `Approaching budget limit for ${label} (${Math.round(percent)}%)`,
          category: b.category,
          subcategory: b.subcategory,
          percent
        });
      }
    });
    
    return alerts;
  }, [budgets, stats]);

  const groupedExpenses = useMemo(() => {
    const filtered = expenses.filter(e => {
      const matchesSearch = (e.description || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                           (e.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (e.subcategory && (e.subcategory || '').toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = filterCategory === 'All' || e.category === filterCategory;
      const matchesSubcategory = filterSubcategory === 'All' || e.subcategory === filterSubcategory;
      const matchesAccount = filterAccount === 'All' || e.account === filterAccount;
      const matchesDate = (!startDate || e.date >= startDate) && (!endDate || e.date <= endDate);
      const matchesRecurring = !showRecurringOnly || e.isRecurring;
      const matchesTag = filterTag === 'All' || (e.tags && e.tags.includes(filterTag));
      return matchesSearch && matchesCategory && matchesSubcategory && matchesAccount && matchesDate && matchesRecurring && matchesTag;
    });

    const groups: Record<string, Expense[]> = {};
    filtered.forEach(e => {
      if (!groups[e.date]) groups[e.date] = [];
      groups[e.date].push(e);
    });
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [expenses, searchTerm, filterCategory, filterSubcategory, filterAccount, startDate, endDate, showRecurringOnly, filterTag]);

  const groupedIncome = useMemo(() => {
    const filtered = income.filter(i => {
      const matchesSearch = (i.source || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'All'; // Income doesn't have categories in the same way, but we could filter by source if we wanted. For now, just search.
      const matchesAccount = filterAccount === 'All' || i.account === filterAccount;
      const matchesDate = (!startDate || i.date >= startDate) && (!endDate || i.date <= endDate);
      const matchesTag = filterTag === 'All' || (i.tags && i.tags.includes(filterTag));
      return matchesSearch && matchesCategory && matchesAccount && matchesDate && matchesTag;
    });

    const groups: Record<string, Income[]> = {};
    filtered.forEach(i => {
      if (!groups[i.date]) groups[i.date] = [];
      groups[i.date].push(i);
    });
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [income, searchTerm, filterCategory, filterAccount, startDate, endDate, filterTag]);


  const uniqueTags = useMemo(() => {
    const tagsSet = new Set<string>();
    expenses.forEach(e => {
      if (e.tags) e.tags.forEach(t => tagsSet.add(t));
    });
    income.forEach(i => {
      if (i.tags) i.tags.forEach(t => tagsSet.add(t));
    });
    return Array.from(tagsSet).sort();
  }, [expenses, income]);

  const getAccountIcon = (accName: Account) => {
    const acc = accounts.find(a => a.name === accName);
    return <Wallet className="w-4 h-4" style={{ color: acc?.color }} />;
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setSearchTerm('');
                              setFilterTag('All');
    setFilterCategory('All');
    setStartDate('');
    setEndDate('');
    setShowFilters(false);
    
    if (tab === 'investments') {
      investments.forEach(inv => {
        if (inv.symbol) {
        }
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row transition-colors duration-300">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 border-r border-black/5 dark:border-white/5 p-8 bg-white dark:bg-zinc-900/20">
        <div className="flex items-center gap-3 mb-12">
          <div className="relative w-12 h-12 flex items-center justify-center group shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl shadow-lg shadow-accent-500/30 transform group-hover:-rotate-6 group-hover:scale-105 transition-all duration-300" />
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-2xl opacity-50" />
            <div className="absolute inset-0 ring-1 ring-white/30 rounded-2xl" />
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 text-white drop-shadow-md transform group-hover:scale-110 transition-transform duration-300">
              <path d="M10 7H7a2.5 2.5 0 0 0 0 5h3a2.5 2.5 0 0 1 0 5H7" />
              <path d="M12 7l2.5 10 2-7 2 7 2.5-10" opacity="0.8" />
              <circle cx="20.5" cy="4.5" r="1.5" fill="currentColor" stroke="none" className="animate-pulse" />
            </svg>
          </div>
          <div className="flex flex-col">
            <h1 className="text-[1.5rem] font-[800] tracking-[-0.04em] text-zinc-900 dark:text-zinc-100 leading-none">Spend Wise</h1>
            <p className="micro-label mt-1 opacity-70">Personal Finance</p>
          </div>
        </div>

        <div className="pt-4 mb-4 border-b border-zinc-100 dark:border-zinc-800/50">
          <button
            onClick={() => setIsSelectionModalOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-3 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-xl text-sm font-bold shadow-lg hover:scale-[1.02] transition-all mb-4"
          >
            <Plus className="w-5 h-5" />
            {language === 'en' ? 'Add New' : language === 'pt' ? 'Adicionar Novo' : 'Añadir Nuevo'}
          </button>
        </div>

        <nav className="flex-1 space-y-1">
          {[
            { id: 'home', icon: LayoutDashboard, label: t.home },
            { id: 'expenses', icon: PieChart, label: t.expenses },
            { id: 'income', icon: TrendingUp, label: t.income },
            { id: 'budget', icon: Target, label: t.budget },
            { id: 'trends', icon: Activity, label: t.trends },
            { id: 'investments', icon: LineChart, label: t.investments },
            { id: 'settings', icon: Settings, label: t.settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id as Tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === item.id
                  ? 'bg-accent-500 text-white shadow-md'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-black/5 dark:border-white/5">
          <div className="micro-label mb-4 text-accent-500">Status: Active</div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-accent-500/10 flex items-center justify-center text-accent-600">
              <User className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">Matheus Medeiros</p>
              <p className="text-[10px] text-zinc-400 truncate">matheustmedeiros1@gmail.com</p>
            </div>
          </div>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-full flex items-center justify-between px-4 py-3 bg-zinc-100 dark:bg-zinc-800/50 rounded-xl text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all"
          >
            <div className="flex items-center gap-2">
              {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              {isDarkMode ? 'Dark Mode' : 'Light Mode'}
            </div>
            <div className={`w-8 h-4 rounded-full relative transition-colors ${isDarkMode ? 'bg-accent-500' : 'bg-zinc-300'}`}>
              <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${isDarkMode ? 'left-4.5' : 'left-0.5'}`} />
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto no-scrollbar">
        <div className="max-w-5xl mx-auto px-4 lg:px-12 py-8 lg:py-16 pb-32 lg:pb-16">
          {/* Header (Mobile Only) */}
          <header className="lg:hidden mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 flex items-center justify-center group shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-400 to-accent-600 rounded-[0.8rem] shadow-lg shadow-accent-500/30 transform active:-rotate-6 transition-all duration-300" />
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-[0.8rem] opacity-50" />
                <div className="absolute inset-0 ring-1 ring-white/30 rounded-[0.8rem]" />
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 text-white drop-shadow-md">
                  <path d="M10 7H7a2.5 2.5 0 0 0 0 5h3a2.5 2.5 0 0 1 0 5H7" />
                  <path d="M12 7l2.5 10 2-7 2 7 2.5-10" opacity="0.8" />
                  <circle cx="20.5" cy="4.5" r="1.5" fill="currentColor" stroke="none" />
                </svg>
              </div>
              <h1 className="text-[1.5rem] font-[800] tracking-[-0.04em] text-zinc-900 dark:text-zinc-100 leading-none pt-1">Spend Wise</h1>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setUseSecondaryCurrency(!useSecondaryCurrency)}
                className="px-2 py-1 text-xs font-bold bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all flex items-center gap-1"
                title={`Switch to ${useSecondaryCurrency ? currency : secondaryCurrency}`}
                disabled={isFetchingRate}
              >
                <RefreshCw className={`w-3 h-3 ${isFetchingRate ? 'animate-spin' : ''}`} />
                {useSecondaryCurrency ? secondaryCurrency : currency}
              </button>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all"
              >
                <Bell className="w-5 h-5" />
              </button>
              <button 
                onClick={() => handleTabChange('settings')}
                className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Desktop Header Content */}
          <div className="hidden lg:flex items-center justify-between mb-16">
            <div>
              <span className="micro-label">Overview</span>
              <h2 className="text-6xl font-[800] tracking-[-0.05em] text-zinc-900 dark:text-zinc-100 mt-2">
                {activeTab === 'home' ? t.home : 
                 activeTab === 'expenses' ? t.expenses : 
                 activeTab === 'income' ? t.income : 
                 activeTab === 'budget' ? t.budget : 
                 activeTab === 'trends' ? t.trends : activeTab === 'investments' ? t.investments : t.settings}
              </h2>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <button 
                onClick={() => setUseSecondaryCurrency(!useSecondaryCurrency)}
                className="relative px-4 py-2 h-[46px] bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all shadow-sm flex items-center gap-2"
                title={`Switch to ${useSecondaryCurrency ? currency : secondaryCurrency}`}
                disabled={isFetchingRate}
              >
                <RefreshCw className={`w-4 h-4 ${isFetchingRate ? 'animate-spin' : ''}`} />
                {useSecondaryCurrency ? secondaryCurrency : currency}
              </button>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all shadow-sm"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900" />
                )}
              </button>
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-6 h-6 border-2 border-zinc-200 border-t-zinc-800 rounded-full animate-spin" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                {activeTab === 'home' && (
              <div className="space-y-12 pb-12">
                {/* Hero Section: Financial Health */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
                  {/* Total Net Worth Section */}
                  <section className="relative flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-sm font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">{t.totalBalance}</h2>
                        <div className="flex items-baseline gap-2 mt-1">
                          <p className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                            {formatCurrency(stats.netBalance + stats.totalInvestments)}
                          </p>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${stats.monthlyNetBalance >= 0 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400'}`}>
                            {stats.monthlyNetBalance >= 0 ? '+' : ''}{formatCurrency(stats.monthlyNetBalance)}
                          </span>
                        </div>
                      </div>
                      <div className="hidden sm:flex flex-col items-end">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{t.savingsRate}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.max(0, Math.min(100, stats.savingsRate))}%` }}
                              className="h-full bg-zinc-900 dark:bg-zinc-100"
                            />
                          </div>
                          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{Math.round(stats.savingsRate)}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 flex-1">
                      <div className="glass-card p-4 sm:p-5 group flex items-center justify-between">
                        <span className="micro-label !text-emerald-500">{t.income}</span>
                        <div className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 leading-none">{formatCurrency(stats.totalIncome)}</div>
                      </div>

                      <div className="glass-card p-4 sm:p-5 group flex items-center justify-between">
                        <span className="micro-label !text-rose-500">{t.expenses}</span>
                        <div className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 leading-none">{formatCurrency(stats.totalExpenses)}</div>
                      </div>

                      <div className="glass-card p-4 sm:p-5 group flex items-center justify-between">
                        <span className="micro-label !text-blue-500">{t.investments}</span>
                        <div className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 leading-none">{formatCurrency(stats.totalInvestments)}</div>
                      </div>
                    </div>
                  </section>

                  {/* Current Month Section */}
                  <section className="relative flex flex-col">
                    <h2 className="text-xl font-bold">Summary</h2>
                    <p className="text-zinc-500">Your financial summary.</p>
                  </section>
                </div>
              </div>
            )}

            {activeTab === 'expenses' && (
              <div className="space-y-6 pb-20">
                <h2 className="text-2xl font-light">Expenses</h2>
                <div className="space-y-4">
                  {expenses.map(e => (
                    <div key={e.id} className="p-4 bg-white dark:bg-zinc-900 rounded-2xl flex justify-between">
                      <div>
                        <p className="font-bold">{e.description}</p>
                        <p className="text-xs text-zinc-500">{e.category} • {e.date}</p>
                      </div>
                      <p className="font-bold text-rose-500">-{formatCurrency(e.amount)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'income' && (
              <div className="space-y-6 pb-20">
                <h2 className="text-2xl font-light">Income</h2>
                <div className="space-y-4">
                  {income.map(i => (
                    <div key={i.id} className="p-4 bg-white dark:bg-zinc-900 rounded-2xl flex justify-between">
                      <div>
                        <p className="font-bold">{i.source}</p>
                        <p className="text-xs text-zinc-500">{i.account} • {i.date}</p>
                      </div>
                      <p className="font-bold text-emerald-500">+{formatCurrency(i.amount)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'investments' && (
              <div className="space-y-6 pb-20">
                <h2 className="text-2xl font-light">Investments</h2>
                <div className="space-y-4">
                  {investments.map(inv => (
                    <div key={inv.id} className="p-4 bg-white dark:bg-zinc-900 rounded-2xl flex justify-between">
                      <div>
                        <p className="font-bold">{inv.name}</p>
                        <p className="text-xs text-zinc-500">{inv.symbol}</p>
                      </div>
                      <p className="font-bold text-blue-500">{formatCurrency(inv.currentValue)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'budget' && (
              <div className="space-y-6 pb-20">
                <h2 className="text-2xl font-light">Budget</h2>
                <div className="space-y-4">
                  {budgets.map(b => (
                    <div key={b.category} className="p-4 bg-white dark:bg-zinc-900 rounded-2xl flex justify-between">
                      <p className="font-bold">{b.category}</p>
                      <p className="font-bold">{formatCurrency(b.amount)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'trends' && (
              <div className="space-y-6 pb-20">
                <h2 className="text-2xl font-light">Trends</h2>
                <p className="text-zinc-500">Analytics simplified.</p>
              </div>
            )}
            {activeTab === 'settings' && (
              <div className="space-y-8 pb-20">
                {/* Tab Header */}
                <div className="mb-6">
                  <h2 className="text-2xl font-light tracking-tight text-zinc-900 dark:text-zinc-100">{t.settings}</h2>
                  <p className="text-xs text-zinc-400 font-medium mt-1">{t.settingsSummary}</p>
                </div>

                {/* Appearance */}
                <section className="space-y-6">
                  <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t.appearance}</h3>
                  <div className="glass-card p-8 rounded-[2.5rem] space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500 shadow-sm">
                          {isDarkMode ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
                        </div>
                        <div>
                          <p className="text-base font-medium text-zinc-900 dark:text-zinc-100 tracking-tight">{t.darkMode}</p>
                          <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mt-1">{language === 'en' ? 'Toggle dark/light theme' : 'Alternar tema claro/escuro'}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={`w-14 h-7 rounded-full transition-all relative ${isDarkMode ? 'bg-zinc-900 dark:bg-zinc-100' : 'bg-zinc-200'}`}
                      >
                        <motion.div 
                          animate={{ x: isDarkMode ? 30 : 4 }}
                          className="absolute top-1 w-5 h-5 bg-white dark:bg-zinc-900 rounded-full shadow-md"
                        />
                      </button>
                    </div>

                    <div className="h-px bg-zinc-100 dark:bg-zinc-800/50" />

                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500 shadow-sm">
                          <Palette className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-base font-medium text-zinc-900 dark:text-zinc-100 tracking-tight">{language === 'en' ? 'Accent Color' : 'Cor de Destaque'}</p>
                          <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mt-1">{language === 'en' ? 'Customize your primary color' : 'Personalize sua cor primária'}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3 pl-16">
                        {[
                          { name: 'Indigo', color: '#6366f1' },
                          { name: 'Emerald', color: '#10b981' },
                          { name: 'Rose', color: '#f43f5e' },
                          { name: 'Amber', color: '#f59e0b' },
                          { name: 'Violet', color: '#8b5cf6' },
                          { name: 'Sky', color: '#0ea5e9' },
                          { name: 'Zinc', color: '#18181b' }
                        ].map(c => (
                          <button
                            key={c.color}
                            onClick={() => setAccentColor(c.color)}
                            className={`w-10 h-10 rounded-full border-4 transition-all shadow-sm ${accentColor === c.color ? 'border-zinc-900 dark:border-zinc-100 scale-110' : 'border-transparent hover:scale-105'}`}
                            style={{ backgroundColor: c.color }}
                            title={c.name}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="h-px bg-zinc-100 dark:bg-zinc-800" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500">
                          <Search className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{t.language}</p>
                          <p className="text-[10px] text-zinc-400 uppercase tracking-tight">{language === 'en' ? 'Choose your language' : language === 'pt' ? 'Escolha seu idioma' : 'Elige tu idioma'}</p>
                        </div>
                      </div>
                      <select 
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as Language)}
                        className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs font-bold py-2 px-3 rounded-xl outline-none border-none"
                      >
                        <option value="en">English</option>
                        <option value="pt">Português</option>
                        <option value="es">Español</option>
                      </select>
                    </div>

                    <div className="h-px bg-zinc-100 dark:bg-zinc-800" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500">
                          <Banknote className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{t.currency}</p>
                          <p className="text-[10px] text-zinc-400 uppercase tracking-tight">{language === 'en' ? 'Choose your currency' : language === 'pt' ? 'Escolha sua moeda' : 'Elige tu moneda'}</p>
                        </div>
                      </div>
                      <select 
                        value={currency}
                        onChange={(e) => {
                          setCurrency(e.target.value);
                          if (e.target.value === secondaryCurrency) {
                            setSecondaryCurrency(e.target.value === 'USD' ? 'EUR' : 'USD');
                          }
                        }}
                        className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs font-bold py-2 px-3 rounded-xl outline-none border-none"
                      >
                        {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div className="h-px bg-zinc-100 dark:bg-zinc-800" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500">
                          <RefreshCw className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{language === 'en' ? 'Secondary Currency' : language === 'pt' ? 'Moeda Secundária' : 'Moneda Secundaria'}</p>
                          <p className="text-[10px] text-zinc-400 uppercase tracking-tight">{language === 'en' ? 'Quick switch target' : language === 'pt' ? 'Moeda para troca rápida' : 'Moneda para cambio rápido'}</p>
                        </div>
                      </div>
                      <select 
                        value={secondaryCurrency}
                        onChange={(e) => {
                          setSecondaryCurrency(e.target.value);
                          localStorage.setItem('secondaryCurrency', e.target.value);
                        }}
                        className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs font-bold py-2 px-3 rounded-xl outline-none border-none"
                      >
                        {CURRENCIES.filter(c => c !== currency).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div className="h-px bg-zinc-100 dark:bg-zinc-800" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{t.locale}</p>
                          <p className="text-[10px] text-zinc-400 uppercase tracking-tight">{language === 'en' ? 'Choose your region format' : language === 'pt' ? 'Escolha o formato da região' : 'Elige el formato de región'}</p>
                        </div>
                      </div>
                      <select 
                        value={locale}
                        onChange={(e) => setLocale(e.target.value)}
                        className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs font-bold py-2 px-3 rounded-xl outline-none border-none"
                      >
                        {LOCALES.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
                      </select>
                    </div>
                  </div>
                </section>

                {/* Account Management */}
                <section className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t.accounts}</h3>
                    <button 
                      onClick={() => {
                        setEditingAccountId('new');
                        setEditingAccountName('');
                        setEditingAccountColor('#18181b');
                      }}
                      className="text-[10px] font-bold text-accent-500 uppercase tracking-widest"
                    >
                      {t.addNew}
                    </button>
                  </div>
                  <div className="space-y-2">
                    {accounts.map(acc => (
                      <div key={acc.id} className="glass-card p-4 rounded-3xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white" style={{ backgroundColor: acc.color }}>
                            <Wallet className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{acc.name}</p>
                            <p className="text-[10px] text-zinc-400 uppercase tracking-tight">{language === 'en' ? 'Balance' : language === 'pt' ? 'Saldo' : 'Saldo'}: {formatCurrency(stats.byAccount[acc.name] || 0)}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            setEditingAccountId(acc.id);
                            setEditingAccountName(acc.name);
                            setEditingAccountColor(acc.color);
                          }}
                          className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                        >
                          <Settings className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Category Management */}
                <section className="space-y-4">
                  <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t.categories}</h3>
                  <button 
                    onClick={() => setIsManagingCategories(true)}
                    className="w-full glass-card p-6 rounded-[32px] flex items-center justify-between group hover:border-zinc-200 dark:hover:border-zinc-700 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500 group-hover:scale-110 transition-transform">
                        <Tag className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{t.manageCategories}</p>
                        <p className="text-[10px] text-zinc-400 uppercase tracking-tight">{language === 'en' ? 'Edit, add or remove categories' : language === 'pt' ? 'Editar, adicionar ou remover categorias' : 'Editar, añadir o eliminar categorías'}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:translate-x-1 transition-transform" />
                  </button>
                </section>

                {/* Recurring Expenses Management */}
                <section className="space-y-4">
                  <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{(t as any).recurringExpenses}</h3>
                  <div className="space-y-3">
                    {expenses.filter(e => e.isRecurring).length === 0 ? (
                      <div className="glass-card p-8 text-center rounded-[32px]">
                        <Calendar className="w-8 h-8 text-zinc-200 mx-auto mb-2" />
                        <p className="text-xs text-zinc-400 font-medium">{language === 'en' ? 'No recurring expenses found' : language === 'pt' ? 'Nenhuma despesa recorrente encontrada' : 'No se encontraron gastos recurrentes'}</p>
                      </div>
                    ) : (
                      expenses.filter(e => e.isRecurring).map(re => (
                        <div key={re.id} className="glass-card p-4 rounded-[32px] flex items-center justify-between group hover:border-zinc-200 dark:hover:border-zinc-700 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500">
                              <Calendar className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{re.description}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-tight">{re.category}</span>
                                <span className="w-1 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                                <span className="text-[10px] font-bold text-accent-500 uppercase tracking-tight">{re.frequency}</span>
                                <span className="w-1 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                                <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-tight">{formatCurrency(re.amount)}</span>
                              </div>
                              {re.nextOccurrence && (
                                <p className="text-[8px] text-zinc-400 uppercase tracking-widest mt-1 font-bold">
                                  {language === 'en' ? 'Next' : language === 'pt' ? 'Próximo' : 'Próximo'}: {re.nextOccurrence}
                                  {re.installmentsCount && re.installmentsCount > 0 && (
                                    <span className="ml-2 text-accent-500">
                                      • {re.installmentsCount} {language === 'en' ? 'Installments' : language === 'pt' ? 'Parcelas' : 'Cuotas'}
                                    </span>
                                  )}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleStartEditExpense(re)}
                              className="p-2 text-zinc-400 hover:text-accent-500 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteExpense(re.id)}
                              className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>

                {/* Recurring Income Management */}
                <section className="space-y-4">
                  <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{language === 'en' ? 'Recurring Income' : language === 'pt' ? 'Receitas Recorrentes' : 'Ingresos Recurrentes'}</h3>
                  <div className="space-y-3">
                    {income.filter(i => i.isRecurring).length === 0 ? (
                      <div className="glass-card p-8 text-center rounded-[32px]">
                        <RefreshCw className="w-8 h-8 text-zinc-200 mx-auto mb-2" />
                        <p className="text-xs text-zinc-400 font-medium">{language === 'en' ? 'No recurring income found' : language === 'pt' ? 'Nenhuma receita recorrente encontrada' : 'No se encontraron ingresos recurrentes'}</p>
                      </div>
                    ) : (
                      income.filter(i => i.isRecurring).map(ri => (
                        <div key={ri.id} className="glass-card p-4 rounded-[32px] flex items-center justify-between group hover:border-zinc-200 dark:hover:border-zinc-700 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500">
                              <RefreshCw className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{ri.source}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-tight">{ri.account}</span>
                                <span className="w-1 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                                <span className="text-[10px] font-bold text-accent-500 uppercase tracking-tight">{ri.frequency}</span>
                                <span className="w-1 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                                <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-tight">{formatCurrency(ri.amount)}</span>
                              </div>
                              {ri.nextOccurrence && (
                                <p className="text-[8px] text-zinc-400 uppercase tracking-widest mt-1 font-bold">
                                  {language === 'en' ? 'Next' : language === 'pt' ? 'Próximo' : 'Próximo'}: {ri.nextOccurrence}
                                  {ri.installmentsCount && ri.installmentsCount > 0 && (
                                    <span className="ml-2 text-accent-500">
                                      • {ri.installmentsCount} {language === 'en' ? 'Installments' : language === 'pt' ? 'Parcelas' : 'Cuotas'}
                                    </span>
                                  )}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleStartEditIncome(ri)}
                              className="p-2 text-zinc-400 hover:text-accent-500 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteIncome(ri.id)}
                              className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>

                {/* App Info */}
                <section className="pt-8 border-t border-zinc-100 dark:border-zinc-800 text-center">
                  <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">SpendWise v1.2.0</p>
                  <p className="text-[8px] text-zinc-400 mt-1">Made with precision</p>
                </section>
              </div>
            )}
              </motion.div>
            </AnimatePresence>
        )}
      </div>
    </main>

      {/* Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 px-6 py-3 rounded-[2.5rem] flex items-center gap-2 shadow-2xl z-40 max-w-[95vw] overflow-x-auto no-scrollbar">
        <NavButton active={activeTab === 'home'} onClick={() => handleTabChange('home')} icon={<LayoutDashboard className="w-5 h-5" />} label={t.home} />
        <NavButton active={activeTab === 'expenses'} onClick={() => handleTabChange('expenses')} icon={<PieChart className="w-5 h-5" />} label={t.exp} />
        <NavButton active={activeTab === 'income'} onClick={() => handleTabChange('income')} icon={<TrendingUp className="w-5 h-5" />} label={t.inc} />
        
        <button
          onClick={() => setIsSelectionModalOpen(true)}
          className="flex flex-col items-center justify-center min-w-[64px] h-12 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl shadow-lg mx-1"
        >
          <Plus className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">Add</span>
        </button>

        <NavButton active={activeTab === 'investments'} onClick={() => handleTabChange('investments')} icon={<LineChart className="w-5 h-5" />} label={t.inv} />
        <NavButton active={activeTab === 'budget'} onClick={() => handleTabChange('budget')} icon={<Target className="w-5 h-5" />} label={t.bud} />
        <NavButton active={activeTab === 'trends'} onClick={() => handleTabChange('trends')} icon={<Activity className="w-5 h-5" />} label={t.tre} />
        <NavButton active={activeTab === 'settings'} onClick={() => handleTabChange('settings')} icon={<Settings className="w-5 h-5" />} label={t.set} />
      </nav>

            

      <AddSelectionModal 
        isOpen={isSelectionModalOpen} 
        onClose={() => setIsSelectionModalOpen(false)} 
        onSelect={(type) => {
          handleTabChange(type);
          handleOpenAddModal();
          setIsSelectionModalOpen(false);
        }}
        t={t}
        language={language}
      />

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isConfirmingDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsConfirmingDelete(false)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800"
            >
              <div className="p-8 space-y-6">
                <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto text-red-500">
                  <Trash2 className="w-8 h-8" />
                </div>
                
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-light tracking-tight text-zinc-900 dark:text-zinc-100">
                    {t.confirmDeleteTitle}
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {deleteTargetType === 'category' ? (language === 'en' ? 'This will delete all subcategories and budgets for this category. Expenses will be moved to "Other".' : language === 'pt' ? 'Isso excluirá todas as subcategorias e orçamentos desta categoria. As despesas serão movidas para "Outros".' : 'Esto eliminará todas las subcategorías y presupuestos de esta categoría. Los gastos se moverán a "Otros".') :
                     deleteTargetType === 'subcategory' ? (language === 'en' ? 'This will delete the budget for this subcategory. Expenses will be moved to "Other".' : language === 'pt' ? 'Isso excluirá o orçamento desta subcategoria. As despesas serão movidas para "Outros".' : 'Esto eliminará el presupuesto de esta subcategoría. Los gastos se moverán a "Otros".') :
                     deleteTargetType === 'account' ? (language === 'en' ? 'Expenses and income from this account will be moved to "Bank".' : language === 'pt' ? 'Despesas e receitas desta conta serão movidas para "Banco".' : 'Los gastos e ingresos de esta cuenta se moverán a "Banco".') :
                     t.confirmDeleteMessage}
                  </p>
                  {deleteTargetName && (
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-2">{deleteTargetName}</p>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setIsConfirmingDelete(false)}
                    className="flex-1 px-6 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                  >
                    {t.cancel}
                  </button>
                  <button
                    onClick={executeDelete}
                    className="flex-1 px-6 py-4 bg-red-500 text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all active:scale-95"
                  >
                    {t.delete}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Pinned Metric Modal */}
      <AnimatePresence>
        {isAddMetricModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddMetricModalOpen(false)}
              className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 shadow-2xl border border-zinc-100 dark:border-zinc-800/50"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-light tracking-tight text-zinc-900 dark:text-zinc-100">
                    {language === 'en' ? 'Add Metric' : language === 'pt' ? 'Adicionar Métrica' : 'Añadir Métrica'}
                  </h2>
                  <p className="text-xs text-zinc-400 font-medium mt-1">
                    {language === 'en' ? 'Pin a new metric to your dashboard' : language === 'pt' ? 'Fixe uma nova métrica no seu painel' : 'Fije una nueva métrica en su panel'}
                  </p>
                </div>
                <button 
                  onClick={() => setIsAddMetricModalOpen(false)}
                  className="w-10 h-10 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Metric Type</label>
                  <select
                    value={metricTypeToAdd}
                    onChange={(e) => setMetricTypeToAdd(e.target.value as any)}
                    className="w-full p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl text-sm font-medium text-zinc-900 dark:text-zinc-100 outline-none border border-transparent focus:border-zinc-200 dark:focus:border-zinc-700 transition-all"
                  >
                    <option value="netWorth">{t.totalBalance}</option>
                    <option value="monthlyIncome">{t.income}</option>
                    <option value="monthlyExpenses">{t.expenses}</option>
                    <option value="savingsRate">{t.savingsRate}</option>
                    <option value="totalInvestments">{t.investments}</option>
                    <option value="category">Category Spending</option>
                  </select>
                </div>

                {metricTypeToAdd === 'category' && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Select Category</label>
                    <select
                      value={metricCategoryToAdd}
                      onChange={(e) => setMetricCategoryToAdd(e.target.value)}
                      className="w-full p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl text-sm font-medium text-zinc-900 dark:text-zinc-100 outline-none border border-transparent focus:border-zinc-200 dark:focus:border-zinc-700 transition-all"
                    >
                      <option value="">-- Select Category --</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                <button
                  onClick={handleAddMetric}
                  disabled={metricTypeToAdd === 'category' && !metricCategoryToAdd}
                  className="w-full py-4 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-2xl text-sm font-bold tracking-wide hover:scale-[0.98] transition-transform disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  {language === 'en' ? 'Add to Dashboard' : language === 'pt' ? 'Adicionar ao Painel' : 'Añadir al Panel'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Manage Categories Modal */}
      <AnimatePresence>
        {isManagingCategories && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsManagingCategories(false)}
              className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 rounded-t-[32px] p-8 z-50 max-w-md mx-auto shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="w-12 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full mx-auto mb-8" />
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-light tracking-tight text-zinc-900 dark:text-zinc-100">
                  {t.manage} {t.categories}
                </h2>
                <button 
                  onClick={() => setIsManagingCategories(false)}
                  className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-8">
                {/* Add Category */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{language === 'en' ? 'New Category' : language === 'pt' ? 'Nova Categoria' : 'Nueva Categoría'}</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder={language === 'en' ? 'Category Name' : language === 'pt' ? 'Nome da Categoria' : 'Nombre de la Categoría'}
                      className="flex-1 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm outline-none border border-transparent focus:border-zinc-200 dark:focus:border-zinc-700 transition-all dark:text-zinc-100"
                    />
                    <button
                      onClick={handleAddCategory}
                      className="p-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all"
                    >
                      <PlusCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Category List */}
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{language === 'en' ? 'Existing Categories' : language === 'pt' ? 'Categorias Existentes' : 'Categorías Existentes'}</label>
                  <div className="space-y-4">
                    {categories.map(cat => (
                      <div key={cat.id} className="space-y-3 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-700">
                        <div className="flex items-center gap-2">
                          {editingCategoryId === cat.id ? (
                            <input
                              autoFocus
                              type="text"
                              value={editingCategoryName}
                              onChange={(e) => setEditingCategoryName(e.target.value)}
                              onBlur={() => handleEditCategory(cat.id, editingCategoryName)}
                              onKeyDown={(e) => e.key === 'Enter' && handleEditCategory(cat.id, editingCategoryName)}
                              className="flex-1 bg-white dark:bg-zinc-900 p-2 rounded-lg text-sm outline-none dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700"
                            />
                          ) : (
                            <span 
                              className="flex-1 text-sm font-bold text-zinc-900 dark:text-zinc-100 cursor-pointer hover:text-accent-500 transition-colors"
                              onClick={() => {
                                setEditingCategoryId(cat.id);
                                setEditingCategoryName(cat.name);
                              }}
                            >
                              {cat.name}
                            </span>
                          )}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                if (editingCategoryId === cat.id) {
                                  handleEditCategory(cat.id, editingCategoryName);
                                } else {
                                  setEditingCategoryId(cat.id);
                                  setEditingCategoryName(cat.name);
                                }
                              }}
                              className={`p-1.5 transition-colors ${editingCategoryId === cat.id ? 'text-accent-500' : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat.id)}
                              className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Subcategories for this category */}
                        <div className="pl-4 space-y-2 border-l-2 border-zinc-200 dark:border-zinc-700">
                          {subcategories.filter(s => s.categoryId === cat.id).map(sub => (
                            <div key={sub.id} className="flex items-center gap-2 p-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800">
                              {editingSubcategoryId === sub.id ? (
                                <input
                                  autoFocus
                                  type="text"
                                  value={editingSubcategoryName}
                                  onChange={(e) => setEditingSubcategoryName(e.target.value)}
                                  onBlur={() => handleEditSubcategory(sub.id, editingSubcategoryName)}
                                  onKeyDown={(e) => e.key === 'Enter' && handleEditSubcategory(sub.id, editingSubcategoryName)}
                                  className="flex-1 bg-transparent text-xs outline-none dark:text-zinc-100"
                                />
                              ) : (
                                <span 
                                  className="flex-1 text-xs text-zinc-600 dark:text-zinc-400 cursor-pointer hover:text-accent-500 transition-colors"
                                  onClick={() => {
                                    setEditingSubcategoryId(sub.id);
                                    setEditingSubcategoryName(sub.name);
                                  }}
                                >
                                  {sub.name}
                                </span>
                              )}
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => {
                                    if (editingSubcategoryId === sub.id) {
                                      handleEditSubcategory(sub.id, editingSubcategoryName);
                                    } else {
                                      setEditingSubcategoryId(sub.id);
                                      setEditingSubcategoryName(sub.name);
                                    }
                                  }}
                                  className={`p-1 transition-colors ${editingSubcategoryId === sub.id ? 'text-accent-500' : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteSubcategory(sub.id)}
                                  className="p-1 text-zinc-400 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                          
                          {/* Add Subcategory Inline */}
                          <div className="flex gap-2 pt-1">
                            <input
                              type="text"
                              placeholder={language === 'en' ? 'Add subcategory...' : language === 'pt' ? 'Adicionar subcategoria...' : 'Añadir subcategoría...'}
                              className="flex-1 p-2 bg-transparent text-xs outline-none border-b border-zinc-200 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-zinc-100 transition-all dark:text-zinc-100"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  const val = (e.target as HTMLInputElement).value;
                                  if (val) {
                                    handleAddSubcategoryWithArgs(cat.id, val);
                                    (e.target as HTMLInputElement).value = '';
                                  }
                                }
                              }}
                              id={`modal-new-sub-${cat.id}`}
                            />
                            <button
                              onClick={() => {
                                const input = document.getElementById(`modal-new-sub-${cat.id}`) as HTMLInputElement;
                                if (input.value) {
                                  handleAddSubcategoryWithArgs(cat.id, input.value);
                                  input.value = '';
                                }
                              }}
                              className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all"
                            >
                              <PlusCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add Subcategory Section at the bottom */}
                <div className="space-y-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    {language === 'en' ? 'Add New Subcategory' : language === 'pt' ? 'Nova Subcategoria' : 'Nueva Subcategoría'}
                  </label>
                  <div className="flex flex-col gap-2">
                    <select
                      value={selectedCategoryIdForSub}
                      onChange={(e) => setSelectedCategoryIdForSub(e.target.value)}
                      className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm outline-none border border-transparent focus:border-zinc-200 dark:focus:border-zinc-700 transition-all dark:text-zinc-100"
                    >
                      <option value="">{language === 'en' ? 'Select Category' : language === 'pt' ? 'Selecionar Categoria' : 'Seleccionar Categoría'}</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newSubcategoryName}
                        onChange={(e) => setNewSubcategoryName(e.target.value)}
                        placeholder={language === 'en' ? 'Subcategory Name' : language === 'pt' ? 'Nome da Subcategoria' : 'Nombre de la Subcategoría'}
                        className="flex-1 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm outline-none border border-transparent focus:border-zinc-200 dark:focus:border-zinc-700 transition-all dark:text-zinc-100"
                      />
                      <button
                        onClick={handleAddSubcategory}
                        disabled={!newSubcategoryName || !selectedCategoryIdForSub}
                        className="p-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <PlusCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Account Modal */}
      <AnimatePresence>
        {editingAccountId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingAccountId(null)}
              className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 rounded-t-[32px] p-8 z-50 max-w-md mx-auto shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full mx-auto mb-8" />
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-light tracking-tight text-zinc-900 dark:text-zinc-100">
                  {editingAccountId === 'new' ? (language === 'en' ? 'New Account' : language === 'pt' ? 'Nova Conta' : 'Nueva Cuenta') : (language === 'en' ? 'Edit Account' : language === 'pt' ? 'Editar Conta' : 'Editar Cuenta')}
                </h2>
                {editingAccountId !== 'new' && (
                  <button 
                    onClick={() => {
                      handleDeleteAccount(editingAccountId);
                      setEditingAccountId(null);
                    }}
                    className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 block">{language === 'en' ? 'Account Name' : language === 'pt' ? 'Nome da Conta' : 'Nombre de la Cuenta'}</label>
                  <input
                    type="text"
                    value={editingAccountName}
                    onChange={(e) => setEditingAccountName(e.target.value)}
                    placeholder={language === 'en' ? 'e.g. Savings, Wallet' : language === 'pt' ? 'ex: Poupança, Carteira' : 'ej: Ahorros, Billetera'}
                    className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm font-medium text-zinc-900 dark:text-zinc-100 outline-none border border-transparent focus:border-zinc-200 dark:focus:border-zinc-700 transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 block">{language === 'en' ? 'Color' : language === 'pt' ? 'Cor' : 'Color'}</label>
                  <div className="flex flex-wrap gap-3">
                    {['#18181b', '#820ad1', '#cc092f', '#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#6366f1'].map(color => (
                      <button
                        key={color}
                        onClick={() => setEditingAccountColor(color)}
                        className={`w-8 h-8 rounded-full transition-all ${editingAccountColor === color ? 'ring-2 ring-offset-2 ring-zinc-900 dark:ring-zinc-100 scale-110' : 'hover:scale-105'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    <input 
                      type="color" 
                      value={editingAccountColor}
                      onChange={(e) => setEditingAccountColor(e.target.value)}
                      className="w-8 h-8 rounded-full overflow-hidden border-none p-0 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setEditingAccountId(null)}
                    className="flex-1 py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-2xl font-semibold transition-all active:scale-[0.98]"
                  >
                    {t.cancel}
                  </button>
                  <button
                    onClick={() => {
                      if (editingAccountId === 'new') {
                        handleAddAccount(editingAccountName, editingAccountColor);
                      } else {
                        handleEditAccount(editingAccountId, editingAccountName, editingAccountColor);
                      }
                      setEditingAccountId(null);
                    }}
                    className="flex-1 py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl font-semibold shadow-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all active:scale-[0.98]"
                  >
                    {t.save}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Update Investment Value Modal */}
      <AnimatePresence>
        {isUpdatingValueModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUpdatingValueModalOpen(false)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800"
            >
              <div className="p-8 space-y-6">
                <header className="space-y-1">
                  <h2 className="text-xl font-light tracking-tight text-zinc-900 dark:text-zinc-100">
                    {language === 'en' ? 'Update Value' : language === 'pt' ? 'Atualizar Valor' : 'Actualizar Valor'}
                  </h2>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    {investments.find(i => i.id === updatingInvestmentId)?.name}
                  </p>
                </header>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">{t.amount}</label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">{currencySymbol}</span>
                      <input
                        type="number"
                        autoFocus
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        className="w-full pl-10 pr-4 py-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl text-lg font-bold text-zinc-900 dark:text-zinc-100 outline-none border border-transparent focus:border-zinc-200 dark:focus:border-zinc-700 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">{t.date}</label>
                    <input
                      type="date"
                      value={updateDate}
                      onChange={(e) => setUpdateDate(e.target.value)}
                      className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl text-sm font-medium text-zinc-900 dark:text-zinc-100 outline-none border border-transparent focus:border-zinc-200 dark:focus:border-zinc-700 transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setIsUpdatingValueModalOpen(false)}
                    className="flex-1 px-6 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                  >
                    {t.cancel}
                  </button>
                  <button
                    onClick={() => updatingInvestmentId && handleUpdateInvestmentValue(updatingInvestmentId, Number(newValue), updateDate)}
                    className="flex-1 px-6 py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-zinc-900/20 dark:shadow-zinc-100/10 hover:opacity-90 transition-all active:scale-95"
                  >
                    {t.save}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Investment History Modal */}
      <AnimatePresence>
        {isHistoryModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsHistoryModalOpen(false)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800"
            >
              <div className="p-8 space-y-6">
                <header className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-xl font-light tracking-tight text-zinc-900 dark:text-zinc-100">
                      {language === 'en' ? 'Investment History' : language === 'pt' ? 'Histórico de Investimento' : 'Historial de Inversión'}
                    </h2>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      {investments.find(i => i.id === updatingInvestmentId)?.name}
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsHistoryModalOpen(false)}
                    className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </header>

                <div className="max-h-[400px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                  {selectedInvestmentHistory.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-sm text-zinc-400">{t.noData}</p>
                    </div>
                  ) : (
                    [...selectedInvestmentHistory].reverse().map((entry, index, arr) => {
                      const nextEntry = arr[index + 1];
                      const diff = nextEntry ? entry.value - nextEntry.value : 0;
                      const percentDiff = nextEntry && nextEntry.value !== 0 ? (diff / nextEntry.value) * 100 : 0;

                      return (
                        <div key={entry.id} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-700/30">
                          <div className="space-y-1">
                            <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{formatCurrency(entry.value)}</p>
                            <p className="text-[10px] text-zinc-400 uppercase tracking-tight font-medium">
                              {new Date(entry.date).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                          {index < arr.length - 1 && (
                            <div className={`text-right ${diff >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                              <p className="text-[10px] font-bold">
                                {diff >= 0 ? '+' : ''}{formatCurrency(diff)}
                              </p>
                              <p className="text-[8px] font-bold uppercase tracking-tight">
                                {diff >= 0 ? '+' : ''}{percentDiff.toFixed(1)}%
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setIsHistoryModalOpen(false)}
                    className="w-full px-6 py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-zinc-900/20 dark:shadow-zinc-100/10 hover:opacity-90 transition-all active:scale-95"
                  >
                    {language === 'en' ? 'Close' : language === 'pt' ? 'Fechar' : 'Cerrar'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Entry Modal */}
      <AnimatePresence>
        {isAdding && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetForm}
              className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 rounded-t-[32px] p-8 z-50 max-w-md mx-auto shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full mx-auto mb-8" />
              <h2 className="text-2xl font-light tracking-tight text-zinc-900 dark:text-zinc-100 mb-8">
                {editingEntryId ? t.edit : (language === 'en' ? 'New' : language === 'pt' ? 'Novo(a)' : 'Nuevo(a)')} {activeTab === 'expenses' || activeTab === 'home' ? t.expenses.slice(0, -1) : activeTab === 'income' ? t.income : activeTab === 'investments' ? t.investments.slice(0, -1) : t.budget}
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 block">
                    {activeTab === 'investments' ? t.initial : t.amount}
                  </label>
                  <div className="relative">
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-3xl font-light text-zinc-300 dark:text-zinc-700">{currencySymbol}</span>
                    <input
                      autoFocus
                      type="text"
                      inputMode="decimal"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className={`w-full pl-8 py-2 text-4xl font-light tracking-tight text-zinc-900 dark:text-zinc-100 border-b ${amountError ? 'border-red-500 focus:border-red-500' : 'border-zinc-100 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-100'} outline-none transition-colors placeholder:text-zinc-100 dark:placeholder:text-zinc-800`}
                      required
                    />
                  </div>
                  {amountError && (
                    <p className="mt-2 text-xs font-medium text-red-500">{amountError}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {activeTab === 'expenses' || activeTab === 'home' || activeTab === 'budget' ? (
                    <>
                      <div className="order-1">
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t.category}</label>
                          <button 
                            type="button"
                            onClick={() => setIsManagingCategories(true)}
                            className="text-[10px] font-bold text-accent-500 uppercase tracking-widest hover:text-accent-600 transition-colors"
                          >
                            {t.manage}
                          </button>
                        </div>
                        <select
                          value={category}
                          onChange={(e) => {
                            const newCatName = e.target.value;
                            setCategory(newCatName);
                            const cat = categories.find(c => c.name === newCatName);
                            if (cat) {
                              const subs = subcategories.filter(s => s.categoryId === cat.id);
                              if (subs.length > 0) setSubcategory(subs[0].name);
                              else setSubcategory('');
                            }
                          }}
                          required
                          className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm font-medium text-zinc-900 dark:text-zinc-100 outline-none border border-transparent focus:border-zinc-200 dark:focus:border-zinc-700 transition-all appearance-none"
                        >
                          {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                        </select>
                      </div>
                      <div className="relative order-2">
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t.subcategory}</label>
                          <button 
                            type="button"
                            onClick={() => setIsAddingSubcategory(!isAddingSubcategory)}
                            className="text-[10px] font-bold text-accent-500 uppercase tracking-widest hover:text-accent-600 transition-colors"
                          >
                            {isAddingSubcategory ? t.cancel : t.addNew}
                          </button>
                        </div>
                        {isAddingSubcategory ? (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={quickSubcategoryName}
                              onChange={(e) => setQuickSubcategoryName(e.target.value)}
                              placeholder={t.new_subcategory_name}
                              className="flex-1 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm font-medium text-zinc-900 dark:text-zinc-100 outline-none border border-transparent focus:border-zinc-200 dark:focus:border-zinc-700 transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={async () => {
                                if (!quickSubcategoryName) return;
                                const cat = categories.find(c => c.name === category);
                                if (cat) {
                                  await handleAddSubcategoryWithArgs(cat.id, quickSubcategoryName);
                                  setSubcategory(quickSubcategoryName);
                                  setQuickSubcategoryName('');
                                  setIsAddingSubcategory(false);
                                }
                              }}
                              className="p-3 bg-accent-500 text-white rounded-xl hover:bg-accent-600 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <select
                            value={subcategory}
                            onChange={(e) => setSubcategory(e.target.value)}
                            className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm font-medium text-zinc-900 dark:text-zinc-100 outline-none border border-transparent focus:border-zinc-200 dark:focus:border-zinc-700 transition-all appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={subcategories.filter(s => s.categoryId === categories.find(c => c.name === category)?.id).length === 0}
                          >
                            {(() => {
                              const relevantSubs = subcategories.filter(s => s.categoryId === categories.find(c => c.name === category)?.id);
                              return relevantSubs.length > 0 ? (
                                relevantSubs.map(sub => <option key={sub.id} value={sub.name}>{sub.name}</option>)
                              ) : (
                                <option value="">No subcategories</option>
                              );
                            })()}
                          </select>
                        )}
                      </div>
                    </>
                  ) : activeTab === 'income' ? (
                    <>
                      <div className="relative z-[60] order-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 block">
                          {language === 'en' ? 'Source' : language === 'pt' ? 'Origem' : 'Origen'}
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={source}
                            onChange={(e) => {
                              setSource(e.target.value);
                              setShowSourceDropdown(true);
                            }}
                            onFocus={() => setShowSourceDropdown(true)}
                            onBlur={() => setTimeout(() => setShowSourceDropdown(false), 200)}
                            placeholder="Salary, Gift..."
                            className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm font-medium text-zinc-900 dark:text-zinc-100 outline-none border border-transparent focus:border-zinc-200 dark:focus:border-zinc-700 transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
                          />
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
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
                { (activeTab === 'expenses' || activeTab === 'home' || activeTab === 'income') && (
                  <div className="mt-4">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 block">TAGS</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tags.map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs rounded flex items-center gap-1 font-medium">
                          {tag}
                          <button type="button" onClick={() => setTags(tags.filter((_, idx) => idx !== i))} className="hover:text-red-500 transition-colors"><X size={12} /></button>
                        </span>
                      ))}
                    </div>
                    <input 
                      type="text" 
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && tagInput.trim()) {
                          if (e) e.preventDefault();
    console.log('handleAddEntry called', activeTab, amount);
                          if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
                          setTagInput('');
                        }
                      }}
                      placeholder="Add a tag and press Enter"
                      className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm font-medium text-zinc-900 dark:text-zinc-100 outline-none border border-transparent focus:border-zinc-200 dark:focus:border-zinc-700 transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
                    />
                  </div>
                )}
                {submitError && (
                  <p className="mt-2 text-xs font-medium text-red-500">{submitError}</p>
                )}
                <button
                  type="button" onClick={handleAddEntry}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl font-semibold shadow-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all active:scale-[0.98] mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? '...' : (editingEntryId ? t.save : t.addEntry)}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: ReactNode, label: string }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all relative group ${active ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}>
      <div className={`p-2 rounded-xl transition-all ${active ? 'bg-zinc-100 dark:bg-zinc-800' : 'group-hover:bg-zinc-100/50 dark:group-hover:bg-zinc-800/30'}`}>
        {icon}
      </div>
      <span className="text-[8px] font-bold uppercase tracking-widest opacity-100">{label}</span>
    </button>
  );
}

function EmptyState({ icon, title }: { icon: ReactNode, title: string }) {
  return (
    <div className="text-center py-32 animate-in fade-in zoom-in duration-1000">
      <div className="w-24 h-24 bg-zinc-50 dark:bg-zinc-900/50 rounded-[3rem] flex items-center justify-center mx-auto mb-8 border border-zinc-100 dark:border-zinc-800/50 shadow-sm">
        <div className="text-zinc-300 dark:text-zinc-700">
          {icon}
        </div>
      </div>
      <h3 className="text-zinc-900 dark:text-zinc-100 font-medium tracking-tight text-xl mb-2">{title}</h3>
      <p className="text-zinc-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">Tap the + button to start tracking</p>
    </div>
  );
}

function DateHeader({ dateStr, total, isIncome = false, formatCurrency }: { dateStr: string, total: number, isIncome?: boolean, formatCurrency: (amount: number) => string }) {
  return (
    <div className="flex justify-between items-end mb-6 px-2">
      <div>
        <h2 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.3em] mb-1">
          {new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' })}
        </h2>
        <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          {new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </p>
      </div>
      <div className="text-right">
        <p className="text-[8px] font-bold text-zinc-300 dark:text-zinc-600 uppercase tracking-widest mb-1">Daily Total</p>
        <span className={`text-sm font-bold tracking-tight ${isIncome ? 'text-emerald-500' : 'text-zinc-900 dark:text-zinc-100'}`}>
          {isIncome ? '+' : ''}{formatCurrency(total)}
        </span>
      </div>
    </div>
  );
}

interface ExpenseItemProps {
  key?: string | number;
  expense: Expense;
  onDelete: (id: string) => Promise<void> | void;
  onEdit: (expense: Expense) => void;
  getAccountIcon: (acc: string) => ReactNode;
  formatCurrency: (amount: number) => string;
  accounts: AccountInfo[];
  language: string;
}

function SpendingTrendChart({ 
  categoryTrendData, 
  subcategoryTrendData, 
  categories, 
  topSubcategories,
  formatCurrency, 
  isDarkMode, 
  language 
}: {
  categoryTrendData: any[];
  subcategoryTrendData: any[];
  categories: string[];
  topSubcategories: string[];
  formatCurrency: (amount: number) => string;
  isDarkMode: boolean;
  language: string;
}) {
  const [view, setView] = useState<'category' | 'subcategory'>('category');
  
  const data = view === 'category' ? categoryTrendData : subcategoryTrendData;
  const keys = view === 'category' ? categories : topSubcategories;

  return (
    <div className="glass-card p-6 rounded-[32px] border border-zinc-100/50 dark:border-zinc-800/30">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h3 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-1">
            {language === 'en' ? 'Spending Trend' : 'Tendência de Gastos'}
          </h3>
          <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            {language === 'en' ? 'Monthly Breakdown' : 'Detalhamento Mensal'}
          </p>
        </div>
        <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
          <button
            onClick={() => setView('category')}
            className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
              view === 'category' 
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm' 
                : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
            }`}
          >
            {language === 'en' ? 'Categories' : 'Categorias'}
          </button>
          <button
            onClick={() => setView('subcategory')}
            className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
              view === 'subcategory' 
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm' 
                : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
            }`}
          >
            {language === 'en' ? 'Subcategories' : 'Subcategorias'}
          </button>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ReBarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#27272a' : '#f4f4f5'} />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 600, fill: isDarkMode ? '#71717a' : '#a1a1aa' }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 600, fill: isDarkMode ? '#71717a' : '#a1a1aa' }}
              tickFormatter={(val) => formatCurrency(val).replace('$', '').replace('R$', '')}
            />
            <Tooltip 
              cursor={{ fill: isDarkMode ? '#18181b' : '#fafafa', opacity: 0.4 }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-4 rounded-2xl shadow-xl">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">{label}</p>
                      <div className="space-y-2">
                        {payload.map((entry: any, index: number) => (
                          <div key={index} className="flex items-center justify-between gap-8">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{entry.name}</span>
                            </div>
                            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{formatCurrency(entry.value)}</span>
                          </div>
                        ))}
                        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-8">
                          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Total</span>
                          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                            {formatCurrency(payload.reduce((sum: number, entry: any) => sum + (entry.value || 0), 0))}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            {keys.map((key, index) => (
              <Bar 
                key={key} 
                dataKey={key} 
                stackId="a" 
                fill={isDarkMode ? CHART_COLORS_DARK[index % CHART_COLORS_DARK.length] : CHART_COLORS[index % CHART_COLORS.length]} 
                radius={index === keys.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
              />
            ))}
          </ReBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ExpenseItem({ expense, onDelete, onEdit, getAccountIcon, formatCurrency, accounts, language }: ExpenseItemProps) {
  const accountColor = accounts.find(a => a.name === expense.account)?.color || '#a1a1aa';

  return (
    <motion.div 
      layout 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 350, damping: 30 }}
      className="group relative bg-white dark:bg-zinc-900/40 p-4 rounded-3xl flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-all border border-zinc-100/50 dark:border-zinc-800/30 hover:shadow-sm"
    >
      <div className="flex items-center gap-4">
        <div 
          className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all group-hover:scale-105"
          style={{ 
            backgroundColor: accountColor + '10', 
            color: accountColor,
            border: `1px solid ${accountColor}20`
          }}
        >
          {getAccountIcon(expense.account)}
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">{expense.description}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="micro-label">{expense.account}</span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className="micro-label">{expense.category}</span>
            {(expense.isRecurring || expense.isInstallment) && (
              <div className="flex items-center gap-1 px-1.5 py-0.5 bg-accent-50/50 dark:bg-accent-900/20 rounded-full">
                <RefreshCw className="w-2 h-2 text-accent-500" />
                <span className="text-[8px] font-bold text-accent-500 uppercase tracking-widest">
                  {expense.isRecurring ? 'Rec' : 'Inst'}
                </span>
              </div>
            )}
            {expense.tags && expense.tags.length > 0 && (
              <>
                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                {expense.tags.map((tag, i) => (
                  <span key={i} className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-[8px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest rounded-sm">
                    {tag}
                  </span>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">-{formatCurrency(expense.amount)}</p>
          {expense.subcategory && (
            <p className="text-[8px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mt-0.5">{expense.subcategory}</p>
          )}
        </div>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all">
          <button onClick={() => onEdit(expense)} className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onDelete(expense.id)} className="p-2 text-zinc-400 hover:text-rose-500 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

interface IncomeItemProps {
  key?: string | number;
  income: Income;
  onDelete: (id: string) => Promise<void> | void;
  onEdit: (income: Income) => void;
  getAccountIcon: (acc: string) => ReactNode;
  formatCurrency: (amount: number) => string;
  accounts: AccountInfo[];
  language: string;
}

function IncomeItem({ income, onDelete, onEdit, getAccountIcon, formatCurrency, accounts, language }: IncomeItemProps) {
  const accountColor = accounts.find(a => a.name === income.account)?.color || '#a1a1aa';

  return (
    <motion.div 
      layout 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 350, damping: 30 }}
      className="group relative bg-white dark:bg-zinc-900/40 p-4 rounded-3xl flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-all border border-zinc-100/50 dark:border-zinc-800/30 hover:shadow-sm"
    >
      <div className="flex items-center gap-4">
        <div 
          className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all group-hover:scale-105"
          style={{ 
            backgroundColor: accountColor + '10', 
            color: accountColor,
            border: `1px solid ${accountColor}20`
          }}
        >
          {getAccountIcon(income.account)}
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">{income.source}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="micro-label">{income.account}</span>
            {income.paymentMethod && (
              <>
                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                <span className="micro-label">{income.paymentMethod}</span>
              </>
            )}
            {income.isRecurring && (
              <>
                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50/50 dark:bg-emerald-900/20 rounded-full">
                  <RefreshCw className="w-2 h-2 text-emerald-500" />
                  <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">
                    {income.frequency}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-bold text-emerald-500 tracking-tight">+{formatCurrency(income.amount)}</p>
          <div className="flex flex-col items-end mt-0.5">
            <p className="text-[8px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">{income.user}</p>
            {income.notes && (
              <p className="text-[8px] font-medium text-zinc-400 dark:text-zinc-500 italic truncate max-w-[120px]">{income.notes}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all">
          <button onClick={() => onEdit(income)} className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onDelete(income.id)} className="p-2 text-zinc-400 hover:text-rose-500 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

interface InvestmentItemProps {
  investment: Investment;
  onDelete: (id: string) => void;
  onEdit: (inv: Investment) => void;
  formatCurrency: (amount: number) => string;
  accounts: AccountInfo[];
  locale: string;
  isUpdating: boolean;
  isDarkMode: boolean;
}

function InvestmentItem({ 
  investment: inv, 
  onDelete, 
  onEdit, 
  formatCurrency, 
  accounts, 
  locale, 
  isUpdating,
  isDarkMode
}: InvestmentItemProps) {
  const startDate = new Date(inv.date).getTime();
  const targetDate = inv.targetDate ? new Date(inv.targetDate).getTime() : 0;
  const today = new Date().getTime();
  const totalTime = targetDate - startDate;
  const timeElapsed = today - startDate;
  const timeProgress = totalTime > 0 ? Math.max(0, Math.min(1, timeElapsed / totalTime)) : 0;
  const amountProgress = inv.targetAmount && inv.targetAmount > 0 ? Math.max(0, Math.min(1, inv.currentValue / inv.targetAmount)) : 0;
  const accountColor = accounts.find(a => a.name === inv.account)?.color || '#cbd5e1';

  return (
    <motion.div 
      layout 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-zinc-900/40 p-6 rounded-[2.5rem] border border-zinc-100/50 dark:border-zinc-800/30 relative group/inv hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-all hover:shadow-sm"
    >
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 bg-zinc-900 dark:bg-zinc-100 rounded-2xl flex items-center justify-center text-white dark:text-zinc-900 shadow-xl group-hover/inv:scale-105 transition-transform">
            <LineChart className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 tracking-tight">{inv.name}</h3>
              {inv.symbol && (
                <span className="text-[9px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded-full uppercase tracking-widest">
                  {inv.symbol}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accountColor }} />
                <span className="micro-label">{inv.account}</span>
              </div>
              <span className="text-zinc-200 dark:text-zinc-800">•</span>
              <span className="micro-label">{new Date(inv.date).toLocaleDateString(locale, { month: 'short', year: 'numeric' })}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover/inv:opacity-100 transition-all">
          <button onClick={() => onEdit(inv)} className="p-2.5 text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(inv.id)} className="p-2.5 text-zinc-300 hover:text-rose-500 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="space-y-1">
          <p className="micro-label">Current Value</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tighter">{formatCurrency(inv.currentValue)}</p>
        </div>
        <div className="space-y-1">
          <p className="micro-label">Profit / Loss</p>
          <p className={`text-2xl font-bold tracking-tighter ${inv.currentValue >= inv.initialAmount ? 'text-emerald-500' : 'text-rose-500'}`}>
            {inv.currentValue >= inv.initialAmount ? '+' : ''}{formatCurrency(inv.currentValue - inv.initialAmount)}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="micro-label">Growth</span>
            <span className={`text-[10px] font-bold ${inv.currentValue >= inv.initialAmount ? 'text-emerald-500' : 'text-rose-500'}`}>
              {((inv.currentValue / inv.initialAmount - 1) * 100).toFixed(2)}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, Math.max(0, (inv.currentValue / inv.initialAmount) * 50))}%` }}
              className={`h-full rounded-full ${inv.currentValue >= inv.initialAmount ? 'bg-emerald-500' : 'bg-rose-500'}`}
            />
          </div>
        </div>

        {inv.targetAmount && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="micro-label">Target Progress</span>
              <span className="text-[10px] font-bold text-zinc-900 dark:text-zinc-100">
                {Math.round(amountProgress * 100)}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${amountProgress * 100}%` }}
                className="h-full bg-accent-500 rounded-full"
              />
            </div>
          </div>
        )}

        {inv.targetDate && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="micro-label">Time Progress</span>
              <span className="text-[10px] font-bold text-zinc-900 dark:text-zinc-100">
                {Math.round(timeProgress * 100)}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${timeProgress * 100}%` }}
                className={`h-full rounded-full ${timeProgress >= 1 ? 'bg-rose-500' : 'bg-zinc-300 dark:bg-zinc-600'}`}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function AddSelectionModal({ isOpen, onClose, onSelect, t, language }: { isOpen: boolean, onClose: () => void, onSelect: (type: Tab) => void, t: any, language: string }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800"
        >
          <div className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                {language === 'en' ? 'Add New' : language === 'pt' ? 'Adicionar Novo' : 'Añadir Nuevo'}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {language === 'en' ? 'What would you like to record?' : language === 'pt' ? 'O que você gostaria de registrar?' : '¿Qué te gostaria registrar?'}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => onSelect('expenses')}
                className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all group border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
              >
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                  <PieChart className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-zinc-900 dark:text-zinc-100">{t.expenses}</p>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">{language === 'en' ? 'Money Out' : 'Saída'}</p>
                </div>
              </button>

              <button
                onClick={() => onSelect('income')}
                className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all group border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-zinc-900 dark:text-zinc-100">{t.income}</p>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">{language === 'en' ? 'Money In' : 'Entrada'}</p>
                </div>
              </button>

              <button
                onClick={() => onSelect('investments')}
                className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all group border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                  <LineChart className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-zinc-900 dark:text-zinc-100">{t.investments}</p>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">{language === 'en' ? 'Assets' : 'Ativos'}</p>
                </div>
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full p-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-2xl font-bold text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              {language === 'en' ? 'Cancel' : 'Cancelar'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
