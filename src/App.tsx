/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, FormEvent, ReactNode, DragEvent } from 'react';
import { Plus, Trash2, Edit2, Wallet, CreditCard, Banknote, Calendar, Tag, ChevronRight, ChevronLeft, PieChart, ArrowUpRight, ArrowDownLeft, TrendingUp, Target, List, LineChart, Settings, PlusCircle, Activity, Bell, AlertTriangle, X, Search, Filter, Home, Sun, Moon, ChevronDown, Check, RefreshCw, Palette, LayoutDashboard, User, Sparkles, Lightbulb, Pin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { InvestmentWizard } from './components/InvestmentWizard';
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
    insightsSummary: 'Deep dive into your financial trends and patterns.',
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
    budgetWizard: "Budget Wizard",
    wizardStep1: "Monthly Income",
    wizardStep2: "Choose Framework",
    wizardStep3: "Assign Categories",
    wizardStep4: "Review & Apply",
    wizardIncomeLabel: "What is your total monthly income?",
    wizardFrameworkLabel: "Select a budgeting framework",
    wizardAssignLabel: "Assign each category to a bucket",
    wizardApply: "Apply Budget",
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
    insightsSummary: 'Mergulhe nas suas tendências e padrões financeiros.',
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
    budgetWizard: "Assistente de Orçamento",
    wizardStep1: "Renda Mensal",
    wizardStep2: "Escolher Framework",
    wizardStep3: "Atribuir Categorias",
    wizardStep4: "Revisar e Aplicar",
    wizardIncomeLabel: "Qual é a sua renda mensal total?",
    wizardFrameworkLabel: "Selecione um framework de orçamento",
    wizardAssignLabel: "Atribua cada categoria a um grupo",
    wizardApply: "Aplicar Orçamento",
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
    insightsSummary: 'Profundice en suas tendencias y patrones financieros.',
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
    budgetWizard: "Asistente de Presupuesto",
    wizardStep1: "Ingreso Mensual",
    wizardStep2: "Elegir Framework",
    wizardStep3: "Asignar Categorías",
    wizardStep4: "Revisar y Aplicar",
    wizardIncomeLabel: "¿Cuál es su ingreso mensual total?",
    wizardFrameworkLabel: "Seleccione un marco de presupuesto",
    wizardAssignLabel: "Asigne cada categoría a un grupo",
    wizardApply: "Aplicar Presupuesto",
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

  // Gemini AI Insights State
  const [aiInsights, setAiInsights] = useState<{
    summary: string;
    savingsRateAnalysis: string;
    tips: {
      title: string;
      description: string;
      category: string;
      estimatedSavings: string;
    }[];
  } | null>(null);
  const [aiInsightsLoading, setAiInsightsLoading] = useState(false);
  const [aiInsightsError, setAiInsightsError] = useState<string | null>(null);
  const [checkedTips, setCheckedTips] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('financier_checked_tips');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('financier_checked_tips', JSON.stringify(checkedTips));
    } catch (err) {
      console.error(err);
    }
  }, [checkedTips]);

  // Form state
  const [amount, setAmount] = useState('');
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
  const [suggestedCategory, setSuggestedCategory] = useState<{category: string, subcategory: string} | null>(null);
  const [investmentTargetAmount, setInvestmentTargetAmount] = useState('');
  const [investmentTargetDate, setInvestmentTargetDate] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<Frequency>('Monthly');
  const [isInstallment, setIsInstallment] = useState(false);
  const [installmentsCount, setInstallmentsCount] = useState('1');
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
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterSubcategory, setFilterSubcategory] = useState('All');
  const [filterAccount, setFilterAccount] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showRecurringOnly, setShowRecurringOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [selectedPattern, setSelectedPattern] = useState<{name: string, desc: string, p: number[], buckets: string[]} | null>(null);
  const [isBudgetWizardOpen, setIsBudgetWizardOpen] = useState(false);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardIncome, setWizardIncome] = useState('');
  const [wizardCategoryAssignments, setWizardCategoryAssignments] = useState<Record<string, string>>({});
  const [wizardCustomAmounts, setWizardCustomAmounts] = useState<Record<string, string>>({});
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

  const fetchAiInsights = async (force = false) => {
    if (!force && aiInsights) return;
    setAiInsightsLoading(true);
    setAiInsightsError(null);
    try {
      const res = await fetch('/api/gemini/insights');
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || errData.error || `Server returned status ${res.status}`);
      }
      const data = await res.json();
      setAiInsights(data);
      try {
        localStorage.setItem('financier_ai_insights', JSON.stringify(data));
      } catch (err) {
        console.error('Failed to save AI insights to localStorage', err);
      }
    } catch (err: any) {
      console.error('Failed to fetch AI insights:', err);
      setAiInsightsError(err.message || 'An error occurred while generating insights.');
    } finally {
      setAiInsightsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'home' && !aiInsights && !aiInsightsLoading && !aiInsightsError) {
      fetchAiInsights();
    }
  }, [activeTab]);

  useEffect(() => {
    if (description.length >= 3) {
      const match = expenses.find(e => e.description.toLowerCase().includes(description.toLowerCase()));
      if (match) {
        setSuggestedCategory({ category: match.category, subcategory: match.subcategory || '' });
      } else {
        setSuggestedCategory(null);
      }
    } else {
      setSuggestedCategory(null);
    }
  }, [description, expenses]);

  const handleSymbolChange = (value: string) => {
    const upperValue = value.toUpperCase();
    setInvestmentSymbol(upperValue);
    
    if (upperValue.length > 0) {
      const filtered = COMMON_SYMBOLS.filter(s => 
        s.symbol.startsWith(upperValue) || 
        s.name.toLowerCase().includes(value.toLowerCase())
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
    setIsAdding(true);
  };

  const handleAddEntry = async (e: FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;

    if (activeTab === 'expenses' || activeTab === 'home') {
      const expenseData = {
        amount: Number(amount),
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
      };

      try {
        const url = editingEntryId ? `/api/expenses/${editingEntryId}` : '/api/expenses';
        const method = editingEntryId ? 'PUT' : 'POST';
        
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingEntryId ? expenseData : { ...expenseData, id: crypto.randomUUID() }),
        });
        if (res.ok) {
          await fetchAllData();
          resetForm();
        }
      } catch (err) {
        console.error('Failed to save expense', err);
      }
    } else if (activeTab === 'income') {
      const incomeData = {
        amount: Number(amount),
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
      };

      try {
        const url = editingEntryId ? `/api/income/${editingEntryId}` : '/api/income';
        const method = editingEntryId ? 'PUT' : 'POST';

        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingEntryId ? incomeData : { ...incomeData, id: crypto.randomUUID() }),
        });
        if (res.ok) {
          await fetchAllData();
          resetForm();
        }
      } catch (err) {
        console.error('Failed to save income', err);
      }
    } else if (activeTab === 'investments') {
      const investmentData = {
        name: investmentName || 'New Investment',
        symbol: investmentSymbol || null,
        initialAmount: Number(amount),
        currentValue: Number(amount), // Default current value to initial amount
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
          body: JSON.stringify(editingEntryId ? investmentData : { ...investmentData, id: crypto.randomUUID() }),
        });
        if (res.ok) {
          await fetchAllData();
          resetForm();
        }
      } catch (err) {
        console.error('Failed to save investment', err);
      }
    } else if (activeTab === 'budget') {
      try {
        await handleUpdateBudget(category, subcategory, Number(amount));
        resetForm();
      } catch (err) {
        console.error('Failed to update budget', err);
      }
    }
  };

  const resetForm = () => {
    setIsAdding(false);
    setIsAddingSubcategory(false);
    setQuickSubcategoryName('');
    setEditingEntryId(null);
    setAmount('');
    setCategory('');
    setSubcategory('');
    setDescription('');
    setSource('');
    setNotes('');
    setPaymentMethod('');
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

  const fetchLivePrice = async (id: string, symbol: string) => {
    if (!symbol) return;
    
    setUpdatingInvestments(prev => ({ ...prev, [id]: true }));
    
    try {
      const response = await fetch('/api/gemini/live-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, currency })
      });
      const data = await response.json();
      
      if (data.price && data.price > 0) {
        await handleUpdateInvestmentValue(id, data.price);
      }
    } catch (err) {
      console.error('Failed to fetch live price', err);
    } finally {
      setUpdatingInvestments(prev => ({ ...prev, [id]: false }));
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
    e.preventDefault();
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
      const matchesSearch = e.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           e.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (e.subcategory && e.subcategory.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = filterCategory === 'All' || e.category === filterCategory;
      const matchesSubcategory = filterSubcategory === 'All' || e.subcategory === filterSubcategory;
      const matchesAccount = filterAccount === 'All' || e.account === filterAccount;
      const matchesDate = (!startDate || e.date >= startDate) && (!endDate || e.date <= endDate);
      const matchesRecurring = !showRecurringOnly || e.isRecurring;
      return matchesSearch && matchesCategory && matchesSubcategory && matchesAccount && matchesDate && matchesRecurring;
    });

    const groups: Record<string, Expense[]> = {};
    filtered.forEach(e => {
      if (!groups[e.date]) groups[e.date] = [];
      groups[e.date].push(e);
    });
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [expenses, searchTerm, filterCategory, filterSubcategory, filterAccount, startDate, endDate, showRecurringOnly]);

  const groupedIncome = useMemo(() => {
    const filtered = income.filter(i => {
      const matchesSearch = i.source.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'All'; // Income doesn't have categories in the same way, but we could filter by source if we wanted. For now, just search.
      const matchesAccount = filterAccount === 'All' || i.account === filterAccount;
      const matchesDate = (!startDate || i.date >= startDate) && (!endDate || i.date <= endDate);
      return matchesSearch && matchesCategory && matchesAccount && matchesDate;
    });

    const groups: Record<string, Income[]> = {};
    filtered.forEach(i => {
      if (!groups[i.date]) groups[i.date] = [];
      groups[i.date].push(i);
    });
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [income, searchTerm, filterCategory, filterAccount, startDate, endDate]);

  const getAccountIcon = (accName: Account) => {
    const acc = accounts.find(a => a.name === accName);
    return <Wallet className="w-4 h-4" style={{ color: acc?.color }} />;
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setSearchTerm('');
    setFilterCategory('All');
    setStartDate('');
    setEndDate('');
    setShowFilters(false);
    
    if (tab === 'investments') {
      investments.forEach(inv => {
        if (inv.symbol) {
          fetchLivePrice(inv.id, inv.symbol);
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
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setHeroMonthOffset(prev => prev - 1)}
                            className="p-1 -ml-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <h2 className="text-sm font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest min-w-[120px] text-center">
                            {(() => {
                              const d = new Date();
                              d.setMonth(d.getMonth() + heroMonthOffset);
                              return `${d.toLocaleDateString('en-US', { month: 'long' })}/${d.getFullYear().toString().slice(-2)}`;
                            })()}
                          </h2>
                          <button 
                            onClick={() => setHeroMonthOffset(prev => prev + 1)}
                            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-baseline gap-2 mt-1">
                          <p className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                            {formatCurrency(stats.monthlyNetBalance)}
                          </p>
                        </div>
                      </div>
                      <div className="hidden sm:flex flex-col items-end">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{language === 'en' ? 'Budget Used' : language === 'pt' ? 'Orçamento Usado' : 'Presupuesto Usado'}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.max(0, Math.min(100, stats.totalBudget > 0 ? (stats.monthlyExpenses / stats.totalBudget) * 100 : 0))}%` }}
                              className={`h-full ${stats.monthlyExpenses > stats.totalBudget ? 'bg-rose-500' : 'bg-accent-500'}`}
                            />
                          </div>
                          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{stats.totalBudget > 0 ? Math.round((stats.monthlyExpenses / stats.totalBudget) * 100) : 0}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 flex-1">
                      <div className="glass-card p-4 sm:p-5 group flex items-center justify-between">
                        <span className="micro-label !text-emerald-500">{t.income}</span>
                        <div className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 leading-none">{formatCurrency(stats.monthlyIncome)}</div>
                      </div>

                      <div className="glass-card p-4 sm:p-5 group flex items-center justify-between">
                        <span className="micro-label !text-rose-500">{t.expenses}</span>
                        <div className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 leading-none">{formatCurrency(stats.monthlyExpenses)}</div>
                      </div>

                      <div className="glass-card p-4 sm:p-5 group flex items-center justify-between">
                        <span className="micro-label !text-blue-500">{t.investments}</span>
                        <div className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 leading-none">{formatCurrency(stats.monthlyInvestments)}</div>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Pinned Metrics */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest flex items-center gap-2">
                      <Pin className="w-4 h-4 text-zinc-400" />
                      {language === 'en' ? 'Pinned Metrics' : language === 'pt' ? 'Métricas Fixadas' : 'Métricas Fijadas'}
                    </h3>
                    <button 
                      onClick={() => setIsAddMetricModalOpen(true)}
                      className="text-[10px] font-bold text-accent-500 hover:text-accent-600 uppercase tracking-widest transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      {t.addNew}
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {pinnedMetrics.map((metric, index) => {
                      let title = '';
                      let value = '';
                      let colorClass = 'text-zinc-900 dark:text-zinc-100';
                      let bgClass = 'bg-white dark:bg-zinc-900/50';
                      let icon = <LineChart className="w-4 h-4" />;
                      
                      if (metric.type === 'netWorth') {
                        title = t.totalBalance;
                        value = formatCurrency(stats.netBalance + stats.totalInvestments);
                        icon = <Wallet className="w-4 h-4" />;
                      } else if (metric.type === 'monthlyIncome') {
                        title = t.income;
                        value = formatCurrency(stats.monthlyIncome);
                        colorClass = 'text-emerald-500';
                        icon = <ArrowUpRight className="w-4 h-4" />;
                      } else if (metric.type === 'monthlyExpenses') {
                        title = t.expenses;
                        value = formatCurrency(stats.monthlyExpenses);
                        colorClass = 'text-rose-500';
                        icon = <ArrowDownLeft className="w-4 h-4" />;
                      } else if (metric.type === 'savingsRate') {
                        title = t.savingsRate;
                        value = `${Math.round(stats.savingsRate)}%`;
                        colorClass = 'text-amber-500';
                        icon = <Target className="w-4 h-4" />;
                      } else if (metric.type === 'totalInvestments') {
                        title = t.investments;
                        value = formatCurrency(stats.totalInvestments);
                        colorClass = 'text-accent-500';
                        icon = <TrendingUp className="w-4 h-4" />;
                      } else if (metric.type === 'category' && metric.categoryId) {
                        title = metric.categoryId;
                        value = formatCurrency(stats.monthlySpendingByCategory[metric.categoryId] || 0);
                        icon = <PieChart className="w-4 h-4" />;
                      }

                      return (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          key={metric.id}
                          draggable
                          onDragStart={(e) => handleDragStartMetric(e, index)}
                          onDragOver={(e) => handleDragOverMetric(e, index)}
                          onDragEnd={handleDragEndMetric}
                          className={`p-5 rounded-[2rem] border border-zinc-100 dark:border-zinc-800/50 shadow-sm cursor-grab active:cursor-grabbing relative group transition-all ${bgClass} ${draggedMetricIndex === index ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className={`w-8 h-8 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center ${colorClass}`}>
                              {icon}
                            </div>
                            <button 
                              onClick={() => handleRemoveMetric(metric.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-rose-500 transition-all rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest truncate">{title}</p>
                          <p className={`text-xl font-bold tracking-tight mt-1 truncate ${colorClass}`}>{value}</p>
                        </motion.div>
                      );
                    })}
                    {pinnedMetrics.length === 0 && (
                      <div className="col-span-2 sm:col-span-4 p-8 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2rem] text-center">
                        <p className="text-xs font-medium text-zinc-400">
                          {language === 'en' ? 'No metrics pinned. Pin your most important numbers here.' : language === 'pt' ? 'Nenhuma métrica fixada. Fixe seus números mais importantes aqui.' : 'No hay métricas fijadas. Fije sus números más importantes aquí.'}
                        </p>
                      </div>
                    )}
                  </div>
                </section>

                {/* Main Dashboard Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  {/* Left Column: Breakdown & Budgets */}
                  <div className="lg:col-span-2 space-y-12">
                    {/* Net Worth Trend Chart */}
                    <section className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">
                            {language === 'en' ? 'Net Worth Trend' : language === 'pt' ? 'Tendência do Patrimônio Líquido' : 'Tendencia del Patrimonio Neto'}
                          </h3>
                          <p className="text-[10px] text-zinc-400 font-medium mt-1 uppercase tracking-tight">
                            {language === 'en' ? 'Last 6 Months Progress' : language === 'pt' ? 'Progresso nos últimos 6 meses' : 'Progreso en los últimos 6 meses'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="glass-card p-6 rounded-[2.5rem] h-80 bg-white dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/50 shadow-sm relative overflow-hidden">
                        <ResponsiveContainer width="100%" height="100%">
                          <ComposedChart data={netWorthTrend}>
                            <defs>
                              <linearGradient id="netWorthGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={accentColor} stopOpacity={0.2}/>
                                <stop offset="95%" stopColor={accentColor} stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#27272a' : '#f4f4f5'} />
                            <XAxis 
                              dataKey="month" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fontSize: 10, fill: '#a1a1aa' }} 
                            />
                            <YAxis 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fontSize: 10, fill: '#a1a1aa' }}
                              tickFormatter={(value) => `${currencySymbol}${value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value}`}
                            />
                            <Tooltip 
                              cursor={{ fill: isDarkMode ? '#27272a' : '#f4f4f5', opacity: 0.4 }}
                              contentStyle={{ 
                                backgroundColor: isDarkMode ? '#18181b' : '#fff', 
                                borderRadius: '16px', 
                                border: 'none', 
                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                color: isDarkMode ? '#fff' : '#000'
                              }}
                              itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                              formatter={(value: number) => [formatCurrency(value), language === 'en' ? 'Net Worth' : language === 'pt' ? 'Patrimônio Líquido' : 'Patrimonio Neto']}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="netWorth" 
                              stroke="none" 
                              fill="url(#netWorthGrad)" 
                            />
                            <Line 
                              type="monotone" 
                              dataKey="netWorth" 
                              stroke={accentColor} 
                              strokeWidth={3}
                              dot={{ r: 4, fill: accentColor, strokeWidth: 0 }}
                              activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                          </ComposedChart>
                        </ResponsiveContainer>
                      </div>
                    </section>

                    {/* Gemini AI Spending Insights */}
                    <section className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                            {language === 'en' ? 'AI Spending Insights' : language === 'pt' ? 'Análise de Gastos IA' : 'Análisis de Gastos de IA'}
                          </h3>
                          <p className="text-[10px] text-zinc-400 font-medium mt-1 uppercase tracking-tight">
                            {language === 'en' ? 'Powered by Gemini 3.5 Flash' : language === 'pt' ? 'Alimentado por Gemini 3.5 Flash' : 'Desarrollado por Gemini 3.5 Flash'}
                          </p>
                        </div>
                        {aiInsights && !aiInsightsLoading && (
                          <button
                            onClick={() => fetchAiInsights(true)}
                            disabled={aiInsightsLoading}
                            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all disabled:opacity-50 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${aiInsightsLoading ? 'animate-spin' : ''}`} />
                            {language === 'en' ? 'Refresh' : language === 'pt' ? 'Atualizar' : 'Actualizar'}
                          </button>
                        )}
                      </div>

                      {aiInsightsLoading ? (
                        <div className="glass-card p-8 rounded-[2.5rem] bg-white dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/50 shadow-sm relative overflow-hidden space-y-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                              <Sparkles className="w-6 h-6 animate-spin" />
                            </div>
                            <div className="flex-1 space-y-2">
                              <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded-full w-1/3 animate-pulse" />
                              <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full w-2/3 animate-pulse" />
                            </div>
                          </div>
                          
                          <div className="space-y-3 pt-4 border-t border-zinc-100/50 dark:border-zinc-800/30">
                            <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest animate-pulse flex items-center gap-2">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                              {language === 'en' ? 'Analyzing spending trends...' : language === 'pt' ? 'Analisando tendências de gastos...' : 'Analizando tendencias de gastos...'}
                            </p>
                            <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full w-full animate-pulse" />
                            <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full w-5/6 animate-pulse" />
                            <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full w-4/5 animate-pulse" />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                            {[1, 2, 3].map((n) => (
                              <div key={n} className="p-5 border border-zinc-100 dark:border-zinc-800/50 rounded-2xl space-y-3 bg-zinc-50/20 dark:bg-zinc-900/10">
                                <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full w-1/2 animate-pulse" />
                                <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full w-full animate-pulse" />
                                <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full w-3/4 animate-pulse" />
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : aiInsightsError ? (
                        <div className="glass-card p-8 rounded-[2.5rem] bg-white dark:bg-zinc-900/30 border border-rose-100 dark:border-rose-950/30 shadow-sm relative overflow-hidden text-center space-y-4">
                          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center text-rose-500 mx-auto">
                            <AlertTriangle className="w-6 h-6" />
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                              {language === 'en' ? 'Unable to Generate Insights' : language === 'pt' ? 'Não foi possível gerar análises' : 'No se pudieron generar análisis'}
                            </h4>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
                              {aiInsightsError}
                            </p>
                          </div>
                          <button
                            onClick={() => fetchAiInsights(true)}
                            className="px-6 py-2.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-xl text-xs font-bold hover:scale-105 transition-all shadow-md"
                          >
                            {language === 'en' ? 'Configure & Retry' : language === 'pt' ? 'Configurar e Tentar Novamente' : 'Configurar y Reintentar'}
                          </button>
                        </div>
                      ) : aiInsights ? (
                        <motion.div 
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          className="glass-card p-8 rounded-[2.5rem] bg-white dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/50 shadow-sm relative overflow-hidden space-y-6"
                        >
                          {/* Summary & Analysis Header */}
                          <div className="space-y-4">
                            <div className="p-5 bg-zinc-50/50 dark:bg-zinc-900/20 rounded-3xl border border-zinc-100/50 dark:border-zinc-800/20">
                              <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 leading-relaxed">
                                "{aiInsights.summary}"
                              </p>
                            </div>
                            <div className="flex items-start gap-3 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed px-1">
                              <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                              <p>{aiInsights.savingsRateAnalysis}</p>
                            </div>
                          </div>

                          {/* 3 Actionable Tips */}
                          <div className="space-y-4 pt-4 border-t border-zinc-100/50 dark:border-zinc-800/30">
                            <h4 className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                              {language === 'en' ? '3 Tailored Savings Recommendations' : language === 'pt' ? '3 Recomendações de Economia Personalizadas' : '3 Recomendaciones de Ahorro Personalizadas'}
                            </h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {aiInsights.tips.map((tip, index) => {
                                const isChecked = checkedTips.includes(tip.title);
                                return (
                                  <div 
                                    key={tip.title} 
                                    className={`p-6 border rounded-3xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                                      isChecked 
                                        ? 'bg-emerald-500/5 border-emerald-500/30 shadow-none scale-98 opacity-80' 
                                        : 'bg-white dark:bg-zinc-900/20 border-zinc-100 dark:border-zinc-800/50 hover:border-zinc-200 dark:hover:border-zinc-700 shadow-sm'
                                    }`}
                                  >
                                    <div className="space-y-4">
                                      {/* Header with Checkbox and Badge */}
                                      <div className="flex justify-between items-start gap-2">
                                        <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-full">
                                          {tip.category}
                                        </span>
                                        <button 
                                          onClick={() => {
                                            if (isChecked) {
                                              setCheckedTips(checkedTips.filter(t => t !== tip.title));
                                            } else {
                                              setCheckedTips([...checkedTips, tip.title]);
                                            }
                                          }}
                                          className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                                            isChecked 
                                              ? 'bg-emerald-500 border-emerald-500 text-white' 
                                              : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 text-transparent'
                                          }`}
                                        >
                                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                                        </button>
                                      </div>

                                      {/* Content */}
                                      <div className="space-y-2">
                                        <h5 className={`text-xs font-bold leading-tight ${isChecked ? 'line-through text-zinc-400 dark:text-zinc-600' : 'text-zinc-900 dark:text-zinc-100'}`}>
                                          {tip.title}
                                        </h5>
                                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                          {tip.description}
                                        </p>
                                      </div>
                                    </div>

                                    {/* Savings Tag */}
                                    <div className="mt-4 pt-3 border-t border-zinc-100/50 dark:border-zinc-800/30 flex justify-between items-center">
                                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                                        {language === 'en' ? 'Monthly savings' : language === 'pt' ? 'Economia mensal' : 'Ahorro mensual'}
                                      </span>
                                      <span className="text-xs font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-lg">
                                        {tip.estimatedSavings}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Success state bar */}
                          {checkedTips.length > 0 && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between"
                            >
                              <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                {language === 'en' 
                                  ? `Awesome! You have implemented ${checkedTips.length} of 3 recommendations.` 
                                  : language === 'pt' 
                                  ? `Incrível! Você implementou ${checkedTips.length} de 3 recomendações.` 
                                  : `¡Excelente! Has implementado ${checkedTips.length} de 3 recomendaciones.`}
                              </p>
                              <button 
                                onClick={() => setCheckedTips([])}
                                className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest hover:underline"
                              >
                                {language === 'en' ? 'Reset' : language === 'pt' ? 'Reiniciar' : 'Reiniciar'}
                              </button>
                            </motion.div>
                          )}
                        </motion.div>
                      ) : (
                        <div className="glass-card p-8 rounded-[2.5rem] bg-white dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/50 shadow-sm relative overflow-hidden text-center space-y-4">
                          <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 dark:text-zinc-600 mx-auto">
                            <Sparkles className="w-6 h-6" />
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                              {language === 'en' ? 'AI Spending Insights' : language === 'pt' ? 'Análise de Gastos de IA' : 'Análisis de Gastos de IA'}
                            </h4>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                              {language === 'en' 
                                ? 'Get a detailed, customized analysis of your transactions and find hidden savings opportunities.' 
                                : language === 'pt' 
                                ? 'Obtenha uma análise detalhada e personalizada das suas transações e encontre oportunidades ocultas de economia.' 
                                : 'Obtenga un análisis detallado y personalizado de sus transacciones y encuentre oportunidades ocultas de ahorro.'}
                            </p>
                          </div>
                          <button
                            onClick={() => fetchAiInsights(true)}
                            className="px-6 py-2.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-xl text-xs font-bold hover:scale-105 transition-all shadow-md"
                          >
                            {language === 'en' ? 'Generate Analysis' : language === 'pt' ? 'Gerar Análise' : 'Generar Análisis'}
                          </button>
                        </div>
                      )}
                    </section>

                    {/* Monthly Breakdown */}
                    <section className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">{t.spendingByCategory}</h3>
                        <button onClick={() => handleTabChange('expenses')} className="text-[10px] font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 uppercase tracking-widest transition-colors">
                          {t.viewAll}
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {(Object.entries(stats.monthlySpendingByCategory) as [string, number][])
                          .sort(([, a], [, b]) => b - a)
                          .slice(0, 4)
                          .map(([catName, amount]) => {
                            const percentage = stats.monthlyExpenses > 0 ? (amount / stats.monthlyExpenses) * 100 : 0;
                            return (
                              <div key={catName} className="space-y-3">
                                <div className="flex justify-between items-end">
                                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{catName}</p>
                                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{formatCurrency(amount)}</p>
                                </div>
                                <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    className="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full"
                                  />
                                </div>
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">{percentage.toFixed(1)}% of total</p>
                              </div>
                            );
                          })}
                        {Object.keys(stats.monthlySpendingByCategory).length === 0 && (
                          <div className="col-span-2 py-12 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
                            <p className="text-xs text-zinc-400 font-medium">{t.noData}</p>
                          </div>
                        )}
                      </div>
                    </section>

                    {/* Budget Progress */}
                    <section className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">{t.budget}</h3>
                        <button onClick={() => handleTabChange('budget')} className="text-[10px] font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 uppercase tracking-widest transition-colors">
                          {t.manage}
                        </button>
                      </div>
                      <div className="p-6 bg-white dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/50 rounded-[2rem] shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                          <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{language === 'en' ? 'Overall Budget' : language === 'pt' ? 'Orçamento Geral' : 'Presupuesto General'}</span>
                          <span className={`text-xs font-black px-3 py-1 rounded-full ${stats.monthlyExpenses > stats.totalBudget && stats.totalBudget > 0 ? 'bg-rose-50 text-rose-500 dark:bg-rose-900/20' : 'bg-zinc-50 text-zinc-500 dark:bg-zinc-800'}`}>
                            {stats.totalBudget > 0 ? Math.round((stats.monthlyExpenses / stats.totalBudget) * 100) : 0}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mb-4">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${stats.totalBudget > 0 ? Math.min((stats.monthlyExpenses / stats.totalBudget) * 100, 100) : 0}%` }}
                            className={`h-full rounded-full ${stats.monthlyExpenses > stats.totalBudget && stats.totalBudget > 0 ? 'bg-rose-500' : 'bg-zinc-900 dark:bg-zinc-100'}`}
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-zinc-400 uppercase tracking-tight">{formatCurrency(stats.monthlyExpenses)} / {formatCurrency(stats.totalBudget)}</span>
                          {stats.monthlyExpenses > stats.totalBudget && stats.totalBudget > 0 && <AlertTriangle className="w-4 h-4 text-rose-500" />}
                        </div>
                      </div>
                    </section>
                  </div>

                  {/* Right Column: Recent Transactions */}
                  <div className="space-y-8">
                    <section className="space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="micro-label">{t.recentTransactions}</span>
                        <button onClick={() => handleTabChange('expenses')} className="micro-label hover:text-accent-600 transition-colors">
                          {t.viewAll}
                        </button>
                      </div>
                      <div className="glass-card overflow-hidden">
                        <AnimatePresence initial={false}>
                          {[...expenses, ...income]
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .slice(0, 6)
                            .map((item, index) => {
                              const isIncome = 'source' in item;
                              const acc = accounts.find(a => a.name === item.account);
                              return (
                                <motion.div 
                                  key={item.id} 
                                  layout
                                  initial={{ opacity: 0, y: 15 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -15, scale: 0.95 }}
                                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                  className={`flex items-center justify-between group p-6 ${index !== 0 ? 'border-t border-black/5 dark:border-white/5' : ''}`}
                                >
                                  <div className="flex items-center gap-4">
                                    <div>
                                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1">{isIncome ? item.source : item.description}</p>
                                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">{item.account} • {new Date(item.date).toLocaleDateString(locale, { month: 'short', day: 'numeric' })}</p>
                                    </div>
                                  </div>
                                  <p className={`text-sm font-mono font-bold ${isIncome ? 'text-emerald-500' : 'text-zinc-900 dark:text-zinc-100'}`}>
                                    {isIncome ? '+' : '-'}{formatCurrency(item.amount)}
                                  </p>
                                </motion.div>
                              );
                            })}
                        </AnimatePresence>
                        {expenses.length === 0 && income.length === 0 && (
                          <div className="p-8 text-center">
                            <p className="text-xs text-zinc-400 font-medium">{t.noData}</p>
                          </div>
                        )}
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'expenses' && (
              <div className="space-y-8 pb-24">
                {/* Header & Search */}
                <div className="space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                    <div>
                      <h2 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-2">{t.expenses}</h2>
                      <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{formatCurrency(stats.monthlyExpenses)}</p>
                        <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 mb-1">this month</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all border text-[10px] font-bold uppercase tracking-widest ${
                          showFilters 
                            ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-900 shadow-lg shadow-zinc-900/20 dark:shadow-zinc-100/10' 
                            : 'bg-white border-zinc-100 text-zinc-400 dark:bg-zinc-900 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700'
                        }`}
                      >
                        <Filter className="w-3.5 h-3.5" />
                        {language === 'en' ? 'Filters' : language === 'pt' ? 'Filtros' : 'Filtros'}
                      </button>
                      <button 
                        onClick={() => setShowRecurringOnly(!showRecurringOnly)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
                          showRecurringOnly 
                            ? 'bg-accent-500 border-accent-500 text-white shadow-lg shadow-accent-500/20' 
                            : 'bg-white border-zinc-100 text-zinc-400 dark:bg-zinc-900 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700'
                        }`}
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${showRecurringOnly ? 'animate-spin-slow' : ''}`} />
                        {t.recurringExpenses}
                      </button>
                    </div>
                  </div>

                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-zinc-900 dark:group-focus-within:text-zinc-100 transition-colors" />
                    <input
                      type="text"
                      placeholder={language === 'en' ? 'Search transactions...' : language === 'pt' ? 'Buscar transações...' : 'Buscar transacciones...'}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-6 py-4 bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/50 rounded-2xl text-sm focus:outline-none focus:border-zinc-200 dark:focus:border-zinc-700 transition-all dark:text-zinc-100 placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
                    />
                  </div>

                  {/* Monthly Summary Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/50">
                      <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Budget Used</p>
                      <div className="flex items-end gap-2">
                        <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                          {stats.totalBudget > 0 ? Math.round((stats.monthlyExpenses / stats.totalBudget) * 100) : 0}%
                        </p>
                        <div className="flex-1 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mb-1.5">
                          <div 
                            className="h-full bg-accent-500 transition-all duration-1000" 
                            style={{ width: `${Math.min(100, stats.totalBudget > 0 ? (stats.monthlyExpenses / stats.totalBudget) * 100 : 0)}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/50">
                      <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Top Category</p>
                      <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate tracking-tight">
                        {Object.entries(stats.monthlySpendingByCategory).sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0] || '---'}
                      </p>
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5 font-medium">
                        {formatCurrency(Object.entries(stats.monthlySpendingByCategory).sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[1] as number || 0)}
                      </p>
                    </div>
                    <div className="hidden sm:block p-4 rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/50">
                      <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Savings Rate</p>
                      <p className={`text-xl font-bold tracking-tight ${stats.savingsRate >= 20 ? 'text-emerald-500' : stats.savingsRate > 0 ? 'text-accent-500' : 'text-red-500'}`}>
                        {Math.round(stats.savingsRate)}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Spending Trend Chart */}
                <SpendingTrendChart 
                  categoryTrendData={expensesTrendData.categoryTrend}
                  subcategoryTrendData={expensesTrendData.subcategoryTrend}
                  categories={expensesTrendData.categories}
                  topSubcategories={expensesTrendData.topSubcategories}
                  formatCurrency={formatCurrency}
                  isDarkMode={isDarkMode}
                  language={language}
                />

                <AnimatePresence>
                  {showRecurringOnly && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="glass-card p-6 rounded-[32px] bg-accent-50/30 dark:bg-accent-900/10 border-accent-100/50 dark:border-accent-900/20"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-[10px] font-bold text-accent-900 dark:text-accent-100 uppercase tracking-[0.2em]">{t.recurringExpenses}</h3>
                          <p className="text-2xl font-bold tracking-tight text-accent-600 dark:text-accent-400 mt-1">
                            {formatCurrency(expenses.filter(e => e.isRecurring).reduce((sum, e) => {
                              const mult = e.frequency === 'Daily' ? 30 : e.frequency === 'Weekly' ? 4 : 1;
                              return sum + (e.amount * mult);
                            }, 0))}
                            <span className="text-[10px] font-medium text-accent-400 dark:text-accent-500 ml-2 uppercase tracking-widest">/ month</span>
                          </p>
                        </div>
                        <div className="w-10 h-10 bg-accent-100 dark:bg-accent-900/30 rounded-xl flex items-center justify-center text-accent-600 dark:text-accent-400">
                          <RefreshCw className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 bg-white dark:bg-zinc-900/50 rounded-2xl border border-accent-100/50 dark:border-accent-900/20">
                          <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{language === 'en' ? 'Active Rules' : language === 'pt' ? 'Regras Ativas' : 'Reglas Activas'}</p>
                          <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{expenses.filter(e => e.isRecurring).length}</p>
                        </div>
                        <div className="p-4 bg-white dark:bg-zinc-900/50 rounded-2xl border border-accent-100/50 dark:border-accent-900/20">
                          <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{language === 'en' ? 'Next Due' : language === 'pt' ? 'Próximo Venc.' : 'Próximo Venc.'}</p>
                          <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                            {(() => {
                              const next = expenses
                                .filter(e => e.isRecurring && e.nextOccurrence)
                                .sort((a, b) => new Date(a.nextOccurrence!).getTime() - new Date(b.nextOccurrence!).getTime())[0];
                              return next ? `${next.description}` : '---';
                            })()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Filter Chips */}
                <div className="space-y-4">
                  <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
                    <button
                      onClick={() => setFilterCategory('All')}
                      className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border ${
                        filterCategory === 'All'
                          ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-900 shadow-md'
                          : 'bg-white border-zinc-100 text-zinc-400 dark:bg-zinc-900 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700'
                      }`}
                    >
                      {language === 'en' ? 'All Categories' : language === 'pt' ? 'Todas Categorias' : 'Todas Categorías'}
                    </button>
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setFilterCategory(cat.name)}
                        className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border ${
                          filterCategory === cat.name
                            ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-900 shadow-md'
                            : 'bg-white border-zinc-100 text-zinc-400 dark:bg-zinc-900 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
                    <button
                      onClick={() => setFilterAccount('All')}
                      className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border ${
                        filterAccount === 'All'
                          ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-900 shadow-md'
                          : 'bg-white border-zinc-100 text-zinc-400 dark:bg-zinc-900 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700'
                      }`}
                    >
                      {language === 'en' ? 'All Accounts' : language === 'pt' ? 'Todas Contas' : 'Todas Cuentas'}
                    </button>
                    {accounts.map(acc => (
                      <button
                        key={acc.id}
                        onClick={() => setFilterAccount(acc.name)}
                        className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border flex items-center gap-2 ${
                          filterAccount === acc.name
                            ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-900 shadow-md'
                            : 'bg-white border-zinc-100 text-zinc-400 dark:bg-zinc-900 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700'
                        }`}
                      >
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: acc.color }} />
                        {acc.name}
                      </button>
                    ))}
                  </div>
                </div>

                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-[32px] border border-zinc-100 dark:border-zinc-800">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t.category}</label>
                          <select
                            value={filterCategory}
                            onChange={(e) => {
                              setFilterCategory(e.target.value);
                              setFilterSubcategory('All');
                            }}
                            className="w-full p-2.5 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl text-xs focus:outline-none dark:text-zinc-100"
                          >
                            <option value="All">{language === 'en' ? 'All Categories' : language === 'pt' ? 'Todas as Categorias' : 'Todas las Categorías'}</option>
                            {categories.map(cat => (
                              <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t.subcategory}</label>
                          <select
                            value={filterSubcategory}
                            onChange={(e) => setFilterSubcategory(e.target.value)}
                            className="w-full p-2.5 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl text-xs focus:outline-none dark:text-zinc-100 disabled:opacity-50"
                            disabled={filterCategory === 'All'}
                          >
                            <option value="All">{language === 'en' ? 'All Subcategories' : language === 'pt' ? 'Todas as Subcategorias' : 'Todas las Subcategorías'}</option>
                            {subcategories
                              .filter(s => s.categoryId === categories.find(c => c.name === filterCategory)?.id)
                              .map(sub => (
                                <option key={sub.id} value={sub.name}>{sub.name}</option>
                              ))
                            }
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t.account}</label>
                          <select
                            value={filterAccount}
                            onChange={(e) => setFilterAccount(e.target.value)}
                            className="w-full p-2.5 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl text-xs focus:outline-none dark:text-zinc-100"
                          >
                            <option value="All">{language === 'en' ? 'All Accounts' : language === 'pt' ? 'Todas as Contas' : 'Todas las Cuentas'}</option>
                            {accounts.map(acc => (
                              <option key={acc.id} value={acc.name}>{acc.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Start Date</label>
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full p-2.5 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl text-xs focus:outline-none dark:text-zinc-100"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">End Date</label>
                          <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full p-2.5 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl text-xs focus:outline-none dark:text-zinc-100"
                          />
                        </div>
                        {(filterCategory !== 'All' || filterAccount !== 'All' || startDate !== '' || endDate !== '' || searchTerm !== '') && (
                          <button
                            onClick={() => {
                              setFilterCategory('All');
                              setFilterAccount('All');
                              setStartDate('');
                              setEndDate('');
                              setSearchTerm('');
                            }}
                            className="col-span-full text-[10px] font-bold text-accent-500 uppercase tracking-widest hover:text-accent-600 transition-colors pt-2 text-center"
                          >
                            Clear all filters
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-8">
                  {groupedExpenses.length === 0 ? (
                    <EmptyState icon={<PieChart className="w-8 h-8 text-zinc-300" />} title={language === 'en' ? 'No expenses yet' : language === 'pt' ? 'Nenhuma despesa ainda' : 'No hay gastos todavía'} />
                  ) : (
                    groupedExpenses.map(([dateStr, items]) => (
                      <section key={dateStr} className="space-y-4">
                        <DateHeader dateStr={dateStr} total={items.reduce((sum, i) => sum + i.amount, 0)} formatCurrency={formatCurrency} />
                        <div className="space-y-3">
                          <AnimatePresence initial={false}>
                            {items.map(expense => (
                              <ExpenseItem 
                                key={expense.id} 
                                expense={expense} 
                                onDelete={handleDeleteExpense} 
                                onEdit={handleStartEditExpense} 
                                getAccountIcon={getAccountIcon} 
                                formatCurrency={formatCurrency} 
                                accounts={accounts}
                                language={language}
                              />
                            ))}
                          </AnimatePresence>
                        </div>
                      </section>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'income' && (
              <div className="space-y-8 pb-24">
                {/* Header & Search */}
                <div className="space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                    <div>
                      <h2 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-2">{t.income}</h2>
                      <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{formatCurrency(stats.monthlyIncome)}</p>
                        <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 mb-1">this month</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all border text-[10px] font-bold uppercase tracking-widest ${
                          showFilters 
                            ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-900 shadow-lg shadow-zinc-900/20 dark:shadow-zinc-100/10' 
                            : 'bg-white border-zinc-100 text-zinc-400 dark:bg-zinc-900 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700'
                        }`}
                      >
                        <Filter className="w-3.5 h-3.5" />
                        {language === 'en' ? 'Filters' : language === 'pt' ? 'Filtros' : 'Filtros'}
                      </button>
                    </div>
                  </div>

                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-zinc-900 dark:group-focus-within:text-zinc-100 transition-colors" />
                    <input
                      type="text"
                      placeholder={language === 'en' ? 'Search income...' : language === 'pt' ? 'Buscar receitas...' : 'Buscar ingresos...'}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-6 py-4 bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/50 rounded-2xl text-sm focus:outline-none focus:border-zinc-200 dark:focus:border-zinc-700 transition-all dark:text-zinc-100 placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
                    />
                  </div>

                  {/* Income Summary Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/50">
                      <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Top Source</p>
                      <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate tracking-tight">
                        {income.length > 0 
                          ? Object.entries(income.reduce((acc, curr) => {
                              acc[curr.source] = (acc[curr.source] || 0) + curr.amount;
                              return acc;
                            }, {} as Record<string, number>)).sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0]
                          : '---'}
                      </p>
                      <p className="text-[10px] text-emerald-500 mt-0.5 font-bold">
                        {formatCurrency(income.length > 0 
                          ? Object.entries(income.reduce((acc, curr) => {
                              acc[curr.source] = (acc[curr.source] || 0) + curr.amount;
                              return acc;
                            }, {} as Record<string, number>)).sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[1] as number
                          : 0)}
                      </p>
                    </div>
                    <div className="p-4 rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/50">
                      <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Recurring Ratio</p>
                      <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                        {income.length > 0 ? Math.round((income.filter(i => i.isRecurring).length / income.length) * 100) : 0}%
                      </p>
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5 font-medium">Stable income</p>
                    </div>
                  </div>
                </div>

                {/* Account Filter Chips */}
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
                  <button
                    onClick={() => setFilterAccount('All')}
                    className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border ${
                      filterAccount === 'All'
                        ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-900 shadow-md'
                        : 'bg-white border-zinc-100 text-zinc-400 dark:bg-zinc-900 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700'
                    }`}
                  >
                    {language === 'en' ? 'All Accounts' : 'Todas Contas'}
                  </button>
                  {accounts.map(acc => (
                    <button
                      key={acc.id}
                      onClick={() => setFilterAccount(acc.name)}
                      className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border flex items-center gap-2 ${
                        filterAccount === acc.name
                          ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-900 shadow-md'
                          : 'bg-white border-zinc-100 text-zinc-400 dark:bg-zinc-900 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700'
                      }`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: acc.color }} />
                      {acc.name}
                    </button>
                  ))}
                </div>

                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-2 gap-4 p-6 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-[32px] border border-zinc-100 dark:border-zinc-800">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t.account}</label>
                          <select
                            value={filterAccount}
                            onChange={(e) => setFilterAccount(e.target.value)}
                            className="w-full p-2.5 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl text-xs focus:outline-none dark:text-zinc-100"
                          >
                            <option value="All">{language === 'en' ? 'All Accounts' : language === 'pt' ? 'Todas as Contas' : 'Todas las Cuentas'}</option>
                            {accounts.map(acc => (
                              <option key={acc.id} value={acc.name}>{acc.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Start Date</label>
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full p-2.5 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl text-xs focus:outline-none dark:text-zinc-100"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">End Date</label>
                          <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full p-2.5 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl text-xs focus:outline-none dark:text-zinc-100"
                          />
                        </div>
                        {(filterAccount !== 'All' || startDate !== '' || endDate !== '' || searchTerm !== '') && (
                          <button
                            onClick={() => {
                              setFilterAccount('All');
                              setStartDate('');
                              setEndDate('');
                              setSearchTerm('');
                            }}
                            className="col-span-2 text-[10px] font-bold text-accent-500 uppercase tracking-widest hover:text-accent-600 transition-colors pt-2 text-center"
                          >
                            Clear all filters
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-8">
                  {groupedIncome.length === 0 ? (
                    <EmptyState icon={<TrendingUp className="w-8 h-8 text-zinc-300" />} title={language === 'en' ? 'No income yet' : language === 'pt' ? 'Nenhuma receita ainda' : 'No hay ingresos todavía'} />
                  ) : (
                    groupedIncome.map(([dateStr, items]) => (
                      <section key={dateStr} className="space-y-4">
                        <DateHeader dateStr={dateStr} total={items.reduce((sum, i) => sum + i.amount, 0)} isIncome formatCurrency={formatCurrency} />
                        <div className="space-y-3">
                          <AnimatePresence initial={false}>
                            {items.map(inc => (
                              <IncomeItem 
                                key={inc.id} 
                                income={inc} 
                                onDelete={handleDeleteIncome} 
                                onEdit={handleStartEditIncome} 
                                getAccountIcon={getAccountIcon} 
                                formatCurrency={formatCurrency} 
                                accounts={accounts}
                                language={language}
                              />
                            ))}
                          </AnimatePresence>
                        </div>
                      </section>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'budget' && (
              <div className="space-y-10 pb-20">
                {/* Header */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">{t.budget}</h2>
                      <p className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-1">{formatCurrency(budgets.reduce((sum, b) => sum + b.amount, 0))}</p>
                    </div>
                    <button
                      onClick={() => {
                        setWizardIncome(stats.monthlyIncome.toString());
                        setIsBudgetWizardOpen(true);
                        setWizardStep(1);
                      }}
                      className="flex items-center gap-2 px-4 py-3 bg-accent-500 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-accent-600 transition-all shadow-lg shadow-accent-500/20"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      {t.budgetWizard}
                    </button>
                  </div>

                  <div className="glass-card p-6 rounded-[32px] bg-accent-50/30 dark:bg-accent-900/10 border-accent-100/50 dark:border-accent-900/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-accent-100 dark:bg-accent-900/30 rounded-xl flex items-center justify-center text-accent-600 dark:text-accent-400">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-accent-900 dark:text-accent-100 uppercase tracking-tight">
                          {language === 'en' ? 'Budgeting Patterns' : language === 'pt' ? 'Padrões de Orçamento' : 'Patrones de Presupuesto'}
                        </p>
                        <p className="text-[10px] text-accent-600/70 dark:text-accent-400/70 uppercase tracking-tight font-bold">
                          {language === 'en' ? 'Quick guides to start your financial journey' : language === 'pt' ? 'Guias rápidos para começar sua jornada financeira' : 'Guías rápidas para comenzar tu viaje financiero'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { name: '50/30/20', desc: language === 'en' ? 'Needs/Wants/Savings' : 'Essencial/Desejos/Reserva', p: [50, 30, 20], buckets: language === 'en' ? ['Needs', 'Wants', 'Savings'] : ['Essencial', 'Desejos', 'Reserva'] },
                        { name: '70/20/10', desc: language === 'en' ? 'Living/Savings/Debt' : 'Viver/Reserva/Dívidas', p: [70, 20, 10], buckets: language === 'en' ? ['Living', 'Savings', 'Debt'] : ['Viver', 'Reserva', 'Dívidas'] },
                        { name: '80/20', desc: language === 'en' ? 'Living/Savings' : 'Viver/Reserva', p: [80, 20], buckets: language === 'en' ? ['Living', 'Savings'] : ['Viver', 'Reserva'] }
                      ].map(pattern => (
                        <button 
                          key={pattern.name}
                          onClick={() => setSelectedPattern(pattern)}
                          className={`p-4 bg-white dark:bg-zinc-900 border rounded-2xl text-left transition-all group ${selectedPattern?.name === pattern.name ? 'border-accent-500 ring-2 ring-accent-500/20' : 'border-accent-100 dark:border-accent-900/30 hover:border-accent-500'}`}
                        >
                          <p className="text-sm font-black text-accent-600 dark:text-accent-400 mb-1">{pattern.name}</p>
                          <p className="text-[10px] text-zinc-500 uppercase tracking-tighter leading-tight font-bold">{pattern.desc}</p>
                          <div className="flex h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full mt-3 overflow-hidden">
                            {pattern.p.map((val, i) => (
                              <div 
                                key={i} 
                                style={{ width: `${val}%` }} 
                                className={`h-full ${i === 0 ? 'bg-accent-500' : i === 1 ? 'bg-accent-300' : 'bg-accent-100'}`} 
                              />
                            ))}
                          </div>
                        </button>
                      ))}
                    </div>

                    <AnimatePresence>
                      {selectedPattern && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-6 pt-6 border-t border-accent-100 dark:border-accent-900/30 overflow-hidden"
                        >
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xs font-bold text-accent-900 dark:text-accent-100 uppercase tracking-tight">
                              {language === 'en' ? 'Apply Pattern' : language === 'pt' ? 'Aplicar Padrão' : 'Aplicar Patrón'}: {selectedPattern.name}
                            </h3>
                            <button onClick={() => setSelectedPattern(null)} className="text-zinc-400 hover:text-zinc-600">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <p className="text-[10px] text-zinc-500 mb-4">
                            {language === 'en' ? 'Assign each category to a bucket to automatically calculate budgets.' : 'Atribua cada categoria a um grupo para calcular os orçamentos automaticamente.'}
                          </p>

                          <div className="space-y-3">
                            {categories.map(cat => (
                              <div key={cat.id} className="flex items-center justify-between p-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400">{cat.name}</span>
                                <div className="flex gap-1">
                                  {selectedPattern.buckets.map((bucket, idx) => (
                                    <button
                                      key={bucket}
                                      onClick={() => {
                                        const amt = (selectedPattern.p[idx] / 100) * stats.monthlyIncome;
                                        // We divide the bucket percentage by the number of categories in that bucket? 
                                        // No, let's just apply the full bucket percentage to the category for now, 
                                        // or better: let the user decide.
                                        // Actually, a better "Apply" would be to set the category budget to (Income * Bucket% / CountOfCatsInBucket)
                                        // But that's complex. Let's just set the percentage input for them.
                                        const p = selectedPattern.p[idx];
                                        handleUpdateBudget(cat.name, '', (p / 100) * stats.monthlyIncome);
                                      }}
                                      className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-accent-100 dark:hover:bg-accent-900/30 rounded-lg text-[8px] font-bold text-zinc-500 hover:text-accent-600 transition-all"
                                    >
                                      {bucket} ({selectedPattern.p[idx]}%)
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <section className="space-y-6">
                  {categories.map(cat => {
                    const isEditing = editingBudgetCategory?.id === cat.id;
                    const catBudget = budgets.find(b => b.category === cat.name && (!b.subcategory || b.subcategory === ''))?.amount || 0;
                    const catSubs = subcategories.filter(s => s.categoryId === cat.id);
                    
                    const displayCatBudget = isEditing ? (tempBudgets['root'] ?? catBudget) : catBudget;
                    const catPercent = stats.monthlyIncome > 0 ? (displayCatBudget / stats.monthlyIncome) * 100 : 0;
                    
                    return (
                      <div key={cat.id} className="space-y-3">
                        <div className={`glass-card p-4 rounded-2xl flex flex-col gap-4 transition-all ${isEditing ? 'ring-2 ring-accent-500 border-accent-200 bg-accent-50/10' : ''}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-zinc-900 dark:bg-zinc-100 rounded-xl flex items-center justify-center text-white dark:text-zinc-900">
                                <Target className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 block">{cat.name}</span>
                                <div className="flex items-center gap-1 mt-0.5">
                                  {isEditing ? (
                                    <div className="flex items-center gap-1">
                                      <input
                                        type="number"
                                        value={catPercent === 0 ? '' : Math.round(catPercent)}
                                        onChange={(e) => {
                                          const p = Number(e.target.value);
                                          const amt = (p / 100) * stats.monthlyIncome;
                                          setTempBudgets(prev => ({ ...prev, root: amt }));
                                        }}
                                        placeholder="0"
                                        className="w-8 text-[10px] font-bold text-accent-500 bg-transparent outline-none border-b border-accent-500/30 focus:border-accent-500 transition-colors"
                                      />
                                      <span className="text-[10px] font-bold text-zinc-400">%</span>
                                    </div>
                                  ) : (
                                    <span className="text-[10px] font-bold text-zinc-400">{Math.round(catPercent)}%</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <span className="text-zinc-400 text-sm">{currencySymbol}</span>
                                {isEditing ? (
                                  <input
                                    type="number"
                                    value={displayCatBudget === 0 ? '' : displayCatBudget}
                                    onChange={(e) => setTempBudgets(prev => ({ ...prev, root: Number(e.target.value) }))}
                                    placeholder="0"
                                    className="w-20 text-right font-bold text-zinc-900 dark:text-zinc-100 bg-transparent outline-none border-b border-zinc-300 dark:border-zinc-600 focus:border-accent-500 transition-colors"
                                  />
                                ) : (
                                  <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{formatCurrency(catBudget)}</span>
                                )}
                              </div>

                              {isEditing ? (
                                <div className="flex gap-1">
                                  <button
                                    onClick={handleSaveBudget}
                                    className="p-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                                    title={t.save}
                                  >
                                    <Check className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={handleCancelBudget}
                                    className="p-1.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
                                    title={t.cancel}
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setEditingBudgetCategory(cat);
                                    const initialTemps: Record<string, number> = { root: catBudget };
                                    catSubs.forEach(sub => {
                                      const subB = budgets.find(b => b.category === cat.name && b.subcategory === sub.name)?.amount || 0;
                                      initialTemps[sub.name] = subB;
                                    });
                                    setTempBudgets(initialTemps);
                                  }}
                                  className="p-1.5 text-zinc-400 hover:text-accent-500 hover:bg-accent-50 dark:hover:bg-accent-900/20 rounded-lg transition-all"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>

                          {!isEditing && catBudget > 0 && (
                            <div className="space-y-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tight">
                                <div className="flex items-center gap-2">
                                  <span className="text-zinc-400">{t.spent}: {formatCurrency(stats.monthlySpendingByCategory[cat.name] || 0)}</span>
                                  <span className={`text-[10px] font-bold ${
                                    ((stats.monthlySpendingByCategory[cat.name] || 0) / catBudget) >= 1 
                                      ? 'text-rose-500' 
                                      : ((stats.monthlySpendingByCategory[cat.name] || 0) / catBudget) >= 0.8 
                                        ? 'text-amber-500' 
                                        : 'text-emerald-500'
                                  }`}>
                                    ({Math.round(((stats.monthlySpendingByCategory[cat.name] || 0) / catBudget) * 100)}%)
                                  </span>
                                  <span className="text-zinc-300 dark:text-zinc-700">/</span>
                                  <span className="text-zinc-500">{formatCurrency(catBudget)}</span>
                                </div>
                                <span className={`${
                                  ((stats.monthlySpendingByCategory[cat.name] || 0) / catBudget) >= 1 
                                    ? 'text-rose-500' 
                                    : ((stats.monthlySpendingByCategory[cat.name] || 0) / catBudget) >= 0.8 
                                      ? 'text-amber-500' 
                                      : 'text-emerald-500'
                                }`}>
                                  {(stats.monthlySpendingByCategory[cat.name] || 0) > catBudget 
                                    ? t.overBudget 
                                    : t.remaining}: {formatCurrency(Math.abs(catBudget - (stats.monthlySpendingByCategory[cat.name] || 0)))}
                                </span>
                              </div>
                              <div className="relative group/progress" title={`${t.spent}: ${formatCurrency(stats.monthlySpendingByCategory[cat.name] || 0)} | ${t.budget}: ${formatCurrency(catBudget)} | ${t.remaining}: ${formatCurrency(catBudget - (stats.monthlySpendingByCategory[cat.name] || 0))}`}>
                                <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden shadow-inner">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, ((stats.monthlySpendingByCategory[cat.name] || 0) / catBudget) * 100)}%` }}
                                    className={`h-full rounded-full transition-colors duration-500 ${
                                      ((stats.monthlySpendingByCategory[cat.name] || 0) / catBudget) >= 1 
                                        ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]' 
                                        : ((stats.monthlySpendingByCategory[cat.name] || 0) / catBudget) >= 0.8 
                                          ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]' 
                                          : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                                    }`}
                                  />
                                </div>
                                
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl opacity-0 group-hover/progress:opacity-100 transition-all duration-200 pointer-events-none z-50 whitespace-nowrap scale-95 group-hover/progress:scale-100 origin-bottom">
                                  <div className="flex flex-col gap-1.5 min-w-[140px]">
                                    <div className="flex justify-between items-center gap-4">
                                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{t.spent} ({Math.round(((stats.monthlySpendingByCategory[cat.name] || 0) / catBudget) * 100)}%)</span>
                                      <span className="text-xs font-bold text-white">{formatCurrency(stats.monthlySpendingByCategory[cat.name] || 0)}</span>
                                    </div>
                                    <div className="flex justify-between items-center gap-4">
                                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{t.budget}</span>
                                      <span className="text-xs font-bold text-white">{formatCurrency(catBudget)}</span>
                                    </div>
                                    <div className="h-px bg-zinc-800 my-0.5" />
                                    <div className="flex justify-between items-center gap-4">
                                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{t.remaining}</span>
                                      <span className={`text-xs font-bold ${catBudget - (stats.monthlySpendingByCategory[cat.name] || 0) < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                                        {formatCurrency(catBudget - (stats.monthlySpendingByCategory[cat.name] || 0))}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900" />
                                </div>
                              </div>
                            </div>
                          )}

                          {isEditing && (
                            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-accent-100/50 dark:border-accent-900/30">
                              <div className="text-center">
                                <p className="text-[8px] uppercase tracking-widest text-zinc-400 font-bold mb-1">{t.totalBudget}</p>
                                <p className="text-[10px] font-bold text-zinc-900 dark:text-zinc-100">{formatCurrency(displayCatBudget)}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-[8px] uppercase tracking-widest text-zinc-400 font-bold mb-1">{t.subcategoryBudgets}</p>
                                <p className="text-[10px] font-bold text-zinc-900 dark:text-zinc-100">
                                  {formatCurrency((Object.entries(tempBudgets) as [string, number][]).filter(([k]) => k !== 'root').reduce((sum, [, v]) => sum + v, 0))}
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-[8px] uppercase tracking-widest text-zinc-400 font-bold mb-1">{t.remaining}</p>
                                <p className={`text-[10px] font-bold ${displayCatBudget - (Object.entries(tempBudgets) as [string, number][]).filter(([k]) => k !== 'root').reduce((sum, [, v]) => sum + v, 0) < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                  {formatCurrency(displayCatBudget - (Object.entries(tempBudgets) as [string, number][]).filter(([k]) => k !== 'root').reduce((sum, [, v]) => sum + v, 0))}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {catSubs.length > 0 && (
                          <div className="ml-6 space-y-2 border-l-2 border-zinc-100 dark:border-zinc-800 pl-4">
                            {catSubs.map(sub => {
                              const subBudget = budgets.find(b => b.category === cat.name && b.subcategory === sub.name)?.amount || 0;
                              const displaySubBudget = isEditing ? (tempBudgets[sub.name] ?? subBudget) : subBudget;
                              const subPercent = stats.monthlyIncome > 0 ? (displaySubBudget / stats.monthlyIncome) * 100 : 0;
                              
                              return (
                                <div key={sub.id} className={`bg-zinc-50/50 dark:bg-zinc-800/50 p-4 rounded-xl border flex flex-col gap-3 transition-all ${isEditing ? 'border-accent-100 dark:border-accent-900/30' : 'border-zinc-100/50 dark:border-zinc-700/50'}`}>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Tag className="w-3 h-3 text-zinc-400" />
                                      <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{sub.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {isEditing ? (
                                        <div className="flex items-center gap-1 mr-2">
                                          <input
                                            type="number"
                                            value={subPercent === 0 ? '' : Math.round(subPercent)}
                                            onChange={(e) => {
                                              const p = Number(e.target.value);
                                              const amt = (p / 100) * stats.monthlyIncome;
                                              setTempBudgets(prev => ({ ...prev, [sub.name]: amt }));
                                            }}
                                            placeholder="0"
                                            className="w-6 text-[8px] font-bold text-accent-500 bg-transparent outline-none border-b border-accent-500/30 focus:border-accent-500 transition-colors text-right"
                                          />
                                          <span className="text-[8px] font-bold text-zinc-400">%</span>
                                        </div>
                                      ) : (
                                        <span className="text-[8px] font-bold text-zinc-400 mr-2">{Math.round(subPercent)}%</span>
                                      )}
                                      
                                      <div className="flex items-center gap-2">
                                        <span className="text-zinc-400 text-[10px]">{currencySymbol}</span>
                                        {isEditing ? (
                                          <input
                                            type="number"
                                            value={displaySubBudget === 0 ? '' : displaySubBudget}
                                            onChange={(e) => setTempBudgets(prev => ({ ...prev, [sub.name]: Number(e.target.value) }))}
                                            placeholder="0"
                                            className="w-16 text-right text-xs font-bold text-zinc-900 dark:text-zinc-100 bg-transparent outline-none border-b border-zinc-200 dark:border-zinc-700 focus:border-accent-500 transition-colors"
                                          />
                                        ) : (
                                          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{formatCurrency(subBudget)}</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {!isEditing && subBudget > 0 && (
                                    <div className="space-y-1.5">
                                      <div className="flex justify-between items-center text-[8px] font-bold uppercase tracking-tight">
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-zinc-400">{t.spent}: {formatCurrency(stats.monthlySpendingBySubcategory[`${cat.name}:${sub.name}`] || 0)}</span>
                                          <span className={`${
                                            ((stats.monthlySpendingBySubcategory[`${cat.name}:${sub.name}`] || 0) / subBudget) >= 1 
                                              ? 'text-rose-500' 
                                              : ((stats.monthlySpendingBySubcategory[`${cat.name}:${sub.name}`] || 0) / subBudget) >= 0.8 
                                                ? 'text-amber-500' 
                                                : 'text-emerald-500'
                                          }`}>
                                            ({Math.round(((stats.monthlySpendingBySubcategory[`${cat.name}:${sub.name}`] || 0) / subBudget) * 100)}%)
                                          </span>
                                          <span className="text-zinc-300 dark:text-zinc-700">/</span>
                                          <span className="text-zinc-500">{formatCurrency(subBudget)}</span>
                                        </div>
                                        <span className={`${
                                          ((stats.monthlySpendingBySubcategory[`${cat.name}:${sub.name}`] || 0) / subBudget) >= 1 
                                            ? 'text-rose-500' 
                                            : ((stats.monthlySpendingBySubcategory[`${cat.name}:${sub.name}`] || 0) / subBudget) >= 0.8 
                                              ? 'text-amber-500' 
                                              : 'text-emerald-500'
                                        }`}>
                                          {(stats.monthlySpendingBySubcategory[`${cat.name}:${sub.name}`] || 0) > subBudget 
                                            ? t.overBudget 
                                            : t.remaining}: {formatCurrency(Math.abs(subBudget - (stats.monthlySpendingBySubcategory[`${cat.name}:${sub.name}`] || 0)))}
                                        </span>
                                      </div>
                                      <div className="relative group/progress" title={`${t.spent}: ${formatCurrency(stats.monthlySpendingBySubcategory[`${cat.name}:${sub.name}`] || 0)} | ${t.budget}: ${formatCurrency(subBudget)} | ${t.remaining}: ${formatCurrency(subBudget - (stats.monthlySpendingBySubcategory[`${cat.name}:${sub.name}`] || 0))}`}>
                                        <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden shadow-inner">
                                          <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(100, ((stats.monthlySpendingBySubcategory[`${cat.name}:${sub.name}`] || 0) / subBudget) * 100)}%` }}
                                            className={`h-full rounded-full transition-colors duration-500 ${
                                              ((stats.monthlySpendingBySubcategory[`${cat.name}:${sub.name}`] || 0) / subBudget) >= 1 
                                                ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.2)]' 
                                                : ((stats.monthlySpendingBySubcategory[`${cat.name}:${sub.name}`] || 0) / subBudget) >= 0.8 
                                                  ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.2)]' 
                                                  : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.2)]'
                                            }`}
                                          />
                                        </div>
                                        
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl opacity-0 group-hover/progress:opacity-100 transition-all duration-200 pointer-events-none z-50 whitespace-nowrap scale-95 group-hover/progress:scale-100 origin-bottom">
                                          <div className="flex flex-col gap-1.5 min-w-[140px]">
                                            <div className="flex justify-between items-center gap-4">
                                              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{t.spent} ({Math.round(((stats.monthlySpendingBySubcategory[`${cat.name}:${sub.name}`] || 0) / subBudget) * 100)}%)</span>
                                              <span className="text-xs font-bold text-white">{formatCurrency(stats.monthlySpendingBySubcategory[`${cat.name}:${sub.name}`] || 0)}</span>
                                            </div>
                                            <div className="flex justify-between items-center gap-4">
                                              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{t.budget}</span>
                                              <span className="text-xs font-bold text-white">{formatCurrency(subBudget)}</span>
                                            </div>
                                            <div className="h-px bg-zinc-800 my-0.5" />
                                            <div className="flex justify-between items-center gap-4">
                                              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{t.remaining}</span>
                                              <span className={`text-xs font-bold ${subBudget - (stats.monthlySpendingBySubcategory[`${cat.name}:${sub.name}`] || 0) < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                                                {formatCurrency(subBudget - (stats.monthlySpendingBySubcategory[`${cat.name}:${sub.name}`] || 0))}
                                              </span>
                                            </div>
                                          </div>
                                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900" />
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </section>
              </div>
            )}

            {activeTab === 'insights' && (
              <div className="space-y-10 pb-20">
                {/* Header */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">{t.insights}</h2>
                      <p className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-1">{formatCurrency(insightsData.net)}</p>
                    </div>
                    <div className="relative group">
                      <select
                        value={insightsRange}
                        onChange={(e) => setInsightsRange(e.target.value as any)}
                        className="appearance-none bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 py-3 pr-12 text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-4 focus:ring-accent-500/10 transition-all cursor-pointer shadow-sm"
                      >
                        <option value="thisMonth">{t.thisMonth}</option>
                        <option value="last3Months">{t.last3Months}</option>
                        <option value="last6Months">{t.last6Months}</option>
                        <option value="last12Months">{t.last12Months}</option>
                        <option value="custom">{t.custom}</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none transition-transform group-hover:text-zinc-600" />
                    </div>
                  </div>

                  {insightsRange === 'custom' && (
                    <div className="flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
                      <div className="flex-1 flex items-center gap-3 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl px-4 py-3 shadow-sm">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t.startDate}</span>
                        <input
                          type="date"
                          value={insightsStartDate}
                          onChange={(e) => setInsightsStartDate(e.target.value)}
                          className="bg-transparent text-xs font-bold text-zinc-900 dark:text-zinc-100 outline-none flex-1"
                        />
                      </div>
                      <div className="flex-1 flex items-center gap-3 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl px-4 py-3 shadow-sm">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t.endDate}</span>
                        <input
                          type="date"
                          value={insightsEndDate}
                          onChange={(e) => setInsightsEndDate(e.target.value)}
                          className="bg-transparent text-xs font-bold text-zinc-900 dark:text-zinc-100 outline-none flex-1"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Insights Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="glass-card p-8 rounded-[2.5rem] border-emerald-500/10 dark:border-emerald-500/5 group hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                      <TrendingUp className="w-20 h-20 text-emerald-500" />
                    </div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4">{t.income}</p>
                    <p className="text-4xl font-light tracking-tight text-emerald-500">{formatCurrency(insightsData.totalIncome)}</p>
                    <div className="mt-6 h-1.5 w-12 bg-emerald-500/20 rounded-full group-hover:w-full transition-all duration-700" />
                  </div>
                  <div className="glass-card p-8 rounded-[2.5rem] border-rose-500/10 dark:border-rose-500/5 group hover:bg-rose-50/30 dark:hover:bg-rose-900/10 transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                      <ArrowDownLeft className="w-20 h-20 text-rose-500" />
                    </div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4">{t.expenses}</p>
                    <p className="text-4xl font-light tracking-tight text-rose-500">{formatCurrency(insightsData.totalExpenses)}</p>
                    <div className="mt-6 h-1.5 w-12 bg-rose-500/20 rounded-full group-hover:w-full transition-all duration-700" />
                  </div>
                  <div className="glass-card p-8 rounded-[2.5rem] border-accent-500/10 dark:border-accent-500/5 group hover:bg-accent-50/30 dark:hover:bg-accent-900/10 transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                      <PieChart className="w-20 h-20 text-accent-500" />
                    </div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4">{language === 'en' ? 'Net Cash Flow' : 'Fluxo de Caixa Líquido'}</p>
                    <p className={`text-4xl font-light tracking-tight ${insightsData.net >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{formatCurrency(insightsData.net)}</p>
                    <div className={`mt-6 h-1.5 w-12 ${insightsData.net >= 0 ? 'bg-emerald-500/20' : 'bg-rose-500/20'} rounded-full group-hover:w-full transition-all duration-700`} />
                  </div>
                  <div className="glass-card p-8 rounded-[2.5rem] border-amber-500/10 dark:border-amber-500/5 group hover:bg-amber-50/30 dark:hover:bg-amber-900/10 transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Target className="w-20 h-20 text-amber-500" />
                    </div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4">{t.savingsRate}</p>
                    <p className="text-4xl font-light tracking-tight text-amber-500">
                      {insightsData.totalIncome > 0 ? Math.round((insightsData.net / insightsData.totalIncome) * 100) : 0}%
                    </p>
                    <div className="mt-6 h-1.5 w-12 bg-amber-500/20 rounded-full group-hover:w-full transition-all duration-700" />
                  </div>
                </div>

                {/* Monthly Income vs Expenses Bar Chart */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      {language === 'en' ? 'Income vs Expenses' : language === 'pt' ? 'Receita vs Despesas' : 'Ingresos vs Gastos'}
                    </h2>
                    {selectedMonth && (
                      <button 
                        onClick={() => setSelectedMonth(null)}
                        className="text-[10px] font-bold text-accent-500 uppercase tracking-widest hover:underline"
                      >
                        {language === 'en' ? 'Clear Filter' : language === 'pt' ? 'Limpar Filtro' : 'Limpiar Filtro'}
                      </button>
                    )}
                  </div>
                  <div className="glass-card p-6 rounded-[32px] h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart 
                        data={insightsData.trendData}
                        onClick={(data: any) => {
                          if (data && data.activePayload && data.activePayload.length > 0) {
                            const month = data.activePayload[0].payload.rawMonth;
                            setSelectedMonth(prev => prev === month ? null : month);
                          }
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#27272a' : '#f4f4f5'} />
                        <XAxis 
                          dataKey="month" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fill: '#a1a1aa' }} 
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fill: '#a1a1aa' }}
                          tickFormatter={(value) => `${currencySymbol}${value}`}
                        />
                        <Tooltip 
                          cursor={{ fill: isDarkMode ? '#27272a' : '#f4f4f5', opacity: 0.4 }}
                          contentStyle={{ 
                            backgroundColor: isDarkMode ? '#18181b' : '#fff', 
                            borderRadius: '16px', 
                            border: 'none', 
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                            color: isDarkMode ? '#fff' : '#000'
                          }}
                          itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                        />
                        <Legend 
                          verticalAlign="top" 
                          align="right"
                          iconType="circle"
                          wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingBottom: '20px' }}
                        />
                        <Bar 
                          dataKey="income" 
                          name={t.income}
                          fill="#10b981" 
                          radius={[4, 4, 0, 0]} 
                          barSize={20}
                          className="cursor-pointer"
                        />
                        <Bar 
                          dataKey="expenses" 
                          name={t.expenses}
                          fill={isDarkMode ? '#f4f4f5' : '#18181b'} 
                          radius={[4, 4, 0, 0]} 
                          barSize={20}
                          className="cursor-pointer"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="net" 
                          name={language === 'en' ? 'Net' : language === 'pt' ? 'Líquido' : 'Neto'}
                          stroke="#6366f1" 
                          strokeWidth={3}
                          dot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                        <ReferenceLine y={0} stroke={isDarkMode ? '#3f3f46' : '#d4d4d8'} />
                        {insightsData.trendData.length > 12 && <Brush dataKey="month" height={30} stroke="#6366f1" fill={isDarkMode ? '#18181b' : '#fff'} />}
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </section>

                {/* Trend Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Monthly Expense Trend Chart */}
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{language === 'en' ? 'Expense Trend' : language === 'pt' ? 'Tendência de Despesas' : 'Tendencia de Gastos'}</h2>
                      <button 
                        onClick={() => setShowMoMComparison(!showMoMComparison)}
                        className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full transition-all ${showMoMComparison ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900' : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}
                      >
                        {language === 'en' ? 'MoM Overlay' : language === 'pt' ? 'Comparar Mês' : 'Comparar Mes'}
                      </button>
                    </div>
                    <div className="glass-card p-6 rounded-[32px] h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        {showMoMComparison ? (
                          <ReLineChart data={insightsData.momTrendData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#27272a' : '#f4f4f5'} />
                            <XAxis 
                              dataKey="day" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fontSize: 10, fill: '#a1a1aa' }} 
                            />
                            <YAxis 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fontSize: 10, fill: '#a1a1aa' }}
                              tickFormatter={(value) => `${currencySymbol}${value}`}
                            />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: isDarkMode ? '#18181b' : '#fff', 
                                borderRadius: '16px', 
                                border: 'none', 
                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                color: isDarkMode ? '#fff' : '#000'
                              }}
                              itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="currentMonth" 
                              name={language === 'en' ? 'This Month' : language === 'pt' ? 'Este Mês' : 'Este Mes'}
                              stroke={isDarkMode ? '#f4f4f5' : '#18181b'} 
                              strokeWidth={3} 
                              dot={false}
                              activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="previousMonth" 
                              name={language === 'en' ? 'Last Month' : language === 'pt' ? 'Mês Passado' : 'Mes Pasado'}
                              stroke="#a1a1aa" 
                              strokeWidth={2} 
                              strokeDasharray="5 5"
                              dot={false}
                              activeDot={{ r: 4, strokeWidth: 0 }}
                            />
                          </ReLineChart>
                        ) : (
                          <ReLineChart data={insightsData.trendData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#27272a' : '#f4f4f5'} />
                            <XAxis 
                              dataKey="month" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fontSize: 10, fill: '#a1a1aa' }} 
                            />
                            <YAxis 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fontSize: 10, fill: '#a1a1aa' }}
                              tickFormatter={(value) => `${currencySymbol}${value}`}
                            />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: isDarkMode ? '#18181b' : '#fff', 
                                borderRadius: '16px', 
                                border: 'none', 
                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                color: isDarkMode ? '#fff' : '#000'
                              }}
                              itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="expenses" 
                              stroke={isDarkMode ? '#f4f4f5' : '#18181b'} 
                              strokeWidth={2} 
                              dot={{ r: 4, fill: isDarkMode ? '#f4f4f5' : '#18181b', strokeWidth: 0 }} 
                              activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                          </ReLineChart>
                        )}
                      </ResponsiveContainer>
                    </div>
                  </section>

                  {/* Monthly Income Trend Chart */}
                  <section className="space-y-4">
                    <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{language === 'en' ? 'Income Trend' : language === 'pt' ? 'Tendência de Receita' : 'Tendencia de Ingresos'}</h2>
                    <div className="glass-card p-6 rounded-[32px] h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <ReLineChart data={insightsData.trendData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#27272a' : '#f4f4f5'} />
                          <XAxis 
                            dataKey="month" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fill: '#a1a1aa' }} 
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fill: '#a1a1aa' }}
                            tickFormatter={(value) => `${currencySymbol}${value}`}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: isDarkMode ? '#18181b' : '#fff', 
                              borderRadius: '16px', 
                              border: 'none', 
                              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                              color: isDarkMode ? '#fff' : '#000'
                            }}
                            itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="income" 
                            stroke="#10b981" 
                            strokeWidth={2} 
                            dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} 
                            activeDot={{ r: 6, strokeWidth: 0 }}
                          />
                        </ReLineChart>
                      </ResponsiveContainer>
                    </div>
                  </section>
                </div>

                {/* Monthly Trend per Category Chart */}
                <section className="space-y-4">
                  <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    {language === 'en' ? 'Spending Trend by Category' : language === 'pt' ? 'Tendência de Gastos por Categoria' : 'Tendencia de Gastos por Categoría'}
                  </h2>
                  <div className="glass-card p-6 rounded-[32px] h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ReLineChart data={insightsData.categoryTrendData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#27272a' : '#f4f4f5'} />
                        <XAxis 
                          dataKey="month" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fill: '#a1a1aa' }} 
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fill: '#a1a1aa' }}
                          tickFormatter={(value) => `${currencySymbol}${value}`}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: isDarkMode ? '#18181b' : '#fff', 
                            borderRadius: '16px', 
                            border: 'none', 
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                            color: isDarkMode ? '#fff' : '#000'
                          }}
                          itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                        />
                        <Legend 
                          verticalAlign="top" 
                          align="right"
                          iconType="circle"
                          wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingBottom: '10px' }}
                        />
                        {insightsData.categories.map((cat, index) => (
                          <Line 
                            key={cat}
                            type="monotone" 
                            dataKey={cat} 
                            stroke={isDarkMode ? CHART_COLORS_DARK[index % CHART_COLORS_DARK.length] : CHART_COLORS[index % CHART_COLORS.length]} 
                            strokeWidth={2} 
                            dot={{ r: 3, fill: isDarkMode ? CHART_COLORS_DARK[index % CHART_COLORS_DARK.length] : CHART_COLORS[index % CHART_COLORS.length], strokeWidth: 0 }} 
                            activeDot={{ r: 5, strokeWidth: 0 }}
                          />
                        ))}
                      </ReLineChart>
                    </ResponsiveContainer>
                  </div>
                </section>

                {/* Subcategory Distribution Chart */}
                <section className="space-y-4">
                  <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    {language === 'en' 
                      ? `Spending Distribution ${selectedMonth ? `(${new Date(selectedMonth + '-01').toLocaleDateString(locale, { month: 'long', year: 'numeric' })})` : `(${insightsRange === 'custom' ? `${insightsStartDate} - ${insightsEndDate}` : t[insightsRange]})`}` 
                      : language === 'pt' 
                      ? `Distribuição de Gastos ${selectedMonth ? `(${new Date(selectedMonth + '-01').toLocaleDateString(locale, { month: 'long', year: 'numeric' })})` : `(${insightsRange === 'custom' ? `${insightsStartDate} - ${insightsEndDate}` : t[insightsRange]})`}` 
                      : `Distribución de Gastos ${selectedMonth ? `(${new Date(selectedMonth + '-01').toLocaleDateString(locale, { month: 'long', year: 'numeric' })})` : `(${insightsRange === 'custom' ? `${insightsStartDate} - ${insightsEndDate}` : t[insightsRange]})`}`}
                  </h2>
                  <div className="glass-card p-6 rounded-[32px] h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={insightsData.distributionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {insightsData.distributionData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={isDarkMode ? CHART_COLORS_DARK[index % CHART_COLORS_DARK.length] : CHART_COLORS[index % CHART_COLORS.length]} 
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: isDarkMode ? '#18181b' : '#fff', 
                            borderRadius: '16px', 
                            border: 'none', 
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                            color: isDarkMode ? '#fff' : '#000'
                          }}
                          formatter={(value: number) => [formatCurrency(value), language === 'en' ? 'Amount' : 'Valor']}
                        />
                        <Legend 
                          verticalAlign="bottom" 
                          height={36} 
                          iconType="circle"
                          wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '20px' }}
                        />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                </section>

                {/* Detailed Subcategory Breakdown Chart */}
                {insightsData.subcategoryBreakdownData.length > 0 && (
                  <section className="space-y-4">
                    <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      {language === 'en' ? 'Top Subcategories Breakdown' : language === 'pt' ? 'Detalhamento das Principais Subcategorias' : 'Desglose de Principales Subcategorías'}
                    </h2>
                    <div className="glass-card p-6 rounded-[32px] h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <ReBarChart
                          layout="vertical"
                          data={insightsData.subcategoryBreakdownData}
                          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={isDarkMode ? '#27272a' : '#f4f4f5'} />
                          <XAxis type="number" hide />
                          <YAxis 
                            dataKey="name" 
                            type="category" 
                            width={100}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fontWeight: 600, fill: isDarkMode ? '#a1a1aa' : '#71717a' }}
                          />
                          <Tooltip 
                            cursor={{ fill: isDarkMode ? '#27272a' : '#f4f4f5', opacity: 0.4 }}
                            contentStyle={{ 
                              backgroundColor: isDarkMode ? '#18181b' : '#fff', 
                              borderRadius: '16px', 
                              border: 'none', 
                              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                              color: isDarkMode ? '#fff' : '#000'
                            }}
                            formatter={(value: number) => [formatCurrency(value), language === 'en' ? 'Amount' : 'Valor']}
                          />
                          <Bar 
                            dataKey="value" 
                            radius={[0, 10, 10, 0]}
                            barSize={20}
                          >
                            {insightsData.subcategoryBreakdownData.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={isDarkMode ? CHART_COLORS_DARK[index % CHART_COLORS_DARK.length] : CHART_COLORS[index % CHART_COLORS.length]} 
                              />
                            ))}
                            <LabelList 
                              dataKey="value" 
                              position="right" 
                              formatter={(value: number) => formatCurrency(value)}
                              style={{ fontSize: 10, fontWeight: 700, fill: isDarkMode ? '#a1a1aa' : '#71717a' }}
                            />
                          </Bar>
                        </ReBarChart>
                      </ResponsiveContainer>
                    </div>
                  </section>
                )}

                {/* Monthly Subcategory Trend Chart */}
                {insightsData.subcategoryTrendData.length > 1 && (
                  <section className="space-y-4">
                    <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      {language === 'en' ? 'Monthly Subcategory Trend' : language === 'pt' ? 'Tendência Mensal por Subcategoria' : 'Tendencia Mensual por Subcategoría'}
                    </h2>
                    <div className="glass-card p-6 rounded-[32px] h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <ReBarChart
                          data={insightsData.subcategoryTrendData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#27272a' : '#f4f4f5'} />
                          <XAxis 
                            dataKey="month" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fontWeight: 600, fill: isDarkMode ? '#a1a1aa' : '#71717a' }}
                          />
                          <YAxis 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fontWeight: 600, fill: isDarkMode ? '#a1a1aa' : '#71717a' }}
                            tickFormatter={(value) => formatCurrency(value)}
                          />
                          <Tooltip 
                            cursor={{ fill: isDarkMode ? '#27272a' : '#f4f4f5', opacity: 0.4 }}
                            contentStyle={{ 
                              backgroundColor: isDarkMode ? '#18181b' : '#fff', 
                              borderRadius: '16px', 
                              border: 'none', 
                              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                              color: isDarkMode ? '#fff' : '#000'
                            }}
                            formatter={(value: number) => [formatCurrency(value), language === 'en' ? 'Amount' : 'Valor']}
                          />
                          <Legend 
                            verticalAlign="top" 
                            align="right"
                            iconType="circle"
                            wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingBottom: '10px' }}
                          />
                          {insightsData.topSubcategories.map((sub, index) => (
                            <Bar 
                              key={sub}
                              dataKey={sub} 
                              stackId="a" 
                              fill={isDarkMode ? CHART_COLORS_DARK[index % CHART_COLORS_DARK.length] : CHART_COLORS[index % CHART_COLORS.length]} 
                              radius={index === insightsData.topSubcategories.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                            />
                          ))}
                        </ReBarChart>
                      </ResponsiveContainer>
                    </div>
                  </section>
                )}

                <section className="space-y-4">
                  <h2 className="text-xl font-light tracking-tight text-zinc-900 dark:text-zinc-100 mb-4">{language === 'en' ? 'Budget vs Spending' : language === 'pt' ? 'Orçamento vs Gastos' : 'Presupuesto vs Gastos'}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categories.map(cat => {
                    const spent = stats.spendingByCategory[cat.name] || 0;
                    const budget = budgets.find(b => b.category === cat.name && (!b.subcategory || b.subcategory === ''))?.amount || 0;
                    const percent = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
                    const isOver = budget > 0 && spent > budget;
                    const remaining = budget - spent;

                    const subBudgets = budgets.filter(b => b.category === cat.name && b.subcategory && b.subcategory !== '');

                    return (
                      <div key={cat.id} className="space-y-4">
                        <div className="glass-card p-5 rounded-3xl group/budget relative">
                          <div className="flex justify-between items-end mb-3">
                            <div>
                              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em]">{cat.name}</p>
                              <p className="text-lg font-light tracking-tight text-zinc-900 dark:text-zinc-100">{formatCurrency(spent)} <span className="text-zinc-300 dark:text-zinc-600 text-sm font-light">/ {formatCurrency(budget)}</span></p>
                            </div>
                            {budget > 0 && (
                              <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${isOver ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-500' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500'} uppercase tracking-tight`}>
                                {isOver ? (language === 'en' ? 'Over Budget' : language === 'pt' ? 'Acima do Orçamento' : 'Exceso de Presupuesto') : `${Math.round(100 - percent)}% ${language === 'en' ? 'Left' : language === 'pt' ? 'Restante' : 'Restante'}`}
                              </span>
                            )}
                          </div>
                          <div className="w-full h-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percent}%` }}
                              className={`h-full rounded-full ${isOver ? 'bg-rose-500' : 'bg-zinc-900 dark:bg-zinc-100'}`}
                            />
                          </div>

                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl opacity-0 group-hover/budget:opacity-100 transition-all duration-200 pointer-events-none z-50 whitespace-nowrap scale-95 group-hover/budget:scale-100 origin-bottom">
                            <div className="flex flex-col gap-1.5 min-w-[140px]">
                              <div className="flex justify-between items-center gap-4">
                                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{t.spent}</span>
                                <span className="text-xs font-bold text-white">{formatCurrency(spent)}</span>
                              </div>
                              <div className="flex justify-between items-center gap-4">
                                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{t.budget}</span>
                                <span className="text-xs font-bold text-white">{formatCurrency(budget)}</span>
                              </div>
                              <div className="h-px bg-zinc-800 my-0.5" />
                              <div className="flex justify-between items-center gap-4">
                                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{t.remaining}</span>
                                <span className={`text-xs font-bold ${remaining < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                                  {formatCurrency(remaining)}
                                </span>
                              </div>
                            </div>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900" />
                          </div>
                        </div>

                        {subBudgets.length > 0 && (
                          <div className="ml-6 space-y-3 border-l-2 border-zinc-100 dark:border-zinc-800/50 pl-4">
                            {subBudgets.map(sb => {
                              const subSpent = stats.spendingBySubcategory[`${cat.name}:${sb.subcategory}`] || 0;
                              const subPercent = sb.amount > 0 ? Math.min((subSpent / sb.amount) * 100, 100) : 0;
                              const subIsOver = sb.amount > 0 && subSpent > sb.amount;
                              const subRemaining = sb.amount - subSpent;

                              return (
                                <div key={sb.subcategory} className="bg-white dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800/50 group/subbudget relative">
                                  <div className="flex justify-between items-end mb-2">
                                    <div>
                                      <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tight">{sb.subcategory}</p>
                                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{formatCurrency(subSpent)} <span className="text-zinc-300 dark:text-zinc-600 text-xs">/ {formatCurrency(sb.amount)}</span></p>
                                    </div>
                                    <span className={`text-[9px] font-bold ${subIsOver ? 'text-rose-500' : 'text-emerald-500'}`}>
                                      {Math.round(subPercent)}%
                                    </span>
                                  </div>
                                  <div className="w-full h-1.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-full overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${subPercent}%` }}
                                      className={`h-full rounded-full ${subIsOver ? 'bg-rose-500' : 'bg-zinc-900 dark:bg-zinc-100'}`}
                                    />
                                  </div>

                                  {/* Sub Tooltip */}
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl opacity-0 group-hover/subbudget:opacity-100 transition-all duration-200 pointer-events-none z-50 whitespace-nowrap scale-95 group-hover/subbudget:scale-100 origin-bottom">
                                    <div className="flex flex-col gap-1.5 min-w-[140px]">
                                      <div className="flex justify-between items-center gap-4">
                                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{t.spent}</span>
                                        <span className="text-xs font-bold text-white">{formatCurrency(subSpent)}</span>
                                      </div>
                                      <div className="flex justify-between items-center gap-4">
                                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{t.budget}</span>
                                        <span className="text-xs font-bold text-white">{formatCurrency(sb.amount)}</span>
                                      </div>
                                      <div className="h-px bg-zinc-800 my-0.5" />
                                      <div className="flex justify-between items-center gap-4">
                                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{t.remaining}</span>
                                        <span className={`text-xs font-bold ${subRemaining < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                                          {formatCurrency(subRemaining)}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900" />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          )}
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

            {activeTab === 'investments' && (
              <div className="space-y-8 pb-24">
                {/* Header */}
                <div className="space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                    <div>
                      <h2 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-2">{t.investments}</h2>
                      <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{formatCurrency(stats.totalInvestments)}</p>
                        <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 mb-1">total portfolio</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {investments.length > 0 && (
                        <button 
                          onClick={() => investments.forEach(inv => inv.symbol && fetchLivePrice(inv.id, inv.symbol))}
                          disabled={Object.values(updatingInvestments).some(v => v)}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all border border-zinc-100 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 bg-white dark:bg-zinc-900 disabled:opacity-30"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${Object.values(updatingInvestments).some(v => v) ? 'animate-spin' : ''}`} />
                          {language === 'en' ? 'Refresh' : 'Atualizar'}
                        </button>
                      )}
                      <button
                        onClick={() => setIsWizardOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400 border border-accent-200 dark:border-accent-800 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-accent-100 dark:hover:bg-accent-900/40 transition-all shadow-sm"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        {language === 'en' ? 'AI Wizard' : 'Assistente IA'}
                      </button>
                      <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-zinc-900/20 dark:shadow-zinc-100/10"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        {language === 'en' ? 'Add Asset' : language === 'pt' ? 'Adicionar Ativo' : 'Agregar Activo'}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-5 rounded-3xl bg-emerald-50/30 dark:bg-emerald-900/10 border border-emerald-100/50 dark:border-emerald-900/20">
                      <p className="text-[8px] font-bold text-emerald-600/70 dark:text-emerald-400/70 uppercase tracking-widest mb-1">Total Profit</p>
                      <p className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                        +{formatCurrency(stats.totalInvestments - stats.totalInitialInvestments)}
                      </p>
                      <p className="text-[10px] font-bold text-emerald-600/50 dark:text-emerald-400/50 uppercase tracking-widest mt-1">
                        {stats.totalInitialInvestments > 0 ? ((stats.totalInvestments - stats.totalInitialInvestments) / stats.totalInitialInvestments * 100).toFixed(1) : 0}% return
                      </p>
                    </div>
                    <div className="p-5 rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/50">
                      <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Active Assets</p>
                      <p className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{investments.length}</p>
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 font-medium">Diversified holdings</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {investments.length === 0 ? (
                    <EmptyState icon={<LineChart className="w-8 h-8 text-zinc-300" />} title={language === 'en' ? 'No investments tracked' : language === 'pt' ? 'Nenhum investimento rastreado' : 'No hay inversiones rastreadas'} />
                  ) : (
                    investments.map(inv => {
                      const profit = inv.currentValue - inv.initialAmount;
                      const percent = inv.initialAmount !== 0 ? ((profit / inv.initialAmount) * 100).toFixed(1) : '0';
                      const isUpdating = updatingInvestments[inv.id];

                      const startDate = new Date(inv.date).getTime();
                      const targetDate = inv.targetDate ? new Date(inv.targetDate).getTime() : 0;
                      const today = new Date().getTime();
                      const totalTime = targetDate - startDate;
                      const timeElapsed = today - startDate;
                      const timeProgress = totalTime > 0 ? Math.max(0, Math.min(1, timeElapsed / totalTime)) : 0;
                      const amountProgress = inv.targetAmount && inv.targetAmount > 0 ? Math.max(0, Math.min(1, inv.currentValue / inv.targetAmount)) : 0;

                      return (
                        <div key={inv.id} className="bg-white dark:bg-zinc-900/40 p-6 rounded-[2.5rem] border border-zinc-100/50 dark:border-zinc-800/30 relative group/inv hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-all">
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
                                    <div 
                                      className="w-1.5 h-1.5 rounded-full" 
                                      style={{ backgroundColor: accounts.find(a => a.name === inv.account)?.color || '#cbd5e1' }} 
                                    />
                                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{inv.account}</span>
                                  </div>
                                  <span className="text-zinc-200 dark:text-zinc-800">•</span>
                                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{new Date(inv.date).toLocaleDateString(locale, { month: 'short', year: 'numeric' })}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover/inv:opacity-100 transition-all translate-x-2 group-hover/inv:translate-x-0">
                              {inv.symbol && (
                                <button 
                                  onClick={() => fetchLivePrice(inv.id, inv.symbol!)}
                                  disabled={isUpdating}
                                  className="p-2.5 text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors disabled:opacity-30"
                                >
                                  <RefreshCw className={`w-4 h-4 ${isUpdating ? 'animate-spin' : ''}`} />
                                </button>
                              )}
                              <button onClick={() => handleEditInvestment(inv)} className="p-2.5 text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDeleteInvestment(inv.id)} className="p-2.5 text-zinc-300 hover:text-rose-500 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Breakdown Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 mb-10">
                            <div className="space-y-1.5">
                              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{t.initial}</p>
                              <p className="text-2xl font-light tracking-tight text-zinc-900 dark:text-zinc-100">{formatCurrency(inv.initialAmount)}</p>
                            </div>
                            <div className="space-y-1.5">
                              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{t.currentValue}</p>
                              <div className="flex items-center gap-2">
                                <p className="text-2xl font-light tracking-tight text-zinc-900 dark:text-zinc-100">{formatCurrency(inv.currentValue)}</p>
                                <button 
                                  onClick={() => {
                                    setUpdatingInvestmentId(inv.id);
                                    setNewValue(inv.currentValue.toString());
                                    setUpdateDate(new Date().toISOString().split('T')[0]);
                                    setIsUpdatingValueModalOpen(true);
                                  }}
                                  className="p-1.5 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            <div className="space-y-1.5 sm:text-right">
                              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{t.profit}</p>
                              <div className={`flex flex-col sm:items-end ${profit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                <p className="text-2xl font-light tracking-tight">{profit >= 0 ? '+' : ''}{formatCurrency(profit)}</p>
                                <p className="text-[10px] font-bold tracking-widest uppercase">{profit >= 0 ? '+' : ''}{percent}%</p>
                              </div>
                            </div>
                          </div>

                          {/* Interactive Chart */}
                          <div className="mb-10 p-6 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-[2rem] border border-zinc-100 dark:border-zinc-800/50">
                            <div className="flex items-center justify-between mb-6">
                              <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{language === 'en' ? 'Performance' : language === 'pt' ? 'Desempenho' : 'Rendimiento'}</h4>
                              <div className="flex gap-1.5">
                                {['1M', '3M', '1Y', 'ALL'].map(range => (
                                  <button
                                    key={range}
                                    onClick={() => setInvestmentTimeRanges(prev => ({ ...prev, [inv.id]: range }))}
                                    className={`px-2.5 py-1 text-[9px] font-bold rounded-lg transition-all ${
                                      investmentTimeRanges[inv.id] === range
                                        ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md'
                                        : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
                                    }`}
                                  >
                                    {range}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="h-56 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={filterHistoryByRange(investmentHistories[inv.id], investmentTimeRanges[inv.id])}>
                                  <defs>
                                    <linearGradient id={`colorValue-${inv.id}`} x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor={profit >= 0 ? '#10b981' : '#f43f5e'} stopOpacity={0.2}/>
                                      <stop offset="95%" stopColor={profit >= 0 ? '#10b981' : '#f43f5e'} stopOpacity={0}/>
                                    </linearGradient>
                                  </defs>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#27272a' : '#f4f4f5'} />
                                  <XAxis 
                                    dataKey="date" 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 9, fill: '#a1a1aa', fontWeight: 500 }}
                                    tickFormatter={(date) => new Date(date).toLocaleDateString(locale, { month: 'short', day: 'numeric' })}
                                    minTickGap={40}
                                  />
                                  <YAxis 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 9, fill: '#a1a1aa', fontWeight: 500 }}
                                    tickFormatter={(value) => `${currencySymbol}${value}`}
                                    domain={['auto', 'auto']}
                                    width={45}
                                  />
                                  <Tooltip
                                    content={({ active, payload }) => {
                                      if (active && payload && payload.length) {
                                        return (
                                          <div className="bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-2xl">
                                            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">
                                              {new Date(payload[0].payload.date).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </p>
                                            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                              {formatCurrency(payload[0].value as number)}
                                            </p>
                                          </div>
                                        );
                                      }
                                      return null;
                                    }}
                                  />
                                  <ReferenceLine y={inv.initialAmount} stroke={isDarkMode ? '#3f3f46' : '#d4d4d8'} strokeDasharray="5 5" />
                                  <Area 
                                    type="monotone" 
                                    dataKey="value" 
                                    stroke={profit >= 0 ? '#10b981' : '#f43f5e'} 
                                    strokeWidth={3} 
                                    fillOpacity={1} 
                                    fill={`url(#colorValue-${inv.id})`}
                                    animationDuration={1500}
                                  />
                                </ComposedChart>
                              </ResponsiveContainer>
                            </div>
                          </div>

                          {/* Progress Section */}
                          {(inv.targetAmount || inv.targetDate) && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-zinc-100 dark:border-zinc-800/50">
                              {inv.targetAmount && (
                                <div className="space-y-3">
                                  <div className="flex justify-between items-end">
                                    <div className="flex items-center gap-2">
                                      <Target className="w-3.5 h-3.5 text-accent-500" />
                                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t.goalProgress}</p>
                                    </div>
                                    <p className="text-[10px] font-bold text-zinc-900 dark:text-zinc-100">
                                      {Math.round(amountProgress * 100)}% <span className="text-zinc-400 font-medium ml-1">of {formatCurrency(inv.targetAmount)}</span>
                                    </p>
                                  </div>
                                  <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                    <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: `${amountProgress * 100}%` }}
                                      className={`h-full rounded-full ${amountProgress >= 1 ? 'bg-emerald-500' : 'bg-accent-500'}`}
                                    />
                                  </div>
                                </div>
                              )}
                              {inv.targetDate && (
                                <div className="space-y-3">
                                  <div className="flex justify-between items-end">
                                    <div className="flex items-center gap-2">
                                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t.timeProgress}</p>
                                    </div>
                                    <p className="text-[10px] font-bold text-zinc-900 dark:text-zinc-100">
                                      {Math.round(timeProgress * 100)}% <span className="text-zinc-400 font-medium ml-1">to {new Date(inv.targetDate).toLocaleDateString(locale)}</span>
                                    </p>
                                  </div>
                                  <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                    <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: `${timeProgress * 100}%` }}
                                      className={`h-full rounded-full ${timeProgress >= 1 ? 'bg-rose-500' : 'bg-zinc-300 dark:bg-zinc-600'}`}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
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

            <InvestmentWizard 
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        currency={currency}
        locale={locale}
        stats={stats}
        investments={investments}
      />

      <AddSelectionModal 
        isOpen={isSelectionModalOpen} 
        onClose={() => setIsSelectionModalOpen(false)} 
        onSelect={(type) => {
          handleTabChange(type);
          setIsAdding(true);
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
              
              <form onSubmit={handleAddEntry} className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 block">
                    {activeTab === 'investments' ? t.initial : t.amount}
                  </label>
                  <div className="relative">
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-3xl font-light text-zinc-300 dark:text-zinc-700">{currencySymbol}</span>
                    <input
                      autoFocus
                      type="number"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-8 py-2 text-4xl font-light tracking-tight text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-100 outline-none transition-colors placeholder:text-zinc-100 dark:placeholder:text-zinc-800"
                      required
                    />
                  </div>
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
                        <AnimatePresence>
                          {showSourceDropdown && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-xl z-[60] overflow-hidden max-h-48 overflow-y-auto no-scrollbar"
                            >
                              {Array.from(new Set([...income.map(i => i.source), ...categories.map(c => c.name)]))
                                .filter(Boolean)
                                .sort()
                                .filter(src => !source || src?.toLowerCase().includes(source.toLowerCase()))
                                .map(src => (
                                <button
                                  key={src}
                                  type="button"
                                  onClick={() => {
                                    setSource(src as string);
                                    setShowSourceDropdown(false);
                                  }}
                                  className="w-full px-4 py-3 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-between group border-b border-zinc-50 dark:border-zinc-800/50 last:border-0"
                                >
                                  <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{src}</span>
                                  <ChevronRight className="w-3 h-3 text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <div className="relative order-3">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 block">Payment Method</label>
                        <div className="relative">
                          <input
                              type="text"
                              value={paymentMethod}
                              onChange={(e) => {
                                setPaymentMethod(e.target.value);
                                setShowPaymentMethodDropdown(true);
                              }}
                              onFocus={() => setShowPaymentMethodDropdown(true)}
                              onBlur={() => setTimeout(() => setShowPaymentMethodDropdown(false), 200)}
                              placeholder="Bank Transfer, Cash..."
                              className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm font-medium text-zinc-900 dark:text-zinc-100 outline-none border border-transparent focus:border-zinc-200 dark:focus:border-zinc-700 transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
                            />
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                        </div>
                        <AnimatePresence>
                            {showPaymentMethodDropdown && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-xl z-[60] overflow-hidden max-h-48 overflow-y-auto no-scrollbar"
                              >
                                {Array.from(new Set(income.map(i => i.paymentMethod).filter(Boolean))).filter(pm => !paymentMethod || pm?.toLowerCase().includes(paymentMethod.toLowerCase())).map((pm) => (
                                  <button
                                    key={pm}
                                    type="button"
                                    onClick={() => {
                                      setPaymentMethod(pm as string);
                                      setShowPaymentMethodDropdown(false);
                                    }}
                                    className="w-full px-4 py-3 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-between group border-b border-zinc-50 dark:border-zinc-800/50 last:border-0"
                                  >
                                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{pm}</span>
                                    <ChevronRight className="w-3 h-3 text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      <div className="order-4">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 block">Notes</label>
                        <input
                            type="text"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Additional details..."
                            className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm font-medium text-zinc-900 dark:text-zinc-100 outline-none border border-transparent focus:border-zinc-200 dark:focus:border-zinc-700 transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
                          />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="order-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 block">Investment Name</label>
                        <input
                          type="text"
                          value={investmentName}
                          onChange={(e) => setInvestmentName(e.target.value)}
                          placeholder="e.g. Apple Stock"
                          className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm font-medium text-zinc-900 dark:text-zinc-100 outline-none border border-transparent focus:border-zinc-200 dark:focus:border-zinc-700 transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
                        />
                      </div>
                      <div className="order-2">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 block">Symbol (for live tracking)</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={investmentSymbol}
                            onChange={(e) => handleSymbolChange(e.target.value)}
                            placeholder="e.g. AAPL, BTC"
                            className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm font-medium text-zinc-900 dark:text-zinc-100 outline-none border border-transparent focus:border-zinc-200 dark:focus:border-zinc-700 transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
                          />
                          <AnimatePresence>
                            {showSymbolSuggestions && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-xl z-[60] overflow-hidden"
                              >
                                {symbolSuggestions.map((suggestion) => (
                                  <button
                                    key={suggestion.symbol}
                                    type="button"
                                    onClick={() => handleSelectSymbol(suggestion)}
                                    className="w-full px-4 py-2 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-between group"
                                  >
                                    <div className="flex flex-col">
                                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{suggestion.symbol}</span>
                                      <span className="text-[10px] text-zinc-400">{suggestion.name}</span>
                                    </div>
                                    <ChevronRight className="w-3 h-3 text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                      <div className="order-4">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 block">Target Amount</label>
                        <input
                          type="number"
                          step="0.01"
                          value={investmentTargetAmount}
                          onChange={(e) => setInvestmentTargetAmount(e.target.value)}
                          placeholder="Goal Amount"
                          className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm font-medium text-zinc-900 dark:text-zinc-100 outline-none border border-transparent focus:border-zinc-200 dark:focus:border-zinc-700 transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
                        />
                      </div>
                      <div className="order-5">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 block">Target Date</label>
                        <input
                          type="date"
                          value={investmentTargetDate}
                          onChange={(e) => setInvestmentTargetDate(e.target.value)}
                          className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm font-medium text-zinc-900 dark:text-zinc-100 outline-none border border-transparent focus:border-zinc-200 dark:focus:border-zinc-700 transition-all"
                        />
                      </div>
                    </>
                  )}
                  <div className={`relative z-[55] ${activeTab === 'income' ? 'order-2' : 'order-3'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t.account}</label>
                      <div className="flex items-center gap-1.5">
                        <div 
                          className="w-2 h-2 rounded-full shadow-sm" 
                          style={{ backgroundColor: accounts.find(a => a.name === account)?.color || '#cbd5e1' }} 
                        />
                        <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">{account}</span>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={account}
                        onChange={(e) => {
                          setAccount(e.target.value as Account);
                          setShowAccountDropdown(true);
                        }}
                        onFocus={() => setShowAccountDropdown(true)}
                        onBlur={() => setTimeout(() => setShowAccountDropdown(false), 200)}
                        className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm font-medium text-zinc-900 dark:text-zinc-100 outline-none border border-transparent focus:border-zinc-200 dark:focus:border-zinc-700 transition-all"
                        placeholder="Bank Account, Cash..."
                      />
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                    </div>
                    <AnimatePresence>
                      {showAccountDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-xl z-[60] overflow-hidden max-h-48 overflow-y-auto no-scrollbar"
                        >
                          {[
                            ...accounts.map(acc => ({ name: acc.name, color: acc.color })),
                            ...Array.from(new Set([...expenses.map(e => e.account), ...income.map(i => i.account)]))
                              .filter(a => !accounts.find(acc => acc.name === a))
                              .map(a => ({ name: a, color: '#cbd5e1' }))
                          ].filter(a => !account || a.name.toLowerCase().includes(account.toLowerCase())).map((acc) => (
                            <button
                              key={acc.name}
                              type="button"
                              onClick={() => {
                                setAccount(acc.name as Account);
                                setShowAccountDropdown(false);
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-between group border-b border-zinc-50 dark:border-zinc-800/50 last:border-0"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: acc.color }} />
                                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{acc.name}</span>
                              </div>
                              <ChevronRight className="w-3 h-3 text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 block">{t.date}</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm font-medium text-zinc-900 dark:text-zinc-100 outline-none border border-transparent focus:border-zinc-200 dark:focus:border-zinc-700 transition-all"
                    />
                  </div>
                  <div className="relative z-[50]">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 block">Who?</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={user}
                        onChange={(e) => {
                          setUser(e.target.value);
                          setShowUserDropdown(true);
                        }}
                        onFocus={() => setShowUserDropdown(true)}
                        onBlur={() => setTimeout(() => setShowUserDropdown(false), 200)}
                        className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm font-medium text-zinc-900 dark:text-zinc-100 outline-none border border-transparent focus:border-zinc-200 dark:focus:border-zinc-700 transition-all"
                        placeholder="Person..."
                      />
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                    </div>
                    <AnimatePresence>
                      {showUserDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-xl z-[60] overflow-hidden max-h-48 overflow-y-auto no-scrollbar"
                        >
                          {[
                            ...USERS,
                            ...Array.from(new Set([...expenses.map(e => e.user), ...income.map(i => i.user)])).filter(u => !USERS.includes(u))
                          ].filter(u => !user || u.toLowerCase().includes(user.toLowerCase())).map((u) => (
                            <button
                              key={u}
                              type="button"
                              onClick={() => {
                                setUser(u);
                                setShowUserDropdown(false);
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-between group border-b border-zinc-50 dark:border-zinc-800/50 last:border-0"
                            >
                              <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{u}</span>
                              <ChevronRight className="w-3 h-3 text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {(activeTab === 'expenses' || activeTab === 'home' || activeTab === 'income') && (
                  <div className="space-y-4">
                    <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl space-y-4">
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer flex-1">
                          <input
                            type="checkbox"
                            checked={isRecurring}
                            onChange={(e) => {
                              setIsRecurring(e.target.checked);
                              if (e.target.checked) setIsInstallment(false);
                            }}
                            className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-zinc-900 dark:focus:ring-zinc-100 bg-transparent"
                          />
                          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t.recurring}</span>
                        </label>
                      </div>

                      {isRecurring && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="space-y-4"
                        >
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Frequency</label>
                            <select
                              value={frequency}
                              onChange={(e) => setFrequency(e.target.value as Frequency)}
                              className="w-full p-3 bg-white dark:bg-zinc-900 rounded-xl text-sm font-medium text-zinc-900 dark:text-zinc-100 outline-none border border-transparent focus:border-zinc-200 dark:focus:border-zinc-700 transition-all"
                            >
                              <option value="Daily">Daily</option>
                              <option value="Weekly">Weekly</option>
                              <option value="Monthly">Monthly</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Next Occurrence</label>
                            <input
                              type="date"
                              value={nextOccurrence}
                              onChange={(e) => setNextOccurrence(e.target.value)}
                              className="w-full p-3 bg-white dark:bg-zinc-900 rounded-xl text-sm font-medium text-zinc-900 dark:text-zinc-100 outline-none border border-transparent focus:border-zinc-200 dark:focus:border-zinc-700 transition-all"
                            />
                          </div>
                          
                          {(activeTab === 'expenses' || activeTab === 'home' || activeTab === 'income') && (
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                                {language === 'en' ? 'Total Number of Installments (Optional)' : language === 'pt' ? 'Número Total de Parcelas (Opcional)' : 'Número Total de Cuotas (Opcional)'}
                              </label>
                              <input
                                type="number"
                                min="0"
                                placeholder={language === 'en' ? 'Leave empty for indefinite' : language === 'pt' ? 'Deixe vazio para indefinido' : 'Dejar vacío para indefinido'}
                                value={installmentsCount}
                                onChange={(e) => setInstallmentsCount(e.target.value)}
                                className="w-full p-3 bg-white dark:bg-zinc-900 rounded-xl text-sm font-medium text-zinc-900 dark:text-zinc-100 outline-none border border-transparent focus:border-zinc-200 dark:focus:border-zinc-700 transition-all"
                              />
                            </div>
                          )}
                        </motion.div>
                      )}

                      {isInstallment && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="space-y-2"
                        >
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">{t.installmentsCount}</label>
                          <input
                            type="number"
                            min="1"
                            value={installmentsCount}
                            onChange={(e) => setInstallmentsCount(e.target.value)}
                            className="w-full p-3 bg-white dark:bg-zinc-900 rounded-xl text-sm font-medium text-zinc-900 dark:text-zinc-100 outline-none border border-transparent focus:border-zinc-200 dark:focus:border-zinc-700 transition-all"
                          />
                        </motion.div>
                      )}
                    </div>

                    {activeTab !== 'income' && (
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 block">{t.description}</label>
                        <input
                          type="text"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="What was this for?"
                          className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-sm font-medium text-zinc-900 dark:text-zinc-100 outline-none border border-transparent focus:border-zinc-200 dark:focus:border-zinc-700 transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
                        />
                        <AnimatePresence>
                          {suggestedCategory && (
                            <motion.button
                              initial={{ opacity: 0, y: -5, height: 0 }}
                              animate={{ opacity: 1, y: 0, height: 'auto' }}
                              exit={{ opacity: 0, y: -5, height: 0 }}
                              type="button"
                              onClick={() => {
                                setCategory(suggestedCategory.category);
                                if (suggestedCategory.subcategory) {
                                  setSubcategory(suggestedCategory.subcategory);
                                }
                                setSuggestedCategory(null);
                              }}
                              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent-500/10 text-accent-600 dark:text-accent-400 rounded-lg text-xs font-bold hover:bg-accent-500/20 transition-colors"
                            >
                              <Sparkles className="w-3 h-3" />
                              Suggestion: {suggestedCategory.category}{suggestedCategory.subcategory ? ` > ${suggestedCategory.subcategory}` : ''}
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl font-semibold shadow-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all active:scale-[0.98] mt-4"
                >
                  {editingEntryId ? t.save : t.addEntry}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Budget Wizard Modal */}
      <AnimatePresence>
        {isBudgetWizardOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBudgetWizardOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 max-h-[90vh] bg-white dark:bg-zinc-950 rounded-t-[32px] z-[70] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{t.budgetWizard}</h3>
                  <p className="text-xs text-zinc-400 font-medium">Step {wizardStep} of 4</p>
                </div>
                <button onClick={() => setIsBudgetWizardOpen(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                  <X className="w-5 h-5 text-zinc-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
                {wizardStep === 1 && (
                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 bg-accent-100 dark:bg-accent-900/30 rounded-2xl flex items-center justify-center mx-auto text-accent-600 dark:text-accent-400">
                        <Wallet className="w-8 h-8" />
                      </div>
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{t.wizardIncomeLabel}</h4>
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">{currencySymbol}</span>
                      <input
                        type="number"
                        value={wizardIncome}
                        onChange={(e) => setWizardIncome(e.target.value)}
                        className="w-full pl-10 pr-4 py-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl text-xl font-bold text-zinc-900 dark:text-zinc-100 outline-none border-2 border-transparent focus:border-accent-500 transition-all"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                )}

                {wizardStep === 2 && (
                  <div className="space-y-6">
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 text-center">{t.wizardFrameworkLabel}</h4>
                    <div className="grid gap-3">
                      {[
                        { name: '50/30/20', desc: language === 'en' ? 'Needs/Wants/Savings' : 'Essencial/Desejos/Reserva', p: [50, 30, 20], buckets: language === 'en' ? ['Needs', 'Wants', 'Savings'] : ['Essencial', 'Desejos', 'Reserva'] },
                        { name: '70/20/10', desc: language === 'en' ? 'Living/Savings/Debt' : 'Viver/Reserva/Dívidas', p: [70, 20, 10], buckets: language === 'en' ? ['Living', 'Savings', 'Debt'] : ['Viver', 'Reserva', 'Dívidas'] },
                        { name: '80/20', desc: language === 'en' ? 'Living/Savings' : 'Viver/Reserva', p: [80, 20], buckets: language === 'en' ? ['Living', 'Savings'] : ['Viver', 'Reserva'] },
                        { name: 'Custom', desc: language === 'en' ? 'Set individual budgets' : 'Definir orçamentos individuais', p: [], buckets: [] }
                      ].map(pattern => (
                        <button
                          key={pattern.name}
                          onClick={() => setSelectedPattern(pattern)}
                          className={`p-4 rounded-2xl border-2 text-left transition-all ${selectedPattern?.name === pattern.name ? 'border-accent-500 bg-accent-50/10' : 'border-zinc-100 dark:border-zinc-800 hover:border-accent-200'}`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-zinc-900 dark:text-zinc-100">{pattern.name}</span>
                            <span className="text-[10px] font-bold text-accent-500 uppercase tracking-widest">{pattern.desc}</span>
                          </div>
                          {pattern.p.length > 0 ? (
                            <div className="flex h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                              {pattern.p.map((val, i) => (
                                <div key={i} style={{ width: `${val}%` }} className={`h-full ${i === 0 ? 'bg-accent-500' : i === 1 ? 'bg-accent-300' : 'bg-accent-100'}`} />
                              ))}
                            </div>
                          ) : (
                            <div className="flex h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                              <div className="h-full w-full bg-zinc-200 dark:bg-zinc-700" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {wizardStep === 3 && (
                  <div className="space-y-6">
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 text-center">
                      {selectedPattern?.name === 'Custom' 
                        ? (language === 'en' ? 'Set Budgets' : language === 'pt' ? 'Definir Orçamentos' : 'Definir Presupuestos')
                        : t.wizardAssignLabel}
                    </h4>
                    <div className="space-y-3">
                      {categories.map(cat => (
                        <div key={cat.id} className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-700 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{cat.name}</span>
                            {selectedPattern?.name !== 'Custom' && (
                              <span className="text-[10px] font-bold text-accent-500 uppercase tracking-widest">
                                {wizardCategoryAssignments[cat.name] || 'Unassigned'}
                              </span>
                            )}
                          </div>
                          {selectedPattern?.name === 'Custom' ? (
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-[10px] font-bold">{currencySymbol}</span>
                              <input
                                type="number"
                                value={wizardCustomAmounts[cat.name] || ''}
                                onChange={(e) => setWizardCustomAmounts(prev => ({ ...prev, [cat.name]: e.target.value }))}
                                placeholder="0.00"
                                className="w-full pl-8 pr-4 py-2 bg-white dark:bg-zinc-900 rounded-xl text-xs font-bold text-zinc-900 dark:text-zinc-100 outline-none border border-zinc-100 dark:border-zinc-800 focus:border-accent-500 transition-all"
                              />
                            </div>
                          ) : (
                            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                              {selectedPattern?.buckets.map(bucket => (
                                <button
                                  key={bucket}
                                  onClick={() => setWizardCategoryAssignments(prev => ({ ...prev, [cat.name]: bucket }))}
                                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${wizardCategoryAssignments[cat.name] === bucket ? 'bg-accent-500 text-white' : 'bg-white dark:bg-zinc-900 text-zinc-400 border border-zinc-100 dark:border-zinc-700'}`}
                                >
                                  {bucket}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {wizardStep === 4 && (
                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                        <Check className="w-8 h-8" />
                      </div>
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{t.wizardStep4}</h4>
                    </div>
                    
                    <div className="glass-card p-4 rounded-2xl space-y-4">
                      {selectedPattern?.name !== 'Custom' && (
                        <div className="flex justify-between items-center pb-4 border-b border-zinc-100 dark:border-zinc-800">
                          <span className="text-xs text-zinc-400 font-bold uppercase tracking-widest">{t.income}</span>
                          <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{formatCurrency(Number(wizardIncome))}</span>
                        </div>
                      )}
                      <div className="space-y-3">
                        {selectedPattern?.name === 'Custom' ? (
                          <>
                            {categories.filter(c => wizardCustomAmounts[c.name]).map(cat => (
                              <div key={cat.id} className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">{cat.name}</span>
                                <span className="text-xs font-bold text-accent-500">{formatCurrency(Number(wizardCustomAmounts[cat.name]))}</span>
                              </div>
                            ))}
                            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                              <span className="text-xs text-zinc-400 font-bold uppercase tracking-widest">{t.totalBudgeted}</span>
                              <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                {formatCurrency(Object.keys(wizardCustomAmounts).reduce((acc: number, key: string) => acc + Number(wizardCustomAmounts[key] || 0), 0))}
                              </span>
                            </div>
                          </>
                        ) : (
                          selectedPattern?.buckets.map((bucket, idx) => {
                            const bucketAmount = (selectedPattern.p[idx] / 100) * Number(wizardIncome);
                            const assignedCats = categories.filter(c => wizardCategoryAssignments[c.name] === bucket);
                            return (
                              <div key={bucket} className="space-y-1">
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">{bucket} ({selectedPattern.p[idx]}%)</span>
                                  <span className="text-xs font-bold text-accent-500">{formatCurrency(bucketAmount)}</span>
                                </div>
                                <p className="text-[10px] text-zinc-400">
                                  {assignedCats.length > 0 ? assignedCats.map(c => c.name).join(', ') : 'No categories assigned'}
                                </p>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 flex gap-3">
                {wizardStep > 1 && (
                  <button
                    onClick={() => setWizardStep(prev => prev - 1)}
                    className="flex-1 py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-zinc-200 transition-all"
                  >
                    {t.back}
                  </button>
                )}
                <button
                  onClick={async () => {
                    if (wizardStep < 4) {
                      if (wizardStep === 1 && !wizardIncome) return;
                      if (wizardStep === 2 && !selectedPattern) return;
                      setWizardStep(prev => prev + 1);
                    } else {
                      // Apply budgets
                      if (selectedPattern?.name === 'Custom') {
                        for (const catName in wizardCustomAmounts) {
                          const amount = Number(wizardCustomAmounts[catName]);
                          if (amount > 0) {
                            await handleUpdateBudget(catName, '', amount);
                          }
                        }
                      } else {
                        for (const bucket of selectedPattern!.buckets) {
                          const bucketIdx = selectedPattern!.buckets.indexOf(bucket);
                          const bucketAmount = (selectedPattern!.p[bucketIdx] / 100) * Number(wizardIncome);
                          const assignedCats = categories.filter(c => wizardCategoryAssignments[c.name] === bucket);
                          
                          if (assignedCats.length > 0) {
                            const amountPerCat = bucketAmount / assignedCats.length;
                            for (const cat of assignedCats) {
                              await handleUpdateBudget(cat.name, '', amountPerCat);
                            }
                          }
                        }
                      }
                      setIsBudgetWizardOpen(false);
                      fetchAllData();
                    }
                  }}
                  className="flex-[2] py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-lg"
                >
                  {wizardStep === 4 ? t.wizardApply : t.next}
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
  fetchLivePrice: (id: string, symbol: string) => void;
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
  fetchLivePrice,
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
          {inv.symbol && (
            <button 
              onClick={() => fetchLivePrice(inv.id, inv.symbol!)}
              disabled={isUpdating}
              className="p-2.5 text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors disabled:opacity-30"
            >
              <RefreshCw className={`w-4 h-4 ${isUpdating ? 'animate-spin' : ''}`} />
            </button>
          )}
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
