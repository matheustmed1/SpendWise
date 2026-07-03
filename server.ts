import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();




const db = new Database("expenses.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT NOT NULL DEFAULT 'Other',
    account TEXT NOT NULL,
    date TEXT NOT NULL,
    description TEXT,
    user TEXT NOT NULL DEFAULT 'Me',
    isRecurring INTEGER DEFAULT 0,
    frequency TEXT,
    nextOccurrence TEXT,
    isInstallment INTEGER DEFAULT 0,
    installmentsCount INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS subcategories (
    id TEXT PRIMARY KEY,
    categoryId TEXT NOT NULL,
    name TEXT NOT NULL,
    UNIQUE(categoryId, name),
    FOREIGN KEY(categoryId) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS income (
    id TEXT PRIMARY KEY,
    amount REAL NOT NULL,
    source TEXT NOT NULL,
    account TEXT NOT NULL,
    date TEXT NOT NULL,
    user TEXT NOT NULL DEFAULT 'Me',
    isRecurring INTEGER DEFAULT 0,
    frequency TEXT,
    nextOccurrence TEXT,
    notes TEXT,
    paymentMethod TEXT
  );

  CREATE TABLE IF NOT EXISTS budgets (
    category TEXT NOT NULL,
    subcategory TEXT NOT NULL DEFAULT '',
    amount REAL NOT NULL DEFAULT 0,
    PRIMARY KEY (category, subcategory)
  );

  CREATE TABLE IF NOT EXISTS investments (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    symbol TEXT,
    initialAmount REAL NOT NULL,
    currentValue REAL NOT NULL,
    date TEXT NOT NULL,
    user TEXT NOT NULL DEFAULT 'Me',
    targetAmount REAL,
    targetDate TEXT
  );

  CREATE TABLE IF NOT EXISTS investment_history (
    id TEXT PRIMARY KEY,
    investmentId TEXT NOT NULL,
    value REAL NOT NULL,
    date TEXT NOT NULL,
    FOREIGN KEY(investmentId) REFERENCES investments(id)
  );

  CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    color TEXT NOT NULL DEFAULT '#18181b'
  );
`);

// Migration: Ensure all columns exist in expenses table
const tableInfo = db.prepare("PRAGMA table_info(expenses)").all() as any[];
const columns = tableInfo.map(c => c.name);

const requiredColumns = [
  { name: 'isRecurring', type: 'INTEGER DEFAULT 0' },
  { name: 'frequency', type: 'TEXT' },
  { name: 'nextOccurrence', type: 'TEXT' },
  { name: 'isInstallment', type: 'INTEGER DEFAULT 0' },
  { name: 'installmentsCount', type: 'INTEGER DEFAULT 0' },
  { name: 'subcategory', type: "TEXT NOT NULL DEFAULT 'Other'" }
];

requiredColumns.forEach(col => {
  if (!columns.includes(col.name)) {
    try {
      db.exec(`ALTER TABLE expenses ADD COLUMN ${col.name} ${col.type}`);
      console.log(`Added missing column ${col.name} to expenses table`);
    } catch (err) {
      console.error(`Failed to add column ${col.name}:`, err);
    }
  }
});

// Migration: Ensure subcategory exists in budgets table
const budgetTableInfo = db.prepare("PRAGMA table_info(budgets)").all() as any[];
const budgetColumns = budgetTableInfo.map(c => c.name);

if (!budgetColumns.includes('subcategory')) {
  try {
    // SQLite doesn't support adding a column to a primary key easily.
    // However, we can add the column and then the app will work.
    // If we need to change the PK, we'd need to recreate the table.
    // For now, let's just add the column.
    db.exec(`ALTER TABLE budgets ADD COLUMN subcategory TEXT NOT NULL DEFAULT ''`);
    console.log(`Added missing column subcategory to budgets table`);
  } catch (err) {
    console.error(`Failed to add subcategory to budgets:`, err);
  }
}

// Migration: Ensure symbol exists in investments table
const investmentTableInfo = db.prepare("PRAGMA table_info(investments)").all() as any[];
const investmentColumns = investmentTableInfo.map(c => c.name);

if (!investmentColumns.includes('symbol')) {
  try {
    db.exec(`ALTER TABLE investments ADD COLUMN symbol TEXT`);
    console.log(`Added missing column symbol to investments table`);
  } catch (err) {
    console.error(`Failed to add symbol to investments:`, err);
  }
}

if (!investmentColumns.includes('targetAmount')) {
  try {
    db.exec(`ALTER TABLE investments ADD COLUMN targetAmount REAL`);
    console.log(`Added missing column targetAmount to investments table`);
  } catch (err) {
    console.error(`Failed to add targetAmount to investments:`, err);
  }
}

if (!investmentColumns.includes('targetDate')) {
  try {
    db.exec(`ALTER TABLE investments ADD COLUMN targetDate TEXT`);
    console.log(`Added missing column targetDate to investments table`);
  } catch (err) {
    console.error(`Failed to add targetDate to investments:`, err);
  }
}

if (!investmentColumns.includes('account')) {
  try {
    db.exec(`ALTER TABLE investments ADD COLUMN account TEXT NOT NULL DEFAULT 'Bank'`);
    console.log(`Added missing column account to investments table`);
  } catch (err) {
    console.error(`Failed to add account to investments:`, err);
  }
}

// Migration: Ensure all columns exist in income table
const incomeTableInfo = db.prepare("PRAGMA table_info(income)").all() as any[];
const incomeColumns = incomeTableInfo.map(c => c.name);

const requiredIncomeColumns = [
  { name: 'isRecurring', type: 'INTEGER DEFAULT 0' },
  { name: 'frequency', type: 'TEXT' },
  { name: 'nextOccurrence', type: 'TEXT' },
  { name: 'notes', type: 'TEXT' },
  { name: 'paymentMethod', type: 'TEXT' }
];

requiredIncomeColumns.forEach(col => {
  if (!incomeColumns.includes(col.name)) {
    try {
      db.exec(`ALTER TABLE income ADD COLUMN ${col.name} ${col.type}`);
      console.log(`Added missing column ${col.name} to income table`);
    } catch (err) {
      console.error(`Failed to add ${col.name} to income:`, err);
    }
  }
});

// Seed categories and subcategories if empty
const existingCategories = db.prepare("SELECT COUNT(*) as count FROM categories").get() as { count: number };
if (existingCategories.count === 0) {
  const defaultData = [
    { name: 'Food', sub: ['Groceries', 'Dining Out'] },
    { name: 'Transport', sub: ['Fuel', 'Public Transport'] },
    { name: 'Shopping', sub: ['Clothing', 'Electronics'] },
    { name: 'Entertainment', sub: ['Movies', 'Games'] },
    { name: 'Health', sub: ['Pharmacy', 'Doctor'] },
    { name: 'Bills', sub: ['Rent', 'Utilities'] },
    { name: 'Other', sub: ['Miscellaneous'] }
  ];

  const insertCat = db.prepare("INSERT INTO categories (id, name) VALUES (?, ?)");
  const insertSub = db.prepare("INSERT INTO subcategories (id, categoryId, name) VALUES (?, ?, ?)");

  defaultData.forEach(cat => {
    const catId = randomUUID();
    insertCat.run(catId, cat.name);
    cat.sub.forEach(subName => {
      insertSub.run(randomUUID(), catId, subName);
    });
  });
}

// Seed budgets if empty
const existingBudgets = db.prepare("SELECT COUNT(*) as count FROM budgets").get() as { count: number };
if (existingBudgets.count === 0) {
  const categories = db.prepare("SELECT name FROM categories").all() as { name: string }[];
  const insertBudget = db.prepare("INSERT INTO budgets (category, amount) VALUES (?, ?)");
  categories.forEach(cat => insertBudget.run(cat.name, 0));
}

// Seed accounts if empty
const existingAccounts = db.prepare("SELECT COUNT(*) as count FROM accounts").get() as { count: number };
if (existingAccounts.count === 0) {
  const defaultAccounts = [
    { name: 'Bank', color: '#18181b' },
    { name: 'NuBank MBM', color: '#820ad1' },
    { name: 'Nubank MM', color: '#820ad1' },
    { name: 'Bradesco', color: '#cc092f' }
  ];
  const insertAccount = db.prepare("INSERT INTO accounts (id, name, color) VALUES (?, ?, ?)");
  defaultAccounts.forEach(acc => insertAccount.run(randomUUID(), acc.name, acc.color));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Request logging
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API Routes
  app.get("/api/expenses", (req, res) => {
    // Process recurring expenses before returning
    const today = new Date().toISOString().split('T')[0];
    const recurringExpenses = db.prepare("SELECT * FROM expenses WHERE isRecurring = 1 AND nextOccurrence <= ?").all(today) as any[];
    
    for (const re of recurringExpenses) {
      if (!re.nextOccurrence) continue;
      
      let currentNext = new Date(re.nextOccurrence);
      if (isNaN(currentNext.getTime())) {
        console.error(`Invalid nextOccurrence for recurring expense ${re.id}: ${re.nextOccurrence}`);
        continue;
      }

      const todayDate = new Date(today);
      
      while (currentNext <= todayDate) {
        // Create new expense entry
        const newId = randomUUID();
        const insertStmt = db.prepare(
          "INSERT INTO expenses (id, amount, category, subcategory, account, date, description, user) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        );
        insertStmt.run(
          newId,
          re.amount,
          re.category,
          re.subcategory,
          re.account,
          currentNext.toISOString().split('T')[0],
          re.description,
          re.user
        );
        
        // Decrement installmentsCount if it exists
        if (re.installmentsCount > 0) {
          re.installmentsCount -= 1;
          if (re.installmentsCount === 0) {
            re.isRecurring = 0;
            break; // Stop creating more occurrences if limit reached
          }
        }

        // Calculate next occurrence
        if (re.frequency === 'Daily') {
          currentNext.setDate(currentNext.getDate() + 1);
        } else if (re.frequency === 'Weekly') {
          currentNext.setDate(currentNext.getDate() + 7);
        } else if (re.frequency === 'Monthly') {
          currentNext.setMonth(currentNext.getMonth() + 1);
        } else {
          break; // Should not happen
        }
      }
      
      // Update the recurring template with the new nextOccurrence and installmentsCount
      if (!isNaN(currentNext.getTime())) {
        db.prepare("UPDATE expenses SET nextOccurrence = ?, installmentsCount = ?, isRecurring = ? WHERE id = ?").run(
          currentNext.toISOString().split('T')[0],
          re.installmentsCount,
          re.isRecurring,
          re.id
        );
      }
    }

    const expenses = db.prepare("SELECT * FROM expenses ORDER BY date DESC").all();
    res.json(expenses);
  });

  app.get("/api/income", (req, res) => {
    // Process recurring income before returning
    const today = new Date().toISOString().split('T')[0];
    const recurringIncome = db.prepare("SELECT * FROM income WHERE isRecurring = 1 AND nextOccurrence <= ?").all(today) as any[];

    for (const ri of recurringIncome) {
      if (!ri.nextOccurrence) continue;

      let currentNext = new Date(ri.nextOccurrence);
      if (isNaN(currentNext.getTime())) {
        console.error(`Invalid nextOccurrence for recurring income ${ri.id}: ${ri.nextOccurrence}`);
        continue;
      }

      const todayDate = new Date(today);

      while (currentNext <= todayDate) {
        // Create new income entry
        const newId = randomUUID();
        const insertStmt = db.prepare(
          "INSERT INTO income (id, amount, source, account, date, user, notes, paymentMethod) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        );
        insertStmt.run(
          newId,
          ri.amount,
          ri.source,
          ri.account,
          currentNext.toISOString().split('T')[0],
          ri.user,
          ri.notes || null,
          ri.paymentMethod || null
        );

        // Calculate next occurrence
        if (ri.frequency === 'Daily') {
          currentNext.setDate(currentNext.getDate() + 1);
        } else if (ri.frequency === 'Weekly') {
          currentNext.setDate(currentNext.getDate() + 7);
        } else if (ri.frequency === 'Monthly') {
          currentNext.setMonth(currentNext.getMonth() + 1);
        } else {
          break; // Should not happen
        }
      }

      // Update the recurring template with the new nextOccurrence
      if (!isNaN(currentNext.getTime())) {
        db.prepare("UPDATE income SET nextOccurrence = ? WHERE id = ?").run(
          currentNext.toISOString().split('T')[0],
          ri.id
        );
      }
    }

    const income = db.prepare("SELECT * FROM income ORDER BY date DESC").all();
    res.json(income);
  });

  app.get("/api/budgets", (req, res) => {
    const budgets = db.prepare("SELECT * FROM budgets").all();
    res.json(budgets);
  });

  app.get("/api/categories", (req, res) => {
    const categories = db.prepare("SELECT * FROM categories").all();
    res.json(categories);
  });

  app.get("/api/subcategories", (req, res) => {
    const subcategories = db.prepare("SELECT * FROM subcategories").all();
    res.json(subcategories);
  });

  app.get("/api/accounts", (req, res) => {
    const accounts = db.prepare("SELECT * FROM accounts").all();
    res.json(accounts);
  });

  app.get("/api/investments", (req, res) => {
    const investments = db.prepare("SELECT * FROM investments").all();
    res.json(investments);
  });

  app.get("/api/investments/:id/history", (req, res) => {
    const { id } = req.params;
    const history = db.prepare("SELECT * FROM investment_history WHERE investmentId = ? ORDER BY date ASC").all(id);
    res.json(history);
  });

  app.post("/api/expenses", (req, res) => {
    const { id, amount, category, subcategory, account, date, description, user, isRecurring, frequency, isInstallment, installmentsCount, nextOccurrence: bodyNextOccurrence } = req.body;
    
    let nextOccurrence = bodyNextOccurrence;
    if (isRecurring && !nextOccurrence) {
      const dateObj = new Date(date);
      if (frequency === 'Daily') {
        dateObj.setDate(dateObj.getDate() + 1);
      } else if (frequency === 'Weekly') {
        dateObj.setDate(dateObj.getDate() + 7);
      } else if (frequency === 'Monthly') {
        dateObj.setMonth(dateObj.getMonth() + 1);
      }
      nextOccurrence = dateObj.toISOString().split('T')[0];
    }

    const stmt = db.prepare(
      "INSERT INTO expenses (id, amount, category, subcategory, account, date, description, user, isRecurring, frequency, nextOccurrence, isInstallment, installmentsCount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    stmt.run(
      id || randomUUID(), 
      amount, 
      category, 
      subcategory || 'Other', 
      account, 
      date, 
      description, 
      user || 'Me',
      isRecurring ? 1 : 0,
      frequency || null,
      nextOccurrence,
      isInstallment ? 1 : 0,
      installmentsCount || 0
    );
    res.status(201).json({ success: true });
  });

  app.put("/api/expenses/:id", (req, res) => {
    const { id } = req.params;
    const { amount, category, subcategory, account, date, description, user, isRecurring, frequency, isInstallment, installmentsCount, nextOccurrence: bodyNextOccurrence } = req.body;
    
    let nextOccurrence = bodyNextOccurrence;
    if (isRecurring && !nextOccurrence) {
      const dateObj = new Date(date);
      if (frequency === 'Daily') {
        dateObj.setDate(dateObj.getDate() + 1);
      } else if (frequency === 'Weekly') {
        dateObj.setDate(dateObj.getDate() + 7);
      } else if (frequency === 'Monthly') {
        dateObj.setMonth(dateObj.getMonth() + 1);
      }
      nextOccurrence = dateObj.toISOString().split('T')[0];
    }

    const stmt = db.prepare(
      "UPDATE expenses SET amount = ?, category = ?, subcategory = ?, account = ?, date = ?, description = ?, user = ?, isRecurring = ?, frequency = ?, nextOccurrence = ?, isInstallment = ?, installmentsCount = ? WHERE id = ?"
    );
    const result = stmt.run(
      amount, 
      category, 
      subcategory || 'Other', 
      account, 
      date, 
      description, 
      user || 'Me',
      isRecurring ? 1 : 0,
      frequency || null,
      nextOccurrence,
      isInstallment ? 1 : 0,
      installmentsCount || 0,
      id
    );

    if (result.changes > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Expense not found" });
    }
  });

  app.post("/api/categories", (req, res) => {
    const { name } = req.body;
    const id = randomUUID();
    try {
      db.prepare("INSERT INTO categories (id, name) VALUES (?, ?)").run(id, name);
      res.status(201).json({ id, name });
    } catch (err) {
      res.status(400).json({ error: "Category already exists" });
    }
  });

  app.put("/api/categories/:id", (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const oldCategory = db.prepare("SELECT name FROM categories WHERE id = ?").get() as { name: string };
    
    if (oldCategory) {
      db.transaction(() => {
        db.prepare("UPDATE categories SET name = ? WHERE id = ?").run(name, id);
        db.prepare("UPDATE expenses SET category = ? WHERE category = ?").run(name, oldCategory.name);
        db.prepare("UPDATE budgets SET category = ? WHERE category = ?").run(name, oldCategory.name);
      })();
      res.json({ id, name });
    } else {
      res.status(404).json({ error: "Category not found" });
    }
  });

  app.delete("/api/categories/:id", (req, res) => {
    const { id } = req.params;
    const category = db.prepare("SELECT name FROM categories WHERE id = ?").get() as { name: string };
    
    if (category) {
      db.transaction(() => {
        db.prepare("DELETE FROM subcategories WHERE categoryId = ?").run(id);
        db.prepare("DELETE FROM budgets WHERE category = ?").run(category.name);
        db.prepare("UPDATE expenses SET category = 'Other', subcategory = 'Other' WHERE category = ?").run(category.name);
        db.prepare("DELETE FROM categories WHERE id = ?").run(id);
      })();
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Category not found" });
    }
  });

  app.post("/api/subcategories", (req, res) => {
    const { categoryId, name } = req.body;
    const id = randomUUID();
    try {
      db.prepare("INSERT INTO subcategories (id, categoryId, name) VALUES (?, ?, ?)").run(id, categoryId, name);
      res.status(201).json({ id, categoryId, name });
    } catch (err) {
      res.status(400).json({ error: "Subcategory already exists in this category" });
    }
  });

  app.put("/api/subcategories/:id", (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const sub = db.prepare("SELECT s.name, c.name as categoryName FROM subcategories s JOIN categories c ON s.categoryId = c.id WHERE s.id = ?").get() as { name: string, categoryName: string };
    
    if (sub) {
      db.transaction(() => {
        db.prepare("UPDATE subcategories SET name = ? WHERE id = ?").run(name, id);
        db.prepare("UPDATE expenses SET subcategory = ? WHERE category = ? AND subcategory = ?").run(name, sub.categoryName, sub.name);
        db.prepare("UPDATE budgets SET subcategory = ? WHERE category = ? AND subcategory = ?").run(name, sub.categoryName, sub.name);
      })();
      res.json({ id, name });
    } else {
      res.status(404).json({ error: "Subcategory not found" });
    }
  });

  app.delete("/api/subcategories/:id", (req, res) => {
    const { id } = req.params;
    const sub = db.prepare("SELECT s.name, c.name as categoryName FROM subcategories s JOIN categories c ON s.categoryId = c.id WHERE s.id = ?").get() as { name: string, categoryName: string };
    
    if (sub) {
      db.transaction(() => {
        db.prepare("DELETE FROM budgets WHERE category = ? AND subcategory = ?").run(sub.categoryName, sub.name);
        db.prepare("UPDATE expenses SET subcategory = 'Other' WHERE category = ? AND subcategory = ?").run(sub.categoryName, sub.name);
        db.prepare("DELETE FROM subcategories WHERE id = ?").run(id);
      })();
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Subcategory not found" });
    }
  });

  app.post("/api/accounts", (req, res) => {
    const { name, color } = req.body;
    const id = randomUUID();
    try {
      db.prepare("INSERT INTO accounts (id, name, color) VALUES (?, ?, ?)").run(id, name, color || '#18181b');
      res.status(201).json({ id, name, color: color || '#18181b' });
    } catch (err) {
      res.status(400).json({ error: "Account already exists" });
    }
  });

  app.put("/api/accounts/:id", (req, res) => {
    const { id } = req.params;
    const { name, color } = req.body;
    const oldAccount = db.prepare("SELECT name FROM accounts WHERE id = ?").get() as { name: string };
    
    if (oldAccount) {
      db.transaction(() => {
        db.prepare("UPDATE accounts SET name = ?, color = ? WHERE id = ?").run(name, color, id);
        db.prepare("UPDATE expenses SET account = ? WHERE account = ?").run(name, oldAccount.name);
        db.prepare("UPDATE income SET account = ? WHERE account = ?").run(name, oldAccount.name);
      })();
      res.json({ id, name, color });
    } else {
      res.status(404).json({ error: "Account not found" });
    }
  });

  app.delete("/api/accounts/:id", (req, res) => {
    const { id } = req.params;
    const account = db.prepare("SELECT name FROM accounts WHERE id = ?").get() as { name: string };
    
    if (account) {
      db.transaction(() => {
        db.prepare("UPDATE expenses SET account = 'Bank' WHERE account = ?").run(account.name);
        db.prepare("UPDATE income SET account = 'Bank' WHERE account = ?").run(account.name);
        db.prepare("DELETE FROM accounts WHERE id = ?").run(id);
      })();
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Account not found" });
    }
  });

  app.post("/api/income", (req, res) => {
    const { id, amount, source, account, date, user, isRecurring, frequency, nextOccurrence: bodyNextOccurrence, notes, paymentMethod } = req.body;
    
    let nextOccurrence = bodyNextOccurrence;
    if (isRecurring && !nextOccurrence) {
      const dateObj = new Date(date);
      if (frequency === 'Daily') {
        dateObj.setDate(dateObj.getDate() + 1);
      } else if (frequency === 'Weekly') {
        dateObj.setDate(dateObj.getDate() + 7);
      } else if (frequency === 'Monthly') {
        dateObj.setMonth(dateObj.getMonth() + 1);
      }
      nextOccurrence = dateObj.toISOString().split('T')[0];
    }

    const stmt = db.prepare(
      "INSERT INTO income (id, amount, source, account, date, user, isRecurring, frequency, nextOccurrence, notes, paymentMethod) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    stmt.run(id || randomUUID(), amount, source, account, date, user || 'Me', isRecurring ? 1 : 0, frequency || null, nextOccurrence, notes || null, paymentMethod || null);
    res.status(201).json({ success: true });
  });

  app.put("/api/income/:id", (req, res) => {
    const { id } = req.params;
    const { amount, source, account, date, user, isRecurring, frequency, nextOccurrence: bodyNextOccurrence, notes, paymentMethod } = req.body;

    let nextOccurrence = bodyNextOccurrence;
    if (isRecurring && !nextOccurrence) {
      const dateObj = new Date(date);
      if (frequency === 'Daily') {
        dateObj.setDate(dateObj.getDate() + 1);
      } else if (frequency === 'Weekly') {
        dateObj.setDate(dateObj.getDate() + 7);
      } else if (frequency === 'Monthly') {
        dateObj.setMonth(dateObj.getMonth() + 1);
      }
      nextOccurrence = dateObj.toISOString().split('T')[0];
    }

    const stmt = db.prepare(
      "UPDATE income SET amount = ?, source = ?, account = ?, date = ?, user = ?, isRecurring = ?, frequency = ?, nextOccurrence = ?, notes = ?, paymentMethod = ? WHERE id = ?"
    );
    const result = stmt.run(amount, source, account, date, user || 'Me', isRecurring ? 1 : 0, frequency || null, nextOccurrence, notes || null, paymentMethod || null, id);
    
    if (result.changes > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Income not found" });
    }
  });

  app.post("/api/budgets", (req, res) => {
    const { category, subcategory, amount } = req.body;
    const stmt = db.prepare("INSERT OR REPLACE INTO budgets (category, subcategory, amount) VALUES (?, ?, ?)");
    stmt.run(category, subcategory || '', amount);
    res.json({ success: true });
  });

  app.post("/api/investments", (req, res) => {
    const { id, name, symbol, initialAmount, date, user, account, targetAmount, targetDate } = req.body;
    const investmentId = id || randomUUID();
    const stmt = db.prepare(
      "INSERT INTO investments (id, name, symbol, initialAmount, currentValue, date, user, account, targetAmount, targetDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    stmt.run(investmentId, name, symbol || null, initialAmount, initialAmount, date, user || 'Me', account || 'Bank', targetAmount || null, targetDate || null);
    
    // Initial history entry
    db.prepare("INSERT INTO investment_history (id, investmentId, value, date) VALUES (?, ?, ?, ?)").run(
      randomUUID(), investmentId, initialAmount, date
    );
    
    res.status(201).json({ success: true });
  });

  app.post("/api/investments/:id/value", (req, res) => {
    const { id } = req.params;
    const { value, date } = req.body;
    
    db.prepare("UPDATE investments SET currentValue = ? WHERE id = ?").run(value, id);
    db.prepare("INSERT INTO investment_history (id, investmentId, value, date) VALUES (?, ?, ?, ?)").run(
      randomUUID(), id, value, date || new Date().toISOString().split('T')[0]
    );
    
    res.json({ success: true });
  });

  app.delete("/api/expenses/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM expenses WHERE id = ?").run(id);
    res.json({ success: true });
  });

  app.delete("/api/income/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM income WHERE id = ?").run(id);
    res.json({ success: true });
  });

  app.put("/api/investments/:id", (req, res) => {
    const { id } = req.params;
    const { name, symbol, initialAmount, date, user, account, targetAmount, targetDate } = req.body;
    const stmt = db.prepare(
      "UPDATE investments SET name = ?, symbol = ?, initialAmount = ?, date = ?, user = ?, account = ?, targetAmount = ?, targetDate = ? WHERE id = ?"
    );
    const result = stmt.run(name, symbol || null, initialAmount, date, user || 'Me', account || 'Bank', targetAmount || null, targetDate || null, id);
    
    if (result.changes > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Investment not found" });
    }
  });

  app.delete("/api/investments/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM investment_history WHERE investmentId = ?").run(id);
    db.prepare("DELETE FROM investments WHERE id = ?").run(id);
    res.json({ success: true });
  });


  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  // Global error handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal Server Error", message: err.message });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("CRITICAL: Failed to start server:", err);
  process.exit(1);
});
